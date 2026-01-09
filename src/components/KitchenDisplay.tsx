import { useState, useEffect } from "react";
import { Clock, CheckCircle, ChefHat, Bell, AlertTriangle, TrendingUp } from "lucide-react";
import { useApp } from "../contexts/AppContext";
import { Analytics } from "../lib/analytics";
import { toast } from "sonner@2.0.3";

export function KitchenDisplay() {
  const { orders, updateOrder } = useApp();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [lastOrderCount, setLastOrderCount] = useState(0);
  const [chefStats, setChefStats] = useState({ avgPrepTime: 0, ordersCompleted: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Update chef stats
    setChefStats(Analytics.getChefPerformance());
    
    // Check for new orders
    const newOrders = orders.filter(o => o.status === 'new');
    if (newOrders.length > lastOrderCount) {
      // Play notification sound
      playNotificationSound();
      toast.info('New Order Received!', {
        description: `Order ${newOrders[newOrders.length - 1]?.orderNumber}`,
        duration: 3000,
      });
    }
    setLastOrderCount(newOrders.length);
  }, [orders]);

  const playNotificationSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Two beeps
      oscillator.frequency.value = 880;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
      
      // Second beep
      const oscillator2 = audioContext.createOscillator();
      oscillator2.connect(gainNode);
      oscillator2.frequency.value = 880;
      oscillator2.type = 'sine';
      oscillator2.start(audioContext.currentTime + 0.3);
      oscillator2.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      // Silent fail
    }
  };

  const getElapsedTime = (timestamp: Date) => {
    const diff = Math.floor((currentTime.getTime() - new Date(timestamp).getTime()) / 1000);
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;
    return { minutes, seconds, display: `${minutes}:${seconds.toString().padStart(2, "0")}` };
  };

  const updateOrderStatus = (orderId: number, status: "new" | "preparing" | "completed" | "served") => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const updates: any = { status };
    
    if (status === 'preparing' && !order.prepStartTime) {
      updates.prepStartTime = new Date();
    }
    
    if (status === 'completed' && !order.prepEndTime) {
      updates.prepEndTime = new Date();
      const prepTime = Math.round((new Date().getTime() - new Date(order.prepStartTime || new Date()).getTime()) / 60000);
      toast.success(`Order ${order.orderNumber} Ready!`, {
        description: `Prep time: ${prepTime} minutes`,
      });
    }
    
    updateOrder(orderId, updates);
  };

  const activeOrders = orders.filter(order => order.status !== "completed" && order.status !== "served");
  const newOrders = activeOrders.filter(order => order.status === "new");
  const preparingOrders = activeOrders.filter(order => order.status === "preparing");
  const completedToday = orders.filter(o => {
    const today = new Date().toDateString();
    return new Date(o.timestamp).toDateString() === today && o.status === 'completed';
  }).length;

  return (
    <div className="p-8 bg-neutral-900 min-h-screen">
      {/* Header */}
      <div className="mb-10 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-3xl flex items-center justify-center shadow-xl">
            <ChefHat className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-white mb-1">Kitchen Display System</h1>
            <p className="text-neutral-400">{currentTime.toLocaleTimeString()}</p>
          </div>
        </div>
        
        <div className="flex gap-6">
          <div className="text-center px-8 py-5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-2 justify-center mb-2">
              <Bell className="w-5 h-5 text-blue-400" />
              <p className="text-3xl text-white">{newOrders.length}</p>
            </div>
            <p className="text-neutral-400 text-sm">New Orders</p>
          </div>
          <div className="text-center px-8 py-5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-2 justify-center mb-2">
              <Clock className="w-5 h-5 text-warning" />
              <p className="text-3xl text-warning">{preparingOrders.length}</p>
            </div>
            <p className="text-neutral-400 text-sm">Preparing</p>
          </div>
          <div className="text-center px-8 py-5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-2 justify-center mb-2">
              <CheckCircle className="w-5 h-5 text-success" />
              <p className="text-3xl text-success">{completedToday}</p>
            </div>
            <p className="text-neutral-400 text-sm">Completed Today</p>
          </div>
          <div className="text-center px-8 py-5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-2 justify-center mb-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <p className="text-3xl text-white">{chefStats.avgPrepTime.toFixed(1)}</p>
            </div>
            <p className="text-neutral-400 text-sm">Avg Prep (min)</p>
          </div>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {activeOrders
          .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
          .map((order) => {
          const isNew = order.status === "new";
          const isPreparing = order.status === "preparing";
          const elapsed = getElapsedTime(order.timestamp);
          const isOverdue = elapsed.minutes > 15;

          return (
            <div
              key={order.id}
              className={`rounded-3xl p-7 shadow-2xl transition-all transform hover:scale-105 ${
                isNew
                  ? "bg-gradient-to-br from-blue-500 to-blue-600 border-4 border-blue-300 animate-pulse"
                  : isPreparing
                  ? "bg-gradient-to-br from-warning to-secondary border-4 border-yellow-300"
                  : "bg-gradient-to-br from-success to-green-600 border-4 border-green-300"
              } ${isOverdue ? 'ring-4 ring-red-500' : ''}`}
            >
              {/* Order Header */}
              <div className="flex justify-between items-start mb-5">
                <div>
                  <h2 className="text-white mb-2">{order.orderNumber}</h2>
                  <p className="text-white/90 text-sm">{order.table}</p>
                  {order.customerName && (
                    <p className="text-white/70 text-xs mt-1">👤 {order.customerName}</p>
                  )}
                </div>
                <div
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl ${
                    isOverdue 
                      ? "bg-red-500 shadow-lg animate-pulse" 
                      : "bg-white/20 backdrop-blur-sm"
                  }`}
                >
                  <Clock className="w-5 h-5 text-white" />
                  <span className={`text-white ${elapsed.minutes > 10 ? 'font-bold' : ''}`}>
                    {elapsed.display}
                  </span>
                </div>
              </div>

              {/* Priority Alert */}
              {isOverdue && (
                <div className="mb-4 px-4 py-2 bg-red-600 rounded-xl flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-white" />
                  <span className="text-white text-sm">PRIORITY ORDER!</span>
                </div>
              )}

              {/* Order Items */}
              <div className="bg-white/10 rounded-2xl p-5 mb-5 backdrop-blur-sm">
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-white items-center">
                      <span className="flex-1">{item.name}</span>
                      <span className="bg-white/20 px-3 py-1.5 rounded-lg ml-3">x{item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Info */}
              <div className="mb-4 flex flex-wrap gap-2 text-xs">
                <span className="px-3 py-1 bg-white/20 rounded-lg text-white">
                  Rs {order.total}
                </span>
                {order.paymentMethod && (
                  <span className="px-3 py-1 bg-white/20 rounded-lg text-white capitalize">
                    {order.paymentMethod}
                  </span>
                )}
                <span className="px-3 py-1 bg-white/20 rounded-lg text-white">
                  {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                </span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {isNew && (
                  <button
                    onClick={() => updateOrderStatus(order.id, "preparing")}
                    className="w-full py-4 bg-white text-neutral-900 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105 font-semibold"
                  >
                    ⚡ Start Preparing
                  </button>
                )}
                {isPreparing && (
                  <button
                    onClick={() => updateOrderStatus(order.id, "completed")}
                    className="w-full py-4 bg-white text-neutral-900 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-2 font-semibold"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Mark Complete ✓
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {activeOrders.length === 0 && (
        <div className="text-center py-24">
          <div className="w-24 h-24 bg-white/10 rounded-3xl mx-auto mb-6 flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-success" />
          </div>
          <h3 className="text-white mb-3">All Caught Up! 🎉</h3>
          <p className="text-neutral-400">No pending orders at the moment</p>
          <div className="mt-6 px-6 py-4 bg-white/5 rounded-2xl inline-block">
            <p className="text-neutral-300">
              {completedToday} orders completed today • Avg prep time: {chefStats.avgPrepTime.toFixed(1)} min
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
