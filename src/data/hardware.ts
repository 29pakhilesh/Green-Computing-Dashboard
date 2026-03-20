export type DeviceCategory = "cpu" | "gpu" | "laptop" | "desktop" | "phone";

export interface HardwareDevice {
  id: string;
  name: string;
  category: DeviceCategory;
  manufacturer: string;
  formFactor: "desktop" | "laptop" | "phone" | "all-in-one" | "soc";
  year: number;
  tdpWatts: number;
  avgPowerWatts: number;
  co2PerHourKg: number;
  efficiencyScore: number;
  notes?: string;
}

// Emission factor in kg CO2 per kWh (approx global electricity mix)
export const EMISSION_FACTOR_KG_PER_KWH = 0.475;

export type ElectricityMixKey = "global_avg" | "renewables_high" | "grid_mixed" | "coal_intensive";

export const ELECTRICITY_MIXES: Record<
  ElectricityMixKey,
  { label: string; emissionFactorKgPerKwh: number; note: string }
> = {
  global_avg: {
    label: "Global average",
    emissionFactorKgPerKwh: 0.475,
    note: "Approximate world electricity mix (used as default)."
  },
  renewables_high: {
    label: "Renewables-heavy",
    emissionFactorKgPerKwh: 0.12,
    note: "Cleaner grid assumption (higher renewable share)."
  },
  grid_mixed: {
    label: "Mixed grid",
    emissionFactorKgPerKwh: 0.30,
    note: "A mid-range electricity mix assumption."
  },
  coal_intensive: {
    label: "Coal-intensive",
    emissionFactorKgPerKwh: 0.70,
    note: "More carbon-heavy grid assumption."
  }
};

export const HARDWARE_DB: HardwareDevice[] = [
  // Desktop CPUs
  {
    id: "intel-i5-12400",
    name: "Intel Core i5-12400",
    category: "cpu",
    manufacturer: "Intel",
    formFactor: "desktop",
    year: 2022,
    tdpWatts: 65,
    avgPowerWatts: 45,
    co2PerHourKg: (45 / 1000) * EMISSION_FACTOR_KG_PER_KWH,
    efficiencyScore: 82
  },
  {
    id: "intel-i9-13900k",
    name: "Intel Core i9-13900K",
    category: "cpu",
    manufacturer: "Intel",
    formFactor: "desktop",
    year: 2023,
    tdpWatts: 253,
    avgPowerWatts: 190,
    co2PerHourKg: (190 / 1000) * EMISSION_FACTOR_KG_PER_KWH,
    efficiencyScore: 62,
    notes: "High-end desktop CPU; very fast but power hungry."
  },
  {
    id: "intel-i7-12700",
    name: "Intel Core i7-12700",
    category: "cpu",
    manufacturer: "Intel",
    formFactor: "desktop",
    year: 2022,
    tdpWatts: 125,
    avgPowerWatts: 80,
    co2PerHourKg: (80 / 1000) * EMISSION_FACTOR_KG_PER_KWH,
    efficiencyScore: 72
  },
  {
    id: "ryzen-5-5600x",
    name: "AMD Ryzen 5 5600X",
    category: "cpu",
    manufacturer: "AMD",
    formFactor: "desktop",
    year: 2021,
    tdpWatts: 65,
    avgPowerWatts: 50,
    co2PerHourKg: (50 / 1000) * EMISSION_FACTOR_KG_PER_KWH,
    efficiencyScore: 85
  },
  {
    id: "ryzen-7-5800x",
    name: "AMD Ryzen 7 5800X",
    category: "cpu",
    manufacturer: "AMD",
    formFactor: "desktop",
    year: 2021,
    tdpWatts: 105,
    avgPowerWatts: 75,
    co2PerHourKg: (75 / 1000) * EMISSION_FACTOR_KG_PER_KWH,
    efficiencyScore: 78
  },
  {
    id: "ryzen-7-7800x3d",
    name: "AMD Ryzen 7 7800X3D",
    category: "cpu",
    manufacturer: "AMD",
    formFactor: "desktop",
    year: 2023,
    tdpWatts: 120,
    avgPowerWatts: 80,
    co2PerHourKg: (80 / 1000) * EMISSION_FACTOR_KG_PER_KWH,
    efficiencyScore: 88,
    notes: "Very efficient gaming CPU thanks to 3D cache."
  },
  {
    id: "ryzen-9-7950x",
    name: "AMD Ryzen 9 7950X",
    category: "cpu",
    manufacturer: "AMD",
    formFactor: "desktop",
    year: 2023,
    tdpWatts: 170,
    avgPowerWatts: 140,
    co2PerHourKg: (140 / 1000) * EMISSION_FACTOR_KG_PER_KWH,
    efficiencyScore: 72
  },
  // Desktop GPUs
  {
    id: "rtx-3060",
    name: "NVIDIA RTX 3060",
    category: "gpu",
    manufacturer: "NVIDIA",
    formFactor: "desktop",
    year: 2021,
    tdpWatts: 170,
    avgPowerWatts: 140,
    co2PerHourKg: (140 / 1000) * EMISSION_FACTOR_KG_PER_KWH,
    efficiencyScore: 70
  },
  {
    id: "rtx-3070",
    name: "NVIDIA RTX 3070",
    category: "gpu",
    manufacturer: "NVIDIA",
    formFactor: "desktop",
    year: 2020,
    tdpWatts: 220,
    avgPowerWatts: 185,
    co2PerHourKg: (185 / 1000) * EMISSION_FACTOR_KG_PER_KWH,
    efficiencyScore: 68
  },
  {
    id: "rtx-3080",
    name: "NVIDIA RTX 3080",
    category: "gpu",
    manufacturer: "NVIDIA",
    formFactor: "desktop",
    year: 2020,
    tdpWatts: 320,
    avgPowerWatts: 270,
    co2PerHourKg: (270 / 1000) * EMISSION_FACTOR_KG_PER_KWH,
    efficiencyScore: 60
  },
  {
    id: "rtx-4090",
    name: "NVIDIA RTX 4090",
    category: "gpu",
    manufacturer: "NVIDIA",
    formFactor: "desktop",
    year: 2022,
    tdpWatts: 450,
    avgPowerWatts: 380,
    co2PerHourKg: (380 / 1000) * EMISSION_FACTOR_KG_PER_KWH,
    efficiencyScore: 55,
    notes: "Extreme performance, extreme power usage."
  },
  {
    id: "rtx-4060",
    name: "NVIDIA RTX 4060",
    category: "gpu",
    manufacturer: "NVIDIA",
    formFactor: "desktop",
    year: 2023,
    tdpWatts: 115,
    avgPowerWatts: 100,
    co2PerHourKg: (100 / 1000) * EMISSION_FACTOR_KG_PER_KWH,
    efficiencyScore: 80
  },
  {
    id: "rx-6800",
    name: "AMD Radeon RX 6800",
    category: "gpu",
    manufacturer: "AMD",
    formFactor: "desktop",
    year: 2021,
    tdpWatts: 250,
    avgPowerWatts: 210,
    co2PerHourKg: (210 / 1000) * EMISSION_FACTOR_KG_PER_KWH,
    efficiencyScore: 67
  },
  {
    id: "integrated-graphics",
    name: "Integrated graphics (modern iGPU)",
    category: "gpu",
    manufacturer: "Generic",
    formFactor: "desktop",
    year: 2022,
    tdpWatts: 40,
    avgPowerWatts: 30,
    co2PerHourKg: (30 / 1000) * EMISSION_FACTOR_KG_PER_KWH,
    efficiencyScore: 92,
    notes: "Very efficient for office and light workloads."
  },
  // Laptops
  {
    id: "ultrabook-13",
    name: "Efficient Ultrabook 13\"",
    category: "laptop",
    manufacturer: "Generic",
    formFactor: "laptop",
    year: 2023,
    tdpWatts: 25,
    avgPowerWatts: 18,
    co2PerHourKg: (18 / 1000) * EMISSION_FACTOR_KG_PER_KWH,
    efficiencyScore: 90
  },
  {
    id: "gaming-laptop-15",
    name: "Gaming Laptop 15\"",
    category: "laptop",
    manufacturer: "Generic",
    formFactor: "laptop",
    year: 2023,
    tdpWatts: 130,
    avgPowerWatts: 95,
    co2PerHourKg: (95 / 1000) * EMISSION_FACTOR_KG_PER_KWH,
    efficiencyScore: 65
  },
  // Apple Silicon & Macs
  {
    id: "apple-m1",
    name: "Apple M1 (MacBook Air)",
    category: "laptop",
    manufacturer: "Apple",
    formFactor: "laptop",
    year: 2020,
    tdpWatts: 20,
    avgPowerWatts: 15,
    co2PerHourKg: (15 / 1000) * EMISSION_FACTOR_KG_PER_KWH,
    efficiencyScore: 94,
    notes: "Highly efficient SoC used in fanless MacBook Air."
  },
  {
    id: "apple-m2",
    name: "Apple M2 (MacBook Air)",
    category: "laptop",
    manufacturer: "Apple",
    formFactor: "laptop",
    year: 2022,
    tdpWatts: 25,
    avgPowerWatts: 18,
    co2PerHourKg: (18 / 1000) * EMISSION_FACTOR_KG_PER_KWH,
    efficiencyScore: 96
  },
  {
    id: "apple-m2-pro",
    name: "Apple M2 Pro (MacBook Pro 14\")",
    category: "laptop",
    manufacturer: "Apple",
    formFactor: "laptop",
    year: 2023,
    tdpWatts: 35,
    avgPowerWatts: 28,
    co2PerHourKg: (28 / 1000) * EMISSION_FACTOR_KG_PER_KWH,
    efficiencyScore: 90
  },
  {
    id: "imac-24-m3",
    name: "iMac 24\" (M3)",
    category: "desktop",
    manufacturer: "Apple",
    formFactor: "all-in-one",
    year: 2024,
    tdpWatts: 65,
    avgPowerWatts: 45,
    co2PerHourKg: (45 / 1000) * EMISSION_FACTOR_KG_PER_KWH,
    efficiencyScore: 88
  },
  {
    id: "mac-mini-m2",
    name: "Mac mini (M2)",
    category: "desktop",
    manufacturer: "Apple",
    formFactor: "desktop",
    year: 2023,
    tdpWatts: 40,
    avgPowerWatts: 25,
    co2PerHourKg: (25 / 1000) * EMISSION_FACTOR_KG_PER_KWH,
    efficiencyScore: 93
  },
  // Phones – more variety
  // Mobile phones – typical charging / use power
  {
    id: "iphone-15-pro",
    name: "iPhone 15 Pro",
    category: "phone",
    manufacturer: "Apple",
    formFactor: "phone",
    year: 2023,
    tdpWatts: 15,
    avgPowerWatts: 7,
    co2PerHourKg: (7 / 1000) * EMISSION_FACTOR_KG_PER_KWH,
    efficiencyScore: 98,
    notes: "Efficient A‑series SoC with OLED display and aggressive power management."
  },
  {
    id: "iphone-se-3",
    name: "iPhone SE (3rd gen)",
    category: "phone",
    manufacturer: "Apple",
    formFactor: "phone",
    year: 2022,
    tdpWatts: 10,
    avgPowerWatts: 5,
    co2PerHourKg: (5 / 1000) * EMISSION_FACTOR_KG_PER_KWH,
    efficiencyScore: 97
  },
  {
    id: "pixel-8",
    name: "Google Pixel 8",
    category: "phone",
    manufacturer: "Google",
    formFactor: "phone",
    year: 2023,
    tdpWatts: 15,
    avgPowerWatts: 7,
    co2PerHourKg: (7 / 1000) * EMISSION_FACTOR_KG_PER_KWH,
    efficiencyScore: 96
  },
  {
    id: "galaxy-s24",
    name: "Samsung Galaxy S24",
    category: "phone",
    manufacturer: "Samsung",
    formFactor: "phone",
    year: 2024,
    tdpWatts: 18,
    avgPowerWatts: 8,
    co2PerHourKg: (8 / 1000) * EMISSION_FACTOR_KG_PER_KWH,
    efficiencyScore: 95
  },
  {
    id: "budget-android",
    name: "Efficient Android phone",
    category: "phone",
    manufacturer: "Generic",
    formFactor: "phone",
    year: 2022,
    tdpWatts: 12,
    avgPowerWatts: 5,
    co2PerHourKg: (5 / 1000) * EMISSION_FACTOR_KG_PER_KWH,
    efficiencyScore: 97
  },
  {
    id: "gaming-phone",
    name: "High-end gaming phone",
    category: "phone",
    manufacturer: "Generic",
    formFactor: "phone",
    year: 2023,
    tdpWatts: 25,
    avgPowerWatts: 10,
    co2PerHourKg: (10 / 1000) * EMISSION_FACTOR_KG_PER_KWH,
    efficiencyScore: 90,
    notes: "High refresh display and SoC; more power for gaming."
  },
  {
    id: "feature-phone",
    name: "Basic feature phone",
    category: "phone",
    manufacturer: "Generic",
    formFactor: "phone",
    year: 2020,
    tdpWatts: 5,
    avgPowerWatts: 2,
    co2PerHourKg: (2 / 1000) * EMISSION_FACTOR_KG_PER_KWH,
    efficiencyScore: 99,
    notes: "Very low power usage; limited smart features."
  }
];

export function energyKWh(powerWatts: number, hoursPerDay: number): number {
  return (powerWatts * hoursPerDay) / 1000;
}

export function emissionsKg(
  powerWatts: number,
  hoursPerDay: number,
  emissionFactorKgPerKwh: number = EMISSION_FACTOR_KG_PER_KWH
): number {
  return energyKWh(powerWatts, hoursPerDay) * emissionFactorKgPerKwh;
}

