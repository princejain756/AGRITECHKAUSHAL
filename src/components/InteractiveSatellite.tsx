import React, { useState, useEffect } from "react";
import { Satellite, Scan, Cpu, RefreshCw, Radio, Layers, Info } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface FieldZone {
  id: string;
  name: string;
  polygon: string; // for class points
  ndvi: number;
  vwc: number; // Volume Water Content %
  canopyTemp: number; // Celsius
  nitrogenSat: number; // mg/kg
  chlorophyllPpm: number;
  status: "Optimal" | "Sub-optimal" | "Hydration Deficit" | "Depleted";
}

const LAYER_PRESETS = [
  { id: "ndvi", name: "NDVI (Chlorophyll Density)", label: "Normalized Difference Vegetation Index", minVal: "0.21", maxVal: "0.89", desc: "Measures photosynthetic activity and vegetative canopy density. Dark green indicates robust growth.", colors: ["rgba(239, 68, 68, 0.45)", "rgba(234, 179, 8, 0.45)", "rgba(34, 197, 94, 0.55)", "rgba(21, 128, 61, 0.65)"] },
  { id: "moisture", name: "Soil VWC (Volumetric Water)", label: "Sub-surface Hydro-saturation", minVal: "11%", maxVal: "48%", desc: "Delineates moisture levels down to 40cm depth, bypassing crop canopy interference via radar altimetry.", colors: ["rgba(180, 83, 9, 0.45)", "rgba(217, 119, 6, 0.45)", "rgba(14, 165, 233, 0.5)", "rgba(3, 105, 161, 0.65)"] },
  { id: "thermal", name: "Thermal Canopy Radiance", label: "Infrared Plant Transpiration Energy", minVal: "18.2°C", maxVal: "31.4°C", desc: "Reveals water transportation bottlenecks and stomatal stress before physical color change is visible to humanity.", colors: ["rgba(3, 105, 161, 0.45)", "rgba(34, 197, 94, 0.45)", "rgba(234, 179, 8, 0.55)", "rgba(239, 68, 68, 0.65)"] },
  { id: "nitrogen", name: "Nitrogen Saturation (N)", label: "Canopy Mineral Accumulation", minVal: "4.1 g/kg", maxVal: "14.8 g/kg", desc: "Combines shortwave infrared reflection with machine-learning algorithms to map nitrogen concentration ratios.", colors: ["rgba(79, 70, 229, 0.45)", "rgba(139, 92, 246, 0.5)", "rgba(6, 182, 212, 0.55)", "rgba(20, 184, 166, 0.65)"] }
];

const INITIAL_FIELDS: FieldZone[] = [
  { id: "zone-alpha", name: "Sector Alpha-1 (Premium Wheat)", polygon: "M 30,50 L 190,40 L 220,160 L 50,180 Z", ndvi: 0.82, vwc: 34, canopyTemp: 21.4, nitrogenSat: 12.1, chlorophyllPpm: 580, status: "Optimal" },
  { id: "zone-beta", name: "Sector Beta-2 (Sorghum)", polygon: "M 190,40 L 350,30 L 390,140 L 220,160 Z", ndvi: 0.76, vwc: 31, canopyTemp: 22.8, nitrogenSat: 11.4, chlorophyllPpm: 510, status: "Optimal" },
  { id: "zone-gamma", name: "Sector Gamma-3 (Organic Oats)", polygon: "M 50,180 L 220,160 L 250,290 L 70,320 Z", ndvi: 0.48, vwc: 15, canopyTemp: 29.1, nitrogenSat: 6.8, chlorophyllPpm: 320, status: "Hydration Deficit" },
  { id: "zone-delta", name: "Sector Delta-4 (Bio-Barley)", polygon: "M 220,160 L 390,140 L 410,270 L 250,290 Z", ndvi: 0.74, vwc: 28, canopyTemp: 23.1, nitrogenSat: 10.9, chlorophyllPpm: 490, status: "Optimal" },
  { id: "zone-epsilon", name: "Sector Epsilon-5 (Experimental Alfalfa)", polygon: "M 350,30 L 520,20 L 550,120 L 390,140 Z", ndvi: 0.88, vwc: 41, canopyTemp: 19.8, nitrogenSat: 13.5, chlorophyllPpm: 620, status: "Optimal" },
  { id: "zone-zeta", name: "Sector Zeta-6 (Early Legumes)", polygon: "M 390,140 L 550,120 L 580,250 L 410,270 Z", ndvi: 0.35, vwc: 13, canopyTemp: 30.5, nitrogenSat: 4.2, chlorophyllPpm: 240, status: "Depleted" }
];

export default function InteractiveSatellite() {
  const [selectedLayer, setSelectedLayer] = useState("ndvi");
  const [selectedZone, setSelectedZone] = useState<FieldZone | null>(INITIAL_FIELDS[2]); // Default on a warning zone
  const [isScanning, setIsScanning] = useState(false);
  const [orbitPassTime, setOrbitPassTime] = useState(new Date().toLocaleTimeString());
  const [scanOffset, setScanOffset] = useState("-token");

  useEffect(() => {
    const timer = setInterval(() => {
      setOrbitPassTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const triggerScan = () => {
    if (isScanning) return;
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 2500);
  };

  const currentPreset = LAYER_PRESETS.find(p => p.id === selectedLayer) || LAYER_PRESETS[0];

  // Helper code to map values to layer-specific color intensity
  const getZoneFillColor = (zone: FieldZone) => {
    if (selectedLayer === "ndvi") {
      if (zone.ndvi >= 0.8) return currentPreset.colors[3]; // Optimal green
      if (zone.ndvi >= 0.7) return currentPreset.colors[2]; // Healthy
      if (zone.ndvi >= 0.45) return currentPreset.colors[1]; // Muted yellow
      return currentPreset.colors[0]; // Stress red
    }
    if (selectedLayer === "moisture") {
      if (zone.vwc >= 35) return currentPreset.colors[3];
      if (zone.vwc >= 25) return currentPreset.colors[2];
      if (zone.vwc >= 15) return currentPreset.colors[1];
      return currentPreset.colors[0];
    }
    if (selectedLayer === "thermal") {
      if (zone.canopyTemp >= 28) return currentPreset.colors[3]; // Hot / Stress (Red)
      if (zone.canopyTemp >= 23) return currentPreset.colors[2]; // Average warm
      if (zone.canopyTemp >= 21) return currentPreset.colors[1]; // Moderately cool
      return currentPreset.colors[0]; // Cool (Blue)
    }
    // nitrogen
    if (zone.nitrogenSat >= 12.0) return currentPreset.colors[3];
    if (zone.nitrogenSat >= 10.0) return currentPreset.colors[2];
    if (zone.nitrogenSat >= 6.0) return currentPreset.colors[1];
    return currentPreset.colors[0];
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl p-6 lg:p-8 relative">
      {/* Background Subtle Radar Effect */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Title Bar Details */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-neutral-800 pb-6 mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono tracking-widest uppercase mb-1">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>ORBITAL ORTHOPHOTO SURVEY • RE-88 SATELLITE</span>
          </div>
          <h3 className="text-2xl font-bold font-sans text-neutral-100 tracking-tight">
            High Spectral Resolution Field Scanning
          </h3>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-neutral-800/80 px-4 py-2 rounded-xl text-right font-mono text-xs hidden sm:block border border-neutral-700/50">
            <div className="text-neutral-500 uppercase tracking-widest text-[10px]">L.E.O. Link-State</div>
            <div className="text-neutral-200 font-medium flex items-center justify-end gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>ACTIVE SYNC • {orbitPassTime}</span>
            </div>
          </div>

          <button
            id="sat-trigger-scan"
            onClick={triggerScan}
            disabled={isScanning}
            className={`flex items-center gap-2 font-sans py-2.5 px-5 rounded-xl border font-semibold text-xs tracking-wider uppercase transition-all duration-300 shadow-md ${
              isScanning
                ? "bg-neutral-800 border-neutral-700 text-neutral-500 cursor-not-allowed"
                : "bg-emerald-500 hover:bg-emerald-400 border-emerald-400 hover:border-emerald-300 text-neutral-950 cursor-pointer"
            }`}
          >
            {isScanning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-neutral-400" />
                <span>SCANNING FIELDS...</span>
              </>
            ) : (
              <>
                <Scan className="w-4 h-4" />
                <span>EXECUTE SATELLITE SCAN</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Interactive Map Visuals */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Layer Selector Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-neutral-950 p-1.5 rounded-2xl border border-neutral-800">
            {LAYER_PRESETS.map((p) => {
              const active = selectedLayer === p.id;
              return (
                <button
                  key={p.id}
                  id={`layer-selector-${p.id}`}
                  onClick={() => setSelectedLayer(p.id)}
                  className={`text-center py-2 px-1.5 rounded-xl text-neutral-300 uppercase tracking-wider text-[10px] font-mono font-medium transition-all duration-300 ${
                    active
                      ? "bg-neutral-800 border-neutral-700 font-semibold text-emerald-400"
                      : "hover:bg-neutral-900/60 text-neutral-400 hover:text-neutral-200"
                  }`}
                >
                  {p.name.split(" ")[0]}
                </button>
              );
            })}
          </div>

          {/* Interactive Farm Satellite SVG Map */}
          <div className="relative bg-neutral-950 rounded-2xl aspect-[1.8/1] w-full border border-neutral-800/80 overflow-hidden flex items-center justify-center">
            {/* Grid Coordinates BG */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:16px_16px]" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,223,0.008)_4px,transparent_4px),linear-gradient(90deg,rgba(14,165,223,0.008)_4px,transparent_4px)] bg-[size:64px_64px]" />

            {/* Simulated Geographic Sat Backdrop image with blur for premium contrast */}
            <div className="absolute inset-x-2 inset-y-2 opacity-35 bg-[url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center rounded-xl filter grayscale contrast-125 saturate-50 brightness-50" />

            {/* SVG Polygons of Crop Plots */}
            <svg viewBox="0 0 600 360" className="absolute inset-0 w-full h-full p-2 select-none">
              {/* Plot Definitions */}
              <g className="cursor-pointer">
                {INITIAL_FIELDS.map((zone) => {
                  const isSelected = selectedZone?.id === zone.id;
                  const fillColor = getZoneFillColor(zone);

                  return (
                    <motion.polygon
                      key={zone.id}
                      points={zone.polygon}
                      fill={fillColor}
                      stroke={isSelected ? "#34d399" : "rgba(255,255,255,0.15)"}
                      strokeWidth={isSelected ? 2.5 : 1}
                      whileHover={{ stroke: "#10b981", strokeWidth: 2, scale: 1.005 }}
                      onClick={() => setSelectedZone(zone)}
                      style={{ transformOrigin: "center" }}
                      className="transition-colors duration-500"
                    />
                  );
                })}
              </g>

              {/* Legend overlay pointers */}
              {INITIAL_FIELDS.map((zone) => {
                // Approximate centroids for labels
                let cx = 100, cy = 100;
                if (zone.id === "zone-alpha") { cx = 120; cy = 100; }
                if (zone.id === "zone-beta") { cx = 280; cy = 90; }
                if (zone.id === "zone-gamma") { cx = 150; cy = 230; }
                if (zone.id === "zone-delta") { cx = 310; cy = 210; }
                if (zone.id === "zone-epsilon") { cx = 440; cy = 80; }
                if (zone.id === "zone-zeta") { cx = 480; cy = 200; }

                return (
                  <g key={`marker-${zone.id}`} className="pointer-events-none font-mono">
                    <circle
                      cx={cx}
                      cy={cy}
                      r={3}
                      className={`fill-neutral-900 stroke-neutral-100 ${
                        zone.status !== "Optimal" ? "animate-pulse" : ""
                      }`}
                      strokeWidth={1}
                    />
                    <text
                      x={cx + 7}
                      y={cy + 4}
                      fill="rgba(255,255,255,0.45)"
                      fontSize="8"
                      fontWeight="bold"
                    >
                      {zone.id.replace("zone-", "").toUpperCase()}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Glowing Sweep Line Scan Anim */}
            <AnimatePresence>
              {isScanning && (
                <motion.div
                  initial={{ top: "0%" }}
                  animate={{ top: "100%" }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 2.2, ease: "easeInOut" }}
                  className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#22d3ee] z-20"
                />
              )}
            </AnimatePresence>

            {/* Static Indicator details */}
            <div className="absolute bottom-3 left-4 bg-neutral-900/90 py-1.5 px-3 rounded-lg border border-neutral-800 flex items-center gap-3 text-[10px] font-mono text-neutral-400">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Optimal</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span>Stress/Dryness</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                <span>Deficit Risk</span>
              </span>
            </div>

            <div className="absolute top-3 left-4 bg-neutral-900/90 py-1 px-2.5 rounded text-[8px] font-mono text-neutral-300 uppercase tracking-widest border border-neutral-800">
              SPECTRAL BAND MAP: {selectedLayer.toUpperCase()}
            </div>
          </div>

          <div className="bg-neutral-950/40 border border-neutral-800 p-4 rounded-xl text-xs flex gap-3 text-neutral-400">
            <Info className="text-emerald-400 w-5 h-5 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>{currentPreset.label}:</strong> {currentPreset.desc} Calibrated spectral ranges span{" "}
              <span className="text-neutral-200 font-mono">{currentPreset.minVal}</span> to{" "}
              <span className="text-neutral-200 font-mono">{currentPreset.maxVal}</span>. Select a field zone to view historical telemetry diagnostics.
            </p>
          </div>
        </div>

        {/* Right Side: Diagnostics & Telemetry readout */}
        <div className="lg:col-span-5 bg-neutral-950 p-5 rounded-2xl border border-neutral-800 h-full flex flex-col justify-between">
          <AnimatePresence mode="wait">
            {selectedZone ? (
              <motion.div
                key={selectedZone.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-5"
              >
                {/* Header Information representing a selected physical Zone */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-neutral-800 border border-neutral-700/80 text-[9px] text-emerald-400 font-mono py-0.5 px-2 rounded-full uppercase tracking-wider font-semibold">
                      {selectedZone.id}
                    </span>
                    <span className="text-neutral-500 font-mono text-xs">• Verified Field Area</span>
                  </div>
                  <h4 className="text-lg font-bold font-sans text-neutral-100 flex items-center justify-between">
                    <span>{selectedZone.name}</span>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono font-medium border ${
                        selectedZone.status === "Optimal"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : selectedZone.status === "Hydration Deficit"
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse"
                          : "bg-red-500/10 text-red-400 border-red-500/20"
                      }`}
                    >
                      {selectedZone.status}
                    </span>
                  </h4>
                </div>

                {/* Technical data indicators */}
                <div className="grid grid-cols-2 gap-4 border-t border-neutral-900 pt-5">
                  <div className="bg-neutral-900/60 border border-neutral-800 p-3.5 rounded-xl">
                    <div className="text-neutral-500 text-[10px] font-mono uppercase tracking-widest">
                      Canopy Density (NDVI)
                    </div>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-xl font-bold font-mono text-neutral-100">
                        {selectedZone.ndvi.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-neutral-500 font-mono font-semibold">/ 1.00</span>
                    </div>
                    {/* Tiny Progress Bar */}
                    <div className="w-full bg-neutral-800 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div
                        className="bg-emerald-400 h-full rounded-full"
                        style={{ width: `${selectedZone.ndvi * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="bg-neutral-900/60 border border-neutral-800 p-3.5 rounded-xl">
                    <div className="text-neutral-500 text-[10px] font-mono uppercase tracking-widest">
                      Volumetric Hydration
                    </div>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-xl font-bold font-mono text-neutral-100">
                        {selectedZone.vwc}%
                      </span>
                      <span className="text-[10px] text-neutral-500 font-mono font-semibold">VWC</span>
                    </div>
                    {/* Hydro progress bar */}
                    <div className="w-full bg-neutral-800 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          selectedZone.vwc < 20 ? "bg-amber-400" : "bg-sky-400"
                        }`}
                        style={{ width: `${selectedZone.vwc * 2}%` }}
                      />
                    </div>
                  </div>

                  <div className="bg-neutral-900/60 border border-neutral-800 p-3.5 rounded-xl">
                    <div className="text-neutral-500 text-[10px] font-mono uppercase tracking-widest">
                      Canopy Temp IR
                    </div>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-xl font-bold font-mono text-neutral-100">
                        {selectedZone.canopyTemp}°C
                      </span>
                    </div>
                    <div className="text-[9px] text-neutral-500 leading-none mt-2 font-mono uppercase">
                      Infrared Transp. Thermal
                    </div>
                  </div>

                  <div className="bg-neutral-900/60 border border-neutral-800 p-3.5 rounded-xl">
                    <div className="text-neutral-500 text-[10px] font-mono uppercase tracking-widest">
                      Mineral Nitrogen
                    </div>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-xl font-bold font-mono text-neutral-100">
                        {selectedZone.nitrogenSat.toFixed(1)}
                      </span>
                      <span className="text-[10px] text-neutral-500 font-mono">g/kg</span>
                    </div>
                    <div className="text-[9px] text-neutral-500 leading-none mt-2 font-mono uppercase">
                      Spectrographic N bound
                    </div>
                  </div>
                </div>

                {/* Predictive Field Diagnostics Engine Advice */}
                <div className="border-t border-neutral-900 pt-5 space-y-3.5">
                  <div className="flex items-center gap-1 text-xs text-neutral-300 font-medium">
                    <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                    <span>VERA DIGITAL TWIN REAL-TIME PREDICTIONS</span>
                  </div>

                  <div className="p-3 bg-neutral-900/95 border border-dashed border-neutral-800 rounded-xl space-y-2">
                    <div className="flex justify-between items-center text-[10px] text-neutral-400 font-mono">
                      <span>Chlorophyll Level</span>
                      <span className="text-emerald-400 font-medium">
                        {selectedZone.chlorophyllPpm} ppm
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-neutral-400 font-mono">
                      <span>Satellite Evapotranspiration</span>
                      <span className="text-neutral-200">
                        {(selectedZone.canopyTemp * 0.14).toFixed(2)} mm/day
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-neutral-400 font-mono">
                      <span>Anomological Stress Multiplier</span>
                      <span
                        className={
                          selectedZone.status === "Optimal" ? "text-neutral-500" : "text-amber-400"
                        }
                      >
                        {selectedZone.status === "Optimal" ? "1.00x (Baseline)" : "1.65x (Elevated)"}
                      </span>
                    </div>
                  </div>

                  {/* Recommendation snippet mimicking client analytics */}
                  <div className="text-[11px] text-neutral-400 bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-lg leading-relaxed">
                    {selectedZone.status === "Optimal" ? (
                      <span className="text-neutral-300">
                        ✓ Sector is fully balanced. No intervention required. System is monitoring for macroclimate shifts. Next automated satellite health sweep runs in 6 hours.
                      </span>
                    ) : selectedZone.status === "Hydration Deficit" ? (
                      <span className="text-amber-300">
                        ⚠️ <strong>Action Required:</strong> Immediate hydration calibration needed. Soil Volumetric Water content at 15% violates baseline index thresholds. Execute +15% regional irrigation pass.
                      </span>
                    ) : (
                      <span className="text-red-300">
                        🚨 <strong>Critical:</strong> Zone demonstrates substantial Photosynthetic index depletion (NDVI: {selectedZone.ndvi}). Nitrogen supply and phosphorus mobilization under-indexed. Initiate smart nitrogen injector pass in next cycle.
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 text-neutral-500">
                <Layers className="w-10 h-10 mb-3 stroke-neutral-700" />
                <p className="text-sm">Select any field sector on the spectral map to retrieve high-resolution telemetry diagnostics.</p>
              </div>
            )}
          </AnimatePresence>

          <div className="pt-4 mt-4 border-t border-neutral-900 border-dashed text-[10px] font-mono text-neutral-500 flex justify-between">
            <span>Grid Coordinates: [41°N, 122°W]</span>
            <span>Hectares: 240.5ha</span>
          </div>
        </div>
      </div>
    </div>
  );
}
