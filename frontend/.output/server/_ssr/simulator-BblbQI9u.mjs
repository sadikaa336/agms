import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { L as Flame, M as KeyRound, S as Play, U as CreditCard, W as Coins, Y as Battery, _ as RefreshCw, b as Power, f as SlidersVertical, h as Send, l as TriangleAlert, r as Wifi, t as Zap, w as Pause } from "../_libs/lucide-react.mjs";
import { r as StatusPill, t as AdminLayout } from "./admin-layout-CbX8iDgK.mjs";
import { t as api } from "./api-DRGUSpxz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/simulator-BblbQI9u.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MeterSimulatorPage() {
	const [meters, setMeters] = (0, import_react.useState)([]);
	const [selectedMeterId, setSelectedMeterId] = (0, import_react.useState)("");
	const [meterNumber, setMeterNumber] = (0, import_react.useState)("MTR-NEW-001");
	const [serialNumber, setSerialNumber] = (0, import_react.useState)("SN-2026-0001");
	const [commId, setCommId] = (0, import_react.useState)("COMM-001");
	const [balance, setBalance] = (0, import_react.useState)(0);
	const [reading, setReading] = (0, import_react.useState)(0);
	const [flowRate, setFlowRate] = (0, import_react.useState)(.25);
	const [isFlowing, setIsFlowing] = (0, import_react.useState)(false);
	const [valveOpen, setValveOpen] = (0, import_react.useState)(false);
	const [pressure, setPressure] = (0, import_react.useState)(2.2);
	const [temperature, setTemperature] = (0, import_react.useState)(25.4);
	const [tamperAlarm, setTamperAlarm] = (0, import_react.useState)(false);
	const [keypadInput, setKeypadInput] = (0, import_react.useState)("");
	const [lcdMessage, setLcdMessage] = (0, import_react.useState)(null);
	const [isTransmitting, setIsTransmitting] = (0, import_react.useState)(false);
	const [lastTxStatus, setLastTxStatus] = (0, import_react.useState)(null);
	const [autoSync, setAutoSync] = (0, import_react.useState)(true);
	const [lastSyncTime, setLastSyncTime] = (0, import_react.useState)(null);
	const [tariffs, setTariffs] = (0, import_react.useState)([]);
	const [activeTariff, setActiveTariff] = (0, import_react.useState)(null);
	const activeTariffRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		activeTariffRef.current = activeTariff;
	}, [activeTariff]);
	const loadTariffs = async () => {
		try {
			const data = await api.getTariffs();
			if (data && data.length > 0) {
				setTariffs(data);
				const active = data.find((t) => t.isActive) || data[0];
				setActiveTariff(active);
			}
		} catch {}
	};
	(0, import_react.useEffect)(() => {
		loadTariffs();
	}, []);
	(0, import_react.useEffect)(() => {
		api.getMeters().then((data) => {
			setMeters(data);
			if (data.length > 0) {
				const first = data[0];
				setSelectedMeterId(first.id);
				setMeterNumber(first.meterNumber);
				setSerialNumber(first.serialNumber);
				setCommId(first.communicationId);
				const bal = first.balance !== void 0 ? Number(first.balance) : 0;
				const rd = first.reading !== void 0 ? Number(first.reading) : 0;
				setBalance(bal);
				setReading(rd);
				const isOpen = first.valveStatus === "OPEN" && bal > 0;
				setValveOpen(isOpen);
				setIsFlowing(false);
			}
		}).catch(() => {});
	}, []);
	const handleSelectMeter = async (idStr) => {
		const id = Number(idStr);
		setSelectedMeterId(id);
		loadTariffs();
		try {
			const found = await api.getMeterById(id);
			if (found) {
				setMeterNumber(found.meterNumber);
				setSerialNumber(found.serialNumber);
				setCommId(found.communicationId);
				const bal = found.balance !== void 0 ? Number(found.balance) : 0;
				const rd = found.reading !== void 0 ? Number(found.reading) : 0;
				setBalance(bal);
				setReading(rd);
				const isOpen = found.valveStatus === "OPEN" && bal > 0;
				setValveOpen(isOpen);
				setIsFlowing(false);
				setLcdMessage(`LOADED ${found.meterNumber} · BAL: ৳${bal.toFixed(2)}`);
				setTimeout(() => setLcdMessage(null), 2500);
				return;
			}
		} catch {}
		const cached = meters.find((m) => m.id === id);
		if (cached) {
			setMeterNumber(cached.meterNumber);
			setSerialNumber(cached.serialNumber);
			setCommId(cached.communicationId);
			const bal = cached.balance !== void 0 ? Number(cached.balance) : 0;
			const rd = cached.reading !== void 0 ? Number(cached.reading) : 0;
			setBalance(bal);
			setReading(rd);
			setValveOpen(cached.valveStatus === "OPEN" && bal > 0);
			setIsFlowing(false);
			setLcdMessage(`LOADED ${cached.meterNumber}`);
			setTimeout(() => setLcdMessage(null), 2500);
		}
	};
	(0, import_react.useEffect)(() => {
		if (!isFlowing || !valveOpen || flowRate <= 0) return;
		const interval = setInterval(() => {
			setBalance((prevBal) => {
				if (prevBal <= 0) {
					setValveOpen(false);
					setIsFlowing(false);
					setLcdMessage("CREDIT EXHAUSTED - VALVE SHUT");
					if (selectedMeterId) api.toggleValve(Number(selectedMeterId), "CLOSED").catch(() => {});
					saveDataToDatabase({
						balance: 0,
						valve: false,
						flow: false
					});
					return 0;
				}
				const currentTariff = activeTariffRef.current;
				const unitCost = currentTariff ? Number(currentTariff.unitPrice) : .85;
				const deltaUsage = flowRate / 3600 * 1.5;
				const cost = deltaUsage * unitCost;
				setReading((prevReading) => Number((prevReading + deltaUsage).toFixed(3)));
				const newBal = prevBal - cost;
				return Number((newBal > 0 ? newBal : 0).toFixed(2));
			});
		}, 1e3);
		return () => clearInterval(interval);
	}, [
		isFlowing,
		valveOpen,
		flowRate,
		selectedMeterId
	]);
	const handleKeyClick = (key) => {
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
			const raw = formatted.replace(/-/g, "");
			if (raw.length % 4 === 0 && raw.length < 20) formatted += "-";
			setKeypadInput(formatted);
		}
	};
	const saveDataToDatabase = async (overrides) => {
		if (!commId) return;
		const currentFlow = overrides?.flow !== void 0 ? overrides.flow : isFlowing;
		const currentValve = overrides?.valve !== void 0 ? overrides.valve : valveOpen;
		const currentReading = overrides?.reading !== void 0 ? overrides.reading : reading;
		const currentBal = overrides?.balance !== void 0 ? overrides.balance : balance;
		const currentRate = overrides?.flowRate !== void 0 ? overrides.flowRate : flowRate;
		try {
			const res = await api.sendTelemetry({
				communicationId: commId,
				usage: Number((currentFlow && currentValve ? currentRate : 0).toFixed(3)),
				reading: Number(currentReading.toFixed(3)),
				balance: Number(currentBal.toFixed(2)),
				pressure: Number(pressure.toFixed(2)),
				temperature: Number(temperature.toFixed(2)),
				valveStatus: currentValve ? "OPEN" : "CLOSED"
			});
			const now = (/* @__PURE__ */ new Date()).toLocaleTimeString();
			setLastSyncTime(now);
			if (res && res.balance !== void 0) {
				const srvBal = Number(res.balance);
				if (srvBal > currentBal) {
					const added = (srvBal - currentBal).toFixed(2);
					setBalance(srvBal);
					if (!currentValve && srvBal > 0) setValveOpen(true);
					setLcdMessage(`RECHARGE SYNC: +৳${added} · BAL: ৳${srvBal.toFixed(2)}`);
					setTimeout(() => setLcdMessage(null), 4e3);
					setLastTxStatus(`Manual recharge of +৳${added} detected & synced at ${now}`);
					return;
				}
			}
			setLastTxStatus(`Database Synced: ${currentReading.toFixed(3)} m³ | ৳${currentBal.toFixed(2)} at ${now}`);
		} catch {}
	};
	const handleManualRecharge = async (amount) => {
		setIsTransmitting(true);
		setLcdMessage(`RECHARGING +৳${amount.toFixed(2)}...`);
		try {
			if (selectedMeterId) await api.createRecharge(Number(selectedMeterId), amount, "MANUAL_CONSOLE");
			const newBal = Number((balance + amount).toFixed(2));
			setBalance(newBal);
			setValveOpen(true);
			setLcdMessage(`RECHARGE +৳${amount.toFixed(2)} · VALVE OPEN`);
			setTimeout(() => setLcdMessage(null), 3500);
			const now = (/* @__PURE__ */ new Date()).toLocaleTimeString();
			setLastTxStatus(`Manual Recharge: +৳${amount.toFixed(2)} credited & saved at ${now}`);
			await saveDataToDatabase({
				balance: newBal,
				valve: true
			});
		} catch (err) {
			setLcdMessage("RECHARGE ERROR");
			setTimeout(() => setLcdMessage(null), 2500);
		} finally {
			setIsTransmitting(false);
		}
	};
	const handleTokenSubmit = async () => {
		const cleanToken = keypadInput.trim();
		if (!cleanToken || cleanToken.length < 8) {
			setLcdMessage("ERR: INVALID TOKEN");
			setTimeout(() => setLcdMessage(null), 3e3);
			return;
		}
		setLcdMessage("VERIFYING TOKEN...");
		try {
			if (selectedMeterId) {
				await api.createRecharge(Number(selectedMeterId), 50, "KEYPAD_TOKEN");
				api.toggleValve(Number(selectedMeterId), "OPEN").catch(() => {});
			}
			const newBal = Number((balance + 50).toFixed(2));
			setBalance(newBal);
			setValveOpen(true);
			setLcdMessage("ACCEPTED: +৳50.00 · VALVE OPEN");
			setKeypadInput("");
			setTimeout(() => setLcdMessage(null), 3500);
			saveDataToDatabase({
				balance: newBal,
				valve: true
			});
		} catch {
			const newBal = Number((balance + 50).toFixed(2));
			setBalance(newBal);
			setValveOpen(true);
			setLcdMessage("ACCEPTED: +৳50.00 · VALVE OPEN");
			setKeypadInput("");
			setTimeout(() => setLcdMessage(null), 3500);
			saveDataToDatabase({
				balance: newBal,
				valve: true
			});
		}
	};
	(0, import_react.useEffect)(() => {
		if (!autoSync || !commId) return;
		const interval = setInterval(async () => {
			await saveDataToDatabase();
		}, 5e3);
		return () => clearInterval(interval);
	}, [
		autoSync,
		commId,
		isFlowing,
		valveOpen,
		flowRate,
		reading,
		balance,
		pressure,
		temperature
	]);
	const handleSendTelemetry = async () => {
		setIsTransmitting(true);
		setLcdMessage("SIM TX: SYNCING...");
		await saveDataToDatabase();
		setIsTransmitting(false);
	};
	const handleToggleValve = async () => {
		if (!valveOpen && balance <= 0) {
			setLcdMessage("ERR: 0 BALANCE - RECHARGE FIRST");
			setTimeout(() => setLcdMessage(null), 3e3);
			return;
		}
		const nextState = !valveOpen;
		setValveOpen(nextState);
		if (!nextState) setIsFlowing(false);
		if (selectedMeterId) api.toggleValve(Number(selectedMeterId), nextState ? "OPEN" : "CLOSED").catch(() => {});
		setLcdMessage(nextState ? "VALVE OPENED" : "VALVE CLOSED");
		setTimeout(() => setLcdMessage(null), 2500);
		saveDataToDatabase({
			valve: nextState,
			flow: nextState ? isFlowing : false
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLayout, {
		title: "Gas Meter Simulator",
		subtitle: "Smart Prepaid Meter Hardware Simulator & Real-Time Telemetry Engine (No Hardware/DLMS Socket Required)",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 lg:grid-cols-12 gap-8 items-start",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:col-span-6 flex flex-col items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-between w-64 px-12 mb-[-8px] z-10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-10 h-6 bg-gradient-to-b from-zinc-500 to-zinc-700 rounded-t-md border border-zinc-600 shadow-inner flex items-center justify-center text-[9px] font-mono text-zinc-300",
							children: "GAS IN"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-6 h-3 bg-zinc-600" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-10 h-6 bg-gradient-to-b from-zinc-500 to-zinc-700 rounded-t-md border border-zinc-600 shadow-inner flex items-center justify-center text-[9px] font-mono text-zinc-300",
							children: "OUT"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-6 h-3 bg-zinc-600" })]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-md rounded-[32px] bg-gradient-to-b from-zinc-100 via-zinc-200 to-zinc-300 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 border-4 border-zinc-400 dark:border-zinc-700 p-6 shadow-2xl shadow-black/30 relative",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute top-4 left-4 w-3.5 h-3.5 rounded-full bg-zinc-400 dark:bg-zinc-600 border border-zinc-500 shadow-inner flex items-center justify-center text-[10px] text-zinc-700 dark:text-zinc-300",
							children: "+"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute top-4 right-4 w-3.5 h-3.5 rounded-full bg-zinc-400 dark:bg-zinc-600 border border-zinc-500 shadow-inner flex items-center justify-center text-[10px] text-zinc-700 dark:text-zinc-300",
							children: "+"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute bottom-4 left-4 w-3.5 h-3.5 rounded-full bg-zinc-400 dark:bg-zinc-600 border border-zinc-500 shadow-inner flex items-center justify-center text-[10px] text-zinc-700 dark:text-zinc-300",
							children: "+"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute bottom-4 right-4 w-3.5 h-3.5 rounded-full bg-zinc-400 dark:bg-zinc-600 border border-zinc-500 shadow-inner flex items-center justify-center text-[10px] text-zinc-700 dark:text-zinc-300",
							children: "+"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between pb-3 mb-3 border-b border-zinc-300 dark:border-zinc-700",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-6 w-6 rounded-lg bg-primary text-primary-foreground grid place-items-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "h-3.5 w-3.5" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-bold tracking-wider text-xs text-zinc-900 dark:text-zinc-100 uppercase",
									children: "Smart Meter DLMS"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[9px] font-mono text-zinc-500",
									children: "G4-PREPAID-COSEM"
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-right",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] font-mono font-bold text-zinc-800 dark:text-zinc-200",
									children: meterNumber
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-[9px] text-zinc-500 font-mono",
									children: ["SN: ", serialNumber]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl bg-emerald-950/90 dark:bg-emerald-950 border-4 border-zinc-800 p-4 shadow-inner mb-4 relative overflow-hidden font-mono",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-emerald-500/10 pointer-events-none" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-[11px] text-emerald-400/80 mb-2 border-b border-emerald-800/60 pb-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wifi, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px]",
											children: "IoT SMART METER"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-900/70 text-emerald-300 border border-emerald-800/80",
												children: [
													"RATE: ৳$",
													(activeTariff ? Number(activeTariff.unitPrice) : .85).toFixed(2),
													"/m³"
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: `text-[10px] font-bold px-1.5 py-0.2 rounded ${valveOpen ? "bg-emerald-800/80 text-emerald-200" : "bg-red-900 text-red-200"}`,
												children: ["VALVE: ", valveOpen ? "OPEN" : "SHUT"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Battery, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[10px]",
													children: "3.6V"
												})]
											})
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "py-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] uppercase text-emerald-500/80 tracking-wider",
										children: "Cumulative Volume Index"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-3xl font-black tracking-widest text-emerald-300 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]",
										children: [
											reading.toFixed(3),
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-sm font-semibold text-emerald-400",
												children: "m³"
											})
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-2 pt-2 border-t border-emerald-800/60 mt-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] uppercase text-emerald-500/80",
										children: "Remaining Credit"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xl font-bold text-emerald-300",
										children: ["৳", balance.toFixed(2)]
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-right",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10px] uppercase text-emerald-500/80",
											children: "Current Flow"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-xl font-bold text-emerald-300",
											children: [
												valveOpen && isFlowing ? flowRate.toFixed(2) : "0.00",
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-xs font-normal",
													children: "m³/h"
												})
											]
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 pt-2 border-t border-emerald-800/60 flex items-center justify-between text-[11px] font-bold",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-emerald-400 truncate",
										children: lcdMessage ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "animate-pulse text-emerald-200",
											children: lcdMessage
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["KEYPAD: ", keypadInput || "ENTER 20-DIGIT TOKEN"] })
									}), tamperAlarm && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-red-400 animate-bounce flex items-center gap-1 shrink-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-3 w-3" }), " TAMPER"]
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-around py-2 mb-4 bg-zinc-300 dark:bg-zinc-800/60 rounded-xl border border-zinc-400 dark:border-zinc-700/60",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[9px] font-bold font-mono text-zinc-600 dark:text-zinc-400",
										children: "PWR"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `w-3 h-3 rounded-full ${isTransmitting ? "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.9)] animate-ping" : "bg-amber-700/40"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[9px] font-bold font-mono text-zinc-600 dark:text-zinc-400",
										children: "TX / SYNC"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `w-3 h-3 rounded-full ${valveOpen ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" : "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[9px] font-bold font-mono text-zinc-600 dark:text-zinc-400",
										children: "VALVE"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `w-3 h-3 rounded-full ${tamperAlarm ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-ping" : "bg-zinc-500/30"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[9px] font-bold font-mono text-zinc-600 dark:text-zinc-400",
										children: "ALARM"
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-zinc-800 dark:bg-zinc-950 p-4 rounded-2xl border-2 border-zinc-700 shadow-inner",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] font-mono text-zinc-400 text-center mb-2 uppercase tracking-wider",
								children: "STS Numeric Keypad"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-3 gap-2.5",
								children: [
									"1",
									"2",
									"3",
									"4",
									"5",
									"6",
									"7",
									"8",
									"9",
									"C",
									"0",
									"ENTER"
								].map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => handleKeyClick(k),
									className: `h-11 rounded-xl text-sm font-bold font-mono transition-all active:scale-95 shadow-md flex items-center justify-center ${k === "ENTER" ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/30" : k === "C" ? "bg-zinc-700 text-red-400 hover:bg-zinc-600" : "bg-zinc-700/80 text-zinc-100 hover:bg-zinc-600 border-t border-zinc-500"}`,
									children: k === "ENTER" ? "↵ ENTER" : k
								}, k))
							})]
						})
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:col-span-6 space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card p-5 shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between mb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-sm font-semibold flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersVertical, { className: "h-4 w-4 text-primary" }), "Target Meter Device"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted-foreground font-mono",
								children: "Live REST Telemetry"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: selectedMeterId,
							onChange: (e) => handleSelectMeter(e.target.value),
							className: "w-full h-10 px-3 rounded-xl border border-border bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20",
							children: [meters.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "Standalone Test Meter (MTR-DLMS-001)"
							}), meters.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
								value: m.id,
								children: [
									m.meterNumber,
									" (",
									m.serialNumber,
									") — ",
									m.customer ? `${m.customer.firstName} ${m.customer.lastName}` : "Inventory"
								]
							}, m.id))]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card p-5 shadow-sm space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `w-3 h-3 rounded-full ${autoSync ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" : "bg-zinc-400"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "text-sm font-semibold",
									children: "Simulated Meter Live Auto-Sync"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Continuously pushes readings & telemetry to database"
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setAutoSync(!autoSync),
								className: `h-8 px-3 rounded-lg text-xs font-semibold transition ${autoSync ? "bg-emerald-500/15 text-emerald-600 border border-emerald-500/30" : "bg-muted text-muted-foreground hover:bg-muted/80"}`,
								children: autoSync ? "Auto-Sync: ACTIVE (5s)" : "Auto-Sync: PAUSED"
							})]
						}), lastSyncTime && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-[11px] font-mono text-muted-foreground flex items-center justify-between pt-1 border-t border-border/50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-emerald-600 dark:text-emerald-400 font-semibold",
								children: "● Database Linked"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Last Telemetry Sync: ", lastSyncTime] })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: `h-5 w-5 transition-colors ${isFlowing && valveOpen ? "text-orange-500 animate-pulse" : "text-muted-foreground"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "text-sm font-semibold",
										children: "Simulate Gas Consumption"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: "Adjust burner flow rate to tick the meter"
									})] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => {
										if (!isFlowing) {
											if (balance <= 0) {
												setLcdMessage("ERR: 0 BALANCE - RECHARGE TO FLOW");
												setTimeout(() => setLcdMessage(null), 3e3);
												return;
											}
											if (!valveOpen) {
												setLcdMessage("ERR: VALVE SHUT - OPEN VALVE FIRST");
												setTimeout(() => setLcdMessage(null), 3e3);
												return;
											}
											setIsFlowing(true);
											saveDataToDatabase({ flow: true });
										} else {
											setIsFlowing(false);
											saveDataToDatabase({ flow: false });
										}
									},
									className: `h-9 px-3 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition ${isFlowing ? "bg-amber-500/10 text-amber-600 border border-amber-500/20" : "bg-primary text-primary-foreground"}`,
									children: isFlowing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "h-3.5 w-3.5" }), " Pause Flow"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-3.5 w-3.5" }), " Start Flow"] })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 rounded-xl bg-muted/50 border border-border flex items-center justify-between flex-wrap gap-2 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-7 w-7 rounded-lg bg-primary/10 text-primary grid place-items-center",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coins, { className: "h-3.5 w-3.5" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "font-semibold text-foreground flex items-center gap-1.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Applied Tariff:" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-primary font-bold",
												children: activeTariff ? activeTariff.name : "Standard Residential Plan"
											}),
											activeTariff?.isActive && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded font-mono font-medium",
												children: "ACTIVE"
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[11px] text-muted-foreground font-mono",
										children: [
											"Rate: ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
												className: "text-foreground",
												children: [
													"৳",
													(activeTariff ? Number(activeTariff.unitPrice) : .85).toFixed(2),
													" / m³"
												]
											}),
											activeTariff && Number(activeTariff.vatPercentage) > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "ml-1 opacity-80",
												children: [
													"(+",
													activeTariff.vatPercentage,
													"% VAT)"
												]
											})
										]
									})] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [tariffs.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										value: activeTariff?.id || "",
										onChange: (e) => {
											const selected = tariffs.find((t) => t.id === Number(e.target.value));
											if (selected) {
												setActiveTariff(selected);
												setLcdMessage(`TARIFF: ৳${Number(selected.unitPrice).toFixed(2)}/m³`);
												setTimeout(() => setLcdMessage(null), 2500);
											}
										},
										className: "h-8 px-2 rounded-lg border border-border bg-background text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary",
										children: tariffs.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
											value: t.id,
											children: [
												t.name,
												" (৳",
												Number(t.unitPrice).toFixed(2),
												"/m³)"
											]
										}, t.id))
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: async () => {
											await loadTariffs();
											setLcdMessage("TARIFF RELOADED");
											setTimeout(() => setLcdMessage(null), 2e3);
										},
										className: "h-8 px-2.5 rounded-lg border border-border bg-background hover:bg-accent text-xs inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition",
										title: "Reload latest tariff from database",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3 w-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Sync Tariff" })]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-4 gap-2",
								children: [
									{
										label: "Off",
										rate: 0
									},
									{
										label: "1 Stove Low",
										rate: .15
									},
									{
										label: "2 Burners",
										rate: .35
									},
									{
										label: "Full Heating",
										rate: .75
									}
								].map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => {
										if (p.rate > 0) {
											if (balance <= 0) {
												setLcdMessage("ERR: 0 BALANCE - RECHARGE FIRST");
												setTimeout(() => setLcdMessage(null), 3e3);
												return;
											}
											if (!valveOpen) {
												setLcdMessage("ERR: VALVE SHUT - OPEN VALVE FIRST");
												setTimeout(() => setLcdMessage(null), 3e3);
												return;
											}
										}
										setFlowRate(p.rate);
										const nextFlow = p.rate > 0 && valveOpen && balance > 0;
										setIsFlowing(nextFlow);
										saveDataToDatabase({
											flow: nextFlow,
											flowRate: p.rate
										});
									},
									className: `py-2 px-1 rounded-xl text-xs font-semibold border transition text-center ${flowRate === p.rate && isFlowing ? "bg-primary text-primary-foreground border-primary shadow-sm" : "border-border hover:bg-accent text-foreground/80"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: p.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[10px] opacity-80",
										children: [p.rate, " m³/h"]
									})]
								}, p.label))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between text-xs text-muted-foreground mb-1.5 font-mono",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"Flow Rate: ",
									flowRate.toFixed(2),
									" m³/h"
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"Burn Rate: ৳",
									(flowRate * (activeTariff ? Number(activeTariff.unitPrice) : .85)).toFixed(2),
									" / hr"
								] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "range",
								min: "0",
								max: "1.5",
								step: "0.05",
								value: flowRate,
								onChange: (e) => {
									const val = Number(e.target.value);
									setFlowRate(val);
									const nextFlow = val > 0 && valveOpen && balance > 0;
									setIsFlowing(nextFlow);
									saveDataToDatabase({
										flow: nextFlow,
										flowRate: val
									});
								},
								className: "w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
							})] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "text-sm font-semibold",
										children: "Manual Recharge & Token Station"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground font-mono",
									children: "Real-time DB Sync"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-muted-foreground mb-2 flex items-center gap-1.5 font-medium",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-3.5 w-3.5 text-amber-500" }), "Instant Manual Top-up (Automatically credits DB & opens valve):"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-3 gap-2",
								children: [
									{
										label: "+৳20.00",
										amount: 20
									},
									{
										label: "+৳50.00",
										amount: 50
									},
									{
										label: "+৳100.00",
										amount: 100
									}
								].map((top) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => handleManualRecharge(top.amount),
									disabled: isTransmitting,
									className: "h-9 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 text-xs font-bold transition flex items-center justify-center gap-1 active:scale-95 disabled:opacity-50",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: top.label })
								}, top.label))
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-2 border-t border-border space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs text-muted-foreground flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "h-3.5 w-3.5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Or generate 20-digit token for physical keypad entry:" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => {
											const sampleToken = `${Math.floor(1e3 + Math.random() * 9e3)}-${Math.floor(1e3 + Math.random() * 9e3)}-${Math.floor(1e3 + Math.random() * 9e3)}-${Math.floor(1e3 + Math.random() * 9e3)}-${Math.floor(1e3 + Math.random() * 9e3)}`;
											setKeypadInput(sampleToken);
										},
										className: "flex-1 h-10 rounded-xl bg-accent hover:bg-accent/80 text-foreground text-xs font-semibold inline-flex items-center justify-center gap-2 transition",
										children: "Generate ৳50 Token"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: handleTokenSubmit,
										className: "h-10 px-4 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition shadow-sm",
										children: "Inject Token"
									})]
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-sm font-semibold flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Hardware Telemetry & Valve Control" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, {
									tone: valveOpen ? "success" : "error",
									children: valveOpen ? "Valve Open" : "Valve Closed"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: handleToggleValve,
									className: `h-11 rounded-xl text-xs font-bold inline-flex items-center justify-center gap-2 transition ${valveOpen ? "bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20" : "bg-[oklch(0.75_0.15_160/0.15)] text-[oklch(0.5_0.15_160)] hover:bg-[oklch(0.75_0.15_160/0.25)] border border-emerald-500/20"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Power, { className: "h-4 w-4" }), valveOpen ? "Shutoff Valve (Close)" : "Open Valve (Restore)"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: handleSendTelemetry,
									disabled: isTransmitting,
									className: "h-11 rounded-xl bg-primary text-primary-foreground text-xs font-bold inline-flex items-center justify-center gap-2 hover:bg-primary/90 transition shadow-sm disabled:opacity-50",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4" }), isTransmitting ? "Transmitting..." : "Push Telemetry Now"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-2 border-t border-border flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground",
									children: "Simulate Tamper / Magnetic Sensor:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => {
										const next = !tamperAlarm;
										setTamperAlarm(next);
										if (next) setLcdMessage("ALARM: MAGNETIC TAMPER DETECTED");
										else {
											setLcdMessage("ALARM CLEARED");
											setTimeout(() => setLcdMessage(null), 2e3);
										}
									},
									className: `h-8 px-3 rounded-lg text-xs font-semibold transition ${tamperAlarm ? "bg-red-500 text-white shadow-md shadow-red-500/20" : "bg-accent hover:bg-accent/80 text-foreground"}`,
									children: tamperAlarm ? "Tamper Active (Click to Clear)" : "Trigger Tamper"
								})]
							}),
							lastTxStatus && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-2.5 rounded-lg bg-accent/60 text-[11px] font-mono text-muted-foreground border border-border/50",
								children: ["Network: ", lastTxStatus]
							})
						]
					})
				]
			})]
		})
	});
}
//#endregion
export { MeterSimulatorPage as component };
