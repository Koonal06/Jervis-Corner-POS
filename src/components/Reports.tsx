import { useState } from "react";
import { 
  Download, FileText, DollarSign, TrendingUp, Package, Users,
  Calendar, Clock, Award, AlertTriangle, PieChart, BarChart3
} from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPie, Pie, Cell } from "recharts";
import { dataStore } from "../lib/dataStore";
import { Analytics } from "../lib/analytics";
import { toast } from "sonner";

export function Reports() {
  const [reportType, setReportType] = useState<'daily' | 'weekly' | 'inventory' | 'staff' | 'financial'>('daily');
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month'>('today');

  const todayVsYesterday = Analytics.getTodayVsYesterday();
  const weekComparison = Analytics.getWeekComparison();
  const cashierPerformance = Analytics.getCashierPerformance();
  const cashReconciliation = Analytics.getDailyCashReconciliation();
  const topItems = dataStore.getTopSellingItems(10);
  const peakHours = Analytics.getPeakHours();
  const lowStock = dataStore.getLowStockItems();
  const runningOutSoon = Analytics.getItemsRunningOutSoon(7);
  const profitItems = Analytics.getBestProfitItems();
  const salesData = dataStore.getLast7DaysSales();
  const todaysOrders = dataStore.getTodaysOrders();
  const expenses = dataStore.getExpenses();

  const COLORS = ['#F59E0B', '#EA580C', '#92400E', '#78350F', '#451A03', '#D97706', '#B45309'];

  const exportDailyReport = () => {
    Analytics.exportToCSV(
      todaysOrders.map(o => ({
        OrderNumber: o.orderNumber,
        Time: new Date(o.timestamp).toLocaleTimeString(),
        Customer: o.customerName || 'N/A',
        Table: o.table || 'N/A',
        Items: o.items.map(i => `${i.name} x${i.quantity}`).join(', '),
        Subtotal: o.total + o.discount,
        Discount: o.discount,
        Total: o.total,
        Payment: o.paymentMethod || 'N/A',
        Cashier: o.cashier || 'N/A',
        Status: o.status,
      })),
      'daily_sales_report'
    );
    toast.success('Daily report exported successfully!');
  };

  const exportInventoryReport = () => {
    const inventory = dataStore.getInventory();
    Analytics.exportToCSV(
      inventory.map(i => ({
        Item: i.name,
        Category: i.category,
        Quantity: i.quantity,
        Unit: i.unit,
        MinLevel: i.minLevel,
        Status: i.quantity < i.minLevel ? 'LOW STOCK' : 'OK',
        Supplier: i.supplier,
        DaysUntilRunOut: i.predictedRunOut 
          ? Math.ceil((new Date(i.predictedRunOut).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
          : 'N/A',
      })),
      'inventory_report'
    );
    toast.success('Inventory report exported successfully!');
  };

  const exportFinancialReport = () => {
    const todayExpenses = expenses.filter(e => 
      new Date(e.date).toDateString() === new Date().toDateString()
    );
    const totalExpenses = todayExpenses.reduce((sum, e) => sum + e.amount, 0);
    
    const data = {
      date: new Date().toLocaleDateString(),
      sales: {
        cash: cashReconciliation.expectedCash,
        card: cashReconciliation.expectedCard,
        mobile: cashReconciliation.expectedMobile,
        total: cashReconciliation.totalExpected,
      },
      expenses: {
        items: todayExpenses,
        total: totalExpenses,
      },
      profit: cashReconciliation.totalExpected - totalExpenses,
      vat: Analytics.calculateVAT(cashReconciliation.totalExpected),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial_report_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Financial report exported successfully!');
  };

  return (
    <div className="p-8 space-y-8 bg-neutral-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-accent mb-2">Reports & Analytics</h1>
          <p className="text-neutral-600">Comprehensive business insights and data exports</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={exportDailyReport}
            className="px-5 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export Daily
          </button>
          <button
            onClick={exportInventoryReport}
            className="px-5 py-3 bg-blue-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
          >
            <Package className="w-4 h-4" />
            Export Inventory
          </button>
          <button
            onClick={exportFinancialReport}
            className="px-5 py-3 bg-green-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
          >
            <DollarSign className="w-4 h-4" />
            Export Financial
          </button>
        </div>
      </div>

      {/* Report Type Selector */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {[
          { key: 'daily', label: 'Daily Sales', icon: Calendar },
          { key: 'weekly', label: 'Weekly Trends', icon: TrendingUp },
          { key: 'inventory', label: 'Inventory', icon: Package },
          { key: 'staff', label: 'Staff Performance', icon: Users },
          { key: 'financial', label: 'Financial', icon: DollarSign },
        ].map((type) => {
          const Icon = type.icon;
          return (
            <button
              key={type.key}
              onClick={() => setReportType(type.key as any)}
              className={`px-6 py-3 rounded-2xl whitespace-nowrap transition-all flex items-center gap-2 ${
                reportType === type.key
                  ? "bg-gradient-to-r from-primary to-secondary text-white shadow-md"
                  : "bg-white text-neutral-600 hover:bg-neutral-50 shadow-sm"
              }`}
            >
              <Icon className="w-5 h-5" />
              {type.label}
            </button>
          );
        })}
      </div>

      {/* Daily Sales Report */}
      {reportType === 'daily' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-100">
              <div className="flex items-center justify-between mb-4">
                <DollarSign className="w-12 h-12 text-primary" />
                <span className={`px-3 py-1 rounded-full text-sm ${
                  todayVsYesterday.changePercent >= 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}>
                  {todayVsYesterday.changePercent >= 0 ? '+' : ''}{todayVsYesterday.changePercent.toFixed(1)}%
                </span>
              </div>
              <h3 className="text-neutral-900 mb-1">Rs {todayVsYesterday.today.toLocaleString()}</h3>
              <p className="text-neutral-500 text-sm">Today's Sales</p>
              <p className="text-neutral-400 text-xs mt-2">vs Rs {todayVsYesterday.yesterday.toLocaleString()} yesterday</p>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-100">
              <div className="flex items-center justify-between mb-4">
                <FileText className="w-12 h-12 text-secondary" />
              </div>
              <h3 className="text-neutral-900 mb-1">{todaysOrders.length}</h3>
              <p className="text-neutral-500 text-sm">Total Orders</p>
              <p className="text-neutral-400 text-xs mt-2">
                Avg: Rs {todaysOrders.length > 0 ? Math.round(todayVsYesterday.today / todaysOrders.length) : 0}
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-100">
              <div className="flex items-center justify-between mb-4">
                <Award className="w-12 h-12 text-success" />
              </div>
              <h3 className="text-neutral-900 mb-1">{topItems.length > 0 ? topItems[0].name : 'N/A'}</h3>
              <p className="text-neutral-500 text-sm">Top Selling Item</p>
              <p className="text-neutral-400 text-xs mt-2">
                {topItems.length > 0 ? `${topItems[0].quantity} sold` : ''}
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-100">
              <div className="flex items-center justify-between mb-4">
                <Clock className="w-12 h-12 text-blue-500" />
              </div>
              <h3 className="text-neutral-900 mb-1">
                {peakHours.length > 0 ? peakHours[0].hour : 'N/A'}
              </h3>
              <p className="text-neutral-500 text-sm">Peak Hour</p>
              <p className="text-neutral-400 text-xs mt-2">
                {peakHours.length > 0 ? `${peakHours[0].orders} orders` : ''}
              </p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-neutral-100">
              <h2 className="text-neutral-900 mb-6">Top Selling Items (Today)</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topItems.slice(0, 5)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" vertical={false} />
                  <XAxis dataKey="name" stroke="#78716C" angle={-20} textAnchor="end" height={90} />
                  <YAxis stroke="#78716C" />
                  <Tooltip />
                  <Bar dataKey="quantity" fill="#EA580C" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-neutral-100">
              <h2 className="text-neutral-900 mb-6">Revenue Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPie>
                  <Pie
                    data={topItems.slice(0, 5)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="revenue"
                  >
                    {topItems.slice(0, 5).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPie>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Weekly Trends */}
      {reportType === 'weekly' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-neutral-100">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-neutral-900 mb-2">7-Day Sales Trend</h2>
                <p className="text-neutral-600 text-sm">
                  This Week: Rs {weekComparison.today.toLocaleString()} 
                  <span className={`ml-2 ${weekComparison.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ({weekComparison.changePercent >= 0 ? '+' : ''}{weekComparison.changePercent.toFixed(1)}%)
                  </span>
                </p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" vertical={false} />
                <XAxis dataKey="day" stroke="#78716C" />
                <YAxis stroke="#78716C" />
                <Tooltip />
                <Line type="monotone" dataKey="sales" stroke="#F59E0B" strokeWidth={3} name="Sales (Rs)" />
                <Line type="monotone" dataKey="orders" stroke="#EA580C" strokeWidth={2} name="Orders" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Inventory Report */}
      {reportType === 'inventory' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-100">
              <Package className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-neutral-900 mb-1">{dataStore.getInventory().length}</h3>
              <p className="text-neutral-500 text-sm">Total Items</p>
            </div>
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-100">
              <AlertTriangle className="w-12 h-12 text-danger mb-4" />
              <h3 className="text-danger mb-1">{lowStock.length}</h3>
              <p className="text-neutral-500 text-sm">Low Stock Items</p>
            </div>
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-100">
              <Clock className="w-12 h-12 text-warning mb-4" />
              <h3 className="text-warning mb-1">{runningOutSoon.length}</h3>
              <p className="text-neutral-500 text-sm">Running Out Soon</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm border border-neutral-100">
            <h2 className="text-neutral-900 mb-6">Critical Stock Alerts</h2>
            <div className="space-y-4">
              {lowStock.map(item => (
                <div key={item.id} className="flex items-center justify-between p-5 bg-red-50 rounded-2xl border border-red-200">
                  <div>
                    <h4 className="text-neutral-800 mb-1">{item.name}</h4>
                    <p className="text-sm text-neutral-600">
                      Current: {item.quantity}{item.unit} | Min: {item.minLevel}{item.unit}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="px-4 py-2 bg-danger text-white rounded-xl text-sm">
                      {Math.round((1 - item.quantity / item.minLevel) * 100)}% below min
                    </span>
                    <p className="text-xs text-neutral-500 mt-2">Supplier: {item.supplier}</p>
                  </div>
                </div>
              ))}
              {lowStock.length === 0 && (
                <p className="text-center text-neutral-400 py-8">All inventory levels are healthy!</p>
              )}
            </div>
          </div>

          {runningOutSoon.length > 0 && (
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-neutral-100">
              <h2 className="text-neutral-900 mb-6">Predicted Stock Depletion</h2>
              <div className="space-y-3">
                {runningOutSoon.map(item => (
                  <div key={item.name} className="flex items-center justify-between p-4 bg-orange-50 rounded-xl border border-orange-200">
                    <span className="text-neutral-800">{item.name}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-neutral-600">{item.quantity} remaining</span>
                      <span className="px-3 py-1 bg-warning text-white rounded-lg text-sm">
                        {item.daysLeft} day{item.daysLeft !== 1 ? 's' : ''} left
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Staff Performance */}
      {reportType === 'staff' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-neutral-100">
            <h2 className="text-neutral-900 mb-6">Cashier Performance (Today)</h2>
            {cashierPerformance.length > 0 ? (
              <div className="space-y-4">
                {cashierPerformance.map((cashier, index) => (
                  <div key={cashier.cashier} className="flex items-center gap-4 p-5 bg-neutral-50 rounded-2xl">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white">
                      #{index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-neutral-800 mb-1">{cashier.cashier}</h4>
                      <div className="flex gap-6 text-sm text-neutral-600">
                        <span>Orders: {cashier.totalOrders}</span>
                        <span>Sales: Rs {cashier.totalSales.toLocaleString()}</span>
                        <span>Avg: Rs {Math.round(cashier.avgOrderValue)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="w-full bg-neutral-200 rounded-full h-2 w-32">
                        <div 
                          className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full"
                          style={{ width: `${(cashier.totalOrders / Math.max(...cashierPerformance.map(c => c.totalOrders))) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-neutral-400 py-8">No cashier data available yet</p>
            )}
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm border border-neutral-100">
            <h2 className="text-neutral-900 mb-6">Chef Performance</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-blue-50 rounded-2xl">
                <h3 className="text-blue-700 mb-2">{Analytics.getChefPerformance().avgPrepTime.toFixed(1)} min</h3>
                <p className="text-neutral-600 text-sm">Average Preparation Time</p>
              </div>
              <div className="p-6 bg-green-50 rounded-2xl">
                <h3 className="text-green-700 mb-2">{Analytics.getChefPerformance().ordersCompleted}</h3>
                <p className="text-neutral-600 text-sm">Orders Completed</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Financial Report */}
      {reportType === 'financial' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-100">
              <Banknote className="w-12 h-12 text-success mb-4" />
              <h3 className="text-neutral-900 mb-1">Rs {cashReconciliation.expectedCash.toLocaleString()}</h3>
              <p className="text-neutral-500 text-sm">Cash Expected</p>
            </div>
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-100">
              <CreditCard className="w-12 h-12 text-blue-500 mb-4" />
              <h3 className="text-neutral-900 mb-1">Rs {cashReconciliation.expectedCard.toLocaleString()}</h3>
              <p className="text-neutral-500 text-sm">Card Payments</p>
            </div>
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-100">
              <Smartphone className="w-12 h-12 text-purple-500 mb-4" />
              <h3 className="text-neutral-900 mb-1">Rs {cashReconciliation.expectedMobile.toLocaleString()}</h3>
              <p className="text-neutral-500 text-sm">Mobile Payments</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm border border-neutral-100">
            <h2 className="text-neutral-900 mb-6">Cash Reconciliation</h2>
            <div className="space-y-4">
              <div className="flex justify-between p-4 bg-neutral-50 rounded-xl">
                <span className="text-neutral-600">Total Sales</span>
                <span className="text-neutral-900">Rs {cashReconciliation.totalExpected.toLocaleString()}</span>
              </div>
              <div className="flex justify-between p-4 bg-neutral-50 rounded-xl">
                <span className="text-neutral-600">VAT (15%)</span>
                <span className="text-neutral-900">Rs {Analytics.calculateVAT(cashReconciliation.totalExpected).vat.toLocaleString()}</span>
              </div>
              <div className="flex justify-between p-4 bg-blue-50 rounded-xl border-t-2 border-primary">
                <span className="text-neutral-800">Net Sales (excluding VAT)</span>
                <h3 className="text-primary">Rs {Analytics.calculateVAT(cashReconciliation.totalExpected).subtotal.toLocaleString()}</h3>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm border border-neutral-100">
            <h2 className="text-neutral-900 mb-6">Profit Margins</h2>
            <div className="space-y-3">
              {profitItems.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-success text-white rounded-full flex items-center justify-center text-sm">
                      {index + 1}
                    </span>
                    <span className="text-neutral-800">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-success">{item.margin.toFixed(1)}% margin</span>
                    <p className="text-xs text-neutral-500">Rs {item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Import icons
import { Banknote, CreditCard, Smartphone } from "lucide-react";
