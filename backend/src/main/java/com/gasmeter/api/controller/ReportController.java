package com.gasmeter.api.controller;

import com.gasmeter.api.model.Customer;
import com.gasmeter.api.model.GasMeter;
import com.gasmeter.api.model.Recharge;
import com.gasmeter.api.service.CustomerService;
import com.gasmeter.api.service.MeterService;
import com.gasmeter.api.service.RechargeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportController {

    @Autowired
    private MeterService meterService;

    @Autowired
    private CustomerService customerService;

    @Autowired
    private RechargeService rechargeService;

    @GetMapping("/export/{type}")
    public ResponseEntity<byte[]> exportReport(@PathVariable String type) {
        StringBuilder csv = new StringBuilder();
        String filename = "report-" + type + ".csv";

        if ("meters".equalsIgnoreCase(type)) {
            csv.append("ID,MeterNumber,SerialNumber,CommunicationID,Firmware,Status,ValveStatus,Location\n");
            List<GasMeter> meters = meterService.getAllMeters();
            for (GasMeter m : meters) {
                csv.append(String.format("%d,\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\"\n",
                        m.getId(),
                        m.getMeterNumber(),
                        m.getSerialNumber(),
                        m.getCommunicationId(),
                        m.getFirmwareVersion() != null ? m.getFirmwareVersion() : "",
                        m.getStatus(),
                        m.getValveStatus(),
                        m.getInstallationLocation() != null ? m.getInstallationLocation().replace("\"", "\"\"") : ""
                ));
            }
        } else if ("customers".equalsIgnoreCase(type)) {
            csv.append("ID,FirstName,LastName,Email,Phone,NationalID,Address\n");
            List<Customer> customers = customerService.getAllCustomers();
            for (Customer c : customers) {
                csv.append(String.format("%d,\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\"\n",
                        c.getId(),
                        c.getFirstName(),
                        c.getLastName(),
                        c.getEmail() != null ? c.getEmail() : "",
                        c.getPhone(),
                        c.getNationalId() != null ? c.getNationalId() : "",
                        c.getAddress() != null ? c.getAddress().replace("\"", "\"\"") : ""
                ));
            }
        } else if ("recharges".equalsIgnoreCase(type) || "revenue".equalsIgnoreCase(type)) {
            csv.append("ID,MeterNumber,Amount,Token,PaymentMethod,Status,Date\n");
            List<Recharge> recharges = rechargeService.getAllRecharges();
            DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            for (Recharge r : recharges) {
                csv.append(String.format("%d,\"%s\",%.2f,\"%s\",\"%s\",\"%s\",\"%s\"\n",
                        r.getId(),
                        r.getMeter() != null ? r.getMeter().getMeterNumber() : "N/A",
                        r.getAmount(),
                        r.getToken(),
                        r.getPaymentMethod(),
                        r.getStatus(),
                        r.getCreatedAt() != null ? r.getCreatedAt().format(fmt) : ""
                ));
            }
        } else {
            csv.append("No data available for report type: " + type + "\n");
        }

        byte[] output = csv.toString().getBytes();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(output);
    }
}
