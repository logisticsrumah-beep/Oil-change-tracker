
import React, { useState, useEffect } from 'react';
import { Truck, ViewType, OilChangeRecord, TruckFilter } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TruckList from './components/TruckList';
import AddTruckForm from './components/AddTruckForm';
import OilChangeForm from './components/OilChangeForm';

const INITIAL_TRUCKS: Truck[] = [
  {
    id: '1',
    truckNumber: 'ABC-1234',
    companyNumber: 'C-001',
    make: 'Hino 500',
    records: [
      { id: 'r1', truckId: '1', date: '2023-10-01', oilType: 'Synthetic 5W-40', readingKm: 12500 }
    ]
  },
  {
    id: '2',
    truckNumber: 'XYZ-5678',
    companyNumber: 'C-042',
    make: 'Isuzu NPR',
    records: [
      { id: 'r2', truckId: '2', date: '2023-10-20', oilType: 'Conventional 15W-40', readingKm: 45000 }
    ]
  }
];

const App: React.FC = () => {
  const [trucks, setTrucks] = useState<Truck[]>(() => {
    const saved = localStorage.getItem('trucks_data');
    return saved ? JSON.parse(saved) : INITIAL_TRUCKS;
  });
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [selectedTruckId, setSelectedTruckId] = useState<string | null>(null);
  const [truckFilter, setTruckFilter] = useState<TruckFilter>('all');

  useEffect(() => {
    localStorage.setItem('trucks_data', JSON.stringify(trucks));
  }, [trucks]);

  const handleAddTruck = (newTruck: Omit<Truck, 'id' | 'records'>) => {
    const truck: Truck = {
      ...newTruck,
      id: Date.now().toString(),
      records: []
    };
    setTrucks(prev => [...prev, truck]);
    setTruckFilter('all');
    setCurrentView('trucks');
  };

  const handleUpdateTruck = (updatedData: Omit<Truck, 'id' | 'records'>) => {
    if (!selectedTruckId) return;
    setTrucks(prev => prev.map(t => t.id === selectedTruckId ? { ...t, ...updatedData } : t));
    setCurrentView('trucks');
    setSelectedTruckId(null);
  };

  const handleAddOilChange = (record: Omit<OilChangeRecord, 'id'>) => {
    setTrucks(prev => prev.map(t => {
      if (t.id === record.truckId) {
        return {
          ...t,
          records: [...t.records, { ...record, id: Date.now().toString() }]
        };
      }
      return t;
    }));
    setCurrentView('dashboard');
  };

  const handleDeleteTruck = (id: string) => {
    setTrucks(prev => prev.filter(t => t.id !== id));
  };

  const navigateToOilChange = (truckId: string) => {
    setSelectedTruckId(truckId);
    setCurrentView('oil-change');
  };

  const navigateToEdit = (truckId: string) => {
    setSelectedTruckId(truckId);
    setCurrentView('edit-truck');
  };

  const handleNavigateToFleet = (filter: TruckFilter = 'all') => {
    setTruckFilter(filter);
    setCurrentView('trucks');
  };

  const selectedTruck = trucks.find(t => t.id === selectedTruckId);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar 
        currentView={currentView} 
        setView={(view) => {
          if (view === 'trucks') setTruckFilter('all');
          setCurrentView(view);
        }} 
      />
      
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              {currentView === 'dashboard' && 'Admin Dashboard'}
              {currentView === 'trucks' && 'Manage Fleet'}
              {currentView === 'add-truck' && 'Register New Truck'}
              {currentView === 'edit-truck' && 'Edit Truck Details'}
              {currentView === 'oil-change' && 'Log Oil Change'}
            </h1>
            <p className="text-slate-500">
              {currentView === 'dashboard' && 'Monitoring oil change status for your fleet.'}
              {currentView === 'trucks' && `Viewing ${truckFilter} trucks.`}
              {currentView === 'add-truck' && 'Add a new vehicle to the maintenance system.'}
              {currentView === 'edit-truck' && 'Update vehicle registration information.'}
              {currentView === 'oil-change' && 'Update maintenance logs.'}
            </p>
          </div>
          <div className="text-sm font-medium px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm text-slate-600">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </header>

        <div className="max-w-7xl mx-auto">
          {currentView === 'dashboard' && (
            <Dashboard 
              trucks={trucks} 
              onOilChangeRequest={navigateToOilChange} 
              onNavigateToFleet={handleNavigateToFleet}
            />
          )}
          {currentView === 'trucks' && (
            <TruckList 
              trucks={trucks} 
              filter={truckFilter}
              onDelete={handleDeleteTruck} 
              onAddEntry={navigateToOilChange}
              onEdit={navigateToEdit}
            />
          )}
          {currentView === 'add-truck' && (
            <AddTruckForm onSubmit={handleAddTruck} onCancel={() => setCurrentView('trucks')} />
          )}
          {currentView === 'edit-truck' && selectedTruck && (
            <AddTruckForm 
              initialData={selectedTruck} 
              onSubmit={handleUpdateTruck} 
              onCancel={() => setCurrentView('trucks')} 
            />
          )}
          {currentView === 'oil-change' && selectedTruckId && (
            <OilChangeForm 
              truck={trucks.find(t => t.id === selectedTruckId)!}
              onSubmit={handleAddOilChange}
              onCancel={() => setCurrentView('dashboard')}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
