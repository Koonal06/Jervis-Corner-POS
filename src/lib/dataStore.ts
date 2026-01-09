// Centralized data store with localStorage persistence for the restaurant MIS

export interface Order {
  id: number;
  orderNumber: string;
  items: OrderItem[];
  status: "new" | "preparing" | "completed" | "served";
  timestamp: Date;
  table?: string;
  cashier?: string;
  paymentMethod?: "cash" | "card" | "mobile";
  total: number;
  discount: number;
  prepStartTime?: Date;
  prepEndTime?: Date;
  customerName?: string;
}

export interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  category: string;
}

export interface InventoryItem {
  id: number;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minLevel: number;
  supplier: string;
  supplierContact?: string;
  lastRestocked?: Date;
  usagePerDay?: number;
  predictedRunOut?: Date;
  cost: number;
}

export interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  available: boolean;
  ingredients: { name: string; quantity: number }[];
  preparationTime: number; // minutes
  cost: number;
  soldToday?: number;
  soldThisWeek?: number;
}

export interface StaffMember {
  id: number;
  name: string;
  role: string;
  email: string;
  phone: string;
  hourlyRate: number;
  status: "active" | "inactive";
  totalSales?: number;
  ordersCompleted?: number;
  avgPrepTime?: number;
  attendance?: AttendanceRecord[];
}

export interface AttendanceRecord {
  date: Date;
  clockIn?: Date;
  clockOut?: Date;
  status: "present" | "absent" | "late";
}

export interface Expense {
  id: number;
  category: string;
  description: string;
  amount: number;
  date: Date;
  paymentMethod: string;
}

export interface ActivityLog {
  id: number;
  timestamp: Date;
  user: string;
  action: string;
  details: string;
}

export interface SalesData {
  date: Date;
  hourlyBreakdown: { hour: number; sales: number; orders: number }[];
  totalSales: number;
  totalOrders: number;
  topItems: { name: string; quantity: number; revenue: number }[];
}

// Storage keys
const STORAGE_KEYS = {
  ORDERS: 'jervis_orders',
  INVENTORY: 'jervis_inventory',
  MENU: 'jervis_menu',
  STAFF: 'jervis_staff',
  EXPENSES: 'jervis_expenses',
  LOGS: 'jervis_logs',
  SALES: 'jervis_sales',
  SETTINGS: 'jervis_settings',
};

// Helper functions for localStorage
function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    const parsed = JSON.parse(item);
    // Convert date strings back to Date objects
    return JSON.parse(item, (key, value) => {
      if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
        return new Date(value);
      }
      return value;
    });
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

// Data Store Class
class DataStore {
  // Orders
  getOrders(): Order[] {
    return getFromStorage<Order[]>(STORAGE_KEYS.ORDERS, []);
  }

  saveOrders(orders: Order[]): void {
    saveToStorage(STORAGE_KEYS.ORDERS, orders);
  }

  addOrder(order: Order): void {
    const orders = this.getOrders();
    orders.push(order);
    this.saveOrders(orders);
    this.logActivity('System', 'Order Created', `Order ${order.orderNumber} - Rs ${order.total}`);
  }

  updateOrder(id: number, updates: Partial<Order>): void {
    const orders = this.getOrders();
    const index = orders.findIndex(o => o.id === id);
    if (index !== -1) {
      orders[index] = { ...orders[index], ...updates };
      this.saveOrders(orders);
    }
  }

  // Inventory
  getInventory(): InventoryItem[] {
    return getFromStorage<InventoryItem[]>(STORAGE_KEYS.INVENTORY, []);
  }

  saveInventory(inventory: InventoryItem[]): void {
    saveToStorage(STORAGE_KEYS.INVENTORY, inventory);
  }

  updateInventoryItem(id: number, updates: Partial<InventoryItem>): void {
    const inventory = this.getInventory();
    const index = inventory.findIndex(i => i.id === id);
    if (index !== -1) {
      inventory[index] = { ...inventory[index], ...updates };
      this.saveInventory(inventory);
    }
  }

  // Menu
  getMenu(): MenuItem[] {
    return getFromStorage<MenuItem[]>(STORAGE_KEYS.MENU, []);
  }

  saveMenu(menu: MenuItem[]): void {
    saveToStorage(STORAGE_KEYS.MENU, menu);
  }

  // Staff
  getStaff(): StaffMember[] {
    return getFromStorage<StaffMember[]>(STORAGE_KEYS.STAFF, []);
  }

  saveStaff(staff: StaffMember[]): void {
    saveToStorage(STORAGE_KEYS.STAFF, staff);
  }

  // Expenses
  getExpenses(): Expense[] {
    return getFromStorage<Expense[]>(STORAGE_KEYS.EXPENSES, []);
  }

  saveExpenses(expenses: Expense[]): void {
    saveToStorage(STORAGE_KEYS.EXPENSES, expenses);
  }

  addExpense(expense: Expense): void {
    const expenses = this.getExpenses();
    expenses.push(expense);
    this.saveExpenses(expenses);
    this.logActivity('System', 'Expense Added', `${expense.category} - Rs ${expense.amount}`);
  }

  // Activity Logs
  getLogs(): ActivityLog[] {
    return getFromStorage<ActivityLog[]>(STORAGE_KEYS.LOGS, []);
  }

  saveLogs(logs: ActivityLog[]): void {
    saveToStorage(STORAGE_KEYS.LOGS, logs);
  }

  logActivity(user: string, action: string, details: string): void {
    const logs = this.getLogs();
    const newLog: ActivityLog = {
      id: Date.now(),
      timestamp: new Date(),
      user,
      action,
      details,
    };
    logs.push(newLog);
    // Keep only last 1000 logs
    if (logs.length > 1000) {
      logs.shift();
    }
    this.saveLogs(logs);
  }

  // Sales Data
  getSalesData(): SalesData[] {
    return getFromStorage<SalesData[]>(STORAGE_KEYS.SALES, []);
  }

  saveSalesData(sales: SalesData[]): void {
    saveToStorage(STORAGE_KEYS.SALES, sales);
  }

  // Analytics helpers
  getTodaysSales(): number {
    const orders = this.getOrders();
    const today = new Date().toDateString();
    return orders
      .filter(o => new Date(o.timestamp).toDateString() === today && o.status === 'completed')
      .reduce((sum, o) => sum + o.total, 0);
  }

  getTodaysOrders(): Order[] {
    const orders = this.getOrders();
    const today = new Date().toDateString();
    return orders.filter(o => new Date(o.timestamp).toDateString() === today);
  }

  getYesterdaysSales(): number {
    const orders = this.getOrders();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();
    return orders
      .filter(o => new Date(o.timestamp).toDateString() === yesterdayStr && o.status === 'completed')
      .reduce((sum, o) => sum + o.total, 0);
  }

  getLast7DaysSales(): { day: string; sales: number; orders: number }[] {
    const orders = this.getOrders();
    const result = [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toDateString();
      const dayOrders = orders.filter(o => new Date(o.timestamp).toDateString() === dateStr && o.status === 'completed');
      const sales = dayOrders.reduce((sum, o) => sum + o.total, 0);
      
      result.push({
        day: days[date.getDay()],
        sales,
        orders: dayOrders.length,
      });
    }
    
    return result;
  }

  getPeakHours(): { hour: number; orders: number }[] {
    const todaysOrders = this.getTodaysOrders();
    const hourlyData: { [key: number]: number } = {};
    
    todaysOrders.forEach(order => {
      const hour = new Date(order.timestamp).getHours();
      hourlyData[hour] = (hourlyData[hour] || 0) + 1;
    });
    
    return Object.entries(hourlyData).map(([hour, orders]) => ({
      hour: parseInt(hour),
      orders,
    })).sort((a, b) => b.orders - a.orders);
  }

  getTopSellingItems(limit: number = 5): { name: string; quantity: number; revenue: number }[] {
    const todaysOrders = this.getTodaysOrders();
    const itemStats: { [key: string]: { quantity: number; revenue: number } } = {};
    
    todaysOrders.forEach(order => {
      order.items.forEach(item => {
        if (!itemStats[item.name]) {
          itemStats[item.name] = { quantity: 0, revenue: 0 };
        }
        itemStats[item.name].quantity += item.quantity;
        itemStats[item.name].revenue += item.price * item.quantity;
      });
    });
    
    return Object.entries(itemStats)
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, limit);
  }

  getLowStockItems(): InventoryItem[] {
    const inventory = this.getInventory();
    return inventory.filter(item => item.quantity < item.minLevel);
  }

  // Predictive inventory
  calculateInventoryPredictions(): void {
    const inventory = this.getInventory();
    const menu = this.getMenu();
    const last7DaysOrders = this.getLast7DaysSales();
    
    inventory.forEach(item => {
      // Calculate average daily usage based on menu items sold
      let totalUsage = 0;
      menu.forEach(menuItem => {
        const ingredient = menuItem.ingredients.find(i => i.name === item.name);
        if (ingredient) {
          const itemsSoldPerDay = (menuItem.soldToday || 0);
          totalUsage += ingredient.quantity * itemsSoldPerDay;
        }
      });
      
      const usagePerDay = totalUsage / 7;
      const daysUntilRunOut = usagePerDay > 0 ? item.quantity / usagePerDay : 999;
      const predictedRunOut = new Date();
      predictedRunOut.setDate(predictedRunOut.getDate() + daysUntilRunOut);
      
      this.updateInventoryItem(item.id, {
        usagePerDay,
        predictedRunOut: daysUntilRunOut < 999 ? predictedRunOut : undefined,
      });
    });
  }

  // Export data
  exportToJSON(): string {
    return JSON.stringify({
      orders: this.getOrders(),
      inventory: this.getInventory(),
      menu: this.getMenu(),
      staff: this.getStaff(),
      expenses: this.getExpenses(),
      logs: this.getLogs(),
      exportDate: new Date(),
    }, null, 2);
  }

  // Clear all data (for testing)
  clearAllData(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
}

// Export singleton instance
export const dataStore = new DataStore();
