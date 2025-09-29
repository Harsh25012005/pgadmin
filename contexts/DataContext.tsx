import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  roomNumber: string;
  joinDate: string;
  status: 'active' | 'inactive';
  address: string;
  emergencyContact: string;
  deposit: number;
}

export interface Payment {
  id: string;
  tenantId: string;
  tenantName: string;
  amount: number;
  type: 'rent' | 'deposit' | 'maintenance' | 'other';
  status: 'paid' | 'pending' | 'overdue';
  dueDate: string;
  paidDate?: string;
  description: string;
}

export interface Room {
  id: string;
  number: string;
  type: 'single' | 'double' | 'triple';
  rent: number;
  status: 'occupied' | 'vacant' | 'maintenance';
  tenantId?: string;
  facilities: string[];
  floor: number;
}

export interface Complaint {
  id: string;
  tenantId: string;
  tenantName: string;
  title: string;
  description: string;
  category: 'maintenance' | 'noise' | 'cleanliness' | 'security' | 'other';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdDate: string;
  resolvedDate?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'general' | 'maintenance' | 'event' | 'rule' | 'emergency';
  priority: 'low' | 'medium' | 'high';
  createdDate: string;
  expiryDate?: string;
  isActive: boolean;
}

interface DataContextType {
  tenants: Tenant[];
  payments: Payment[];
  rooms: Room[];
  complaints: Complaint[];
  announcements: Announcement[];
  
  // Tenant methods
  addTenant: (tenant: Omit<Tenant, 'id'>) => void;
  updateTenant: (id: string, tenant: Partial<Tenant>) => void;
  deleteTenant: (id: string) => void;
  getTenant: (id: string) => Tenant | undefined;
  
  // Payment methods
  addPayment: (payment: Omit<Payment, 'id'>) => void;
  updatePayment: (id: string, payment: Partial<Payment>) => void;
  deletePayment: (id: string) => void;
  getPayment: (id: string) => Payment | undefined;
  
  // Room methods
  addRoom: (room: Omit<Room, 'id'>) => void;
  updateRoom: (id: string, room: Partial<Room>) => void;
  deleteRoom: (id: string) => void;
  getRoom: (id: string) => Room | undefined;
  
  // Complaint methods
  addComplaint: (complaint: Omit<Complaint, 'id'>) => void;
  updateComplaint: (id: string, complaint: Partial<Complaint>) => void;
  deleteComplaint: (id: string) => void;
  getComplaint: (id: string) => Complaint | undefined;
  
  // Announcement methods
  addAnnouncement: (announcement: Omit<Announcement, 'id'>) => void;
  updateAnnouncement: (id: string, announcement: Partial<Announcement>) => void;
  deleteAnnouncement: (id: string) => void;
  getAnnouncement: (id: string) => Announcement | undefined;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [tenantsData, paymentsData, roomsData, complaintsData, announcementsData] = await Promise.all([
        AsyncStorage.getItem('tenants'),
        AsyncStorage.getItem('payments'),
        AsyncStorage.getItem('rooms'),
        AsyncStorage.getItem('complaints'),
        AsyncStorage.getItem('announcements'),
      ]);

      if (tenantsData) {
        setTenants(JSON.parse(tenantsData));
      } else {
        // Initialize with sample data if no data exists
        const { initializeSampleData } = await import('../utils/sampleData');
        const sampleData = initializeSampleData();
        setTenants(sampleData.tenants);
        setPayments(sampleData.payments);
        setRooms(sampleData.rooms);
        setComplaints(sampleData.complaints);
        setAnnouncements(sampleData.announcements);
        
        // Save sample data
        await Promise.all([
          AsyncStorage.setItem('tenants', JSON.stringify(sampleData.tenants)),
          AsyncStorage.setItem('payments', JSON.stringify(sampleData.payments)),
          AsyncStorage.setItem('rooms', JSON.stringify(sampleData.rooms)),
          AsyncStorage.setItem('complaints', JSON.stringify(sampleData.complaints)),
          AsyncStorage.setItem('announcements', JSON.stringify(sampleData.announcements)),
        ]);
        return;
      }

      if (paymentsData) setPayments(JSON.parse(paymentsData));
      if (roomsData) setRooms(JSON.parse(roomsData));
      if (complaintsData) setComplaints(JSON.parse(complaintsData));
      if (announcementsData) setAnnouncements(JSON.parse(announcementsData));
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const saveData = async (key: string, data: any) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
    }
  };

  // Tenant methods
  const addTenant = (tenant: Omit<Tenant, 'id'>) => {
    const newTenant = { ...tenant, id: Date.now().toString() };
    const updatedTenants = [...tenants, newTenant];
    setTenants(updatedTenants);
    saveData('tenants', updatedTenants);
  };

  const updateTenant = (id: string, tenant: Partial<Tenant>) => {
    const updatedTenants = tenants.map(t => t.id === id ? { ...t, ...tenant } : t);
    setTenants(updatedTenants);
    saveData('tenants', updatedTenants);
  };

  const deleteTenant = (id: string) => {
    const updatedTenants = tenants.filter(t => t.id !== id);
    setTenants(updatedTenants);
    saveData('tenants', updatedTenants);
  };

  const getTenant = (id: string) => tenants.find(t => t.id === id);

  // Payment methods
  const addPayment = (payment: Omit<Payment, 'id'>) => {
    const newPayment = { ...payment, id: Date.now().toString() };
    const updatedPayments = [...payments, newPayment];
    setPayments(updatedPayments);
    saveData('payments', updatedPayments);
  };

  const updatePayment = (id: string, payment: Partial<Payment>) => {
    const updatedPayments = payments.map(p => p.id === id ? { ...p, ...payment } : p);
    setPayments(updatedPayments);
    saveData('payments', updatedPayments);
  };

  const deletePayment = (id: string) => {
    const updatedPayments = payments.filter(p => p.id !== id);
    setPayments(updatedPayments);
    saveData('payments', updatedPayments);
  };

  const getPayment = (id: string) => payments.find(p => p.id === id);

  // Room methods
  const addRoom = (room: Omit<Room, 'id'>) => {
    const newRoom = { ...room, id: Date.now().toString() };
    const updatedRooms = [...rooms, newRoom];
    setRooms(updatedRooms);
    saveData('rooms', updatedRooms);
  };

  const updateRoom = (id: string, room: Partial<Room>) => {
    const updatedRooms = rooms.map(r => r.id === id ? { ...r, ...room } : r);
    setRooms(updatedRooms);
    saveData('rooms', updatedRooms);
  };

  const deleteRoom = (id: string) => {
    const updatedRooms = rooms.filter(r => r.id !== id);
    setRooms(updatedRooms);
    saveData('rooms', updatedRooms);
  };

  const getRoom = (id: string) => rooms.find(r => r.id === id);

  // Complaint methods
  const addComplaint = (complaint: Omit<Complaint, 'id'>) => {
    const newComplaint = { ...complaint, id: Date.now().toString() };
    const updatedComplaints = [...complaints, newComplaint];
    setComplaints(updatedComplaints);
    saveData('complaints', updatedComplaints);
  };

  const updateComplaint = (id: string, complaint: Partial<Complaint>) => {
    const updatedComplaints = complaints.map(c => c.id === id ? { ...c, ...complaint } : c);
    setComplaints(updatedComplaints);
    saveData('complaints', updatedComplaints);
  };

  const deleteComplaint = (id: string) => {
    const updatedComplaints = complaints.filter(c => c.id !== id);
    setComplaints(updatedComplaints);
    saveData('complaints', updatedComplaints);
  };

  const getComplaint = (id: string) => complaints.find(c => c.id === id);

  // Announcement methods
  const addAnnouncement = (announcement: Omit<Announcement, 'id'>) => {
    const newAnnouncement = { ...announcement, id: Date.now().toString() };
    const updatedAnnouncements = [...announcements, newAnnouncement];
    setAnnouncements(updatedAnnouncements);
    saveData('announcements', updatedAnnouncements);
  };

  const updateAnnouncement = (id: string, announcement: Partial<Announcement>) => {
    const updatedAnnouncements = announcements.map(a => a.id === id ? { ...a, ...announcement } : a);
    setAnnouncements(updatedAnnouncements);
    saveData('announcements', updatedAnnouncements);
  };

  const deleteAnnouncement = (id: string) => {
    const updatedAnnouncements = announcements.filter(a => a.id !== id);
    setAnnouncements(updatedAnnouncements);
    saveData('announcements', updatedAnnouncements);
  };

  const getAnnouncement = (id: string) => announcements.find(a => a.id === id);

  return (
    <DataContext.Provider value={{
      tenants, payments, rooms, complaints, announcements,
      addTenant, updateTenant, deleteTenant, getTenant,
      addPayment, updatePayment, deletePayment, getPayment,
      addRoom, updateRoom, deleteRoom, getRoom,
      addComplaint, updateComplaint, deleteComplaint, getComplaint,
      addAnnouncement, updateAnnouncement, deleteAnnouncement, getAnnouncement,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
