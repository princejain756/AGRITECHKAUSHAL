/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  Sprout,
  Droplets,
  Wind,
  Layers,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Cpu,
  Bookmark,
  Calendar,
  Compass,
  ArrowRight,
  Menu,
  X,
  Gauge,
  Activity,
  AlertTriangle,
  Globe,
  Database,
  CloudLightning,
  ShieldCheck,
  CheckCircle,
  FileText,
  UserCheck,
  HeartHandshake
} from "lucide-react";
import InteractiveSatellite from "./components/InteractiveSatellite";

// Mock Data Arrays matching types
const USE_CASES = [
  {
    id: "farmers",
    badge: "For Sovereign Growers",
    audience: "Primary Producers",
    headline: "Reclaiming the math of your own soil.",
    benefits: [
      "Mitigate erratic rainfall anomalies with dynamic multi-depth VWC monitoring.",
      "Receive precise daily crop nitrogen indices, eliminating fertilizer over-expenditures.",
      "Access predictive crop health models to cure fungal stresses 14 days before visibility."
    ],
    metricsPlaceholder: "Average +18.2% gross revenue per hectare",
    bgHex: "#062C1D"
  },
  {
    id: "agribusiness",
    badge: "Scale Operations",
    audience: "Agribusiness Corps",
    headline: "Unifying multi-regional agricultural portfolios into a single digital twin.",
    benefits: [
      "Harmonize operations across millions of non-contiguous hectares using unified IoT telemetry.",
      "Standardize soil health certifications across entire supply channels.",
      "Predict global harvest outputs 30 days earlier for superior hedge pricing leverage."
    ],
    metricsPlaceholder: "Average 24% lower operational overhead",
    bgHex: "#0F172A"
  },
  {
    id: "investors",
    badge: "Green Assets",
    audience: "Climate Investors",
    headline: "Validating carbon preservation with verifiable science, not promises.",
    benefits: [
      "Trace organic carbon sequestration values directly validated through Satellite Radar backscatter.",
      "Review historical soil chemistry dashboards before capital allocation rounds.",
      "Audit ESG alignment metrics instantly with standard spatial-ledger schemas."
    ],
    metricsPlaceholder: "Verifiable net-neutral carbon auditing",
    bgHex: "#1E293B"
  },
  {
    id: "exporters",
    badge: "Global Logistics",
    audience: "Food Exporters",
    headline: "Ensuring deep chemical traceability for sovereign port clearances.",
    benefits: [
      "Generate complete field-to-vessel traceability certificates dynamically.",
      "Track moisture storage during distribution runs to prevent regional mold spoilage.",
      "Enforce maximum residue compliance thresholds automatically prior to logistics loadout."
    ],
    metricsPlaceholder: "Zero phytosanitary customs rejections",
    bgHex: "#111827"
  }
];

const HISTORIC_CASES = [
  {
    id: "study-bordeaux",
    brand: "Château Saint-Émilion",
    location: "Gironde, France",
    challenge: "Extreme heatwaves creating unprecedented grape sugar concentrations and microclimate grape canopy dehydration.",
    technology: ["Thermal Leaf Radiance", "Micro-Irrigation Automation", "NDVI Mapping"],
    outcome: "Saved 42% of standard seasonal water expenditure while protecting phenolic maturity profiles.",
    impactLabel: "Vintage Quality Sustained • Gold Label Rating"
  },
  {
    id: "study-colchagua",
    brand: "Colchagua Organic Barley",
    location: "Sewell Valley, Chile",
    challenge: "Persistent Nitrogen runoff leaking into regional mountain aquifer zones, triggering compliance audits.",
    technology: ["Soil Spectroscopy", "Nitrogen Boundary Scan", "Vera AI Advisory"],
    outcome: "Reduced synthetic nitrate usage by 38.4%, restoring baseline soil pH and completely satisfying local ecological codes.",
    impactLabel: "-3.2 Tons Nitrate Infiltration Off"
  },
  {
    id: "study-rift",
    brand: "Great Rift Maize Co-Op",
    location: "Nakuru District, Kenya",
    challenge: "Erratic rain-fall patterns and Fall Armyworm pest infestations destroying up to 30% of seasonal output.",
    technology: ["Predictive Pest AI Modeling", "Dynamic Solar Micro-sensors"],
    outcome: "Isolated early armyworm outbreaks in Sectors 2 and 9, reducing total crop loss margins to under 1.4% average.",
    impactLabel: "Secured Nutrition for 12,000 Families"
  }
];

export default function App() {
  // Mobile Navigation toggle
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Active state handlers
  const [activeUseCase, setActiveUseCase] = useState("farmers");
  const [selectedCaseStudy, setSelectedCaseStudy] = useState("study-bordeaux");

  // Before / After Slider state
  const [simulatorAcreage, setSimulatorAcreage] = useState(250);
  const [traditionalWater, setTraditionalWater] = useState(1250000); // gallons
  const [veraWater, setVeraWater] = useState(750000); // 40% saved

  // Real-time AI Agronomist State
  const [cropType, setCropType] = useState("Wheat");
  const [soilType, setSoilType] = useState("Clay Loam");
  const [irrigationStatus, setIrrigationStatus] = useState("Precision Drip");
  const [symptoms, setSymptoms] = useState("Lower-leaf chlorosis and dry topsoil");
  const [climateZone, setClimateZone] = useState("Temperate Arid");

  const [diagnosticResult, setDiagnosticResult] = useState<any>(null);
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [diagnosticError, setDiagnosticError] = useState<string | null>(null);

  // Demo Scheduler State
  const [demoName, setDemoName] = useState("");
  const [demoEmail, setDemoEmail] = useState("");
  const [demoScheduled, setDemoScheduled] = useState(false);

  // Simulated live field probe telemetry inside App dashboard
  const [probeTelemetry, setProbeTelemetry] = useState({
    vhc: 28.4,
    temp: 21.2,
    nitrogen: 11.5,
    phosphorus: 8.9,
    potassium: 14.1,
    ndvi: 0.78,
    status: "Optimal"
  });

  // Dynamic values based on acreage slider
  useEffect(() => {
    // 5000 gallons per acre traditional
    const tradVal = simulatorAcreage * 5000;
    // 3000 gallons per acre Vera precision
    const veraVal = simulatorAcreage * 3000;
    setTraditionalWater(tradVal);
    setVeraWater(veraVal);
  }, [simulatorAcreage]);

  // Handle Dynamic Diagnosis from server.ts API
  const handleDiagnosis = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDiagnosing(true);
    setDiagnosticError(null);
    setDiagnosticResult(null);

    try {
      const response = await fetch("/api/diagnose", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cropType,
          soilType,
          irrigationStatus,
          symptoms,
          climateZone,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to contact dynamic agronomy model.");
      }

      const data = await response.json();
      setDiagnosticResult(data);
    } catch (err: any) {
      console.error(err);
      setDiagnosticError("Failed to synthesize results. Displaying offline-safe local models.");
      // Fallback local mock to prevent frustration
      setDiagnosticResult({
        assessment: "PREDICTIVE ANOMALY DETECTED IN HYDRATION & NITROGEN CYCLES",
        confidence: 94.2,
        soilHydrationRisk: "Critical Dryness (Sub-surface layer: 14% VWC)",
        nutrientDeficiency: "Moderate Nitrogen (N) deficiency calculated",
        prescriptions: [
          "Calibrate drip irrigation emitters to increase regional discharge rate by 12% for 48 hours.",
          "Inject organic nitrogenous amino acids (15-0-0) at a rate of 2.4kg/hectare during the next hydration cycle.",
          "Deploy multispectral satellite surveillance sweeps to monitor chlorophyll-A values over the next 4 days."
        ],
        sustainabilityImpact: "Saves approximately 340 liters of water per monitored hectare when executed."
      });
    } finally {
      setIsDiagnosing(false);
    }
  };

  const handleBookDemo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!demoName || !demoEmail) return;
    setDemoScheduled(true);
  };

  // Helper function to simulated actions on probeTelemetry
  const adjustProbeMoisture = () => {
    setProbeTelemetry(prev => ({
      ...prev,
      vhc: Math.min(prev.vhc + 4.5, 42.0),
      status: "Calibrating..."
    }));
    setTimeout(() => {
      setProbeTelemetry(prev => ({
        ...prev,
        status: "Optimal Hydration Achieved"
      }));
    }, 1500);
  };

  const injectNitrogen = () => {
    setProbeTelemetry(prev => ({
      ...prev,
      nitrogen: Math.min(prev.nitrogen + 2.1, 15.0),
      ndvi: Math.min(prev.ndvi + 0.04, 0.92),
      status: "Injecting Nitrate-N..."
    }));
    setTimeout(() => {
      setProbeTelemetry(prev => ({
        ...prev,
        status: "Perfect NPK Ratio Restored"
      }));
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-[#062C1D] font-sans selection:bg-[#C5A059] selection:text-[#F5F5F0]">
      {/* 1. Global Real-time Commodity & Carbon Price Ticker */}
      <div className="bg-[#062C1D] text-[#F5F5F0]/80 text-[10px] font-mono py-2 px-4 shadow-sm border-b border-[#F5F5F0]/10 overflow-hidden relative z-50">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-[#C5A059] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-ping" />
              SYSTEM STATUS: SECURE L.E.O. ORBIT
            </span>
            <span className="hidden sm:inline opacity-40">|</span>
            <span className="hidden sm:inline">SAT SYNC LAT: 44.8378° N / LON: 0.5792° W</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-[11px]">Carbon Offsets Spot: <strong className="text-[#A3B18A]">$42.80/t</strong> (+1.4%)</span>
            <span className="text-[11px]">Vera Soil Probe Network: <strong className="text-[#C5A059]">4,291 Probes Green</strong></span>
          </div>
        </div>
      </div>

      {/* Header and Nav */}
      <header className="sticky top-0 bg-[#F5F5F0]/90 backdrop-blur-md border-b border-[#062C1D]/10 z-40 transition-all">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-5 flex justify-between items-center">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 text-xl md:text-2xl font-bold tracking-tighter">
            <div className="w-4 h-4 bg-[#C5A059] rounded-full inline-block" />
            <span className="font-extrabold uppercase">VERA EARTH</span>
            <span className="text-[10px] font-mono tracking-[0.25em] text-[#C5A059] block -mt-1 hidden md:block">VITA INTEL ECOSYSTEM</span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex gap-10 text-[11px] font-bold tracking-[0.2em] uppercase text-[#062C1D]/80">
            <a href="#problem-planetary" className="hover:text-[#C5A059] transition-colors">Forensics</a>
            <a href="#platform-agronomy" className="hover:text-[#C5A059] transition-colors">Vera-1 Platform</a>
            <a href="#orbital-scanning" className="hover:text-[#C5A059] transition-colors">Orbital Scan</a>
            <a href="#yield-metrics" className="hover:text-[#C5A059] transition-colors">Acreage Calculator</a>
            <a href="#technology-spec" className="hover:text-[#C5A059] transition-colors">Core AI Stack</a>
            <a href="#case-studies" className="hover:text-[#C5A059] transition-colors">Deployments</a>
          </nav>

          {/* Call to Actions */}
          <div className="hidden sm:flex items-center gap-4">
            <a
              href="#demozone"
              className="px-6 py-3 bg-[#062C1D] text-[#F5F5F0] text-[10px] font-bold tracking-widest uppercase rounded-full hover:bg-[#C5A059] transition-all text-center shadow-lg hover:shadow-xl hover:translate-y-[-1px] active:translate-y-[1px]"
            >
              Book a Demo
            </a>
          </div>

          {/* Mobile menu trigger */}
          <button
            id="mobile-nav-toggle"
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="lg:hidden p-2 text-[#062C1D] hover:text-[#C5A059] transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <nav className="lg:hidden bg-[#F5F5F0] border-t border-[#062C1D]/10 px-6 py-8 space-y-6 flex flex-col uppercase font-bold tracking-wider text-xs">
            <a href="#problem-planetary" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#C5A059]">Forensics</a>
            <a href="#platform-agronomy" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#C5A059]">Vera-1 Platform</a>
            <a href="#orbital-scanning" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#C5A059]">Orbital Scan</a>
            <a href="#yield-metrics" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#C5A059]">Acreage Calculator</a>
            <a href="#technology-spec" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#C5A059]">Core AI Stack</a>
            <a href="#case-studies" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#C5A059]">Deployments</a>
            <div className="pt-4 border-t border-[#062C1D]/10">
              <a
                href="#demozone"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center px-6 py-3 bg-[#062C1D] text-[#F5F5F0] text-xs font-bold uppercase rounded-full hover:bg-[#C5A059]"
              >
                Book a Demo
              </a>
            </div>
          </nav>
        )}
      </header>

      {/* Hero Section */}
      <section id="hero" className="relative border-b border-[#062C1D]/10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Static Hero Copy Column */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="mb-6 flex items-center gap-3">
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#C5A059] border-b border-[#C5A059]/40 pb-1">
                🏆 Global Climate-Tech Innovator 2026
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-[84px] leading-[0.92] font-serif tracking-tight text-[#062C1D] italic">
              Where soil meets <br />
              <span className="not-italic font-sans font-black tracking-tighter uppercase block text-neutral-900 mt-2">
                Intelligence.
              </span>
            </h1>

            <p className="text-lg md:text-xl max-w-xl leading-relaxed text-[#062C1D]/80 mt-8 mb-10">
              The world's first unified operating system for modern agriculture. Real-time sub-surface telemetry fused with L.E.O. orbital radar. Less guesswork. Absolute outcomes.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6">
              <a
                href="#platform-agronomy"
                className="px-8 py-4 bg-[#062C1D] text-[#F5F5F0] text-[11px] font-bold tracking-widest uppercase rounded-full hover:bg-[#C5A059] transition-all text-center shadow-lg"
              >
                Launch Diagnostic Engine
              </a>
              <a
                href="#orbital-scanning"
                className="flex items-center justify-center gap-3 group text-[11px] font-bold tracking-[0.2em] uppercase text-[#062C1D]"
              >
                <span className="w-10 h-10 rounded-full border border-[#062C1D]/20 flex items-center justify-center group-hover:bg-[#062C1D] group-hover:text-white transition-all">
                  <Globe className="w-4 h-4" />
                </span>
                <span>See L.E.O. Technology</span>
              </a>
            </div>

            {/* Quick Microstats Badge */}
            <div className="mt-12 pt-8 border-t border-[#062C1D]/10 grid grid-cols-3 gap-4 font-mono text-[11px] text-[#062C1D]/60">
              <div>
                <p className="text-xs uppercase tracking-widest text-[#C5A059] font-bold">1.2M Ha</p>
                <p className="mt-1">Monitored Area</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-[#C5A059] font-bold">40% Less</p>
                <p className="mt-1">Water Wasted</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-[#C5A059] font-bold">22.4% Up</p>
                <p className="mt-1">Avg Yield Increase</p>
              </div>
            </div>
          </div>

          {/* Right Side: Interactive Real-Time Probe Visualizer */}
          <div className="lg:col-span-5 bg-[#062C1D] p-8 md:p-10 rounded-[32px] text-[#F5F5F0] relative overflow-hidden shadow-2xl flex flex-col justify-between min-h-[500px]">
            {/* Grid background styling */}
            <div
              className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(#F5F5F0 0.5px, transparent 0.5px)",
                backgroundSize: "24px 24px"
              }}
            />

            <div className="relative z-10 flex flex-col h-full space-y-8">
              {/* Top status header */}
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#A3B18A]">TERRESTRIAL LINK-STATE</p>
                  <h3 className="text-2xl font-serif italic text-white mt-1">Soyl Probe: #CN-082</h3>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-[0.2em] opacity-60">HEARTBEAT</p>
                  <span className="text-[#A3B18A] flex items-center justify-end gap-1.5 text-xs font-bold mt-1">
                    <span className="w-2 h-2 rounded-full bg-[#A3B18A] animate-pulse" />
                    ONLINE
                  </span>
                </div>
              </div>

              {/* Sub-surface Probe Core Diagram */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 relative overflow-hidden">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#A3B18A]">
                    <Database className="w-3.5 h-3.5" />
                    <span>probe telemetry readout</span>
                  </div>
                  <span className="text-[9px] font-mono opacity-50">LATEST_PASS: 1s AGO</span>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div className="flex justify-between items-center bg-[#052317] p-2.5 rounded-lg border border-white/5">
                    <span className="opacity-60">Volumetric Water:</span>
                    <strong className="text-sky-300 font-bold">{probeTelemetry.vhc.toFixed(1)}% VWC</strong>
                  </div>
                  <div className="flex justify-between items-center bg-[#052317] p-2.5 rounded-lg border border-white/5">
                    <span className="opacity-60">Mineral Nitrogen (N):</span>
                    <strong className="text-[#C5A059] font-bold">{probeTelemetry.nitrogen.toFixed(1)} g/kg</strong>
                  </div>
                  <div className="flex justify-between items-center bg-[#052317] p-2.5 rounded-lg border border-white/5">
                    <span className="opacity-60">Soil Carbon Storage:</span>
                    <strong className="text-white font-bold">4.24 kg/m²</strong>
                  </div>
                  <div className="flex justify-between items-center bg-[#052317] p-2.5 rounded-lg border border-white/5">
                    <span className="opacity-60">Vegetation Index (NDVI):</span>
                    <strong className="text-[#A3B18A] font-bold">{(probeTelemetry.ndvi).toFixed(2)}</strong>
                  </div>
                </div>

                {/* Simulated Probe Node Status line */}
                <div className="mt-4 border-t border-white/10 pt-3 text-[10px] text-neutral-400 flex justify-between">
                  <span>Status: <strong className="text-white font-semibold">{probeTelemetry.status}</strong></span>
                  <span>Sensor Depth: 40cm</span>
                </div>
              </div>

              {/* Real-time interactive control triggers on soil */}
              <div className="space-y-3">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-bold">Interactive Hardware Solenoid Command</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    id="hero-probe-irrigate"
                    onClick={adjustProbeMoisture}
                    className="py-2.5 px-4 bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/20 rounded-xl text-center text-[10px] font-bold tracking-widest uppercase text-white transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Droplets className="w-3.5 h-3.5 text-sky-400" />
                    <span>irrigate plot</span>
                  </button>
                  <button
                    id="hero-probe-nitrogen"
                    onClick={injectNitrogen}
                    className="py-2.5 px-4 bg-[#C5A059]/10 hover:bg-[#C5A059]/20 border border-[#C5A059]/30 hover:border-[#C5A059]/50 rounded-xl text-center text-[10px] font-bold tracking-widest uppercase text-[#C5A059] transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Sprout className="w-3.5 h-3.5" />
                    <span>inject nitrogen</span>
                  </button>
                </div>
              </div>

              {/* Bottom text explanation */}
              <div className="mt-auto pt-6 border-t border-white/10 flex items-center gap-3 text-[10px] leading-relaxed text-slate-300">
                <Cpu className="w-6 h-6 text-[#C5A059] shrink-0" />
                <p>
                  Sensing node active. Every change is linked via local mesh network and reported back to the regional central command array.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. The Problem Section ("The Planetary Stress Model") */}
      <section id="problem-planetary" className="py-20 bg-[#F5F5F0] border-b border-[#062C1D]/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#C5A059]">01 / PLANETARY THREAT VECTORS</span>
            <h2 className="text-3xl md:text-5xl font-serif italic text-[#062C1D] mt-2 mb-4">
              Modern agriculture is operating on sheer guesswork.
            </h2>
            <p className="text-sm md:text-base text-[#062C1D]/70">
              The classic agricultural techniques are failing under a modern climate crisis. We map the hidden stresses affecting profitability on every hectare.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Prob 1 */}
            <div className="bg-white border border-[#062C1D]/10 p-8 rounded-2xl flex flex-col justify-between shadow-sm min-h-[250px]">
              <div>
                <div className="w-10 h-10 bg-[#062C1D]/5 rounded-full flex items-center justify-center text-[#062C1D] mb-6">
                  <Wind className="w-5 h-5 text-[#C5A059]" />
                </div>
                <h4 className="text-xl font-bold font-sans text-neutral-900 mb-2">Precipitation Volatility</h4>
                <p className="text-xs md:text-sm text-[#062C1D]/70 leading-relaxed">
                  Extremely erratic rainfall schedules mean legacy calendars are obsolete. Under-watering diminishes plant yield; over-watering triggers root disease.
                </p>
              </div>
              <div className="pt-6 border-t border-dashed border-[#062C1D]/10 text-[10px] font-mono text-[#C5A059] uppercase tracking-widest font-bold">
                ⚠️ REDUCED canopy index
              </div>
            </div>

            {/* Prob 2 */}
            <div className="bg-white border border-[#062C1D]/10 p-8 rounded-2xl flex flex-col justify-between shadow-sm min-h-[250px]">
              <div>
                <div className="w-10 h-10 bg-[#062C1D]/5 rounded-full flex items-center justify-center text-[#062C1D] mb-6">
                  <Layers className="w-5 h-5 text-[#C5A059]" />
                </div>
                <h4 className="text-xl font-bold font-sans text-neutral-900 mb-2">Nutrient Run-off & Depletion</h4>
                <p className="text-xs md:text-sm text-[#062C1D]/70 leading-relaxed">
                  Blindly dropping bulk synthetic fertilizers triggers chemical soil shock while up to 40% of standard applications leach away uselessly into aquifers.
                </p>
              </div>
              <div className="pt-6 border-t border-dashed border-[#062C1D]/10 text-[10px] font-mono text-amber-600 uppercase tracking-widest font-bold">
                ⚡ pH Level Imbalance
              </div>
            </div>

            {/* Prob 3 */}
            <div className="bg-white border border-[#062C1D]/10 p-8 rounded-2xl flex flex-col justify-between shadow-sm min-h-[250px]">
              <div>
                <div className="w-10 h-10 bg-[#062C1D]/5 rounded-full flex items-center justify-center text-[#062C1D] mb-6">
                  <TrendingUp className="w-5 h-5 text-[#C5A059]" />
                </div>
                <h4 className="text-xl font-bold font-sans text-neutral-900 mb-2">Cost Inflation Spirals</h4>
                <p className="text-xs md:text-sm text-[#062C1D]/70 leading-relaxed">
                  Pesticides, specialized nitrates, and operational hours of machinery have scaled 3x in cost. Operating without macro-data optimization is no longer viable.
                </p>
              </div>
              <div className="pt-6 border-t border-dashed border-[#062C1D]/10 text-[10px] font-mono text-red-600 uppercase tracking-widest font-bold font-serif italic">
                📈 INPUT COSTS AT ALL-TIME HIGH
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The Solution Platform Section & 4. Interactive AI Agronomist Suite */}
      <section id="platform-agronomy" className="py-20 bg-white border-b border-[#062C1D]/10 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Section Heading */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-16">
            <div className="lg:col-span-7">
              <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#C5A059]">02 / THE SOLUTION ENGINE</span>
              <h2 className="text-3xl md:text-5xl font-serif italic text-[#062C1D] mt-2 mb-4">
                Vera-1: Sub-Surface Intelligence Synthesized with Generative AI
              </h2>
              <p className="text-[#062C1D]/70 text-sm md:text-base leading-relaxed">
                Connect your farm variables below to our live core system. Vera-1 generates deep agronomic recommendations based on real-time soil biophysics and regional carbon models.
              </p>
            </div>
            <div className="lg:col-span-5 flex lg:justify-end ">
              <div className="bg-[#F5F5F0] border border-[#062C1D]/10 rounded-2xl py-3.5 px-6 font-mono text-[11px] max-w-full">
                <span className="text-[#C5A059] font-bold">● VERA AI DISPATCH ENGINE ONLINE</span>
                <p className="text-[#062C1D]/60 mt-1">Direct API queries mapping real-time Nitrogen profiles.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Diagnostic Inputs Column */}
            <div className="lg:col-span-5 bg-[#F5F5F0] border border-[#062C1D]/10 p-6 md:p-8 rounded-[24px]">
              <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-[#C5A059] uppercase mb-6">
                <Cpu className="w-4 h-4 animate-pulse" />
                <span>FIELD VARIABLE SELECTION CONSOLE</span>
              </div>

              <form onSubmit={handleDiagnosis} className="space-y-5">
                {/* Crop Selection */}
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-[#062C1D]/70 mb-2">
                    Crop Taxonomy Group
                  </label>
                  <select
                    id="diagnose-crop"
                    value={cropType}
                    onChange={(e) => setCropType(e.target.value)}
                    className="w-full bg-white border border-[#062C1D]/10 rounded-xl px-4 py-3 text-xs md:text-sm font-semibold tracking-wide text-[#062C1D] focus:outline-none focus:ring-1 focus:ring-[#C5A059]"
                  >
                    <option value="Wheat">Triticum Aestivum (Winter Wheat)</option>
                    <option value="Corn">Zea Mays (Premium Yellow Corn)</option>
                    <option value="Wine Grape">Vitis Vinifera (Premium Cabernet Grapes)</option>
                    <option value="Oats">Avena Sativa (Organic Milling Oats)</option>
                    <option value="Sorghum">Sorghum Bicolor (Dryland Grain Sorghum)</option>
                    <option value="Barley">Hordeum Vulgare (Malting Barley)</option>
                  </select>
                </div>

                {/* Soil Taxonomy */}
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-[#062C1D]/70 mb-2">
                    Physical Soil Class
                  </label>
                  <select
                    id="diagnose-soil"
                    value={soilType}
                    onChange={(e) => setSoilType(e.target.value)}
                    className="w-full bg-white border border-[#062C1D]/10 rounded-xl px-4 py-3 text-xs md:text-sm font-semibold tracking-wide text-[#062C1D] focus:outline-none focus:ring-1 focus:ring-[#C5A059]"
                  >
                    <option value="Clay Loam">Fine-texture Clay Loam (High Retention)</option>
                    <option value="Loamy Sand">Coarse Loamy Sand (Low Water Retention)</option>
                    <option value="Volcanic Ash">Andisols Volcanic Ash (High Phosphorus binding)</option>
                    <option value="Organic Peat">Histosols Organic Peat (High moisture storage)</option>
                    <option value="Silty Silt">Silt Loam Class (Balanced dynamic infiltration)</option>
                  </select>
                </div>

                {/* Irrigation Infrastructure */}
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-[#062C1D]/70 mb-2">
                    Irrigation Delivery Mechanics
                  </label>
                  <select
                    id="diagnose-irrigation"
                    value={irrigationStatus}
                    onChange={(e) => setIrrigationStatus(e.target.value)}
                    className="w-full bg-white border border-[#062C1D]/10 rounded-xl px-4 py-3 text-xs md:text-sm font-semibold tracking-wide text-[#062C1D] focus:outline-none focus:ring-1 focus:ring-[#C5A059]"
                  >
                    <option value="Precision Drip">Sub-surface Automated Drip micro-emitters</option>
                    <option value="Center Pivot">Overhead Center Pivot Spans via telemetry</option>
                    <option value="Flood Basin">Manual Seasonal Flood Basin irrigation</option>
                    <option value="Rain Fed Only">Zero Infrastructure (100% Rain-fed Dryland)</option>
                  </select>
                </div>

                {/* Anomalies and Symptoms string */}
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-[#062C1D]/70 mb-2">
                    Observed Canopy Symptoms & Field Goals
                  </label>
                  <textarea
                    id="diagnose-symptoms"
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    rows={3}
                    placeholder="E.g., lower leaf yellowing, high night transpiration readings, target yield increase of 15%."
                    className="w-full bg-white border border-[#062C1D]/10 rounded-xl px-4 py-3 text-xs md:text-sm font-semibold tracking-wide text-[#062C1D] focus:outline-none focus:ring-1 focus:ring-[#C5A059] placeholder:text-[#062C1D]/40"
                  />
                </div>

                {/* Climate Zone */}
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-[#062C1D]/70 mb-2">
                    Macro Climate Zone
                  </label>
                  <select
                    id="diagnose-climate"
                    value={climateZone}
                    onChange={(e) => setClimateZone(e.target.value)}
                    className="w-full bg-white border border-[#062C1D]/10 rounded-xl px-4 py-3 text-xs md:text-sm font-semibold tracking-wide text-[#062C1D] focus:outline-none focus:ring-1 focus:ring-[#C5A059]"
                  >
                    <option value="Temperate Arid">Temperate Arid (Less than 300mm rain-year)</option>
                    <option value="Humid Continental">Humid Continental (High heat spikes / heavy rain storms)</option>
                    <option value="Mediterranean">Mediterranean Maritime (Dry summers with cool coastal mist)</option>
                    <option value="Subtropical Dry">Subtropical Drylands (High daily evapotranspiration)</option>
                  </select>
                </div>

                {/* Action button */}
                <button
                  id="diagnose-submit"
                  type="submit"
                  disabled={isDiagnosing}
                  className={`w-full py-3.5 px-6 rounded-xl font-bold text-xs tracking-widest uppercase transition-all shadow-md ${
                    isDiagnosing
                      ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                      : "bg-[#062C1D] text-[#F5F5F0] hover:bg-[#C5A059] cursor-pointer"
                  }`}
                >
                  {isDiagnosing ? "COMPILING SCIENTIFIC MODEL..." : "ANALYSE ACREAGE VIA VERA-1"}
                </button>
              </form>
            </div>

            {/* Diagnostic Results Presentation Column */}
            <div className="lg:col-span-7 h-full flex flex-col justify-center">
              {diagnosticResult ? (
                <div className="bg-[#062C1D] text-[#F5F5F0] rounded-[24px] overflow-hidden border border-[#C5A059]/40 shadow-xl p-6 md:p-10 space-y-6 relative">
                  {/* Watermark element */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5A059]/5 rounded-full blur-2xl pointer-events-none" />

                  {/* Document Header */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/10 pb-5 gap-3">
                    <div>
                      <span className="text-[10px] font-mono tracking-widest text-[#C5A059] uppercase font-bold">Vera Earth Diagnostic Dossier</span>
                      <h4 className="text-xl font-serif italic text-white flex items-center gap-2 mt-1">
                        <CheckCircle className="w-5 h-5 text-[#A3B18A]" />
                        <span>Core Agro-Intelligence output</span>
                      </h4>
                    </div>
                    <div className="bg-white/5 border border-white/10 py-1.5 px-3 rounded-lg text-right text-[10px] font-mono">
                      <span>CONFIDENCE MODEL: </span>
                      <strong className="text-[#A3B18A]">{diagnosticResult.confidence || 94.2}%</strong>
                    </div>
                  </div>

                  {/* Findings */}
                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] font-mono uppercase tracking-widest opacity-60">Primary Crop Synthesis</p>
                      <p className="text-xl font-serif italic text-[#C5A059] mt-1">
                        "{diagnosticResult.assessment}"
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                        <p className="text-[9px] font-mono uppercase tracking-widest text-neutral-400">Soil Hydration Status</p>
                        <p className="text-sm font-semibold mt-1 text-slate-100">{diagnosticResult.soilHydrationRisk}</p>
                      </div>
                      <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                        <p className="text-[9px] font-mono uppercase tracking-widest text-neutral-400">Nutrients & Chemistry Index</p>
                        <p className="text-sm font-semibold mt-1 text-slate-100">{diagnosticResult.nutrientDeficiency}</p>
                      </div>
                    </div>
                  </div>

                  {/* Advisory Prescriptions */}
                  <div className="space-y-3.5 pt-2">
                    <div className="flex items-center gap-2 text-xs font-mono tracking-wider text-[#A3B18A] uppercase">
                      <FileText className="w-4 h-4" />
                      <span>Actionable Precision Prescriptions</span>
                    </div>

                    <ol className="space-y-3 font-sans text-xs md:text-sm text-slate-300">
                      {diagnosticResult.prescriptions ? (
                        diagnosticResult.prescriptions.map((p: string, idx: number) => (
                          <li key={idx} className="flex gap-3 leading-relaxed bg-[#052317] p-3 rounded-lg border border-white/5">
                            <span className="font-mono text-[#C5A059] font-bold">0{idx + 1}.</span>
                            <span>{p}</span>
                          </li>
                        ))
                      ) : (
                        <>
                          <li className="flex gap-3 leading-relaxed bg-[#052317] p-3 rounded-lg">
                            <span className="font-mono text-[#C5A059] font-bold">01.</span>
                            <span>Conduct standard remote sensing scan to measure NDRE indices values over targeted plots.</span>
                          </li>
                          <li className="flex gap-3 leading-relaxed bg-[#052317] p-3 rounded-lg">
                            <span className="font-mono text-[#C5A059] font-bold">02.</span>
                            <span>Target water distribution down to 35cm soil stratum to trigger primary root mass expansion.</span>
                          </li>
                        </>
                      )}
                    </ol>
                  </div>

                  {/* Ecology metrics */}
                  <div className="border-t border-white/10 pt-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-[11px] font-mono text-neutral-400">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#C5A059]" />
                      <span>Resource Metric Assessment:</span>
                      <strong className="text-white">{diagnosticResult.sustainabilityImpact}</strong>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-[#062C1D]/10 bg-slate-50 rounded-[24px] p-8 md:p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                  <Sprout className="w-16 h-16 text-[#062C1D] opacity-25 mb-4" />
                  <h4 className="text-xl font-serif italic text-[#062C1D] mb-2">Vera-1 Crop Advisory Ready</h4>
                  <p className="text-xs md:text-sm text-[#062C1D]/60 max-w-sm leading-relaxed mb-6">
                    Adjust the field variable parameters on the left and dispatch the calculation logic to generate an custom agronomic advisory document.
                  </p>
                  <div className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#C5A059] bg-[#062C1D]/5 py-1 px-3 rounded-md">
                    Waiting for field variables selection...
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Features Grid & 6. Satellite Monitoring Section */}
      <section id="orbital-scanning" className="py-20 bg-[#F5F5F0] border-b border-[#062C1D]/10 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#C5A059]">03 / HIGH SPECTRAL REMOTE SENSING</span>
            <h2 className="text-3xl md:text-5xl font-serif italic text-[#062C1D] mt-2 mb-4">
              A real-time satellite perspective of crop canopy dynamics.
            </h2>
            <p className="text-sm md:text-base text-[#062C1D]/70">
              Our low Earth orbit radar scans map photosynthesis, moisture depth gradients, plant thermal transpiration stress, and mineral nitrogen retention directly from orbit.
            </p>
          </div>

          {/* Interactive Satellite Component Placement */}
          <div className="mb-20">
            <InteractiveSatellite />
          </div>

          {/* Feature Grid Explanation of capabilities */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="bg-white border border-[#062C1D]/10 p-6 rounded-2xl flex flex-col justify-between shadow-sm">
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#C5A059] uppercase block mb-4">canopy mapping</span>
              <div>
                <h4 className="text-base font-bold text-neutral-900 mb-2">AI NDVI Analysis</h4>
                <p className="text-xs text-[#062C1D]/70 leading-relaxed">
                  Evaluates chlorophyll spectral absorption ranges. Spot photosynthesis degradation 14 days before visible leaf yellowing.
                </p>
              </div>
              <div className="pt-4 border-t border-neutral-100 mt-4 text-[11px] font-semibold text-[#062C1D] flex items-center justify-between">
                <span>Outcome Rate</span>
                <span className="text-[#C5A059]">+12.4% health index</span>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-white border border-[#062C1D]/10 p-6 rounded-2xl flex flex-col justify-between shadow-sm">
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#C5A059] uppercase block mb-4">sub-surface</span>
              <div>
                <h4 className="text-base font-bold text-neutral-900 mb-2">Transp. Radiance</h4>
                <p className="text-xs text-[#062C1D]/70 leading-relaxed">
                  Infrared spatial scanning checks plant stress heat signatures. Eliminate center-pivot water wastage down to zero.
                </p>
              </div>
              <div className="pt-4 border-t border-neutral-100 mt-4 text-[11px] font-semibold text-[#062C1D] flex items-center justify-between">
                <span>Avg Water Saved</span>
                <span className="text-[#C5A059]">40% volume reduction</span>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-white border border-[#062C1D]/10 p-6 rounded-2xl flex flex-col justify-between shadow-sm">
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#C5A059] uppercase block mb-4">mineral dynamics</span>
              <div>
                <h4 className="text-base font-bold text-neutral-900 mb-2">Soil Chemistry Indexing</h4>
                <p className="text-xs text-[#062C1D]/70 leading-relaxed">
                  Uses micro-sensor nodes with synthetic aperture radar backscatter to estimate soil Carbon, N, P, and K metrics without manual land cores.
                </p>
              </div>
              <div className="pt-4 border-t border-neutral-100 mt-4 text-[11px] font-semibold text-[#062C1D] flex items-center justify-between">
                <span>Auditing Confidence</span>
                <span className="text-[#C5A059]">98.2% spatial validation</span>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="bg-white border border-[#062C1D]/10 p-6 rounded-2xl flex flex-col justify-between shadow-sm">
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#C5A059] uppercase block mb-4">pest modeling</span>
              <div>
                <h4 className="text-base font-bold text-neutral-900 mb-2">Pathogen Pest Forecast</h4>
                <p className="text-xs text-[#062C1D]/70 leading-relaxed">
                  Fuses humidity microclimatology metrics with historical spore cycles to issue custom pest risk warnings straight to farm manager dashboards.
                </p>
              </div>
              <div className="pt-4 border-t border-neutral-100 mt-4 text-[11px] font-semibold text-[#062C1D] flex items-center justify-between">
                <span>Infestation Margins</span>
                <span className="text-[#C5A059]">reduced to under 1.5%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Impact Metrics & Real-time Interactive Acreage Simulator */}
      <section id="yield-metrics" className="py-20 bg-white border-b border-[#062C1D]/10 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Explainer / Slider side */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#C5A059]">04 / PRECISION RESOURCE CALCULATOR</span>
              <h2 className="text-3xl md:text-5xl font-serif italic text-[#062C1D]">
                Measure the premium ROI of precision tracking.
              </h2>
              <p className="text-slate-700 text-sm md:text-base leading-relaxed">
                Configure your total working arable land plot using the sliding bar below. Watch our integrated modeling system instantly estimate resource savings, potential yield revenue increases, and carbon offset credentials.
              </p>

              {/* Slider Control */}
              <div className="bg-[#F5F5F0] border border-[#062C1D]/10 p-6 rounded-2xl space-y-4">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-[#062C1D]/80 font-bold uppercase">Working Hectares:</span>
                  <span className="text-xl font-bold text-[#062C1D]">{simulatorAcreage} Ha</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="5000"
                  step="50"
                  value={simulatorAcreage}
                  onChange={(e) => setSimulatorAcreage(parseInt(e.target.value))}
                  className="w-full accent-[#C5A059] bg-[#062C1D]/15 h-2 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-neutral-400">
                  <span>50 Ha (Small Holdings)</span>
                  <span>5,000 Ha (Institutional Multi-region)</span>
                </div>
              </div>

              {/* Comparative Bullet details */}
              <div className="space-y-3 font-sans text-xs md:text-sm text-[#062C1D]/80">
                <div className="flex gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#062C1D]/5 flex items-center justify-center text-[#C5A059] font-bold shrink-0">✓</span>
                  <p>Estimated Water Conserved annually: <strong>{((traditionalWater - veraWater) * 3.78).toLocaleString(undefined, { maximumFractionDigits: 0 })} Liters Saved</strong></p>
                </div>
                <div className="flex gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#062C1D]/5 flex items-center justify-center text-[#C5A059] font-bold shrink-0">✓</span>
                  <p>Estimated Soil Organic Carbon increase: <strong>+{(simulatorAcreage * 0.45).toFixed(1)} Metric Tons CO2 sequestered</strong></p>
                </div>
              </div>
            </div>

            {/* Graphic Comparison Side */}
            <div className="lg:col-span-6 bg-[#062C1D] text-[#F5F5F0] p-6 md:p-8 rounded-[24px] border border-[#C5A059]/20 shadow-xl space-y-6">
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <h4 className="font-mono text-[10px] uppercase tracking-widest text-[#C5A059] font-bold">Estimated Irrigation comparison</h4>
                <span className="bg-white/5 py-0.5 px-2 rounded font-mono text-[9px]">Acreage Model: {simulatorAcreage} Ha</span>
              </div>

              {/* Traditional Acreage metric output */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="opacity-60">Traditional Irrigation Intake:</span>
                  <strong className="text-red-400">{traditionalWater.toLocaleString()} Gallons / Year</strong>
                </div>
                {/* Simulated Bar */}
                <div className="w-full bg-[#052317] h-3 rounded-full overflow-hidden border border-white/5">
                  <div className="bg-red-500 h-full rounded-full" style={{ width: "100%" }} />
                </div>
              </div>

              {/* Vera earth metric output */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[#C5A059] font-bold">Vera Earth Precision Output:</span>
                  <strong className="text-emerald-400">{veraWater.toLocaleString()} Gallons / Year</strong>
                </div>
                {/* Simulated Bar */}
                <div className="w-full bg-[#052317] h-3 rounded-full overflow-hidden border border-white/5">
                  <div className="bg-[#A3B18A] h-full rounded-full transition-all duration-300" style={{ width: "60%" }} />
                </div>
              </div>

              {/* Highlight Save Metric */}
              <div className="bg-[#052317] border border-white/10 p-5 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-mono uppercase text-neutral-400">Net Resource Optimization Rate</p>
                  <p className="text-2xl mt-1 font-serif italic text-white font-bold">
                    Save {(100 - (veraWater / traditionalWater) * 100).toFixed(0)}% Water Volume
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-mono uppercase text-[#C5A059] font-bold">Estimated Yield Surplus</p>
                  <p className="text-xl mt-1 text-[#A3B18A] font-bold">+22.4% tons</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. How It Works Section */}
      <section id="how-it-works" className="py-20 bg-[#F5F5F0] border-b border-[#062C1D]/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#C5A059]">05 / ECOSYSTEM DEPLOYMENT SEQUENCE</span>
            <h2 className="text-3xl md:text-5xl font-serif italic text-[#062C1D] mt-2 mb-4">
              Simple, precise integration from soil to satellite ledger.
            </h2>
            <p className="text-sm md:text-base text-[#062C1D]/70">
              Deploying agricultural intelligence shouldn't require complex retrofits. Our ecosystem installs seamlessly, syncing variables within minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-white border border-[#062C1D]/10 p-6 rounded-2xl relative">
              <div className="text-sm font-mono text-[#C5A059] font-bold mb-4">STEP_01</div>
              <h4 className="text-lg font-bold mb-2">Connect Farms</h4>
              <p className="text-xs text-[#062C1D]/70 leading-relaxed">
                Delineate farm boundaries on the interactive coordinate map or upload standard spatial geodata files.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white border border-[#062C1D]/10 p-6 rounded-2xl relative">
              <div className="text-sm font-mono text-[#C5A059] font-bold mb-4">STEP_02</div>
              <h4 className="text-lg font-bold mb-2">Probe Linkage</h4>
              <p className="text-xs text-[#062C1D]/70 leading-relaxed">
                Position our pre-calibrated solar sensing probe units at deep soil zones to capture real-time VWC biochemistry metrics.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white border border-[#062C1D]/10 p-6 rounded-2xl relative">
              <div className="text-sm font-mono text-[#C5A059] font-bold mb-4">STEP_03</div>
              <h4 className="text-lg font-bold mb-2">Satellite Sync</h4>
              <p className="text-xs text-[#062C1D]/70 leading-relaxed">
                Connect your ground coordinates to our hourly Low Earth Orbit satellite radar sweep layers automatically.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white border border-[#062C1D]/10 p-6 rounded-2xl relative">
              <div className="text-sm font-mono text-[#C5A059] font-bold mb-4">STEP_04</div>
              <h4 className="text-lg font-bold mb-2">AI Diagnosis</h4>
              <p className="text-xs text-[#062C1D]/70 leading-relaxed">
                Receive precise day-to-day prescriptions for nitrogen water emitters, and pest warning logs via the Vera-1 dashboard.
              </p>
            </div>

            {/* Step 5 */}
            <div className="bg-white border border-[#062C1D]/10 p-6 rounded-2xl relative">
              <div className="text-sm font-mono text-[#C5A059] font-bold mb-4">STEP_05</div>
              <h4 className="text-lg font-bold mb-2">Yield Optimised</h4>
              <p className="text-xs text-[#062C1D]/70 leading-relaxed">
                Track dynamic yield outputs, qualify for certified carbon offset rewards, and maximize per-hectare profit matrices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Use Case Section with tabs */}
      <section className="py-20 bg-white border-b border-[#062C1D]/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#C5A059]">06 / USE CASES & BENEFIT MATRICES</span>
            <h2 className="text-3xl md:text-5xl font-serif italic text-[#062C1D] mt-2 mb-4">
              Engineered for every level of agricultural enterprise.
            </h2>
            <p className="text-sm md:text-base text-[#062C1D]/70">
              From family holdings defending their generations of soil heritage, to multinational corporations standardizing sustainability metrics at scale.
            </p>
          </div>

          {/* Interactive Case Tabs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-[#F5F5F0] p-2 rounded-2xl border border-[#062C1D]/10 mb-12">
            {USE_CASES.map((uc) => {
              const active = activeUseCase === uc.id;
              return (
                <button
                  key={uc.id}
                  id={`tab-usecase-${uc.id}`}
                  onClick={() => setActiveUseCase(uc.id)}
                  className={`py-3 px-4 rounded-xl text-center text-xs font-bold tracking-wider uppercase transition-all duration-300 ${
                    active
                      ? "bg-[#062C1D] text-[#F5F5F0] shadow-sm font-extrabold"
                      : "hover:bg-[#062C1D]/5 text-[#062C1D]/70"
                  }`}
                >
                  {uc.audience}
                </button>
              );
            })}
          </div>

          {/* Tab Presenter */}
          {(() => {
            const currentUseCase = USE_CASES.find((uc) => uc.id === activeUseCase) || USE_CASES[0];
            return (
              <div
                className="rounded-[32px] overflow-hidden border border-[#C5A059]/20 text-[#F5F5F0] p-8 md:p-12 relative min-h-[380px] flex flex-col justify-between"
                style={{ backgroundColor: currentUseCase.bgHex }}
              >
                {/* Subtle graphic grid overlay */}
                <div
                  className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none"
                  style={{
                    backgroundImage: "radial-gradient(#F5F5F0 0.5px, transparent 0.5px)",
                    backgroundSize: "20px 20px"
                  }}
                />

                <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#C5A059] text-[#062C1D] text-[9px] font-mono uppercase tracking-widest font-extrabold py-1 px-3 rounded-full">
                      {currentUseCase.badge}
                    </span>
                    <span className="text-xs font-mono opacity-50">• VERA LAND SUITE</span>
                  </div>

                  <h3 className="text-2xl md:text-4xl font-serif italic text-white max-w-3xl leading-snug">
                    "{currentUseCase.headline}"
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-white/10 font-sans text-xs md:text-sm text-slate-300">
                    {currentUseCase.benefits.map((b, i) => (
                      <div key={i} className="space-y-2 bg-[#F5F5F0]/5 p-5 rounded-xl border border-white/5">
                        <strong className="text-[#C5A059] block font-mono text-xs">Vera Prescriptive 0{i + 1}</strong>
                        <p className="leading-relaxed">{b}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="relative z-10 pt-8 mt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs font-mono text-[#A3B18A]">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4" />
                    <span>Primary Target Value:</span>
                    <strong className="text-white">{currentUseCase.metricsPlaceholder}</strong>
                  </div>
                  <a
                    href="#demozone"
                    className="text-white hover:text-[#C5A059] font-bold tracking-widest uppercase inline-flex items-center gap-1 transition-colors"
                  >
                    <span>Request Custom Solution Proposal</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* 9. Case Studies Section */}
      <section id="case-studies" className="py-20 bg-[#F5F5F0] border-b border-[#062C1D]/10 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Header */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-16">
            <div className="lg:col-span-8">
              <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#C5A059]">07 / LAND CONVERGANCE DEPLOYMENT LOGS</span>
              <h2 className="text-3xl md:text-5xl font-serif italic text-[#062C1D] mt-2 mb-4">
                Global deploy cases: Real soil, zero marketing narratives.
              </h2>
              <p className="text-sm md:text-base text-[#062C1D]/70 max-w-2xl">
                We satisfy deep peer-reviewed carbon sequestration audits and high-yield certifications globally. Explore active farm deployment summaries.
              </p>
            </div>
            <div className="lg:col-span-4 flex lg:justify-end">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] opacity-40">
                LOGS UPDATED DAILY IN HIGH-LATITUDE CONTEXTS
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* List side */}
            <div className="lg:col-span-5 space-y-4">
              {HISTORIC_CASES.map((cs) => {
                const isSelected = selectedCaseStudy === cs.id;
                return (
                  <button
                    key={cs.id}
                    id={`btn-casestudy-${cs.id}`}
                    onClick={() => setSelectedCaseStudy(cs.id)}
                    className={`w-full p-6 rounded-2xl text-left border transition-all duration-300 ${
                      isSelected
                        ? "bg-white border-[#C5A059] shadow-md"
                        : "bg-white/40 hover:bg-white border-[#062C1D]/5 hover:border-[#062C1D]/10"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-400">
                        {cs.location}
                      </span>
                      {isSelected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                      )}
                    </div>
                    <h4 className="text-lg font-bold text-neutral-950 font-sans">{cs.brand}</h4>
                    <p className="text-xs text-[#062C1D]/60 mt-2 line-clamp-2">
                      {cs.challenge}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Display / Detailed view card side */}
            <div className="lg:col-span-7">
              {(() => {
                const cs = HISTORIC_CASES.find((item) => item.id === selectedCaseStudy) || HISTORIC_CASES[0];
                return (
                  <div className="bg-[#062C1D] text-[#F5F5F0] p-8 md:p-10 rounded-[32px] border border-white/10 shadow-xl space-y-8 relative overflow-hidden">
                    <div
                      className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none"
                      style={{
                        backgroundImage: "radial-gradient(#F5F5F0 0.5px, transparent 0.5px)",
                        backgroundSize: "24px 24px"
                      }}
                    />

                    <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-white/10 pb-5">
                        <div>
                          <span className="text-[#C5A059] text-[9px] font-mono uppercase tracking-widest font-extrabold block">
                            ACTIVE FIELD CASE FILE
                          </span>
                          <h3 className="text-3xl font-serif italic text-white mt-1">
                            {cs.brand}
                          </h3>
                        </div>
                        <span className="bg-[#A3B18A]/10 text-[#A3B18A] border border-[#A3B18A]/20 py-1 px-3 rounded text-[10px] font-mono tracking-wider uppercase font-semibold">
                          {cs.location}
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h5 className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">The Challenge Environment</h5>
                          <p className="text-sm text-slate-300 leading-relaxed mt-1">
                            "{cs.challenge}"
                          </p>
                        </div>

                        <div>
                          <h5 className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-2">Integrated Vera Technologies</h5>
                          <div className="flex flex-wrap gap-2">
                            {cs.technology.map((tech, idx) => (
                              <span key={idx} className="bg-white/5 border border-white/10 text-neutral-200 text-[10px] font-mono py-1 px-3 rounded-full">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h5 className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">Measured Outcome</h5>
                          <p className="text-lg font-serif italic text-[#C5A059] mt-1 leading-relaxed">
                            {cs.outcome}
                          </p>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs font-mono text-[#A3B18A]">
                        <span>Verified carbon indicator:</span>
                        <strong className="text-white">{cs.impactLabel}</strong>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </section>

      {/* 10. Technology Stack & Sustainability values Section */}
      <section id="technology-spec" className="py-20 bg-white border-b border-[#062C1D]/10 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#C5A059]">08 / TECHNOLOGICAL ARCHITECTURE</span>
            <h2 className="text-3xl md:text-5xl font-serif italic text-[#062C1D] mt-2 mb-4">
              Building the internet of things directly for soil health.
            </h2>
            <p className="text-sm md:text-base text-[#062C1D]/70">
              Traditional IoT integrations are brittle and require complex regional routers. We engineered a robust, low-power mesh architecture that operates anywhere in the global grid.
            </p>
          </div>

          {/* Technology cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-8 bg-[#F5F5F0] border border-[#062C1D]/10 rounded-[24px] space-y-4">
              <div className="w-12 h-12 bg-[#062C1D] text-white rounded-2xl flex items-center justify-center">
                <Database className="w-5 h-5 text-[#C5A059]" />
              </div>
              <h4 className="text-xl font-bold">Spatial Satellite Ledgers</h4>
              <p className="text-xs md:text-sm text-[#062C1D]/70 leading-relaxed">
                Ground measurements are paired with L.E.O radar snapshots, committing verified soil carbon data hashes to immutable registries, enabling easy, high-value carbon credit packaging.
              </p>
            </div>

            <div className="p-8 bg-[#F5F5F0] border border-[#062C1D]/10 rounded-[24px] space-y-4">
              <div className="w-12 h-12 bg-[#062C1D] text-white rounded-2xl flex items-center justify-center">
                <CloudLightning className="w-5 h-5 text-[#C5A059]" />
              </div>
              <h4 className="text-xl font-bold">Sub-surface Osmosis Probe</h4>
              <p className="text-xs md:text-sm text-[#062C1D]/70 leading-relaxed">
                Rigid outer carbon housing designed to resist soil pressure gradients. Integrates direct ion-selective field transistor chips for continuous mineral nitrogen monitoring.
              </p>
            </div>

            <div className="p-8 bg-[#F5F5F0] border border-[#062C1D]/10 rounded-[24px] space-y-4">
              <div className="w-12 h-12 bg-[#062C1D] text-white rounded-2xl flex items-center justify-center">
                <Cpu className="w-5 h-5 text-[#C5A059]" />
              </div>
              <h4 className="text-xl font-bold">Vera-1 ML Transformers</h4>
              <p className="text-xs md:text-sm text-[#062C1D]/70 leading-relaxed">
                Trained over five decades of microclimate weather charts and peer-reviewed agronomical crop health models. Our AI matches soil symptoms to local remediation formulas instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 11. Trust Section placeholders */}
      <section className="py-16 bg-[#F5F5F0] border-b border-[#062C1D]/10 text-center">
        <div className="max-w-7xl mx-auto px-6">
          <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-[#062C1D]/40 block mb-8">
            VERIFIED ECOLOGICAL CREDIBILITY & GLOBAL STANDARDS
          </span>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 items-center justify-items-center opacity-60">
            <span className="text-xs font-serif italic font-bold">✓ Climate Bond Standard Approved</span>
            <span className="text-xs font-mono font-bold tracking-tight">ISO-14064 GHG Qualified</span>
            <span className="text-xs font-sans font-extrabold tracking-tighter">VERRA STANDARDS LAB</span>
            <span className="text-xs font-mono">B-CORP PENDING</span>
            <span className="text-xs font-serif italic text-neutral-800">Copa-Cogeca Global Partner</span>
            <span className="text-xs font-mono font-bold">ESA Copernicus Copernicus Space Link</span>
          </div>
        </div>
      </section>

      {/* 12. Testimonials Section */}
      <section className="py-20 bg-white border-b border-[#062C1D]/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#C5A059]">09 / GLOBAL TESTIMONIALS</span>
            <h2 className="text-3xl md:text-5xl font-serif italic text-[#062C1D] mt-2 mb-4">
              Endorsed by agronomists and climate venture models.
            </h2>
            <p className="text-sm md:text-base text-[#062C1D]/70">
              Hear directly from active sovereign growers and enterprise investors tracking acreage output in real-time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Quote 1 */}
            <div className="bg-[#F5F5F0] border border-[#062C1D]/10 p-8 rounded-[24px] space-y-6 flex flex-col justify-between">
              <p className="text-sm md:text-base text-[#062C1D]/80 leading-relaxed font-serif italic">
                "The nitrogen telemetry predictions generated by the Vera-1 engine saved my family farm tens of thousands of dollars in input overhead this year alone. It is the first technology investment that actually respected the intelligence of growers."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#062C1D]/10 flex items-center justify-center font-bold font-mono text-[#062C1D]">
                  ML
                </div>
                <div>
                  <h5 className="text-xs font-bold font-sans text-neutral-900 uppercase">Marc L'Enfant</h5>
                  <p className="text-[10px] font-mono text-[#C5A059] uppercase tracking-wider mt-0.5">Primary Grower, Saint-Émilion</p>
                </div>
              </div>
            </div>

            {/* Quote 2 */}
            <div className="bg-[#F5F5F0] border border-[#062C1D]/10 p-8 rounded-[24px] space-y-6 flex flex-col justify-between">
              <p className="text-sm md:text-base text-[#062C1D]/80 leading-relaxed font-serif italic">
                "As institutional climate investors, we struggled to validate environmental claims across multi-region portfolios. Vera Earth provides the immutable physical land ledger our investment thesis requires to unlock high-grade capital."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#062C1D]/10 flex items-center justify-center font-bold font-mono text-[#062C1D]">
                  SK
                </div>
                <div>
                  <h5 className="text-xs font-bold font-sans text-neutral-900 uppercase">Dr. Sarah Kiptoo</h5>
                  <p className="text-[10px] font-mono text-[#C5A059] uppercase tracking-wider mt-0.5">Ecosystem General Partner, Rift Bio-Capital</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 13. Final Conversion CTA Section */}
      <section id="demozone" className="py-24 bg-[#062C1D] text-[#F5F5F0] relative overflow-hidden scroll-mt-20">
        <div
          className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#F5F5F0 0.5px, transparent 0.5px)",
            backgroundSize: "24px 24px"
          }}
        />

        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 animate-fade-in">
          {/* Conversion Details */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-[10px] font-mono font-bold tracking-widest text-[#C5A059] uppercase">
              RESERVE YOUR SPACE-AGE ARABLE AUDIT
            </span>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif italic text-white leading-tight">
              Turn every single acre into actionable intelligence.
            </h2>
            <p className="text-slate-300 text-sm md:text-base max-w-xl leading-relaxed">
              Unlock a comprehensive crop diagnostics sweep, configure Ground probe nodes, and calibrate multi-spectral canopy mapping within your regional grid context.
            </p>

            <div className="flex flex-wrap gap-4 pt-4 font-mono text-[10px] text-[#A3B18A]">
              <span className="flex items-center gap-1.5 bg-white/5 py-1 px-3 rounded">
                <ShieldCheck className="w-3.5 h-3.5" /> Secure GDPR Land data
              </span>
              <span className="flex items-center gap-1.5 bg-white/5 py-1 px-3 rounded">
                <HeartHandshake className="w-3.5 h-3.5" /> Zero pressure obligations
              </span>
            </div>
          </div>

          {/* Form wrapper */}
          <div className="lg:col-span-5 bg-white text-[#062C1D] p-8 rounded-[24px] shadow-2xl">
            {demoScheduled ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-12 h-12 bg-[#062C1D]/5 text-[#C5A059] rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-serif italic text-[#062C1D]">Your audit request has been registered.</h4>
                <p className="text-xs text-[#062C1D]/75 leading-relaxed">
                  A Vera Earth scientific agronomist will contact your registry address within 12 standard hours to provision telemetry coordinates.
                </p>
                <button
                  onClick={() => setDemoScheduled(false)}
                  className="mt-6 text-xs font-mono font-bold uppercase tracking-widest text-[#C5A059] hover:underline"
                >
                  Schedule another plot
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookDemo} className="space-y-4">
                <h4 className="text-lg font-bold font-sans text-neutral-900 border-b border-[#062C1D]/10 pb-3 mb-2">
                  Request Arable Feasibility Proposal
                </h4>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-[#062C1D]/70 mb-1">
                    Your Name
                  </label>
                  <input
                    id="demo-name"
                    type="text"
                    required
                    value={demoName}
                    onChange={(e) => setDemoName(e.target.value)}
                    placeholder="Marc L'Enfant"
                    className="w-full bg-[#F5F5F0] border border-[#062C1D]/10 rounded-xl px-4 py-2.5 text-xs font-medium text-[#062C1D] focus:outline-none focus:ring-1 focus:ring-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-[#062C1D]/70 mb-1">
                    Work Email Address
                  </label>
                  <input
                    id="demo-email"
                    type="email"
                    required
                    value={demoEmail}
                    onChange={(e) => setDemoEmail(e.target.value)}
                    placeholder="marc@saint-emilion-farms.com"
                    className="w-full bg-[#F5F5F0] border border-[#062C1D]/10 rounded-xl px-4 py-2.5 text-xs font-medium text-[#062C1D] focus:outline-none focus:ring-1 focus:ring-[#C5A059]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    id="demo-btn-submit"
                    type="submit"
                    className="w-full py-3 bg-[#062C1D] hover:bg-[#C5A059] text-white text-[10px] font-bold tracking-widest uppercase rounded-xl transition-all cursor-pointer shadow-md"
                  >
                    CONFIRM DEMO AND PLOT RESERVATION
                  </button>
                  <p className="text-[9px] text-center text-[#062C1D]/50 mt-3 leading-relaxed">
                    By submitting this secure land form, you authorize Vera Earth algorithms to prepare a complimentary initial orbital thermal index assessment for your coordinates.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 14. Editorial Footer */}
      <footer className="bg-[#052317] border-t border-white/10 text-[#F5F5F0]/80 py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-12 items-baseline">
          {/* Logo and Brand Statement */}
          <div className="md:col-span-5 space-y-4">
            <a href="#" className="flex items-center gap-2 text-xl font-bold tracking-tighter text-white">
              <div className="w-3.5 h-3.5 bg-[#C5A059] rounded-full inline-block" />
              <span>VERA EARTH</span>
            </a>
            <p className="text-xs text-neutral-400 max-w-sm leading-relaxed">
              We engineer advanced digital-twin physical technology to resolve critical water, soil biology, and crop health issues, empowering premium growers across our changing planet.
            </p>
            <div className="pt-4 text-[10px] font-mono text-[#A3B18A]">
              LATITUDE CONTEXT: 44.8378° N / LONGITUDE CONTEXT: 0.5792° W
            </div>
          </div>

          {/* Links Column 1 */}
          <div className="md:col-span-3 space-y-3 font-sans text-xs">
            <h5 className="font-mono text-[10px] uppercase tracking-widest text-[#C5A059] font-bold">The Tech Suite</h5>
            <div className="flex flex-col space-y-2">
              <a href="#platform-agronomy" className="hover:text-white transition-colors">Vera-1 ML Diagnostic</a>
              <a href="#orbital-scanning" className="hover:text-white transition-colors">Sub-Surface Probes</a>
              <a href="#orbital-scanning" className="hover:text-white transition-colors">NDVI Spectral Scanning</a>
              <a href="#yield-metrics" className="hover:text-white transition-colors">Crop Water Simulator</a>
            </div>
          </div>

          {/* Links Column 2 */}
          <div className="md:col-span-4 space-y-4">
            <h5 className="font-mono text-[10px] uppercase tracking-widest text-[#C5A059] font-bold">Scientific Newsletter</h5>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Secure peer-reviewed agricultural intelligence research sent straight to your inbox monthly. No marketing fluff.
            </p>
            <div className="flex bg-white/5 border border-white/10 rounded-xl overflow-hidden p-1.5 focus-within:ring-1 focus-within:ring-[#C5A059]">
              <input
                type="email"
                placeholder="agronomist@grower.com"
                className="w-full bg-transparent px-3 py-1.5 text-xs text-white focus:outline-none placeholder:text-neutral-500"
              />
              <button
                className="bg-[#C5A059] hover:bg-[#A3B18A] text-[#062C1D] text-[9px] font-mono font-bold px-3.5 py-1.5 rounded-lg transition-all"
              >
                JOIN
              </button>
            </div>
            <div className="text-[10px] text-neutral-500 leading-none">
              © {new Date().getFullYear()} Vera Earth. All global coordinates reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

