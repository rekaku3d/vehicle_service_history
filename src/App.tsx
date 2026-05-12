/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import {
  Car,
  Bike,
  Zap,
  Fuel,
  ChevronDown,
  CheckCircle2,
  Droplets,
  Disc,
  Battery,
  ShieldCheck,
  PlusCircle,
  Wrench,
  Search,
  Filter,
  Bell,
  User,
  Info,
  LogOut,
  ChevronRight,
  RefreshCw,
  AlertTriangle,
  LayoutDashboard,
  History,
  Calendar,
  Trash2,
  Edit,
  Globe,
  Settings,
  X,
  Save,
  Calendar as CalendarIcon,
  Factory,
  DollarSign,
  Camera,
  Plus,
  Gauge,
  Moon,
  Sun
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// ─── Types ────────────────────────────────────────────────────────────

type VehicleType = 'car' | 'motorcycle';
type FuelType = 'fuel' | 'ev';

interface Vehicle {
  id: string;
  type: VehicleType;
  fuelType: FuelType;
  model: string;
  year: string;
  mileage: number;
  vin: string;
  plate: string;
  owner: string;
  nextServiceDate: string;
}

interface ServiceRecord {
  id: string;
  vehicleId: string;
  type: 'service' | 'repair';
  serviceDate?: string;
  repairDate?: string;
  nextService: string;
  description: string;
  workshopName: string;
  cost: number;
}

interface AppSettings {
  units: 'metric' | 'imperial';
  notifications: boolean;
  darkMode: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function getVehicleIcon(type: VehicleType, fuelType: FuelType) {
  if (type === 'motorcycle') return Bike;
  return fuelType === 'ev' ? Zap : Car;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

// ─── Defaults ─────────────────────────────────────────────────────────

const DEFAULT_VEHICLES: Vehicle[] = [
  {
    id: 'v1',
    type: 'car',
    fuelType: 'fuel',
    model: '2021 Toyota RAV4',
    year: '2021',
    mileage: 42500,
    vin: 'JTMA3REV2940285',
    plate: 'ABC 1234',
    owner: 'Aidan Wright',
    nextServiceDate: '2026-07-15',
  },
  {
    id: 'v2',
    type: 'motorcycle',
    fuelType: 'fuel',
    model: '2023 Honda CB500X',
    year: '2023',
    mileage: 8200,
    vin: 'MLHPC5203P5001234',
    plate: 'MTR 5678',
    owner: 'Aidan Wright',
    nextServiceDate: '2026-06-01',
  },
];

const DEFAULT_RECORDS: ServiceRecord[] = [
  {
    id: 'r1',
    vehicleId: 'v1',
    type: 'service',
    serviceDate: '2026-04-01',
    nextService: '2027-04-01',
    description: 'Synthetic oil change and filter replacement',
    workshopName: 'Toyota Service Center',
    cost: 180,
  },
  {
    id: 'r2',
    vehicleId: 'v1',
    type: 'repair',
    repairDate: '2026-03-15',
    nextService: '2027-03-15',
    description: 'Brake pad replacement on front wheels',
    workshopName: 'AutoFix Workshop',
    cost: 350,
  },
];

// ─── App ──────────────────────────────────────────────────────────────

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ServiceRecord | null>(null);
  const [vehicleDropdownOpen, setVehicleDropdownOpen] = useState(false);

  // ── Persistent State ──────────────────────────────────────────────

  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    const saved = localStorage.getItem('autolog_vehicles');
    return saved ? JSON.parse(saved) : DEFAULT_VEHICLES;
  });

  const [activeVehicleId, setActiveVehicleId] = useState<string>(() => {
    return localStorage.getItem('autolog_activeVehicleId') || vehicles[0]?.id || '';
  });

  const [records, setRecords] = useState<ServiceRecord[]>(() => {
    const saved = localStorage.getItem('autolog_records');
    return saved ? JSON.parse(saved) : DEFAULT_RECORDS;
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('autolog_settings');
    return saved ? JSON.parse(saved) : { units: 'metric', notifications: true, darkMode: false };
  });

  const [profilePic, setProfilePic] = useState<string>(() => {
    return localStorage.getItem('autolog_profilePic') || '';
  });

  // ── Derived ───────────────────────────────────────────────────────

  const activeVehicle = vehicles.find(v => v.id === activeVehicleId) || vehicles[0];
  const vehicleRecords = records.filter(r => r.vehicleId === activeVehicleId);
  const totalSpending = vehicleRecords.reduce((sum, r) => sum + (r.cost || 0), 0);

  // ── Dark Mode ─────────────────────────────────────────────────────

  useEffect(() => {
    document.documentElement.classList.toggle('dark', settings.darkMode);
  }, [settings.darkMode]);

  // ── Persistence ───────────────────────────────────────────────────

  useEffect(() => { localStorage.setItem('autolog_vehicles', JSON.stringify(vehicles)); }, [vehicles]);
  useEffect(() => { localStorage.setItem('autolog_activeVehicleId', activeVehicleId); }, [activeVehicleId]);
  useEffect(() => { localStorage.setItem('autolog_records', JSON.stringify(records)); }, [records]);
  useEffect(() => { localStorage.setItem('autolog_settings', JSON.stringify(settings)); }, [settings]);
  useEffect(() => { localStorage.setItem('autolog_profilePic', profilePic); }, [profilePic]);

  // ── Form State ────────────────────────────────────────────────────

  const [formData, setFormData] = useState({
    type: 'service' as 'service' | 'repair',
    serviceDate: '',
    repairDate: '',
    nextService: '',
    description: '',
    workshopName: '',
    cost: 0,
  });

  // ── Vehicle Form State ────────────────────────────────────────────

  const [vehicleForm, setVehicleForm] = useState<Vehicle>({
    id: '',
    type: 'car',
    fuelType: 'fuel',
    model: '',
    year: new Date().getFullYear().toString(),
    mileage: 0,
    vin: '',
    plate: '',
    owner: '',
    nextServiceDate: '',
  });

  // ── Handlers: Records ─────────────────────────────────────────────

  function handleOpenModal(record?: ServiceRecord) {
    if (record) {
      setEditingRecord(record);
      setFormData({
        type: record.type,
        serviceDate: record.serviceDate || '',
        repairDate: record.repairDate || '',
        nextService: record.nextService || '',
        description: record.description || '',
        workshopName: record.workshopName || '',
        cost: record.cost || 0,
      });
    } else {
      setEditingRecord(null);
      setFormData({
        type: 'service',
        serviceDate: '',
        repairDate: '',
        nextService: '',
        description: '',
        workshopName: '',
        cost: 0,
      });
    }
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    setEditingRecord(null);
  }

  function handleDeleteRecord(id: string) {
    setRecords(prev => prev.filter(r => r.id !== id));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editingRecord) {
      setRecords(prev => prev.map(r =>
        r.id === editingRecord.id ? { ...r, ...formData, id: r.id } : r
      ));
    } else {
      const newRecord: ServiceRecord = {
        id: generateId(),
        vehicleId: activeVehicleId,
        ...formData,
      };
      setRecords(prev => [newRecord, ...prev]);
    }
    handleCloseModal();
  }

  function handleChange(field: string, value: string | number) {
    setFormData(prev => ({ ...prev, [field]: value }));
  }

  // ── Handlers: Reschedule ──────────────────────────────────────────

  function handleReschedule() {
    setFormData({
      type: 'service',
      serviceDate: activeVehicle.nextServiceDate,
      repairDate: '',
      nextService: activeVehicle.nextServiceDate,
      description: 'Service reschedule',
      workshopName: 'To be scheduled',
      cost: 0,
    });
    setIsRescheduleModalOpen(true);
  }

  function handleRescheduleClose() {
    setIsRescheduleModalOpen(false);
  }

  function handleRescheduleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (formData.nextService) {
      setVehicles(prev => prev.map(v =>
        v.id === activeVehicleId ? { ...v, nextServiceDate: formData.nextService } : v
      ));
    }
    setIsRescheduleModalOpen(false);
  }

  // ── Handlers: Vehicles ────────────────────────────────────────────

  function handleOpenVehicleModal(vehicle?: Vehicle) {
    if (vehicle) {
      setVehicleForm({ ...vehicle });
    } else {
      setVehicleForm({
        id: '',
        type: 'car',
        fuelType: 'fuel',
        model: '',
        year: new Date().getFullYear().toString(),
        mileage: 0,
        vin: '',
        plate: '',
        owner: activeVehicle?.owner || '',
        nextServiceDate: '',
      });
    }
    setIsVehicleModalOpen(true);
  }

  function handleSaveVehicle(e: React.FormEvent) {
    e.preventDefault();
    if (vehicleForm.id) {
      setVehicles(prev => prev.map(v => v.id === vehicleForm.id ? vehicleForm : v));
    } else {
      const newVehicle: Vehicle = { ...vehicleForm, id: generateId() };
      setVehicles(prev => [...prev, newVehicle]);
      setActiveVehicleId(newVehicle.id);
    }
    setIsVehicleModalOpen(false);
  }

  function handleDeleteVehicle(id: string) {
    if (vehicles.length <= 1) {
      alert('Cannot delete the last vehicle.');
      return;
    }
    if (!confirm('Delete this vehicle and all its records?')) return;
    setVehicles(prev => prev.filter(v => v.id !== id));
    setRecords(prev => prev.filter(r => r.vehicleId !== id));
    if (activeVehicleId === id) {
      const remaining = vehicles.filter(v => v.id !== id);
      setActiveVehicleId(remaining[0]?.id || '');
    }
  }

  // ── Handlers: Profile ─────────────────────────────────────────────

  function handleProfilePicUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setProfilePic(reader.result as string);
    reader.readAsDataURL(file);
  }

  // ── Handlers: Settings ────────────────────────────────────────────

  function handleUpdateVehicle(field: string, value: any) {
    setVehicles(prev => prev.map(v =>
      v.id === activeVehicleId ? { ...v, [field]: value } : v
    ));
  }

  function handleToggleSetting(field: string) {
    setSettings(prev => ({ ...prev, [field]: !prev[field as keyof AppSettings] }));
  }

  function handleUpdateSetting(field: string, value: any) {
    setSettings(prev => ({ ...prev, [field]: value }));
  }

  function handleResetAll() {
    if (confirm('CRITICAL: This will permanently delete all vehicle data and records. Proceed?')) {
      localStorage.clear();
      window.location.reload();
    }
  }

  // ── Render ────────────────────────────────────────────────────────

  const VehicleIcon = activeVehicle ? getVehicleIcon(activeVehicle.type, activeVehicle.fuelType) : Car;

  return (
    <>
      <div className={`min-h-screen flex flex-col pb-safe pt-16 font-inter transition-colors duration-300 ${settings.darkMode ? 'dark bg-slate-900 selection:bg-blue-900/30' : 'bg-[#f7fafd] selection:bg-blue-100'}`}>
        {/* Top App Bar */}
        <header className={`fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-4 z-50 transition-colors duration-300 ${settings.darkMode ? 'bg-slate-800/95 backdrop-blur-xl border-b border-slate-700' : 'bg-white border-b border-slate-200'}`}>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-slate-900 rounded-lg text-white">
              <Car size={20} />
            </div>
            <span className={`text-xl font-extrabold font-manrope tracking-tight transition-colors duration-300 ${settings.darkMode ? 'text-white' : 'text-slate-900'}`}>
              AutoLog Pro
            </span>
          </div>
          <div className="flex items-center gap-3">
            {/* Vehicle Switcher - Click toggle */}
            <div className="relative">
              <button
                onClick={() => setVehicleDropdownOpen(prev => !prev)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold transition-colors ${settings.darkMode ? 'bg-slate-700 text-slate-200 hover:bg-slate-600' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              >
                <VehicleIcon size={14} />
                <span className="max-w-[80px] truncate">{activeVehicle?.model.split(' ').slice(-1)[0]}</span>
                <ChevronDown size={12} className={`transition-transform ${vehicleDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {vehicleDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -5 }}
                    transition={{ duration: 0.15 }}
                    className={`absolute right-0 top-full mt-2 w-64 rounded-2xl shadow-xl border overflow-hidden z-50 ${settings.darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}
                  >
                    <div className={`p-2 border-b ${settings.darkMode ? 'border-slate-700' : 'border-slate-50'}`}>
                      <p className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 ${settings.darkMode ? 'text-slate-400' : 'text-slate-400'}`}>My Vehicles</p>
                    </div>
                    {vehicles.map(v => {
                      const VIcon = getVehicleIcon(v.type, v.fuelType);
                      return (
                        <button
                          key={v.id}
                          onClick={() => { setActiveVehicleId(v.id); setVehicleDropdownOpen(false); }}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                            settings.darkMode
                              ? `hover:bg-slate-700 ${v.id === activeVehicleId ? 'bg-slate-700/50' : ''}`
                              : `hover:bg-slate-50 ${v.id === activeVehicleId ? 'bg-blue-50' : ''}`
                          }`}
                        >
                          <div className={`p-1.5 rounded-lg ${
                            v.id === activeVehicleId
                              ? settings.darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'
                              : settings.darkMode ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500'
                          }`}>
                            <VIcon size={16} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-bold truncate ${settings.darkMode ? 'text-slate-200' : 'text-slate-900'}`}>{v.model}</p>
                            <p className={`text-[10px] font-semibold uppercase ${settings.darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{v.plate} · {v.type === 'motorcycle' ? 'Moto' : v.fuelType === 'ev' ? 'EV' : 'Fuel'}</p>
                          </div>
                          {v.id === activeVehicleId && <CheckCircle2 size={14} className={settings.darkMode ? 'text-blue-400' : 'text-blue-600'} />}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => { handleOpenVehicleModal(); setVehicleDropdownOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-t font-bold text-sm ${
                        settings.darkMode ? 'hover:bg-slate-700 border-slate-700 text-blue-400' : 'hover:bg-slate-50 border-slate-50 text-blue-600'
                      }`}
                    >
                      <div className={`p-1.5 rounded-lg ${settings.darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                        <Plus size={16} />
                      </div>
                      Add Vehicle
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
              {vehicleDropdownOpen && (
                <div className="fixed inset-0 z-40" onClick={() => setVehicleDropdownOpen(false)} />
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => handleToggleSetting('darkMode')}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${settings.darkMode ? 'bg-slate-700 text-yellow-400 hover:bg-slate-600' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
            >
              {settings.darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Profile Picture */}
            <label className={`w-9 h-9 rounded-full overflow-hidden cursor-pointer transition-all block relative group/profile ${settings.darkMode ? 'bg-slate-700 border border-slate-600 hover:ring-2 hover:ring-white/20' : 'bg-slate-100 border border-slate-200 hover:ring-2 hover:ring-slate-900/10'}`}>
              {profilePic ? (
                <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className={`w-full h-full flex items-center justify-center ${settings.darkMode ? 'text-slate-400' : 'text-slate-400'}`}>
                  <User size={18} />
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/profile:opacity-100 transition-opacity rounded-full">
                <Camera size={14} className="text-white" />
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePicUpload}
                className="hidden"
              />
            </label>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 w-full max-w-4xl mx-auto px-4 pt-8 pb-20 md:pb-8 flex flex-col gap-8">
          {activeVehicle && activeTab === 'dashboard' && (
            <DashboardView
              vehicle={activeVehicle}
              records={vehicleRecords}
              totalSpending={totalSpending}
              onAddRecord={() => handleOpenModal()}
              onViewHistory={() => setActiveTab('history')}
              onUpdateMileage={(m) => handleUpdateVehicle('mileage', m)}
              onEditRecord={(r) => handleOpenModal(r)}
              onDeleteRecord={(id) => handleDeleteRecord(id)}
              darkMode={settings.darkMode}
            />
          )}
          {activeVehicle && activeTab === 'history' && (
            <HistoryView
              records={vehicleRecords}
              vehicle={activeVehicle}
              onAddRecord={() => handleOpenModal()}
              onEditRecord={(r) => handleOpenModal(r)}
              onDeleteRecord={(id) => handleDeleteRecord(id)}
              darkMode={settings.darkMode}
            />
          )}
          {activeVehicle && activeTab === 'schedule' && (
            <ScheduleView vehicle={activeVehicle} onReschedule={handleReschedule} darkMode={settings.darkMode} />
          )}
          {activeTab === 'settings' && (
            <SettingsView
              vehicle={activeVehicle}
              vehicles={vehicles}
              settings={settings}
              profilePic={profilePic}
              onUpdateVehicle={handleUpdateVehicle}
              onToggleSetting={handleToggleSetting}
              onUpdateSetting={handleUpdateSetting}
              onResetAll={handleResetAll}
              onEditVehicle={(v) => handleOpenVehicleModal(v)}
              onDeleteVehicle={handleDeleteVehicle}
              onAddVehicle={() => handleOpenVehicleModal()}
              onProfilePicUpload={handleProfilePicUpload}
              darkMode={settings.darkMode}
            />
          )}
          {!activeVehicle && (
            <div className={`flex-1 flex items-center justify-center ${settings.darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              <div className="text-center">
                <Car size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-lg font-bold mb-2">No vehicles found</p>
                <p className="text-sm mb-4">Add your first vehicle to get started</p>
                <button
                  onClick={() => handleOpenVehicleModal()}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
                >
                  Add Vehicle
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Bottom Navigation */}
      <nav className={`fixed bottom-0 left-0 right-0 backdrop-blur-xl border-t px-6 py-3 pb-8 flex items-center justify-around z-50 transition-colors duration-300 ${settings.darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white/80 border-slate-100'}`}>
        <NavButton icon={<LayoutDashboard size={24} />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} darkMode={settings.darkMode} />
        <NavButton icon={<History size={24} />} label="History" active={activeTab === 'history'} onClick={() => setActiveTab('history')} darkMode={settings.darkMode} />
        <NavButton icon={<Calendar size={24} />} label="Schedule" active={activeTab === 'schedule'} onClick={() => setActiveTab('schedule')} darkMode={settings.darkMode} />
        <NavButton icon={<Settings size={24} />} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} darkMode={settings.darkMode} />
      </nav>

      {/* Add/Edit Record Modal */}
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
          onClick={handleCloseModal}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className={`rounded-3xl shadow-xl w-full max-w-lg overflow-hidden transition-colors ${settings.darkMode ? 'bg-slate-800' : 'bg-white'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`flex justify-between items-center px-6 py-4 border-b ${settings.darkMode ? 'border-slate-700' : 'border-slate-100'}`}>
              <h2 className={`text-xl font-bold font-manrope ${settings.darkMode ? 'text-white' : 'text-slate-900'}`}>
                {editingRecord ? 'Edit Record' : 'Add Service Record'}
              </h2>
              <button onClick={handleCloseModal} className={`p-2 rounded-full transition-colors ${settings.darkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}>
                <X size={20} className={settings.darkMode ? 'text-slate-400' : 'text-slate-400'} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className={`grid grid-cols-2 gap-3 p-1.5 rounded-2xl ${settings.darkMode ? 'bg-slate-700/50' : 'bg-slate-100'}`}>
                <button type="button" onClick={() => handleChange('type', 'service')}
                  className={`py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                    formData.type === 'service'
                      ? settings.darkMode ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-white text-blue-600 shadow-md'
                      : settings.darkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700'
                  }`}>
                  <Droplets size={16} /> Service
                </button>
                <button type="button" onClick={() => handleChange('type', 'repair')}
                  className={`py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                    formData.type === 'repair'
                      ? settings.darkMode ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'bg-white text-red-600 shadow-md'
                      : settings.darkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700'
                  }`}>
                  <Wrench size={16} /> Repair
                </button>
              </div>

              {formData.type === 'service' && (
                <div className="space-y-1.5">
                  <label className={`text-sm font-semibold flex items-center gap-2 ${settings.darkMode ? 'text-slate-300' : 'text-slate-700'}`}><CalendarIcon size={16} /> Service Date</label>
                  <input type="date" value={formData.serviceDate} onChange={(e) => handleChange('serviceDate', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all font-medium ${settings.darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-200 text-slate-900'}`} />
                </div>
              )}

              {formData.type === 'repair' && (
                <div className="space-y-1.5">
                  <label className={`text-sm font-semibold flex items-center gap-2 ${settings.darkMode ? 'text-slate-300' : 'text-slate-700'}`}><CalendarIcon size={16} /> Repair Date</label>
                  <input type="date" value={formData.repairDate} onChange={(e) => handleChange('repairDate', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all font-medium ${settings.darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-200 text-slate-900'}`} />
                </div>
              )}

              <div className="space-y-1.5">
                <label className={`text-sm font-semibold flex items-center gap-2 ${settings.darkMode ? 'text-slate-300' : 'text-slate-700'}`}><CalendarIcon size={16} /> Next Service Due</label>
                <input type="date" value={formData.nextService} onChange={(e) => handleChange('nextService', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all font-medium ${settings.darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-200 text-slate-900'}`} />
              </div>

              <div className="space-y-1.5">
                <label className={`text-sm font-semibold flex items-center gap-2 ${settings.darkMode ? 'text-slate-300' : 'text-slate-700'}`}><DollarSign size={16} /> Cost</label>
                <div className="relative">
                  <span className={`absolute left-4 top-1/2 -translate-y-1/2 font-bold ${settings.darkMode ? 'text-slate-400' : 'text-slate-400'}`}>$</span>
                  <input type="number" min="0" step="0.01" value={formData.cost || ''}
                    onChange={(e) => handleChange('cost', parseFloat(e.target.value) || 0)} placeholder="0.00"
                    className={`w-full pl-8 pr-4 py-3 rounded-xl border focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all font-medium ${settings.darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-200 text-slate-900'}`} />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className={`text-sm font-semibold ${settings.darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Description</label>
                <textarea value={formData.description} onChange={(e) => handleChange('description', e.target.value)}
                  rows={3} placeholder="Enter service/repair details..."
                  className={`w-full px-4 py-3 rounded-xl border focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all font-medium resize-none ${settings.darkMode ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400' : 'border-slate-200 text-slate-900'}`} />
              </div>

              <div className="space-y-1.5">
                <label className={`text-sm font-semibold flex items-center gap-2 ${settings.darkMode ? 'text-slate-300' : 'text-slate-700'}`}><Factory size={16} /> Workshop Name</label>
                <input type="text" value={formData.workshopName} onChange={(e) => handleChange('workshopName', e.target.value)}
                  placeholder="Enter workshop name..."
                  className={`w-full px-4 py-3 rounded-xl border focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all font-medium ${settings.darkMode ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400' : 'border-slate-200 text-slate-900'}`} />
              </div>

              <button type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2">
                <Save size={20} /> Save Record
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Reschedule Modal */}
      {isRescheduleModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
          onClick={handleRescheduleClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className={`rounded-3xl shadow-xl w-full max-w-lg overflow-hidden transition-colors ${settings.darkMode ? 'bg-slate-800' : 'bg-white'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`flex justify-between items-center px-6 py-4 border-b ${settings.darkMode ? 'border-slate-700' : 'border-slate-100'}`}>
              <h2 className={`text-xl font-bold font-manrope ${settings.darkMode ? 'text-white' : 'text-slate-900'}`}>Reschedule Service</h2>
              <button onClick={handleRescheduleClose} className={`p-2 rounded-full transition-colors ${settings.darkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}>
                <X size={20} className={settings.darkMode ? 'text-slate-400' : 'text-slate-400'} />
              </button>
            </div>

            <form onSubmit={handleRescheduleSubmit} className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className={`text-sm font-semibold flex items-center gap-2 ${settings.darkMode ? 'text-slate-300' : 'text-slate-700'}`}><CalendarIcon size={16} /> Current Next Service Date</label>
                <p className={`text-sm ${settings.darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  {new Date(activeVehicle.nextServiceDate).toLocaleDateString(undefined, { dateStyle: 'long' })}
                </p>
              </div>
              <div className="space-y-1.5">
                <label className={`text-sm font-semibold flex items-center gap-2 ${settings.darkMode ? 'text-slate-300' : 'text-slate-700'}`}><CalendarIcon size={16} /> New Next Service Date</label>
                <input type="date" value={formData.nextService} onChange={(e) => handleChange('nextService', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all font-medium ${settings.darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-200 text-slate-900'}`} />
              </div>
              <button type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2">
                <Save size={20} /> Confirm Reschedule
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Add/Edit Vehicle Modal */}
      {isVehicleModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
          onClick={() => setIsVehicleModalOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className={`rounded-3xl shadow-xl w-full max-w-lg overflow-hidden transition-colors ${settings.darkMode ? 'bg-slate-800' : 'bg-white'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`flex justify-between items-center px-6 py-4 border-b ${settings.darkMode ? 'border-slate-700' : 'border-slate-100'}`}>
              <h2 className={`text-xl font-bold font-manrope ${settings.darkMode ? 'text-white' : 'text-slate-900'}`}>
                {vehicleForm.id ? 'Edit Vehicle' : 'Add Vehicle'}
              </h2>
              <button onClick={() => setIsVehicleModalOpen(false)} className={`p-2 rounded-full transition-colors ${settings.darkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}>
                <X size={20} className={settings.darkMode ? 'text-slate-400' : 'text-slate-400'} />
              </button>
            </div>

            <form onSubmit={handleSaveVehicle} className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className={`text-sm font-semibold ${settings.darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Vehicle Type</label>
                <div className={`grid grid-cols-2 gap-3 p-1 rounded-xl ${settings.darkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
                  <button type="button" onClick={() => setVehicleForm(prev => ({ ...prev, type: 'car' }))}
                    className={`py-2.5 px-4 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                      vehicleForm.type === 'car'
                        ? settings.darkMode ? 'bg-slate-600 text-blue-400 shadow-sm' : 'bg-white text-blue-600 shadow-sm'
                        : settings.darkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700'
                    }`}><Car size={16} /> Car</button>
                  <button type="button" onClick={() => setVehicleForm(prev => ({ ...prev, type: 'motorcycle' }))}
                    className={`py-2.5 px-4 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                      vehicleForm.type === 'motorcycle'
                        ? settings.darkMode ? 'bg-slate-600 text-blue-400 shadow-sm' : 'bg-white text-blue-600 shadow-sm'
                        : settings.darkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700'
                    }`}><Bike size={16} /> Motorcycle</button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className={`text-sm font-semibold ${settings.darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Fuel / Power</label>
                <div className={`grid grid-cols-2 gap-3 p-1 rounded-xl ${settings.darkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
                  <button type="button" onClick={() => setVehicleForm(prev => ({ ...prev, fuelType: 'fuel' }))}
                    className={`py-2.5 px-4 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                      vehicleForm.fuelType === 'fuel'
                        ? settings.darkMode ? 'bg-slate-600 text-blue-400 shadow-sm' : 'bg-white text-blue-600 shadow-sm'
                        : settings.darkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700'
                    }`}><Fuel size={16} /> Fuel</button>
                  <button type="button" onClick={() => setVehicleForm(prev => ({ ...prev, fuelType: 'ev' }))}
                    className={`py-2.5 px-4 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                      vehicleForm.fuelType === 'ev'
                        ? settings.darkMode ? 'bg-slate-600 text-blue-400 shadow-sm' : 'bg-white text-blue-600 shadow-sm'
                        : settings.darkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700'
                    }`}><Zap size={16} /> Electric</button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className={`text-sm font-semibold ${settings.darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Model</label>
                <input type="text" value={vehicleForm.model} onChange={(e) => setVehicleForm(prev => ({ ...prev, model: e.target.value }))}
                  placeholder="e.g. 2024 Tesla Model 3" required
                  className={`w-full px-4 py-3 rounded-xl border focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all font-medium ${settings.darkMode ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400' : 'border-slate-200 text-slate-900'}`} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className={`text-sm font-semibold ${settings.darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Year</label>
                  <input type="text" value={vehicleForm.year} onChange={(e) => setVehicleForm(prev => ({ ...prev, year: e.target.value }))}
                    placeholder="2024" required
                    className={`w-full px-4 py-3 rounded-xl border focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all font-medium ${settings.darkMode ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400' : 'border-slate-200 text-slate-900'}`} />
                </div>
                <div className="space-y-1.5">
                  <label className={`text-sm font-semibold ${settings.darkMode ? 'text-slate-300' : 'text-slate-700'}`}>License Plate</label>
                  <input type="text" value={vehicleForm.plate} onChange={(e) => setVehicleForm(prev => ({ ...prev, plate: e.target.value }))}
                    placeholder="ABC 1234"
                    className={`w-full px-4 py-3 rounded-xl border focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all font-medium ${settings.darkMode ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400' : 'border-slate-200 text-slate-900'}`} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className={`text-sm font-semibold ${settings.darkMode ? 'text-slate-300' : 'text-slate-700'}`}>VIN</label>
                  <input type="text" value={vehicleForm.vin} onChange={(e) => setVehicleForm(prev => ({ ...prev, vin: e.target.value }))}
                    placeholder="VIN number"
                    className={`w-full px-4 py-3 rounded-xl border focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all font-medium ${settings.darkMode ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400' : 'border-slate-200 text-slate-900'}`} />
                </div>
                <div className="space-y-1.5">
                  <label className={`text-sm font-semibold ${settings.darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Mileage</label>
                  <input type="number" min="0" value={vehicleForm.mileage} onChange={(e) => setVehicleForm(prev => ({ ...prev, mileage: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                    className={`w-full px-4 py-3 rounded-xl border focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all font-medium ${settings.darkMode ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400' : 'border-slate-200 text-slate-900'}`} />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className={`text-sm font-semibold ${settings.darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Owner</label>
                <input type="text" value={vehicleForm.owner} onChange={(e) => setVehicleForm(prev => ({ ...prev, owner: e.target.value }))}
                  placeholder="Owner name"
                  className={`w-full px-4 py-3 rounded-xl border focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all font-medium ${settings.darkMode ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400' : 'border-slate-200 text-slate-900'}`} />
              </div>

              <div className="space-y-1.5">
                <label className={`text-sm font-semibold flex items-center gap-2 ${settings.darkMode ? 'text-slate-300' : 'text-slate-700'}`}><CalendarIcon size={16} /> Next Service Date</label>
                <input type="date" value={vehicleForm.nextServiceDate} onChange={(e) => setVehicleForm(prev => ({ ...prev, nextServiceDate: e.target.value }))}
                  className={`w-full px-4 py-3 rounded-xl border focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all font-medium ${settings.darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-200 text-slate-900'}`} />
              </div>

              <button type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2">
                <Save size={20} /> {vehicleForm.id ? 'Save Changes' : 'Add Vehicle'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}

// ─── NavButton ────────────────────────────────────────────────────────

function NavButton({
  icon,
  label,
  active = false,
  onClick,
  darkMode = false
}: {
  icon: React.ReactNode,
  label: string,
  active?: boolean,
  onClick?: () => void,
  darkMode?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 relative px-4 py-2 rounded-2xl transition-all active:scale-95 ${
        active
          ? darkMode ? 'text-blue-400 bg-blue-500/10' : 'text-blue-600 bg-blue-50/50'
          : darkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'
      }`}
    >
      <>{icon}</>
      <span className="text-[10px] font-bold uppercase tracking-tight font-manrope">{label}</span>
      {active && (
        <motion.div
          layoutId="nav-pill"
          className={`absolute inset-0 rounded-2xl -z-10 ${darkMode ? 'bg-blue-500/10' : 'bg-blue-100/50'}`}
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
    </button>
  );
}

// ─── DashboardView ────────────────────────────────────────────────────

function DashboardView({ vehicle, records, totalSpending, onAddRecord, onViewHistory, onUpdateMileage, onEditRecord, onDeleteRecord, darkMode = false }: {
  vehicle: Vehicle,
  records: ServiceRecord[],
  totalSpending: number,
  onAddRecord: () => void,
  onViewHistory: () => void,
  onUpdateMileage: (m: number) => void,
  onEditRecord: (r: ServiceRecord) => void,
  onDeleteRecord: (id: string) => void,
  darkMode?: boolean
}) {
  const VIcon = getVehicleIcon(vehicle.type, vehicle.fuelType);
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants} className="flex flex-col gap-8">
      {/* Vehicle Hero */}
      <motion.section variants={itemVariants} className="flex flex-col">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Current Vehicle</p>
        <div className="flex justify-between items-end gap-4">
          <div className="flex-1 flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              vehicle.fuelType === 'ev'
                ? darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-50 text-green-600'
                : darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'
            }`}>
              <VIcon size={24} />
            </div>
            <div>
              <h1 className={`text-3xl font-extrabold font-manrope transition-colors ${darkMode ? 'text-white' : 'text-slate-900'}`}>{vehicle.model}</h1>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                {vehicle.plate} · {vehicle.type === 'motorcycle' ? 'Motorcycle' : vehicle.fuelType === 'ev' ? 'Electric' : 'Fuel'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input type="number" value={vehicle.mileage} onChange={(e) => onUpdateMileage(Number(e.target.value))}
              min="0"
              className={`w-32 text-xl font-bold font-manrope bg-transparent border-b-2 border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none transition-colors pb-1 text-right ${darkMode ? 'text-white' : 'text-slate-900'}`} />
            <span className="text-sm font-medium text-slate-400 uppercase">km</span>
          </div>
        </div>
      </motion.section>

      {/* Total Spending Card */}
      <motion.section variants={itemVariants}
        className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20" />
        <div className="relative z-10">
          <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-1">Total Spending</p>
          <p className="text-4xl font-black font-manrope text-white">{formatCurrency(totalSpending)}</p>
          <p className="text-sm text-white/50 mt-1">{records.length} record{records.length !== 1 ? 's' : ''}</p>
        </div>
      </motion.section>

      {/* Vehicle Health Card */}
      <motion.section variants={itemVariants}
        className={`rounded-3xl p-6 overflow-hidden relative transition-colors ${
          darkMode
            ? 'bg-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-slate-700'
            : 'bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100'
        }`}>
        <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -mr-10 -mt-10 ${darkMode ? 'bg-blue-500/10' : 'bg-blue-50/50'}`} />
        <div className="flex justify-between items-start mb-6 relative z-10">
          <div>
            <h2 className={`text-2xl font-bold font-manrope mb-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Vehicle Health</h2>
            <p className={`text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Overall status is Good</p>
          </div>
          <div className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-emerald-100">
            <CheckCircle2 size={16} fill="currentColor" className="text-emerald-500" />
            <span className="text-xs font-bold uppercase tracking-wide">Optimal</span>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 relative z-10">
          {[
            { label: 'Engine Oil', value: '45% Life', icon: <Droplets size={20} />, status: 'warning', color: 'bg-blue-50 text-blue-900' },
            { label: 'Tire Pressure', value: '34 PSI avg', icon: <Disc size={20} />, status: 'success', color: 'bg-slate-50 text-slate-900' },
            { label: 'Battery', value: '12.6V', icon: <Battery size={20} />, status: 'success', color: 'bg-slate-50 text-slate-900' },
            { label: 'Brake Pads', value: 'Good', icon: <ShieldCheck size={20} />, status: 'success', color: 'bg-slate-50 text-slate-900' },
          ].map((item, idx) => (
            <div key={idx} className={`p-4 rounded-2xl flex flex-col gap-4 transition-colors ${
              darkMode ? 'bg-slate-700/50 border border-slate-600' : 'bg-slate-50/50 border border-slate-100'
            }`}>
              <div className="flex justify-between items-start">
                <div className={`p-2 rounded-full ${item.color}`}>{item.icon}</div>
                <div className={`w-2 h-2 rounded-full ${item.status === 'success' ? 'bg-emerald-500' : 'bg-amber-400'}`} />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 mb-0.5">{item.label}</p>
                <p className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Quick Actions */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
        <button onClick={onViewHistory}
          className="bg-slate-900 text-white rounded-2xl py-5 px-4 flex items-center justify-center gap-3 shadow-lg shadow-slate-900/10 font-bold font-manrope text-lg active:scale-95 transition-transform">
          <History size={22} strokeWidth={2.5} /> View Records
        </button>
        <button onClick={onAddRecord}
          className={`rounded-2xl py-5 px-4 flex items-center justify-center gap-3 shadow-lg font-bold font-manrope text-lg active:scale-95 transition-all border-2 border-dashed ${
            darkMode
              ? 'bg-slate-800 text-white border-slate-600 hover:border-blue-500 hover:bg-blue-500/10'
              : 'bg-white text-slate-900 shadow-slate-900/5 border-slate-300 hover:border-blue-400 hover:bg-blue-50/50'
          }`}>
          <PlusCircle size={22} strokeWidth={2.5} /> Add Record
        </button>
      </motion.div>

      {/* Recent History */}
      <motion.section variants={itemVariants}>
        <div className="flex justify-between items-center mb-4 px-1">
          <h3 className={`text-xl font-bold font-manrope ${darkMode ? 'text-white' : 'text-slate-900'}`}>Recent History</h3>
          <button onClick={onViewHistory} className="text-sm font-bold text-blue-600 flex items-center gap-1">
            See all <ChevronRight size={14} />
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {records.slice(0, 3).map((record) => (
            <RecordCard key={record.id} record={record} onEdit={() => onEditRecord(record)} onDelete={() => onDeleteRecord(record.id)} darkMode={darkMode} />
          ))}
          {records.length === 0 && (
            <div className={`py-8 text-center rounded-2xl border border-dashed ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              <p className={`font-medium ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>No records yet. Add your first service record!</p>
            </div>
          )}
        </div>
      </motion.section>
    </motion.div>
  );
}

// ─── HistoryView ──────────────────────────────────────────────────────

function HistoryView({ records, vehicle, onAddRecord, onEditRecord, onDeleteRecord, darkMode = false }: {
  records: ServiceRecord[],
  vehicle: Vehicle,
  onAddRecord?: () => void,
  onEditRecord?: (r: ServiceRecord) => void,
  onDeleteRecord?: (id: string) => void,
  darkMode?: boolean
}) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'service' | 'repair'>('all');

  const filteredRecords = records.filter(r => {
    const matchesSearch = r.description.toLowerCase().includes(search.toLowerCase()) ||
                         r.workshopName?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || r.type === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
      <header className="flex justify-between items-start gap-4">
        <div>
          <h2 className={`text-3xl font-extrabold font-manrope mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Service History</h2>
          <p className={`font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{vehicle.model} · Keep track of every maintenance milestone</p>
        </div>
        <button
          onClick={onAddRecord}
          className="flex-shrink-0 w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/20 active:scale-90 transition-transform"
          title="Add Record"
        >
          <Plus size={24} strokeWidth={3} />
        </button>
      </header>

      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Search records..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full pl-11 pr-4 py-3 rounded-2xl focus:border-blue-500 focus:ring-4 outline-none transition-all font-medium ${
                darkMode
                  ? 'bg-slate-800 border border-slate-700 text-white focus:ring-blue-500/20 placeholder:text-slate-500'
                  : 'bg-white border border-slate-200 focus:ring-blue-50/50'
              }`} />
          </div>
          <button className={`p-3 rounded-2xl transition-colors ${darkMode ? 'bg-slate-800 border border-slate-700 text-slate-400 hover:bg-slate-700' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
            <Filter size={20} />
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {['all', 'service', 'repair'].map((f) => (
            <button key={f} onClick={() => setFilter(f as any)}
              className={`px-5 py-2 rounded-full text-sm font-bold capitalize transition-all whitespace-nowrap ${
                filter === f
                  ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20'
                  : darkMode
                    ? 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-600'
                    : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-300'
              }`}>{f}</button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {filteredRecords.length > 0 ? (
          filteredRecords.map(record => (
            <RecordCard key={record.id} record={record} onEdit={() => onEditRecord?.(record)} onDelete={() => onDeleteRecord?.(record.id)} darkMode={darkMode} />
          ))
        ) : (
          <div className="py-12 text-center">
            <p className={`font-medium ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>No records found matching your criteria</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── ScheduleView ─────────────────────────────────────────────────────

function ScheduleView({ vehicle, onReschedule, darkMode = false }: { vehicle: Vehicle, onReschedule: () => void, darkMode?: boolean }) {
  const daysLeft = Math.ceil((new Date(vehicle.nextServiceDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const isOverdue = daysLeft < 0;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-8">
      <header>
        <h2 className={`text-3xl font-extrabold font-manrope mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Maintenance Schedule</h2>
        <p className={`font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{vehicle.model} · Plan your next visit to the workshop</p>
      </header>

      <div className={`bg-gradient-to-br ${isOverdue ? 'from-red-600 to-rose-700' : 'from-blue-600 to-indigo-700'} rounded-[32px] p-8 text-white shadow-xl ${isOverdue ? 'shadow-red-500/20' : 'shadow-blue-500/20'} relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4 text-white/80">
            <RefreshCw size={18} className={isOverdue ? 'animate-spin-slow' : ''} />
            <span className="text-xs font-bold uppercase tracking-wider">{isOverdue ? 'Service Overdue' : 'Next Service Due'}</span>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-5xl font-black font-manrope">{Math.abs(daysLeft)}</span>
            <span className="text-xl font-bold opacity-80">{daysLeft === 1 ? 'Day' : 'Days'} {isOverdue ? 'Ago' : 'Left'}</span>
          </div>
          <p className="text-white/80 font-medium text-sm">Target Date: {new Date(vehicle.nextServiceDate).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>

          <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-white/60 mb-1">Target Mileage</p>
              <p className="text-lg font-bold">{(Math.floor(vehicle.mileage / 10000) + 1) * 10000} km</p>
            </div>
            <button onClick={onReschedule}
              className="bg-white text-slate-900 px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg hover:bg-slate-50 transition-colors">
              Reschedule
            </button>
          </div>
        </div>
      </div>

      <section>
        <h3 className={`text-xl font-bold font-manrope mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Maintenance Roadmap</h3>
        <div className="flex flex-col gap-4">
          {[
            { label: 'Oil & Filter Change', dist: 10000 - (vehicle.mileage % 10000), icon: <Droplets size={20} />, type: 'Routine' },
            { label: 'Tire Rotation', dist: 5000 - (vehicle.mileage % 5000), icon: <Disc size={20} />, type: 'Maintenance' },
            { label: 'Annual Inspection', dist: 12, icon: <ShieldCheck size={20} />, type: 'Routine', isMonths: true },
          ].map((item, idx) => (
            <div key={idx} className={`p-5 rounded-2xl flex items-center justify-between shadow-sm transition-colors ${
              darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-100'
            }`}>
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-50 text-slate-600'}`}>{item.icon}</div>
                <div>
                  <p className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{item.label}</p>
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-wide">{item.type}</p>
                </div>
              </div>
              <p className={`text-sm font-bold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {item.isMonths ? `Every ${item.dist} Months` : `In ${item.dist} km`}
              </p>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}

// ─── SettingsView ─────────────────────────────────────────────────────

function SettingsView({ vehicle, vehicles, settings, profilePic, onUpdateVehicle, onToggleSetting, onUpdateSetting, onResetAll, onEditVehicle, onDeleteVehicle, onAddVehicle, onProfilePicUpload, darkMode = false }: {
  vehicle: Vehicle,
  vehicles: Vehicle[],
  settings: AppSettings,
  profilePic: string,
  onUpdateVehicle: (field: string, value: any) => void,
  onToggleSetting: (field: string) => void,
  onUpdateSetting: (field: string, value: any) => void,
  onResetAll: () => void,
  onEditVehicle: (v: Vehicle) => void,
  onDeleteVehicle: (id: string) => void,
  onAddVehicle: () => void,
  onProfilePicUpload: (e: React.ChangeEvent<HTMLInputElement>) => void,
  darkMode?: boolean
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-8">
      <header>
        <h2 className={`text-3xl font-extrabold font-manrope mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Settings</h2>
        <p className={`font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Manage your profile, vehicles, and app preferences</p>
      </header>

      {/* Profile Section */}
      <section className={`rounded-3xl p-6 shadow-sm transition-colors ${darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-100'}`}>
        <h3 className={`text-sm font-bold uppercase tracking-widest mb-4 ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>Profile</h3>
        <div className="flex items-center gap-4">
          <label className={`w-16 h-16 rounded-full overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all relative group/profile block flex-shrink-0 ${darkMode ? 'bg-slate-700 border border-slate-600' : 'bg-slate-100 border border-slate-200'}`}>
            {profilePic ? (
              <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400"><User size={28} /></div>
            )}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/profile:opacity-100 transition-opacity rounded-full">
              <Camera size={16} className="text-white" />
            </div>
            <input type="file" accept="image/*" onChange={onProfilePicUpload} className="hidden" />
          </label>
          <div>
            <p className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{vehicle.owner}</p>
            <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
      </section>

      {/* Vehicle Profile */}
      <section className={`rounded-3xl p-6 shadow-sm transition-colors ${darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-100'}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-sm font-bold uppercase tracking-widest ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>Current Vehicle</h3>
          <div className="flex gap-2">
            <button onClick={() => onEditVehicle(vehicle)}
              className="text-xs font-bold text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors">Edit</button>
            <button onClick={() => onDeleteVehicle(vehicle.id)}
              className="text-xs font-bold text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">Delete</button>
          </div>
        </div>
        <div className={`flex items-center gap-4 mb-6 pb-6 border-b ${darkMode ? 'border-slate-700' : 'border-slate-50'}`}>
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
            <Car size={32} />
          </div>
          <div className="flex-1">
            <input type="text" value={vehicle.model} onChange={(e) => onUpdateVehicle('model', e.target.value)}
              className={`text-xl font-bold font-manrope bg-transparent border-b border-transparent hover:border-slate-200 focus:border-blue-500 outline-none w-full ${darkMode ? 'text-white' : 'text-slate-900'}`} />
            <p className={`text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{vehicle.year} · {vehicle.type === 'motorcycle' ? 'Motorcycle' : vehicle.fuelType === 'ev' ? 'Electric' : 'Fuel'}</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center py-1">
            <div className={`flex items-center gap-3 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}><Info size={18} /><span className="font-medium">VIN</span></div>
            <input type="text" value={vehicle.vin} onChange={(e) => onUpdateVehicle('vin', e.target.value)}
              className={`font-bold font-mono text-sm bg-transparent border-b border-transparent hover:border-slate-200 focus:border-blue-500 outline-none text-right ${darkMode ? 'text-white' : 'text-slate-900'}`} />
          </div>
          <div className="flex justify-between items-center py-1">
            <div className={`flex items-center gap-3 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}><User size={18} /><span className="font-medium">Owner</span></div>
            <input type="text" value={vehicle.owner} onChange={(e) => onUpdateVehicle('owner', e.target.value)}
              className={`font-bold bg-transparent border-b border-transparent hover:border-slate-200 focus:border-blue-500 outline-none text-right ${darkMode ? 'text-white' : 'text-slate-900'}`} />
          </div>
          <div className="flex justify-between items-center py-1">
            <div className={`flex items-center gap-3 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}><CalendarIcon size={18} /><span className="font-medium">Next Service</span></div>
            <input type="date" value={vehicle.nextServiceDate} onChange={(e) => onUpdateVehicle('nextServiceDate', e.target.value)}
              className={`font-bold bg-transparent border-b border-transparent hover:border-slate-200 focus:border-blue-500 outline-none text-right ${darkMode ? 'text-white' : 'text-slate-900'}`} />
          </div>
        </div>
      </section>

      {/* All Vehicles */}
      <section className="flex flex-col gap-3">
        <h3 className={`text-sm font-bold uppercase tracking-widest px-1 ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>All Vehicles</h3>
        <div className={`rounded-3xl overflow-hidden shadow-sm transition-colors ${darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-100'}`}>
          {vehicles.map((v, idx) => {
            const VIcon = getVehicleIcon(v.type, v.fuelType);
            return (
              <div key={v.id} className={`p-4 flex items-center justify-between ${idx < vehicles.length - 1 ? `border-b ${darkMode ? 'border-slate-700' : 'border-slate-50'}` : ''}`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-50 text-slate-600'}`}><VIcon size={18} /></div>
                  <div>
                    <p className={`font-bold ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>{v.model}</p>
                    <p className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{v.plate} · {v.type === 'motorcycle' ? 'Moto' : v.fuelType === 'ev' ? 'EV' : 'Fuel'}</p>
                  </div>
                </div>
                <button onClick={() => onEditVehicle(v)}
                  className={`p-2 rounded-lg transition-all ${darkMode ? 'text-slate-500 hover:text-blue-400 hover:bg-blue-500/10' : 'text-slate-300 hover:text-blue-600 hover:bg-blue-50'}`}>
                  <Edit size={16} />
                </button>
              </div>
            );
          })}
          <button onClick={onAddVehicle}
            className={`w-full p-4 flex items-center justify-center gap-2 text-blue-600 font-bold text-sm transition-colors border-t ${darkMode ? 'hover:bg-blue-500/10 border-slate-700' : 'hover:bg-blue-50 border-slate-50'}`}>
            <Plus size={16} /> Add Vehicle
          </button>
        </div>
      </section>

      {/* App Settings */}
      <section className="flex flex-col gap-3">
        <h3 className={`text-sm font-bold uppercase tracking-widest px-1 ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>Preferences</h3>
        <div className={`rounded-3xl overflow-hidden shadow-sm transition-colors ${darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-100'}`}>
          <div onClick={() => onToggleSetting('notifications')}
            className={`p-4 flex items-center justify-between transition-colors cursor-pointer border-b ${darkMode ? 'hover:bg-slate-700 border-slate-700' : 'hover:bg-slate-50 border-slate-50'}`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-600'}`}><Bell size={18} /></div>
              <span className={`font-bold ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>Notifications</span>
            </div>
            <div className={`w-12 h-7 rounded-full relative transition-colors ${settings.notifications ? 'bg-blue-600' : darkMode ? 'bg-slate-600' : 'bg-slate-200'}`}>
              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-all ${settings.notifications ? 'right-1' : 'left-1'}`} />
            </div>
          </div>
          <div onClick={() => onToggleSetting('darkMode')}
            className={`p-4 flex items-center justify-between transition-colors cursor-pointer border-b ${darkMode ? 'hover:bg-slate-700 border-slate-700' : 'hover:bg-slate-50 border-slate-50'}`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${darkMode ? 'bg-yellow-500/20 text-yellow-400' : 'bg-slate-50 text-slate-600'}`}>{darkMode ? <Sun size={18} /> : <Moon size={18} />}</div>
              <span className={`font-bold ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>Dark Mode</span>
            </div>
            <div className={`w-12 h-7 rounded-full relative transition-colors ${settings.darkMode ? 'bg-blue-600' : darkMode ? 'bg-slate-600' : 'bg-slate-200'}`}>
              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-all ${settings.darkMode ? 'right-1' : 'left-1'}`} />
            </div>
          </div>
          <div onClick={() => onUpdateSetting('units', settings.units === 'metric' ? 'imperial' : 'metric')}
            className={`p-4 flex items-center justify-between transition-colors cursor-pointer border-b ${darkMode ? 'hover:bg-slate-700 border-slate-700' : 'hover:bg-slate-50 border-slate-50'}`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-50 text-slate-600'}`}><Globe size={18} /></div>
              <span className={`font-bold ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>Units</span>
            </div>
            <span className={`text-sm font-bold uppercase ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{settings.units}</span>
          </div>
          <div onClick={onResetAll}
            className={`p-4 flex items-center justify-between transition-colors cursor-pointer group ${darkMode ? 'hover:bg-red-500/10' : 'hover:bg-red-50'}`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${darkMode ? 'bg-red-500/20 text-red-400 group-hover:bg-red-500/30' : 'bg-red-50 text-red-600 group-hover:bg-red-100'}`}><LogOut size={18} /></div>
              <span className="font-bold text-red-600">Reset All Data</span>
            </div>
          </div>
        </div>
      </section>

      <div className="text-center py-4">
        <p className={`text-xs font-bold uppercase tracking-widest ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>AutoLog Pro v2.0.0</p>
      </div>
    </motion.div>
  );
}

// ─── RecordCard ───────────────────────────────────────────────────────

function RecordCard({ record, onEdit, onDelete, darkMode = false }: {
  record: ServiceRecord,
  onEdit?: () => void,
  onDelete?: () => void,
  darkMode?: boolean
}) {
  return (
    <motion.div whileHover={{ y: -2 }}
      className={`rounded-2xl p-5 shadow-sm flex items-center justify-between group transition-all ${
        record.type === 'service' ? 'border-l-[6px] border-l-blue-500' : 'border-l-[6px] border-l-red-500'
      } ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
      <div className="flex items-center gap-4 flex-1">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
          record.type === 'service'
            ? darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-600'
            : darkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-50 text-red-600'
        }`}>
          {record.type === 'service' ? <Droplets size={24} /> : <Wrench size={24} />}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`font-bold ${record.type === 'service' ? (darkMode ? 'text-white' : 'text-slate-900') : (darkMode ? 'text-red-400' : 'text-red-900')}`}>
            {record.description || (record.type === 'service' ? 'Service Record' : 'Repair Record')}
          </p>
          <div className="flex flex-wrap items-center gap-2 text-sm mt-1">
            {record.serviceDate && (
              <span className={`flex items-center gap-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}><CalendarIcon size={14} /> {new Date(record.serviceDate).toLocaleDateString()}</span>
            )}
            {record.repairDate && (
              <span className="text-red-500 flex items-center gap-1"><CalendarIcon size={14} /> {new Date(record.repairDate).toLocaleDateString()}</span>
            )}
            {record.workshopName && (
              <span className={`flex items-center gap-1 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}><Factory size={14} /> {record.workshopName}</span>
            )}
            {record.cost > 0 && (
              <span className="text-emerald-600 flex items-center gap-1 font-bold"><DollarSign size={14} /> {formatCurrency(record.cost)}</span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <button onClick={(e) => { e.stopPropagation(); onEdit?.(); }}
          className={`p-2 rounded-lg transition-all ${darkMode ? 'text-slate-500 hover:text-blue-400 hover:bg-blue-500/10' : 'text-slate-300 hover:text-blue-600 hover:bg-blue-50'}`}>
          <Edit size={18} />
        </button>
        <button onClick={(e) => { e.stopPropagation(); onDelete?.(); }}
          className={`p-2 rounded-lg transition-all ${darkMode ? 'text-slate-500 hover:text-red-400 hover:bg-red-500/10' : 'text-slate-300 hover:text-red-600 hover:bg-red-50'}`}>
          <Trash2 size={18} />
        </button>
      </div>
    </motion.div>
  );
}
