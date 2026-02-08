
import { Truck } from './types';

export const getMaintenanceStatus = (truck: Truck): 'Healthy' | 'Check Oil' | 'Overdue' => {
  if (truck.records.length === 0) return 'Overdue';
  
  const lastRecord = [...truck.records].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )[0];
  
  const lastDate = new Date(lastRecord.date);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - lastDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays >= 18) return 'Overdue';
  if (diffDays >= 15) return 'Check Oil';
  return 'Healthy';
};

export const needsOilChange = (truck: Truck): boolean => {
  const status = getMaintenanceStatus(truck);
  return status === 'Check Oil' || status === 'Overdue';
};

export const getDaysSinceLastChange = (truck: Truck): number | null => {
  if (truck.records.length === 0) return null;
  const lastRecord = [...truck.records].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )[0];
  const lastDate = new Date(lastRecord.date);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - lastDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const formatTruckDisplay = (truck: Truck): string => {
  return `${truck.companyNumber} - ${truck.truckNumber}`;
};
