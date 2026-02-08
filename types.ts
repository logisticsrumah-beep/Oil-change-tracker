
export interface OilChangeRecord {
  id: string;
  truckId: string;
  date: string;
  oilType: string;
  readingKm: number;
}

export interface Truck {
  id: string;
  truckNumber: string;
  companyNumber: string;
  make: string;
  records: OilChangeRecord[];
}

export type ViewType = 'dashboard' | 'trucks' | 'add-truck' | 'oil-change' | 'edit-truck';
export type TruckFilter = 'all' | 'overdue' | 'check' | 'healthy';
