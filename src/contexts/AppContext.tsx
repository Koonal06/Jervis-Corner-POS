import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { dataStore, Order, InventoryItem, MenuItem, StaffMember } from '../lib/dataStore';
import { toast } from 'sonner@2.0.3';
import { initializeDataIfNeeded } from '../lib/initializeData';

interface AppContextType {
  orders: Order[];
  inventory: InventoryItem[];
  menu: MenuItem[];
  staff: StaffMember[];
  currentUser: string;
  addOrder: (order: Order) => void;
  updateOrder: (id: number, updates: Partial<Order>) => void;
  updateInventory: (id: number, updates: Partial<InventoryItem>) => void;
  refreshData: () => void;
  setCurrentUser: (user: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [currentUser, setCurrentUser] = useState<string>('Admin');

  // Load data on mount
  useEffect(() => {
    // Initialize sample data if needed
    initializeDataIfNeeded();
    
    refreshData();
    
    // Set up polling for real-time updates
    const interval = setInterval(() => {
      refreshData();
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const refreshData = () => {
    setOrders(dataStore.getOrders());
    setInventory(dataStore.getInventory());
    setMenu(dataStore.getMenu());
    setStaff(dataStore.getStaff());
  };

  const addOrder = (order: Order) => {
    dataStore.addOrder(order);
    refreshData();
    
    // Show toast notification
    toast.success(`Order ${order.orderNumber} created!`, {
      description: `Rs ${order.total} - ${order.items.length} items`,
    });
    
    // Play notification sound (optional)
    playNotificationSound();
  };

  const updateOrder = (id: number, updates: Partial<Order>) => {
    dataStore.updateOrder(id, updates);
    refreshData();
    
    // If order status changed to completed
    if (updates.status === 'completed') {
      const order = orders.find(o => o.id === id);
      if (order) {
        toast.success('Order Ready!', {
          description: `${order.orderNumber} is ready for pickup`,
        });
      }
    }
  };

  const updateInventory = (id: number, updates: Partial<InventoryItem>) => {
    dataStore.updateInventoryItem(id, updates);
    refreshData();
  };

  const playNotificationSound = () => {
    // Simple beep sound using Web Audio API
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      // Silently fail if audio not supported
    }
  };

  return (
    <AppContext.Provider
      value={{
        orders,
        inventory,
        menu,
        staff,
        currentUser,
        addOrder,
        updateOrder,
        updateInventory,
        refreshData,
        setCurrentUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}