import { Order, dataStore } from './dataStore';

export interface PeakHourData {
  hour: string;
  orders: number;
  revenue: number;
}

export interface ComparisonData {
  today: number;
  yesterday: number;
  change: number;
  changePercent: number;
}

export interface PerformanceMetrics {
  cashier: string;
  totalOrders: number;
  totalSales: number;
  avgOrderValue: number;
}

export class Analytics {
  // Get peak hours with revenue
  static getPeakHours(): PeakHourData[] {
    const todaysOrders = dataStore.getTodaysOrders();
    const hourlyData: { [key: number]: { orders: number; revenue: number } } = {};
    
    // Initialize all hours
    for (let i = 0; i < 24; i++) {
      hourlyData[i] = { orders: 0, revenue: 0 };
    }
    
    todaysOrders.forEach(order => {
      const hour = new Date(order.timestamp).getHours();
      hourlyData[hour].orders += 1;
      hourlyData[hour].revenue += order.total;
    });
    
    return Object.entries(hourlyData)
      .map(([hour, data]) => ({
        hour: `${parseInt(hour).toString().padStart(2, '0')}:00`,
        orders: data.orders,
        revenue: data.revenue,
      }))
      .filter(d => d.orders > 0)
      .sort((a, b) => b.orders - a.orders);
  }

  // Compare today vs yesterday
  static getTodayVsYesterday(): ComparisonData {
    const today = dataStore.getTodaysSales();
    const yesterday = dataStore.getYesterdaysSales();
    const change = today - yesterday;
    const changePercent = yesterday > 0 ? (change / yesterday) * 100 : 0;
    
    return { today, yesterday, change, changePercent };
  }

  // Get this week vs last week
  static getWeekComparison(): ComparisonData {
    const orders = dataStore.getOrders();
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    
    const thisWeek = orders
      .filter(o => new Date(o.timestamp) >= weekAgo && o.status === 'completed')
      .reduce((sum, o) => sum + o.total, 0);
    
    const lastWeek = orders
      .filter(o => new Date(o.timestamp) >= twoWeeksAgo && new Date(o.timestamp) < weekAgo && o.status === 'completed')
      .reduce((sum, o) => sum + o.total, 0);
    
    const change = thisWeek - lastWeek;
    const changePercent = lastWeek > 0 ? (change / lastWeek) * 100 : 0;
    
    return { 
      today: thisWeek, 
      yesterday: lastWeek, 
      change, 
      changePercent 
    };
  }

  // Cashier performance
  static getCashierPerformance(): PerformanceMetrics[] {
    const todaysOrders = dataStore.getTodaysOrders();
    const cashierStats: { [key: string]: { orders: number; sales: number } } = {};
    
    todaysOrders.forEach(order => {
      const cashier = order.cashier || 'Unknown';
      if (!cashierStats[cashier]) {
        cashierStats[cashier] = { orders: 0, sales: 0 };
      }
      cashierStats[cashier].orders += 1;
      cashierStats[cashier].sales += order.total;
    });
    
    return Object.entries(cashierStats).map(([cashier, stats]) => ({
      cashier,
      totalOrders: stats.orders,
      totalSales: stats.sales,
      avgOrderValue: stats.orders > 0 ? stats.sales / stats.orders : 0,
    }));
  }

  // Chef performance (average prep time)
  static getChefPerformance(): { avgPrepTime: number; ordersCompleted: number } {
    const completedOrders = dataStore.getOrders().filter(o => 
      o.status === 'completed' && 
      o.prepStartTime && 
      o.prepEndTime
    );
    
    if (completedOrders.length === 0) {
      return { avgPrepTime: 0, ordersCompleted: 0 };
    }
    
    const totalPrepTime = completedOrders.reduce((sum, order) => {
      const start = new Date(order.prepStartTime!).getTime();
      const end = new Date(order.prepEndTime!).getTime();
      return sum + (end - start);
    }, 0);
    
    const avgPrepTime = totalPrepTime / completedOrders.length / 60000; // Convert to minutes
    
    return {
      avgPrepTime: Math.round(avgPrepTime * 10) / 10,
      ordersCompleted: completedOrders.length,
    };
  }

  // Calculate profit margin for menu item
  static calculateProfitMargin(price: number, cost: number): number {
    return price > 0 ? ((price - cost) / price) * 100 : 0;
  }

  // Get best profit margins
  static getBestProfitItems(): { name: string; margin: number; price: number }[] {
    const menu = dataStore.getMenu();
    return menu
      .map(item => ({
        name: item.name,
        margin: this.calculateProfitMargin(item.price, item.cost),
        price: item.price,
      }))
      .sort((a, b) => b.margin - a.margin)
      .slice(0, 5);
  }

  // Calculate daily cash reconciliation
  static getDailyCashReconciliation(): {
    expectedCash: number;
    expectedCard: number;
    expectedMobile: number;
    totalExpected: number;
  } {
    const todaysOrders = dataStore.getTodaysOrders().filter(o => o.status === 'completed');
    
    const expectedCash = todaysOrders
      .filter(o => o.paymentMethod === 'cash')
      .reduce((sum, o) => sum + o.total, 0);
    
    const expectedCard = todaysOrders
      .filter(o => o.paymentMethod === 'card')
      .reduce((sum, o) => sum + o.total, 0);
    
    const expectedMobile = todaysOrders
      .filter(o => o.paymentMethod === 'mobile')
      .reduce((sum, o) => sum + o.total, 0);
    
    return {
      expectedCash,
      expectedCard,
      expectedMobile,
      totalExpected: expectedCash + expectedCard + expectedMobile,
    };
  }

  // Calculate estimated wait time based on current kitchen load
  static getEstimatedWaitTime(): number {
    const orders = dataStore.getOrders();
    const activeOrders = orders.filter(o => o.status === 'new' || o.status === 'preparing');
    const avgPrepTime = this.getChefPerformance().avgPrepTime || 10;
    
    // Assume 2 orders can be prepared in parallel
    const queuePosition = Math.ceil(activeOrders.length / 2);
    return queuePosition * avgPrepTime;
  }

  // Get items running out soon
  static getItemsRunningOutSoon(days: number = 3): Array<{ name: string; daysLeft: number; quantity: number }> {
    const inventory = dataStore.getInventory();
    const now = new Date();
    
    return inventory
      .filter(item => item.predictedRunOut)
      .map(item => {
        const daysLeft = Math.ceil(
          (new Date(item.predictedRunOut!).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        );
        return {
          name: item.name,
          daysLeft,
          quantity: item.quantity,
        };
      })
      .filter(item => item.daysLeft <= days && item.daysLeft > 0)
      .sort((a, b) => a.daysLeft - b.daysLeft);
  }

  // Calculate VAT (Mauritius standard rate is 15%)
  static calculateVAT(amount: number, rate: number = 15): {
    subtotal: number;
    vat: number;
    total: number;
  } {
    const subtotal = amount / (1 + rate / 100);
    const vat = amount - subtotal;
    return {
      subtotal: Math.round(subtotal * 100) / 100,
      vat: Math.round(vat * 100) / 100,
      total: amount,
    };
  }

  // Export data for backup
  static exportToCSV(data: any[], filename: string): void {
    if (data.length === 0) return;
    
    const headers = Object.keys(data[0]);
    const csv = [
      headers.join(','),
      ...data.map(row => headers.map(header => {
        const value = row[header];
        // Handle values with commas
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value}"`;
        }
        return value;
      }).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  // Generate order number
  static generateOrderNumber(): string {
    const orders = dataStore.getOrders();
    const todaysOrders = dataStore.getTodaysOrders();
    const orderNum = todaysOrders.length + 1;
    return `#${orderNum.toString().padStart(3, '0')}`;
  }
}
