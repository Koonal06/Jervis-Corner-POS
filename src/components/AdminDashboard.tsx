import { useEffect, useState } from "react";
import { 
  DollarSign, ShoppingBag, TrendingUp, AlertTriangle, Package, 
  Clock, Users, ArrowUp, ArrowDown, Bell, Download, RefreshCw 
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { dataStore } from "../lib/dataStore";
import { Analytics } from "../lib/analytics";
import { useApp } from "../contexts/AppContext";

export function AdminDashboard() {
  const { orders, inventory, refreshData } = useApp();
  const [salesData, setSalesData] = useState<any[]>([]);
  const [topItems, setTopItems] = useState<any[]>([]);
  const [peakHours, setPeakHours] = useState<any[]>([]);
  const [comparison, setComparison] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    loadDashboardData();
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, [orders, inventory]);

  const loadDashboardData = () => {
    setSalesData(dataStore.getLast7DaysSales());
    setTopItems(dataStore.getTopSellingItems(5));
    setPeakHours(Analytics.getPeakHours().slice(0, 6));
    setComparison(Analytics.getTodayVsYesterday());
  };

  const todaysSales = dataStore.getTodaysSales();
  const todaysOrders = dataStore.getTodaysOrders().length;
  const lowStockItems = dataStore.getLowStockItems();
  const activeOrders = orders.filter(o => o.status === 'new' || o.status === 'preparing').length;
  const estimatedWaitTime = Analytics.getEstimatedWaitTime();
  const runningOutSoon = Analytics.getItemsRunningOutSoon(3);
  
  const changePercent = comparison ? comparison.changePercent : 0;
  const isPositive = changePercent >= 0;

  const stats = [
    {
      title: "Today's Sales",
      value: `Rs ${todaysSales.toLocaleString()}`,
      change: comparison ? `${isPositive ? '+' : ''}${changePercent.toFixed(1)}%` : '+0%',
      changePositive: isPositive,
      subtext: `vs yesterday (Rs ${comparison?.yesterday.toLocaleString() || 0})`,
      icon: DollarSign,
      color: "from-primary to-secondary",
    },
    {
      title: "Total Orders",
      value: `${todaysOrders}`,
      change: `${activeOrders} active`,
      changePositive: true,
      subtext: `${orders.filter(o => o.status === 'completed').length} completed today`,
      icon: ShoppingBag,
      color: "from-secondary to-primary-dark",
    },
    {
      title: "Active Queue",
      value: `${activeOrders}`,
      change: `~${estimatedWaitTime} min`,
      changePositive: false,
      subtext: "Estimated wait time",
      icon: Clock,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Low Stock Alert",
      value: `${lowStockItems.length}`,
      change: `${runningOutSoon.length} critical`,
      changePositive: false,
      subtext: "Items need reorder",
      icon: Package,
      color: "from-danger to-red-600",
    },
  ];

  const COLORS = ['#F59E0B', '#EA580C', '#92400E', '#78350F', '#451A03'];

  const handleExportData = () => {
    const todaysOrders = dataStore.getTodaysOrders();
    Analytics.exportToCSV(
      todaysOrders.map(o => ({
        OrderNumber: o.orderNumber,
        Time: new Date(o.timestamp).toLocaleTimeString(),
        Items: o.items.length,
        Total: o.total,
        Payment: o.paymentMethod || 'N/A',
        Status: o.status,
      })),
      'daily_orders'
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 bg-neutral-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div className="space-y-1">
          <h1 className="text-accent text-2xl sm:text-3xl">Dashboard Overview</h1>
          <p className="text-neutral-600 text-sm">
            {currentTime.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })} • {currentTime.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex gap-2 sm:gap-3">
          <button 
            onClick={refreshData}
            className="px-4 py-2.5 bg-white border border-neutral-200 text-neutral-700 rounded-2xl hover:bg-neutral-50 hover:border-neutral-300 transition-all flex items-center gap-2 shadow-sm font-medium text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button 
            onClick={handleExportData}
            className="px-4 py-2.5 bg-gradient-to-r from-primary to-secondary text-white rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 font-medium text-sm"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all border border-neutral-100"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center shadow-md`}>
                  <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                <span className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium ${stat.changePositive ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                  {stat.change}
                </span>
              </div>
              <h2 className="text-neutral-900 mb-1 text-xl sm:text-2xl">{stat.value}</h2>
              <p className="text-neutral-600 text-sm font-medium mb-0.5">{stat.title}</p>
              <p className="text-neutral-400 text-xs">{stat.subtext}</p>
            </div>
          );
        })}
      </div>

      {/* Critical Alerts Banner */}
      {(lowStockItems.length > 0 || runningOutSoon.length > 0) && (
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-danger rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-start gap-4 sm:gap-5 shadow-sm border border-red-100">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-danger rounded-2xl flex items-center justify-center flex-shrink-0">
            <Bell className="w-6 h-6 sm:w-7 sm:h-7 text-white animate-pulse" />
          </div>
          <div className="flex-1 w-full">
            <h3 className="text-danger mb-3 text-lg sm:text-xl">Critical Inventory Alerts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs sm:text-sm text-neutral-600 mb-2 font-medium">Low Stock ({lowStockItems.length} items):</p>
                <div className="flex flex-wrap gap-2">
                  {lowStockItems.slice(0, 5).map(item => (
                    <span key={item.id} className="px-3 py-1.5 bg-white rounded-xl text-xs sm:text-sm text-neutral-700 shadow-sm border border-red-200 font-medium">
                      {item.name} ({item.quantity}{item.unit})
                    </span>
                  ))}
                </div>
              </div>
              {runningOutSoon.length > 0 && (
                <div>
                  <p className="text-xs sm:text-sm text-neutral-600 mb-2 font-medium">Running Out Soon:</p>
                  <div className="flex flex-wrap gap-2">
                    {runningOutSoon.map(item => (
                      <span key={item.name} className="px-3 py-1.5 bg-white rounded-xl text-xs sm:text-sm text-neutral-700 shadow-sm border border-orange-200 font-medium">
                        {item.name} ({item.daysLeft}d left)
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Sales Trend Chart */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 lg:p-8 shadow-sm border border-neutral-100">
          <div className="mb-5 sm:mb-6">
            <h2 className="text-neutral-900 mb-1 text-lg sm:text-xl">Sales Trend (7 Days)</h2>
            <p className="text-neutral-500 text-xs sm:text-sm">Daily revenue and order volume</p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" vertical={false} />
              <XAxis 
                dataKey="day" 
                stroke="#78716C" 
                axisLine={false}
                tickLine={false}
                style={{ fontSize: '13px' }}
              />
              <YAxis 
                stroke="#78716C" 
                axisLine={false}
                tickLine={false}
                style={{ fontSize: '13px' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "none",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgb(0 0 0 / 0.1)",
                  padding: "12px",
                }}
                labelStyle={{ fontWeight: 600, marginBottom: '4px', fontSize: '13px' }}
              />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#F59E0B"
                strokeWidth={3}
                dot={{ fill: "#F59E0B", r: 5, strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 7 }}
                name="Revenue (Rs)"
              />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="#EA580C"
                strokeWidth={2}
                dot={{ fill: "#EA580C", r: 4 }}
                name="Orders"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Selling Items Chart */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 lg:p-8 shadow-sm border border-neutral-100">
          <div className="mb-5 sm:mb-6">
            <h2 className="text-neutral-900 mb-1 text-lg sm:text-xl">Top Selling Items (Today)</h2>
            <p className="text-neutral-500 text-xs sm:text-sm">Most popular menu items</p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={topItems}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="#78716C" 
                angle={-20} 
                textAnchor="end" 
                height={90}
                axisLine={false}
                tickLine={false}
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#78716C"
                axisLine={false}
                tickLine={false}
                style={{ fontSize: '13px' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "none",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgb(0 0 0 / 0.1)",
                  padding: "12px",
                }}
                labelStyle={{ fontWeight: 600, marginBottom: '4px', fontSize: '13px' }}
              />
              <Bar 
                dataKey="quantity" 
                fill="#EA580C" 
                radius={[10, 10, 0, 0]}
                maxBarSize={60}
                name="Quantity Sold"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Peak Hours */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 lg:p-8 shadow-sm border border-neutral-100">
          <div className="mb-5 sm:mb-6">
            <h2 className="text-neutral-900 mb-1 text-lg sm:text-xl">Peak Hours (Today)</h2>
            <p className="text-neutral-500 text-xs sm:text-sm">Busiest hours by order volume</p>
          </div>
          {peakHours.length > 0 ? (
            <div className="space-y-3">
              {peakHours.map((hour, index) => (
                <div key={hour.hour} className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-white font-semibold text-sm">
                    #{index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1.5">
                      <span className="text-neutral-800 text-sm font-medium">{hour.hour}</span>
                      <span className="text-neutral-600 text-sm">{hour.orders} orders</span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all"
                        style={{ width: `${(hour.orders / peakHours[0].orders) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">Rs {hour.revenue.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-neutral-400">
              <Clock className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No orders yet today</p>
            </div>
          )}
        </div>

        {/* Revenue Breakdown */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 lg:p-8 shadow-sm border border-neutral-100">
          <div className="mb-5 sm:mb-6">
            <h2 className="text-neutral-900 mb-1 text-lg sm:text-xl">Revenue by Category</h2>
            <p className="text-neutral-500 text-xs sm:text-sm">Today's sales distribution</p>
          </div>
          {topItems.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={topItems}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={95}
                  fill="#8884d8"
                  dataKey="revenue"
                >
                  {topItems.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "none",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgb(0 0 0 / 0.1)",
                    padding: "12px",
                  }}
                  formatter={(value: number) => [`Rs ${value}`, 'Revenue']}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-neutral-400">
              <TrendingUp className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No revenue data yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-5 sm:p-6 text-white shadow-md">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base sm:text-lg font-semibold">Average Order Value</h3>
            <DollarSign className="w-7 h-7 sm:w-8 sm:h-8 opacity-80" />
          </div>
          <p className="text-3xl sm:text-4xl font-bold mb-1">
            Rs {todaysOrders > 0 ? Math.round(todaysSales / todaysOrders) : 0}
          </p>
          <p className="text-xs sm:text-sm text-blue-100">Per transaction today</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-3xl p-5 sm:p-6 text-white shadow-md">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base sm:text-lg font-semibold">Completion Rate</h3>
            <TrendingUp className="w-7 h-7 sm:w-8 sm:h-8 opacity-80" />
          </div>
          <p className="text-3xl sm:text-4xl font-bold mb-1">
            {todaysOrders > 0 ? Math.round((orders.filter(o => o.status === 'completed').length / todaysOrders) * 100) : 0}%
          </p>
          <p className="text-xs sm:text-sm text-green-100">Orders completed</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl p-5 sm:p-6 text-white shadow-md">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base sm:text-lg font-semibold">Inventory Health</h3>
            <Package className="w-7 h-7 sm:w-8 sm:h-8 opacity-80" />
          </div>
          <p className="text-3xl sm:text-4xl font-bold mb-1">
            {Math.round((1 - lowStockItems.length / inventory.length) * 100)}%
          </p>
          <p className="text-xs sm:text-sm text-purple-100">Stock levels good</p>
        </div>
      </div>
    </div>
  );
}
