export enum Currency {
  MYR = 'MYR',
  USD = 'USD',
  EUR = 'EUR'
}

export enum Flexibility {
  Strict = 'strict',
  Moderate = 'moderate',
  Flexible = 'flexible'
}

export enum Resolution {
  R_1080p = '1080p',
  R_1440p = '1440p',
  R_4K = '4K',
  Any = 'Any'
}

export enum FormFactor {
  ATX = 'ATX',
  MicroATX = 'Micro-ATX', // Adjusted to match likely Python string expectation
  MiniITX = 'Mini-ITX',
  Any = 'Any'
}

export enum LightingPreference {
  RGB = 'RGB',
  None = 'None'
}

export enum ColorTheme {
  Black = 'Black',
  White = 'White',
}

export enum CpuPlatform {
  Intel = 'Intel',
  AMD = 'AMD',
  Any = 'Any'
}

export interface Financials {
  budget_cap: number;
  currency: string;
  flexibility?: string;
}

export interface BuildRequirements {
  primary_use: string[];
  target_resolution?: string;
  form_factor_target?: string;
}

export interface ComponentPreferences {
  lighting_style?: string;
  color_theme?: string;
  cpu_preferred_platform?: string;
}

// Main Request Model
export interface SiliconSageBuildRequest {
  financials: Financials;
  build_requirements: BuildRequirements;
  component_preferences: ComponentPreferences;
  user_prompt?: string;
}

// Output Schema
// -------------------------
// Base Component
// -------------------------
export interface ComponentBase {
  model_name: string;
  price: number;
  vendor_url: string;
}

// -------------------------
// Component Specs
// -------------------------

export interface CPUSpecs {
  socket?: string;
  core_count?: string;
  base_boost_clock?: string;
  tdp_watts: number;
}

export interface GPUSpecs {
  chipset?: string;
  vram?: string;
  length_mm?: number;
  slot_width?: number;
  tgp_watts: number;
}

export interface MotherboardSpecs {
  form_factor?: string;
  socket?: string;
  rear_io_ports?: string[];
  internal_headers?: string[];
  max_power_draw_watts: number;
}

export interface PSUSpecs {
  wattage?: number;
  rating?: string;
  modular?: string;
}

// -------------------------
// Specific Components
// -------------------------

export interface ComponentCPU extends ComponentBase {
  specs: CPUSpecs;
}

export interface ComponentGPU extends ComponentBase {
  specs: GPUSpecs;
}

export interface ComponentMotherboard extends ComponentBase {
  specs: MotherboardSpecs;
}

export interface ComponentPSU extends ComponentBase {
  specs: PSUSpecs;
}

export interface ComponentGeneric extends ComponentBase {
  specs: Record<string, any>;
}

// -------------------------
// Report Meta
// -------------------------

export interface ReportMeta {
  build_id?: string;
  generated_at?: string;
  total_estimated_cost?: number;
  currency?: string; // Default "MYR"
}

// -------------------------
// Components Root
// -------------------------

export interface BuildComponents {
  cpu: ComponentCPU;
  motherboard: ComponentMotherboard;
  ram: ComponentGeneric;
  storage: ComponentGeneric;
  gpu?: ComponentGPU; // Optional[ComponentGPU]
  psu: ComponentPSU;
}

// -------------------------
// Performance Estimates
// -------------------------

export interface PerformanceEstimates {
  calculated_total_wattage?: number;
  gaming_1440p_fps?: string;
  workstation_score?: string;
}

// -------------------------
// MAIN OUTPUT SCHEMA
// -------------------------

export interface SiliconSageBuildReport {
  report_meta: ReportMeta;
  components: BuildComponents;
  performance_estimates: PerformanceEstimates;
}

// Chat Message Interface
export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}