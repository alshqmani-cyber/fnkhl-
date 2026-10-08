/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PigeonStatus = 'Active' | 'Breeding' | 'Flying' | 'Sold' | 'Dead' | 'Isolated';
export type PigeonSex = 'Male' | 'Female' | 'Unknown';

export interface PigeonPhoto {
  id: string;
  url: string;
  date: string;
  caption?: string;
}

export interface PigeonWeightRecord {
  id: string;
  date: string;
  weight_grams: number;
  notes?: string;
}

export interface MutationTrait {
  id: string;
  name: string;
  type: 'Color' | 'Gene' | 'Mutation' | 'Trait';
  description?: string;
  colorHex?: string;
}

export interface Pigeon {
  id: string;
  ring_number: string;
  name?: string;
  sex: PigeonSex;
  breed: string;
  birth_date: string;
  status: PigeonStatus;
  origin_father_id?: string;
  origin_father_ring?: string;
  origin_mother_id?: string;
  origin_mother_ring?: string;
  phenotype: string; // e.g. "أزرق خطين", "أبيض تكسان", "لوزي Almond"
  genotype: string;  // e.g. "BA/b", "St/+"
  mutations?: string[];
  loft_section_id?: string;
  nest_box_number?: string;
  coi_percentage?: number; // Inbreeding Coefficient (COI %)
  notes?: string;
  image_url?: string;
  photos?: PigeonPhoto[];
  weights?: PigeonWeightRecord[];
  purchase_price?: number;
  sale_price?: number;
  buyer_name?: string;
}

export interface Breed {
  id: string;
  breed_name: string;
  category: 'Meat' | 'Racing' | 'Fancy' | 'Flying' | 'Dual';
  origin_country?: string;
  is_auto_sexing: boolean;
  incubation_days_default: number;
  standard_weight_grams?: number;
  description?: string;
}

export interface Pair {
  id: string;
  male_id: string;
  male_ring: string;
  female_id: string;
  female_ring: string;
  start_date: string;
  end_date?: string;
  status: 'Active' | 'Separated';
  cage_number?: string;
  section_id?: string;
  pair_score_grade?: string; // A+, A, B, C, F
}

export type CycleEggStatus = 'Laid' | 'Fertile' | 'Infertile' | 'Broken' | 'Hatched' | 'DeadInShell';

export interface ProductionCycle {
  id: string;
  pair_id: string;
  pair_label: string; // "Male x Female"
  egg1_date?: string;
  egg1_status: CycleEggStatus;
  egg2_date?: string;
  egg2_status: CycleEggStatus;
  expected_hatch_date?: string;
  actual_hatch_date?: string;
  fertile_eggs_count: number;
  hatched_chicks_count: number;
  weaned_chicks_count: number;
  notes?: string;
  fostered_to_pair_id?: string;
  is_fostered_in: boolean;
  biological_pair_id?: string;
}

export interface ChickWeight {
  id: string;
  cycle_id: string;
  chick_identifier: string;
  weight_date: string;
  weight_grams: number;
  notes?: string;
}

export interface MedicalRecord {
  id: string;
  pigeon_id?: string;
  pair_id?: string;
  disease_symptoms: string;
  medicine_name: string;
  start_date: string;
  end_date: string;
  withdrawal_days: number;
  is_active: boolean;
  type?: 'Vaccination' | 'Treatment' | 'Quarantine' | 'Routine';
}

export interface InventoryItem {
  id: string;
  item_name: string;
  category: 'Feed' | 'Medicine' | 'Tools';
  quantity_available: number;
  unit: string;
  minimum_alert_level: number;
  expiry_date?: string;
  price_per_unit: number;
}

export interface Transaction {
  id: string;
  transaction_type: 'Income' | 'Expense';
  amount: number;
  date: string;
  category: string;
  description: string;
}

export interface LoftSection {
  id: string;
  name: string;
  type: 'Breeding' | 'Flying' | 'YoungBirds' | 'Quarantine' | 'Hospital' | 'Widowhood';
  capacity: number;
  nestBoxesCount: number;
  description?: string;
}

export interface NestBox {
  id: string;
  sectionId: string;
  boxNumber: string;
  currentPairId?: string;
  status: 'Empty' | 'Occupied' | 'Incubating' | 'FeedingChicks' | 'Cleaning';
  notes?: string;
}

export interface RingStock {
  id: string;
  year: number;
  prefix: string;
  seriesStart: number;
  seriesEnd: number;
  currentNumber: number;
  ringSizeMm: number;
  clubName?: string;
  colorHex?: string;
  assignedRings: { [ringNumber: string]: { birdId?: string; date: string } };
}

export interface Contact {
  id: string;
  name: string;
  type: 'Breeder' | 'Buyer' | 'Vet' | 'Club' | 'Supplier';
  phone?: string;
  email?: string;
  city?: string;
  notes?: string;
  rating?: number;
}

export interface SaleCertificate {
  certificateNumber: string;
  pigeonRing: string;
  pigeonBreed: string;
  pigeonColor: string;
  pigeonSex: PigeonSex;
  birthDate: string;
  sellerName: string;
  aviaryName: string;
  buyerName: string;
  buyerContact?: string;
  salePrice: number;
  saleDate: string;
  transferNotes?: string;
  signatureRef: string;
}

export interface AviaryProfile {
  id: string;
  aviaryName: string;
  breederName: string;
  email: string;
  phone?: string;
  country: string;
  city?: string;
  ringPrefix: string;
  ringYear: number;
  currency: string;
  unitSystem: 'metric' | 'imperial';
  dateFormat: 'YYYY-MM-DD' | 'DD/MM/YYYY';
  defaultSpecies: string;
  defaultIncubationDays: number;
  defaultClutchSize: number;
  candlingDays: number;
  bandingAgeDays: number;
  weaningAgeDays: number;
  isRegistered: boolean;
  createdAt: string;
}
