import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { AdminLayout, StatusPill } from "../components/admin-layout";
import { api, type GasMeter, type Tariff } from "../lib/api";
import {
  Flame,
  Power,
  RefreshCw,
  Send,
  AlertTriangle,
  Battery,
  Wifi,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  Play,
  Pause,
  KeyRound,
  RotateCcw,
  CreditCard,
  Zap,
  Coins,
  Tag,
} from "lucide-react";

export const Route = createFileRoute("/simulator")({
  head: () => ({
    meta: [
      { title: "Meter Hardware Simulator — Automated Prepaid Gas Meter Management Software" },
      { name: "description", content: "Interactive DLMS/COSEM smart prepaid gas meter device simulator." },
      { property: "og:title", content: "Meter Hardware Simulator — Automated Prepaid Gas Meter Management Software" },
    ],
  }),
  component: MeterSimulatorPage,
});

function MeterSimulatorPage() {
  const [meters, setMeters] = useState<GasMeter[]>([]);
  const [selectedMeterId, setSelectedMeterId] = useState<number | "">("");

  // Physical Meter State (Starts at 0 reading, 0 balance, valve CLOSED)
  const [meterNumber, setMeterNumber] = useState("MTR-NEW-001");
  const [serialNumber, setSerialNumber] = useState("SN-2026-0001");
  const [commId, setCommId] = useState("COMM-001");
  const [balance, setBalance] = useState(0.0);
  const [reading, setReading] = useState(0.0);
  const [flowRate, setFlowRate] = useState(0.25); // m3 per hour
  const [isFlowing, setIsFlowing] = useState(false);
  const [valveOpen, setValveOpen] = useState(false);
  const [pressure, setPressure] = useState(2.2); // kPa
  const [temperature, setTemperature] = useState(25.4); // Celsius
  const [tamperAlarm, setTamperAlarm] = useState(false);

  // Keypad & LCD Display State
  const [keypadInput, setKeypadInput] = useState("");
  const [lcdMessage, setLcdMessage] = useState<string | null>(null);
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [lastTxStatus, setLastTxStatus] = useState<string | null>(null);
  const [autoSync, setAutoSync] = useState(true);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  // Dynamic Tariff Configuration (Latest tariff rate from database)
  const [tariffs, setTariffs] = useState<Tariff[]>([]);
  const [activeTariff, setActiveTariff] = useState<Tariff | null>(null);
  const activeTariffRef = useRef<Tariff | null>(null);

  useEffect(() => {
    activeTariffRef.current = activeTariff;
  }, [activeTariff]);

  const loadTariffs = async () => {
    try {
      const data = await api.getTariffs();
      if (data && data.length > 0) {
        setTariffs(data);
        // Default to active plan or most recently added plan
        const active = data.find((t) => t.isActive) || data[0];
        setActiveTariff(active);
      }
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    loadTariffs();
  }, []);

  // Fetch registered meters on mount
  useEffect(() => {
    api
      .getMeters()
      .then((data) => {
        setMeters(data);
        if (data.length > 0) {
          const first = data[0];
          setSelectedMeterId(first.id);
          setMeterNumber(first.meterNumber);
          setSerialNumber(first.serialNumber);
          setCommId(first.communicationId);
          const bal = (first as any).balance !== undefined ? Number((first as any).balance) : 0.0;
          const rd = (first as any).reading !== undefined ? Number((first as any).reading) : 0.0;
          setBalance(bal);
          setReading(rd);
          const isOpen = first.valveStatus === "OPEN" && bal > 0;
          setValveOpen(isOpen);
          setIsFlowing(false);
        }
      })
      .catch(() => { });
  }, []);

  // Handle selecting a meter from database
  const handleSelectMeter = async (idStr: string) => {
    const id = Number(idStr);
    setSelectedMeterId(id);
    loadTariffs();
    try {
      const found = await api.getMeterById(id);
      if (found) {
        setMeterNumber(found.meterNumber);
        setSerialNumber(found.serialNumber);
        setCommId(found.communicationId);
        const bal = (found as any).balance !== undefined ? Number((found as any).balance) : 0.0;
        const rd = (found as any).reading !== undefined ? Number((found as any).reading) : 0.0;
        setBalance(bal);
        setReading(rd);
        const isOpen = found.valveStatus === "OPEN" && bal > 0;
        setValveOpen(isOpen);
        setIsFlowing(false);
        setLcdMessage(`LOADED ${found.meterNumber} · BAL: ৳${bal.toFixed(2)}`);
        setTimeout(() => setLcdMessage(null), 2500);
        return;
      }
    } catch {
      // fallback to cached list
    }

    const cached = meters.find((m) => m.id === id);
    if (cached) {
      setMeterNumber(cached.meterNumber);
      setSerialNumber(cached.serialNumber);
      setCommId(cached.communicationId);
      const bal = (cached as any).balance !== undefined ? Number((cached as any).balance) : 0.0;
      const rd = (cached as any).reading !== undefined ? Number((cached as any).reading) : 0.0;
      setBalance(bal);
      setReading(rd);
      setValveOpen(cached.valveStatus === "OPEN" && bal > 0);
      setIsFlowing(false);
      setLcdMessage(`LOADED ${cached.meterNumber}`);
      setTimeout(() => setLcdMessage(null), 2500);
    }
  };

  // Real-time gas consumption tick (1 tick per second)
  useEffect(() => {
    if (!isFlowing || !valveOpen || flowRate <= 0) return;

    const interval = setInterval(() => {
      setBalance((prevBal) => {
        if (prevBal <= 0) {
          setValveOpen(false); // Motorized valve automatically shuts off on 0 credit
          setIsFlowing(false);
          setLcdMessage("CREDIT EXHAUSTED - VALVE SHUT");
          if (selectedMeterId) {
            api.toggleValve(Number(selectedMeterId), "CLOSED").catch(() => { });
          }
          saveDataToDatabase({ balance: 0, valve: false, flow: false });
          return 0;
        }

        // Dynamic deduction according to latest active tariff set value
        const currentTariff = activeTariffRef.current;
        const unitCost = currentTariff ? Number(currentTariff.unitPrice) : 0.85;
        const deltaUsage = (flowRate / 3600) * 1.5; // accelerated simulation speed
        const cost = deltaUsage * unitCost;

        setReading((prevReading) => Number((prevReading + deltaUsage).toFixed(3)));
        const newBal = prevBal - cost;
        return Number((newBal > 0 ? newBal : 0).toFixed(2));
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isFlowing, valveOpen, flowRate, selectedMeterId]);

  // Keypad Button Press
  const handleKeyClick = (key: string) => {
    if (key === "C") {
      setKeypadInput("");
      setLcdMessage(null);
      return;
    }

    if (key === "ENTER") {
      handleTokenSubmit();
      return;
    }

    if (keypadInput.length < 24) {
      let formatted = keypadInput + key;
      // Auto-insert dashes every 4 digits for STS format: XXXX-XXXX-XXXX...
      const raw = formatted.replace(/-/g, "");
      if (raw.length % 4 === 0 && raw.length < 20) {
        formatted += "-";
      }
      setKeypadInput(formatted);
    }
  };

  // Save current meter telemetry to server database and sync any external updates (e.g. manual recharge)
  const saveDataToDatabase = async (overrides?: {
    flow?: boolean;
    valve?: boolean;
    reading?: number;
    balance?: number;
    flowRate?: number;
  }) => {
    if (!commId) return;

    const currentFlow = overrides?.flow !== undefined ? overrides.flow : isFlowing;
    const currentValve = overrides?.valve !== undefined ? overrides.valve : valveOpen;
    const currentReading = overrides?.reading !== undefined ? overrides.reading : reading;
    const currentBal = overrides?.balance !== undefined ? overrides.balance : balance;
    const currentRate = overrides?.flowRate !== undefined ? overrides.flowRate : flowRate;

    try {
      const res = await api.sendTelemetry({
        communicationId: commId,
        usage: Number((currentFlow && currentValve ? currentRate : 0).toFixed(3)),
        reading: Number(currentReading.toFixed(3)),
        balance: Number(currentBal.toFixed(2)),
        pressure: Number(pressure.toFixed(2)),
        temperature: Number(temperature.toFixed(2)),
        valveStatus: currentValve ? "OPEN" : "CLOSED",
      });

      const now = new Date().toLocaleTimeString();
      setLastSyncTime(now);

      // AUTOMATIC RECHARGE DETECTION:
      // If server returned a balance higher than current balance (e.g. manual recharge on /recharges or API)
      if (res && res.balance !== undefined) {
        const srvBal = Number(res.balance);
        if (srvBal > currentBal) {
          const added = (srvBal - currentBal).toFixed(2);
          setBalance(srvBal);
          if (!currentValve && srvBal > 0) {
            setValveOpen(true);
          }
          setLcdMessage(`RECHARGE SYNC: +৳${added} · BAL: ৳${srvBal.toFixed(2)}`);
          setTimeout(() => setLcdMessage(null), 4000);
          setLastTxStatus(`Manual recharge of +৳${added} detected & synced at ${now}`);
          return;
        }
      }

      setLastTxStatus(`Database Synced: ${currentReading.toFixed(3)} m³ | ৳${currentBal.toFixed(2)} at ${now}`);
    } catch {
      // offline fallback
    }
  };

  // Direct Manual Recharge from Simulator Console
  const handleManualRecharge = async (amount: number) => {
    setIsTransmitting(true);
    setLcdMessage(`RECHARGING +৳${amount.toFixed(2)}...`);
    try {
      if (selectedMeterId) {
        await api.createRecharge(Number(selectedMeterId), amount, "MANUAL_CONSOLE");
      }
      const newBal = Number((balance + amount).toFixed(2));
      setBalance(newBal);
      setValveOpen(true);
      setLcdMessage(`RECHARGE +৳${amount.toFixed(2)} · VALVE OPEN`);
      setTimeout(() => setLcdMessage(null), 3500);
      const now = new Date().toLocaleTimeString();
      setLastTxStatus(`Manual Recharge: +৳${amount.toFixed(2)} credited & saved at ${now}`);
      await saveDataToDatabase({ balance: newBal, valve: true });
    } catch (err: any) {
      setLcdMessage("RECHARGE ERROR");
      setTimeout(() => setLcdMessage(null), 2500);
    } finally {
      setIsTransmitting(false);
    }
  };

  // Submit Token through keypad
  const handleTokenSubmit = async () => {
    const cleanToken = keypadInput.trim();
    if (!cleanToken || cleanToken.length < 8) {
      setLcdMessage("ERR: INVALID TOKEN");
      setTimeout(() => setLcdMessage(null), 3000);
      return;
    }

    setLcdMessage("VERIFYING TOKEN...");

    try {
      if (selectedMeterId) {
        // Attempt backend recharge
        await api.createRecharge(Number(selectedMeterId), 50.0, "KEYPAD_TOKEN");
        api.toggleValve(Number(selectedMeterId), "OPEN").catch(() => { });
      }
      // Credit meter and open valve
      const newBal = Number((balance + 50.0).toFixed(2));
      setBalance(newBal);
      setValveOpen(true);
      setLcdMessage("ACCEPTED: +৳50.00 · VALVE OPEN");
      setKeypadInput("");
      setTimeout(() => setLcdMessage(null), 3500);
      saveDataToDatabase({ balance: newBal, valve: true });
    } catch {
      // Offline fallback token acceptance for demonstration
      const newBal = Number((balance + 50.0).toFixed(2));
      setBalance(newBal);
      setValveOpen(true);
      setLcdMessage("ACCEPTED: +৳50.00 · VALVE OPEN");
      setKeypadInput("");
      setTimeout(() => setLcdMessage(null), 3500);
      saveDataToDatabase({ balance: newBal, valve: true });
    }
  };

  // Auto-sync simulated telemetry to backend database every 5 seconds
  useEffect(() => {
    if (!autoSync || !commId) return;

    const interval = setInterval(async () => {
      await saveDataToDatabase();
    }, 5000);

    return () => clearInterval(interval);
  }, [autoSync, commId, isFlowing, valveOpen, flowRate, reading, balance, pressure, temperature]);

  // Push telemetry to REST API manually
  const handleSendTelemetry = async () => {
    setIsTransmitting(true);
    setLcdMessage("SIM TX: SYNCING...");
    await saveDataToDatabase();
    setIsTransmitting(false);
  };

  const handleToggleValve = async () => {
    if (!valveOpen && balance <= 0) {
      setLcdMessage("ERR: 0 BALANCE - RECHARGE FIRST");
      setTimeout(() => setLcdMessage(null), 3000);
      return;
    }
    const nextState = !valveOpen;
    setValveOpen(nextState);
    if (!nextState) {
      setIsFlowing(false);
    }
    if (selectedMeterId) {
      api.toggleValve(Number(selectedMeterId), nextState ? "OPEN" : "CLOSED").catch(() => { });
    }
    setLcdMessage(nextState ? "VALVE OPENED" : "VALVE CLOSED");
    setTimeout(() => setLcdMessage(null), 2500);

    // Save every state update immediately to database!
    saveDataToDatabase({ valve: nextState, flow: nextState ? isFlowing : false });
  };

  return (
    <AdminLayout
      title="Gas Meter Simulator"
      subtitle="Smart Prepaid Meter Hardware Simulator & Real-Time Telemetry Engine (No Hardware/DLMS Socket Required)"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: REALISTIC PHYSICAL HARDWARE METER UNIT */}
        <div className="lg:col-span-6 flex flex-col items-center">
          {/* Top Metal Pipe Inlets */}
          <div className="flex justify-between w-64 px-12 mb-[-8px] z-10">
            <div className="flex flex-col items-center">
              <div className="w-10 h-6 bg-gradient-to-b from-zinc-500 to-zinc-700 rounded-t-md border border-zinc-600 shadow-inner flex items-center justify-center text-[9px] font-mono text-zinc-300">
                GAS IN
              </div>
              <div className="w-6 h-3 bg-zinc-600" />
            </div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-6 bg-gradient-to-b from-zinc-500 to-zinc-700 rounded-t-md border border-zinc-600 shadow-inner flex items-center justify-center text-[9px] font-mono text-zinc-300">
                OUT
              </div>
              <div className="w-6 h-3 bg-zinc-600" />
            </div>
          </div>

          {/* Heavy-Duty Industrial Polycarbonate Casing */}
          <div className="w-full max-w-md rounded-[32px] bg-gradient-to-b from-zinc-100 via-zinc-200 to-zinc-300 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 border-4 border-zinc-400 dark:border-zinc-700 p-6 shadow-2xl shadow-black/30 relative">
            {/* Corner Industrial Safety Screws */}
            <div className="absolute top-4 left-4 w-3.5 h-3.5 rounded-full bg-zinc-400 dark:bg-zinc-600 border border-zinc-500 shadow-inner flex items-center justify-center text-[10px] text-zinc-700 dark:text-zinc-300">
              +
            </div>
            <div className="absolute top-4 right-4 w-3.5 h-3.5 rounded-full bg-zinc-400 dark:bg-zinc-600 border border-zinc-500 shadow-inner flex items-center justify-center text-[10px] text-zinc-700 dark:text-zinc-300">
              +
            </div>
            <div className="absolute bottom-4 left-4 w-3.5 h-3.5 rounded-full bg-zinc-400 dark:bg-zinc-600 border border-zinc-500 shadow-inner flex items-center justify-center text-[10px] text-zinc-700 dark:text-zinc-300">
              +
            </div>
            <div className="absolute bottom-4 right-4 w-3.5 h-3.5 rounded-full bg-zinc-400 dark:bg-zinc-600 border border-zinc-500 shadow-inner flex items-center justify-center text-[10px] text-zinc-700 dark:text-zinc-300">
              +
            </div>

            {/* Manufacturer Brand Banner */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-300 dark:border-zinc-700">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-lg bg-primary text-primary-foreground grid place-items-center">
                  <Flame className="h-3.5 w-3.5" />
                </div>
                <div>
                  <div className="font-bold tracking-wider text-xs text-zinc-900 dark:text-zinc-100 uppercase">
                    Smart Meter DLMS
                  </div>
                  <div className="text-[9px] font-mono text-zinc-500">G4-PREPAID-COSEM</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-mono font-bold text-zinc-800 dark:text-zinc-200">
                  {meterNumber}
                </div>
                <div className="text-[9px] text-zinc-500 font-mono">SN: {serialNumber}</div>
              </div>
            </div>

            {/* REALISTIC HIGH-CONTRAST DIGITAL LCD DISPLAY */}
            <div className="rounded-2xl bg-emerald-950/90 dark:bg-emerald-950 border-4 border-zinc-800 p-4 shadow-inner mb-4 relative overflow-hidden font-mono">
              {/* Backlight Glow Filter */}
              <div className="absolute inset-0 bg-emerald-500/10 pointer-events-none" />

              {/* LCD Top Status Bar (Battery, Signal, Valve, Tariff) */}
              <div className="flex items-center justify-between text-[11px] text-emerald-400/80 mb-2 border-b border-emerald-800/60 pb-1.5">
                <div className="flex items-center gap-1.5">
                  <Wifi className="h-3.5 w-3.5" />
                  <span className="text-[10px]">IoT SMART METER</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-900/70 text-emerald-300 border border-emerald-800/80">
                    RATE: ৳${(activeTariff ? Number(activeTariff.unitPrice) : 0.85).toFixed(2)}/m³
                  </span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${valveOpen ? "bg-emerald-800/80 text-emerald-200" : "bg-red-900 text-red-200"
                      }`}
                  >
                    VALVE: {valveOpen ? "OPEN" : "SHUT"}
                  </span>
                  <div className="flex items-center gap-1">
                    <Battery className="h-3.5 w-3.5" />
                    <span className="text-[10px]">3.6V</span>
                  </div>
                </div>
              </div>

              {/* LCD Main Readouts: Cumulative Reading & Credit */}
              <div className="py-2">
                <div className="text-[10px] uppercase text-emerald-500/80 tracking-wider">
                  Cumulative Volume Index
                </div>
                <div className="text-3xl font-black tracking-widest text-emerald-300 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]">
                  {reading.toFixed(3)}{" "}
                  <span className="text-sm font-semibold text-emerald-400">m³</span>
                </div>
              </div>

              {/* LCD Credit & Instant Flow */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-emerald-800/60 mt-1">
                <div>
                  <div className="text-[10px] uppercase text-emerald-500/80">Remaining Credit</div>
                  <div className="text-xl font-bold text-emerald-300">
                    ৳{balance.toFixed(2)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase text-emerald-500/80">Current Flow</div>
                  <div className="text-xl font-bold text-emerald-300">
                    {valveOpen && isFlowing ? flowRate.toFixed(2) : "0.00"}{" "}
                    <span className="text-xs font-normal">m³/h</span>
                  </div>
                </div>
              </div>

              {/* Dynamic LCD Alert or Message Marquee */}
              <div className="mt-3 pt-2 border-t border-emerald-800/60 flex items-center justify-between text-[11px] font-bold">
                <div className="text-emerald-400 truncate">
                  {lcdMessage ? (
                    <span className="animate-pulse text-emerald-200">{lcdMessage}</span>
                  ) : (
                    <span>KEYPAD: {keypadInput || "ENTER 20-DIGIT TOKEN"}</span>
                  )}
                </div>
                {tamperAlarm && (
                  <span className="text-red-400 animate-bounce flex items-center gap-1 shrink-0">
                    <AlertTriangle className="h-3 w-3" /> TAMPER
                  </span>
                )}
              </div>
            </div>

            {/* HARDWARE STATUS LED INDICATORS */}
            <div className="flex items-center justify-around py-2 mb-4 bg-zinc-300 dark:bg-zinc-800/60 rounded-xl border border-zinc-400 dark:border-zinc-700/60">
              <div className="flex flex-col items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                <span className="text-[9px] font-bold font-mono text-zinc-600 dark:text-zinc-400">
                  PWR
                </span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`w-3 h-3 rounded-full ${isTransmitting
                    ? "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.9)] animate-ping"
                    : "bg-amber-700/40"
                    }`}
                />
                <span className="text-[9px] font-bold font-mono text-zinc-600 dark:text-zinc-400">
                  TX / SYNC
                </span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`w-3 h-3 rounded-full ${valveOpen
                    ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"
                    : "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse"
                    }`}
                />
                <span className="text-[9px] font-bold font-mono text-zinc-600 dark:text-zinc-400">
                  VALVE
                </span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`w-3 h-3 rounded-full ${tamperAlarm
                    ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-ping"
                    : "bg-zinc-500/30"
                    }`}
                />
                <span className="text-[9px] font-bold font-mono text-zinc-600 dark:text-zinc-400">
                  ALARM
                </span>
              </div>
            </div>

            {/* 12-BUTTON PHYSICAL STS MATRIX KEYPAD */}
            <div className="bg-zinc-800 dark:bg-zinc-950 p-4 rounded-2xl border-2 border-zinc-700 shadow-inner">
              <div className="text-[10px] font-mono text-zinc-400 text-center mb-2 uppercase tracking-wider">
                STS Numeric Keypad
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                {["1", "2", "3", "4", "5", "6", "7", "8", "9", "C", "0", "ENTER"].map((k) => (
                  <button
                    key={k}
                    onClick={() => handleKeyClick(k)}
                    className={`h-11 rounded-xl text-sm font-bold font-mono transition-all active:scale-95 shadow-md flex items-center justify-center ${k === "ENTER"
                      ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/30"
                      : k === "C"
                        ? "bg-zinc-700 text-red-400 hover:bg-zinc-600"
                        : "bg-zinc-700/80 text-zinc-100 hover:bg-zinc-600 border-t border-zinc-500"
                      }`}
                  >
                    {k === "ENTER" ? "↵ ENTER" : k}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SIMPLE, REALISTIC SIMULATION CONTROL PANEL */}
        <div className="lg:col-span-6 space-y-6">
          {/* Active Target Device Selector */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold flex items-center gap-2">
                <Sliders className="h-4 w-4 text-primary" />
                Target Meter Device
              </div>
              <span className="text-xs text-muted-foreground font-mono">
                Live REST Telemetry
              </span>
            </div>
            <select
              value={selectedMeterId}
              onChange={(e) => handleSelectMeter(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-border bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {meters.length === 0 && <option value="">Standalone Test Meter (MTR-DLMS-001)</option>}
              {meters.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.meterNumber} ({m.serialNumber}) — {m.customer ? `${m.customer.firstName} ${m.customer.lastName}` : "Inventory"}
                </option>
              ))}
            </select>
          </div>

          {/* Real-time Telemetry Auto-Sync Engine */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-3 h-3 rounded-full ${autoSync
                    ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse"
                    : "bg-zinc-400"
                    }`}
                />
                <div>
                  <h4 className="text-sm font-semibold">Simulated Meter Live Auto-Sync</h4>
                  <p className="text-xs text-muted-foreground">
                    Continuously pushes readings & telemetry to database
                  </p>
                </div>
              </div>
              <button
                onClick={() => setAutoSync(!autoSync)}
                className={`h-8 px-3 rounded-lg text-xs font-semibold transition ${autoSync
                  ? "bg-emerald-500/15 text-emerald-600 border border-emerald-500/30"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
              >
                {autoSync ? "Auto-Sync: ACTIVE (5s)" : "Auto-Sync: PAUSED"}
              </button>
            </div>
            {lastSyncTime && (
              <div className="text-[11px] font-mono text-muted-foreground flex items-center justify-between pt-1 border-t border-border/50">
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">● Database Linked</span>
                <span>Last Telemetry Sync: {lastSyncTime}</span>
              </div>
            )}
          </div>

          {/* Gas Burner Flow Simulator */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame
                  className={`h-5 w-5 transition-colors ${isFlowing && valveOpen ? "text-orange-500 animate-pulse" : "text-muted-foreground"
                    }`}
                />
                <div>
                  <h4 className="text-sm font-semibold">Simulate Gas Consumption</h4>
                  <p className="text-xs text-muted-foreground">Adjust burner flow rate to tick the meter</p>
                </div>
              </div>
              <button
                onClick={() => {
                  if (!isFlowing) {
                    if (balance <= 0) {
                      setLcdMessage("ERR: 0 BALANCE - RECHARGE TO FLOW");
                      setTimeout(() => setLcdMessage(null), 3000);
                      return;
                    }
                    if (!valveOpen) {
                      setLcdMessage("ERR: VALVE SHUT - OPEN VALVE FIRST");
                      setTimeout(() => setLcdMessage(null), 3000);
                      return;
                    }
                    setIsFlowing(true);
                    saveDataToDatabase({ flow: true });
                  } else {
                    setIsFlowing(false);
                    saveDataToDatabase({ flow: false });
                  }
                }}
                className={`h-9 px-3 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition ${isFlowing
                  ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                  : "bg-primary text-primary-foreground"
                  }`}
              >
                {isFlowing ? (
                  <>
                    <Pause className="h-3.5 w-3.5" /> Pause Flow
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5" /> Start Flow
                  </>
                )}
              </button>
            </div>

            {/* Active Tariff Plan Info & Sync */}
            <div className="p-3 rounded-xl bg-muted/50 border border-border flex items-center justify-between flex-wrap gap-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-primary/10 text-primary grid place-items-center">
                  <Coins className="h-3.5 w-3.5" />
                </div>
                <div>
                  <div className="font-semibold text-foreground flex items-center gap-1.5">
                    <span>Applied Tariff:</span>
                    <span className="text-primary font-bold">
                      {activeTariff ? activeTariff.name : "Standard Residential Plan"}
                    </span>
                    {activeTariff?.isActive && (
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded font-mono font-medium">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-muted-foreground font-mono">
                    Rate: <strong className="text-foreground">৳{(activeTariff ? Number(activeTariff.unitPrice) : 0.85).toFixed(2)} / m³</strong>
                    {activeTariff && Number(activeTariff.vatPercentage) > 0 && (
                      <span className="ml-1 opacity-80">(+{activeTariff.vatPercentage}% VAT)</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {tariffs.length > 1 && (
                  <select
                    value={activeTariff?.id || ""}
                    onChange={(e) => {
                      const selected = tariffs.find((t) => t.id === Number(e.target.value));
                      if (selected) {
                        setActiveTariff(selected);
                        setLcdMessage(`TARIFF: ৳${Number(selected.unitPrice).toFixed(2)}/m³`);
                        setTimeout(() => setLcdMessage(null), 2500);
                      }
                    }}
                    className="h-8 px-2 rounded-lg border border-border bg-background text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    {tariffs.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} (৳{Number(t.unitPrice).toFixed(2)}/m³)
                      </option>
                    ))}
                  </select>
                )}
                <button
                  onClick={async () => {
                    await loadTariffs();
                    setLcdMessage("TARIFF RELOADED");
                    setTimeout(() => setLcdMessage(null), 2000);
                  }}
                  className="h-8 px-2.5 rounded-lg border border-border bg-background hover:bg-accent text-xs inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition"
                  title="Reload latest tariff from database"
                >
                  <RefreshCw className="h-3 w-3" />
                  <span>Sync Tariff</span>
                </button>
              </div>
            </div>

            {/* Quick Flow Presets */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "Off", rate: 0.0 },
                { label: "1 Stove Low", rate: 0.15 },
                { label: "2 Burners", rate: 0.35 },
                { label: "Full Heating", rate: 0.75 },
              ].map((p) => (
                <button
                  key={p.label}
                  onClick={() => {
                    if (p.rate > 0) {
                      if (balance <= 0) {
                        setLcdMessage("ERR: 0 BALANCE - RECHARGE FIRST");
                        setTimeout(() => setLcdMessage(null), 3000);
                        return;
                      }
                      if (!valveOpen) {
                        setLcdMessage("ERR: VALVE SHUT - OPEN VALVE FIRST");
                        setTimeout(() => setLcdMessage(null), 3000);
                        return;
                      }
                    }
                    setFlowRate(p.rate);
                    const nextFlow = p.rate > 0 && valveOpen && balance > 0;
                    setIsFlowing(nextFlow);
                    saveDataToDatabase({ flow: nextFlow, flowRate: p.rate });
                  }}
                  className={`py-2 px-1 rounded-xl text-xs font-semibold border transition text-center ${flowRate === p.rate && isFlowing
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "border-border hover:bg-accent text-foreground/80"
                    }`}
                >
                  <div>{p.label}</div>
                  <div className="text-[10px] opacity-80">{p.rate} m³/h</div>
                </button>
              ))}
            </div>

            {/* Flow Slider */}
            <div>
              <div className="flex justify-between text-xs text-muted-foreground mb-1.5 font-mono">
                <span>Flow Rate: {flowRate.toFixed(2)} m³/h</span>
                <span>
                  Burn Rate: ৳{(flowRate * (activeTariff ? Number(activeTariff.unitPrice) : 0.85)).toFixed(2)} / hr
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1.5"
                step="0.05"
                value={flowRate}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setFlowRate(val);
                  const nextFlow = val > 0 && valveOpen && balance > 0;
                  setIsFlowing(nextFlow);
                  saveDataToDatabase({ flow: nextFlow, flowRate: val });
                }}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>
          </div>

          {/* Manual Recharge & STS Token Station */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-primary" />
                <h4 className="text-sm font-semibold">Manual Recharge & Token Station</h4>
              </div>
              <span className="text-xs text-muted-foreground font-mono">Real-time DB Sync</span>
            </div>

            {/* Instant Manual Top-up Buttons */}
            <div>
              <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1.5 font-medium">
                <Zap className="h-3.5 w-3.5 text-amber-500" />
                Instant Manual Top-up (Automatically credits DB & opens valve):
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "+৳20.00", amount: 20 },
                  { label: "+৳50.00", amount: 50 },
                  { label: "+৳100.00", amount: 100 },
                ].map((top) => (
                  <button
                    key={top.label}
                    onClick={() => handleManualRecharge(top.amount)}
                    disabled={isTransmitting}
                    className="h-9 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 text-xs font-bold transition flex items-center justify-center gap-1 active:scale-95 disabled:opacity-50"
                  >
                    <span>{top.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 20-Digit STS Keypad Token Generator */}
            <div className="pt-2 border-t border-border space-y-2">
              <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                <KeyRound className="h-3.5 w-3.5 text-primary" />
                <span>Or generate 20-digit token for physical keypad entry:</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const sampleToken = `${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(
                      1000 + Math.random() * 9000
                    )}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(
                      1000 + Math.random() * 9000
                    )}-${Math.floor(1000 + Math.random() * 9000)}`;
                    setKeypadInput(sampleToken);
                  }}
                  className="flex-1 h-10 rounded-xl bg-accent hover:bg-accent/80 text-foreground text-xs font-semibold inline-flex items-center justify-center gap-2 transition"
                >
                  Generate ৳50 Token
                </button>
                <button
                  onClick={handleTokenSubmit}
                  className="h-10 px-4 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition shadow-sm"
                >
                  Inject Token
                </button>
              </div>
            </div>
          </div>

          {/* Telemetry Transmission & Valve Diagnostics */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
            <div className="text-sm font-semibold flex items-center justify-between">
              <span>Hardware Telemetry & Valve Control</span>
              <StatusPill tone={valveOpen ? "success" : "error"}>
                {valveOpen ? "Valve Open" : "Valve Closed"}
              </StatusPill>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleToggleValve}
                className={`h-11 rounded-xl text-xs font-bold inline-flex items-center justify-center gap-2 transition ${valveOpen
                  ? "bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20"
                  : "bg-[oklch(0.75_0.15_160/0.15)] text-[oklch(0.5_0.15_160)] hover:bg-[oklch(0.75_0.15_160/0.25)] border border-emerald-500/20"
                  }`}
              >
                <Power className="h-4 w-4" />
                {valveOpen ? "Shutoff Valve (Close)" : "Open Valve (Restore)"}
              </button>

              <button
                onClick={handleSendTelemetry}
                disabled={isTransmitting}
                className="h-11 rounded-xl bg-primary text-primary-foreground text-xs font-bold inline-flex items-center justify-center gap-2 hover:bg-primary/90 transition shadow-sm disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                {isTransmitting ? "Transmitting..." : "Push Telemetry Now"}
              </button>
            </div>

            {/* Diagnostic Alarms Simulator */}
            <div className="pt-2 border-t border-border flex items-center justify-between">
              <div className="text-xs text-muted-foreground">Simulate Tamper / Magnetic Sensor:</div>
              <button
                onClick={() => {
                  const next = !tamperAlarm;
                  setTamperAlarm(next);
                  if (next) {
                    setLcdMessage("ALARM: MAGNETIC TAMPER DETECTED");
                  } else {
                    setLcdMessage("ALARM CLEARED");
                    setTimeout(() => setLcdMessage(null), 2000);
                  }
                }}
                className={`h-8 px-3 rounded-lg text-xs font-semibold transition ${tamperAlarm
                  ? "bg-red-500 text-white shadow-md shadow-red-500/20"
                  : "bg-accent hover:bg-accent/80 text-foreground"
                  }`}
              >
                {tamperAlarm ? "Tamper Active (Click to Clear)" : "Trigger Tamper"}
              </button>
            </div>

            {lastTxStatus && (
              <div className="p-2.5 rounded-lg bg-accent/60 text-[11px] font-mono text-muted-foreground border border-border/50">
                Network: {lastTxStatus}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
