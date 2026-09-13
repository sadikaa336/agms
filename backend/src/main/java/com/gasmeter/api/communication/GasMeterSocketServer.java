package com.gasmeter.api.communication;

import com.gasmeter.api.model.GasMeter;
import com.gasmeter.api.service.LogService;
import com.gasmeter.api.service.MeterService;
import gurux.dlms.GXDLMSTranslator;
import gurux.dlms.enums.TranslatorOutputType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.io.*;
import java.net.ServerSocket;
import java.net.Socket;
import java.math.BigDecimal;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Component
public class GasMeterSocketServer implements CommandLineRunner {

    @Value("${meter.communication.port:5000}")
    private int port;

    @Value("${meter.communication.enabled:false}")
    private boolean communicationEnabled;

    @Autowired
    private MeterService meterService;

    @Autowired
    private LogService logService;

    private final ExecutorService executorService = Executors.newFixedThreadPool(20);

    @Override
    public void run(String... args) {
        if (!communicationEnabled) {
            System.out.println("DLMS/COSEM TCP socket server disabled. Meter data is streamed directly from Software Simulated Meter via REST API.");
            return;
        }
        new Thread(this::startServer, "DLMS-Socket-Listener").start();
    }

    private void startServer() {
        System.out.println("Starting DLMS/COSEM TCP/IP Socket Server on port " + port);
        try (ServerSocket serverSocket = new ServerSocket(port)) {
            while (!Thread.currentThread().isInterrupted()) {
                Socket clientSocket = serverSocket.accept();
                executorService.submit(() -> handleMeterConnection(clientSocket));
            }
        } catch (IOException e) {
            System.err.println("Error running communication socket server: " + e.getMessage());
        }
    }

    private void handleMeterConnection(Socket socket) {
        String remoteAddress = socket.getRemoteSocketAddress().toString();
        System.out.println("New connection established with meter at " + remoteAddress);

        try (InputStream inStream = socket.getInputStream();
             OutputStream outStream = socket.getOutputStream()) {

            while (!socket.isClosed()) {
                int firstByte = inStream.read();
                if (firstByte == -1) {
                    break; // connection closed gracefully
                }

                if (firstByte == 0x00 || firstByte == 0x7E) {
                    // Binary DLMS / COSEM Frame
                    byte[] wrapperHeader = new byte[8];
                    wrapperHeader[0] = (byte) firstByte;
                    for (int i = 1; i < 8; i++) {
                        int b = inStream.read();
                        if (b == -1) {
                            return;
                        }
                        wrapperHeader[i] = (byte) b;
                    }

                    int payloadLength = ((wrapperHeader[6] & 0xFF) << 8) | (wrapperHeader[7] & 0xFF);
                    byte[] apdu = new byte[payloadLength];
                    int bytesRead = 0;
                    while (bytesRead < payloadLength) {
                        int r = inStream.read(apdu, bytesRead, payloadLength - bytesRead);
                        if (r == -1) {
                            return;
                        }
                        bytesRead += r;
                    }

                    byte[] fullMessage = new byte[8 + payloadLength];
                    System.arraycopy(wrapperHeader, 0, fullMessage, 0, 8);
                    System.arraycopy(apdu, 0, fullMessage, 8, payloadLength);

                    String xml = "";
                    try {
                        GXDLMSTranslator translator = new GXDLMSTranslator(TranslatorOutputType.SIMPLE_XML);
                        xml = translator.messageToXml(fullMessage);
                    } catch (Exception ex) {
                        xml = "Raw bytes length: " + fullMessage.length;
                    }

                    // Dynamically resolve target meter or default to first registered meter
                    List<GasMeter> allMeters = meterService.getAllMeters();
                    GasMeter targetMeter = allMeters.isEmpty() ? null : allMeters.get(0);

                    // AARQ APDU Handshake
                    if (apdu.length > 0 && apdu[0] == 0x60) {
                        byte[] aareResponse = new byte[] {
                            0x00, 0x01, 0x00, 0x01, 0x00, 0x01, 0x00, 0x1E,
                            0x61, 0x1C,
                            (byte) 0xA1, 0x09, 0x06, 0x07, 0x60, (byte) 0x85, 0x74, 0x05, 0x08, 0x01, 0x01,
                            (byte) 0xA2, 0x03, 0x02, 0x01, 0x00,
                            (byte) 0xA3, 0x0A, 0x04, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
                        };
                        outStream.write(aareResponse);
                        outStream.flush();

                        logService.logCommunication(targetMeter, "INCOMING", "AARQ Handshake: " + xml, "SUCCESS", 0, null);
                        logService.logCommunication(targetMeter, "OUTGOING", "AARE Association Accepted", "SUCCESS", 0, null);
                    } else {
                        byte[] responseAck = new byte[] {
                            0x00, 0x01, 0x00, 0x01, 0x00, 0x01, 0x00, 0x05,
                            0x0C, 0x01, 0x00, 0x00, 0x00
                        };
                        outStream.write(responseAck);
                        outStream.flush();

                        logService.logCommunication(targetMeter, "INCOMING", "COSEM Data Frame: " + xml, "SUCCESS", 0, null);
                        logService.logCommunication(targetMeter, "OUTGOING", "COSEM ACK", "SUCCESS", 0, null);
                    }

                    if (targetMeter != null) {
                        meterService.updateTelemetry(targetMeter.getCommunicationId(),
                                new BigDecimal("0.25"), new BigDecimal("1200.00"),
                                new BigDecimal("45.00"), new BigDecimal("2.1"), new BigDecimal("24.5"));
                    }

                } else {
                    // Text / CSV Telemetry Simulation interface
                    ByteArrayOutputStream buffer = new ByteArrayOutputStream();
                    buffer.write(firstByte);
                    int b;
                    while ((b = inStream.read()) != '\n' && b != '\r' && b != -1) {
                        buffer.write(b);
                    }
                    String line = buffer.toString("UTF-8").trim();
                    if (line.isEmpty()) {
                        continue;
                    }

                    String[] tokens = line.split(",");
                    if (tokens.length >= 4) {
                        String commId = tokens[0].trim();
                        BigDecimal usage = new BigDecimal(tokens[1].trim());
                        BigDecimal reading = new BigDecimal(tokens[2].trim());
                        BigDecimal balance = new BigDecimal(tokens[3].trim());
                        BigDecimal pressure = tokens.length > 4 ? new BigDecimal(tokens[4].trim()) : null;
                        BigDecimal temp = tokens.length > 5 ? new BigDecimal(tokens[5].trim()) : null;

                        GasMeter meter = meterService.getMeterByCommunicationId(commId).orElse(null);

                        if (meter != null) {
                            meterService.updateTelemetry(commId, usage, reading, balance, pressure, temp);
                            logService.logCommunication(meter, "INCOMING", line, "SUCCESS", 0, null);

                            PrintWriter pw = new PrintWriter(outStream, true);
                            String ack = "DLMS_ACK:" + commId + ":OK";
                            pw.println(ack);
                            logService.logCommunication(meter, "OUTGOING", ack, "SUCCESS", 0, null);
                        } else {
                            logService.logCommunication(null, "INCOMING", line, "ERROR", 1, "Meter not found: " + commId);
                            PrintWriter pw = new PrintWriter(outStream, true);
                            pw.println("DLMS_ERROR:UNKNOWN_METER:" + commId);
                        }
                    } else {
                        logService.logCommunication(null, "INCOMING", line, "ERROR", 1, "Invalid frame structure");
                        PrintWriter pw = new PrintWriter(outStream, true);
                        pw.println("DLMS_ERROR:INVALID_FRAME");
                    }
                }
            }

        } catch (IOException e) {
            System.err.println("Communication error with meter at " + remoteAddress + ": " + e.getMessage());
        } finally {
            try {
                socket.close();
            } catch (IOException ignored) {}
        }
    }
}
