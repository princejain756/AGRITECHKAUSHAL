/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CropSensorSample {
  id: string;
  fieldCode: string;
  moisture: number; // Volumetric Water Content %
  temperature: number; // Celsius
  nitrogen: number; // mg/kg
  phosphorus: number; // mg/kg
  potassium: number; // mg/kg
  chlorophyllIndex: number; // NDVI Index (0.0 to 1.0)
  status: "optimal" | "warning" | "critical";
}

export interface SatelliteLayer {
  id: string;
  name: string;
  description: string;
  colorScale: string[];
  unit: string;
  currentRange: string;
}

export interface UseCaseData {
  id: string;
  audience: string;
  headline: string;
  benefits: string[];
  metricsPlaceholder: string;
  bgHex: string;
  badge: string;
}

export interface CaseStudyData {
  id: string;
  brand: string;
  location: string;
  challenge: string;
  technology: string[];
  outcome: string;
  impactLabel: string;
}

export interface DiagnosticResult {
  assessment: string;
  confidence: number;
  soilHydrationRisk: string;
  nutrientDeficiency: string;
  prescriptions: string[];
  sustainabilityImpact: string;
}
