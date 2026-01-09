import { useState, useEffect } from "react";
import {
  Plus,
  Minus,
  Trash2,
  Percent,
  CreditCard,
  Banknote,
  Smartphone,
  Package,
  Hash,
  User,
  Clock,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useApp } from "../contexts/AppContext";
import { Analytics } from "../lib/analytics";
import { dataStore } from "../lib/dataStore";
import { toast } from "sonner@2.0.3";

interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  available?: boolean;
}

interface OrderItem extends MenuItem {
  quantity: number;
}

export function POSOrdering() {
  const { addOrder } = useApp();
  const [selectedCategory, setSelectedCategory] =
    useState("All");
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [discount, setDiscount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [estimatedWait, setEstimatedWait] = useState(0);

  const categories = [
    "All",
    "Snacks",
    "Fried Rice",
    "Fried Noodles",
    "Chicken",
    "Soups",
    "Drinks",
  ];

  const menuItems: MenuItem[] = [
    {
      id: 1,
      name: "Crispy Fried Chicken",
      price: 200,
      category: "Chicken",
      image:
        "https://res.cloudinary.com/dstpuchpj/image/upload/v1767886694/Whisk_665020fe9c3edb583bd488ebba2af952dr_q2twvx.jpg",
      available: true,
    },
    {
      id: 2,
      name: "Classic Chicken Fried Rice",
      price: 250,
      category: "Fried Rice",
      image:
        "https://res.cloudinary.com/dstpuchpj/image/upload/v1767886350/Whisk_caec88926314a92a736476d532003149dr_rusmmq.jpg",
      available: true,
    },
    {
      id: 3,
      name: "Pancit Canton",
      price: 200,
      category: "Fried Noodles",
      image:
        "https://res.cloudinary.com/dstpuchpj/image/upload/v1767891130/Whisk_8c2f52e84ce747e894d4916d4109cc9bdr_af9faz.jpg",
      available: true,
    },
    {
      id: 4,
      name: "Spring Rolls (5pcs)",
      price: 100,
      category: "Snacks",
      image:
        "https://res.cloudinary.com/dstpuchpj/image/upload/v1767906319/vegetable-spring-rolls-02_uabxct.jpg",
      available: true,
    },
    {
      id: 5,
      name: "Chicken Soup",
      price: 110,
      category: "Soups",
      image:
        "https://images.unsplash.com/photo-1701109876066-7fc0c08da447?w=400",
      available: true,
    },
    {
      id: 6,
      name: "Lemon Iced Tea",
      price: 200,
      category: "Drinks",
      image:
        "https://res.cloudinary.com/dstpuchpj/image/upload/v1767887931/Whisk_9207e16f48e976a92cb43f16dfcc1ad3dr_qpyc2x.jpg",
      available: true,
    },
    {
      id: 7,
      name: "Burger Steak",
      price: 470,
      category: "Snacks",
      image:
        "https://res.cloudinary.com/dstpuchpj/image/upload/v1767888702/Whisk_ee445cd546abc39a4904733a6a561f89dr_aryls4.png",
      available: true,
    },
    {
      id: 8,
      name: "French Fries",
      price: 80,
      category: "Snacks",
      image:
        "https://images.unsplash.com/photo-1630431341973-02e1b662ec35?w=400",
      available: true,
    },
    {
      id: 9,
      name: "Garlic Fried Rice",
      price: 175,
      category: "Fried Rice",
      image:
        "https://images.unsplash.com/photo-1646340916384-9845d7686e2e?w=400",
      available: true,
    },
    {
      id: 10,
      name: "Beef Noodles",
      price: 365,
      category: "Fried Noodles",
      image:
        "https://res.cloudinary.com/dstpuchpj/image/upload/v1767889146/Whisk_e57495ec4b11112825148e38edada861dr_yh59hr.png",
      available: true,
    },
    {
      id: 11,
      name: "Chicken Wings (6pcs)",
      price: 220,
      category: "Chicken",
      image:
        "https://res.cloudinary.com/dstpuchpj/image/upload/v1767886913/Whisk_0f67e56d7652b28ae274676274d6c4f3dr_mn3dtm.jpg",
      available: true,
    },
    {
      id: 12,
      name: "Mango Juice",
      price: 150,
      category: "Drinks",
      image:
        "https://res.cloudinary.com/dstpuchpj/image/upload/v1767887728/Whisk_dde17b0b3d91c82a1334fee35cde8348dr_ja4nud.png",
      available: true,
    },

    {
      id: 13,
      name: "Loaded Fries",
      price: 170,
      category: "Snacks",
      image:
        "https://res.cloudinary.com/dstpuchpj/image/upload/v1767886146/Whisk_994abf49e697d59826548020fd8d3cc6dr_qpri7f.jpg",
      available: true,
    },
    {
      id: 14,
      name: "Mozzarella sticks",
      price: 175,
      category: "Snacks",
      image:
        "https://res.cloudinary.com/dstpuchpj/image/upload/v1767886260/Whisk_0dc2b01031bfb709a5e4cc662693bea0dr_nfn2vj.jpg",
      available: true,
    },
    {
      id: 15,
      name: "Vegtable fired rice",
      price: 175,
      category: "Fried Rice",
      image:
        "https://res.cloudinary.com/dstpuchpj/image/upload/v1767886589/Whisk_9fc2be299d180788d674879a657b7156dr_gfhex9.jpg",
      available: true,
    },
    {
      id: 16,
      name: "Spicy Shrimp Fried Rice",
      price: 300,
      category: "Fried Rice",
      image:
        "https://res.cloudinary.com/dstpuchpj/image/upload/v1767886444/Whisk_e7c0fd4892557f8b26540d29f1747ac6dr_fpkz4j.jpg",
      available: true,
    },
    {
      id: 17,
      name: "Grilled chicken breast",
      price: 350,
      category: "Chicken",
      image:
        "https://res.cloudinary.com/dstpuchpj/image/upload/v1767887396/Whisk_07565dc8bc19ba7b6b547c860edd7e2bdr_uusfir.png",
      available: true,
    },
    {
      id: 18,
      name: "Tom yom soup",
      price: 300,
      category: "Soups",
      image:
        "https://res.cloudinary.com/dstpuchpj/image/upload/v1767887514/Whisk_7c1295adf27b9df810247d1884cf6c38dr_uqskgr.png",
      available: true,
    },
  ];

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // F1-F7 for categories
      if (e.key >= "F1" && e.key <= "F7") {
        e.preventDefault();
        const index = parseInt(e.key.replace("F", "")) - 1;
        setSelectedCategory(categories[index]);
      }
      // Ctrl+Enter for checkout
      if (
        e.ctrlKey &&
        e.key === "Enter" &&
        orderItems.length > 0
      ) {
        setShowCheckout(true);
      }
      // Escape to clear order
      if (e.key === "Escape") {
        if (showCheckout) {
          setShowCheckout(false);
        } else if (orderItems.length > 0) {
          if (confirm("Clear current order?")) {
            clearOrder();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () =>
      window.removeEventListener("keydown", handleKeyPress);
  }, [orderItems, showCheckout]);

  // Update estimated wait time
  useEffect(() => {
    setEstimatedWait(Analytics.getEstimatedWaitTime());
  }, []);

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" ||
      item.category === selectedCategory;
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const isAvailable = item.available !== false;
    return matchesCategory && matchesSearch && isAvailable;
  });

  const addToOrder = (item: MenuItem) => {
    const existingItem = orderItems.find(
      (orderItem) => orderItem.id === item.id,
    );
    if (existingItem) {
      setOrderItems(
        orderItems.map((orderItem) =>
          orderItem.id === item.id
            ? { ...orderItem, quantity: orderItem.quantity + 1 }
            : orderItem,
        ),
      );
    } else {
      setOrderItems([...orderItems, { ...item, quantity: 1 }]);
    }
    toast.success(`Added ${item.name}`, { duration: 1000 });
  };

  const updateQuantity = (id: number, change: number) => {
    setOrderItems(
      orderItems
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: Math.max(1, item.quantity + change),
              }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const removeItem = (id: number) => {
    setOrderItems(orderItems.filter((item) => item.id !== id));
  };

  const clearOrder = () => {
    setOrderItems([]);
    setCustomerName("");
    setTableNumber("");
    setDiscount(0);
    setShowCheckout(false);
  };

  const subtotal = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const total = subtotal - discount;

  const handlePayment = (
    paymentMethod: "cash" | "card" | "mobile",
  ) => {
    const orderNumber = Analytics.generateOrderNumber();

    const newOrder = {
      id: Date.now(),
      orderNumber,
      items: orderItems.map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        category: item.category,
      })),
      status: "new" as const,
      timestamp: new Date(),
      table: tableNumber || "Takeout",
      cashier: "Cashier 1",
      paymentMethod,
      total,
      discount,
      customerName: customerName || undefined,
    };

    addOrder(newOrder);

    toast.success(`Order ${orderNumber} Created!`, {
      description: `Total: Rs ${total} - Est. wait: ${estimatedWait} min`,
      duration: 4000,
    });

    // Print receipt simulation
    setTimeout(() => {
      toast.info("Receipt printing...", { duration: 2000 });
    }, 500);

    clearOrder();
  };

  const applyQuickDiscount = (percent: number) => {
    const discountAmount = Math.round(
      (subtotal * percent) / 100,
    );
    setDiscount(discountAmount);
    toast.success(
      `${percent}% discount applied - Rs ${discountAmount}`,
    );
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-neutral-100">
      {/* Left Side - Menu */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto border-r-0 md:border-r-4 border-neutral-300">
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4 gap-4">
            <div>
              <h2 className="text-accent mb-2">
                Point of Sale
              </h2>
              <p className="text-neutral-600 text-sm">
                Select items to add to order
              </p>
            </div>
            <div className="text-left md:text-right">
              <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-2xl">
                <p className="text-sm">Est. Wait Time</p>
                <p className="text-xl">~{estimatedWait} min</p>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-5">
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 pl-14 border-2 border-neutral-200 rounded-2xl focus:border-primary focus:outline-none text-base font-medium placeholder:text-neutral-400"
            />
            <Package className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          </div>
        </div>

        {/* Category Tabs with Keyboard Shortcuts */}
        <div className="flex gap-2 md:gap-3 mb-6 overflow-x-auto pb-2">
          {categories.map((category, index) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 md:px-7 py-3.5 md:py-4 rounded-2xl whitespace-nowrap transition-all relative text-base md:text-lg font-semibold ${
                selectedCategory === category
                  ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg scale-105"
                  : "bg-white text-neutral-700 hover:bg-neutral-50 shadow-sm border border-neutral-200"
              }`}
            >
              {category}
              <span className="hidden lg:inline absolute -top-2 -right-2 text-xs bg-neutral-800 text-white px-2 py-1 rounded-lg opacity-80 font-normal">
                F{index + 1}
              </span>
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5">
          {filteredItems.map((item) => (
            <button
              key={item.id}
              onClick={() => addToOrder(item)}
              className="bg-white rounded-3xl p-3 md:p-5 shadow-sm hover:shadow-lg transition-all group border border-neutral-100 hover:border-primary"
            >
              <div className="aspect-square rounded-2xl overflow-hidden mb-3 md:mb-4 bg-neutral-100">
                <ImageWithFallback
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                />
              </div>
              <h4 className="text-neutral-800 mb-2 line-clamp-2 min-h-[2.5em] md:min-h-[3em] text-sm md:text-base">
                {item.name}
              </h4>
              <p className="text-primary text-sm md:text-base">
                Rs {item.price}
              </p>
            </button>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-16 text-neutral-400">
            <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No items found</p>
          </div>
        )}
      </div>

      {/* Right Side - Order Summary */}
      <div className="w-full md:w-[420px] lg:w-[460px] bg-white shadow-2xl p-4 md:p-8 flex flex-col border-l-0 md:border-l-4 border-neutral-300 max-h-[50vh] md:max-h-none">
        <div className="mb-6">
          <h3 className="text-accent mb-2">Current Order</h3>
          <p className="text-neutral-600 text-sm">
            {orderItems.length} item
            {orderItems.length !== 1 ? "s" : ""}
          </p>

          {/* Customer Details */}
          {!showCheckout && (
            <div className="mt-4 space-y-3">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Customer Name (optional)"
                  value={customerName}
                  onChange={(e) =>
                    setCustomerName(e.target.value)
                  }
                  className="w-full pl-10 pr-4 py-2.5 border border-neutral-200 rounded-xl focus:border-primary focus:outline-none text-sm"
                />
              </div>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Table Number (optional)"
                  value={tableNumber}
                  onChange={(e) =>
                    setTableNumber(e.target.value)
                  }
                  className="w-full pl-10 pr-4 py-2.5 border border-neutral-200 rounded-xl focus:border-primary focus:outline-none text-sm"
                />
              </div>
            </div>
          )}
        </div>

        {/* Order Items */}
        <div className="flex-1 overflow-y-auto space-y-3 mb-6">
          {orderItems.length === 0 ? (
            <div className="text-center py-16 text-neutral-400">
              <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="mb-1">No items in order</p>
              <p className="text-sm">Select items to add</p>
              <p className="text-xs mt-3 text-neutral-500">
                Tip: Use Ctrl+Enter to checkout
              </p>
            </div>
          ) : (
            orderItems.map((item) => (
              <div
                key={item.id}
                className="bg-neutral-50 rounded-2xl p-5"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h4 className="text-neutral-800 mb-1">
                      {item.name}
                    </h4>
                    <p className="text-neutral-500 text-sm">
                      Rs {item.price} each
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-danger hover:bg-red-50 p-2 rounded-xl transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, -1)
                      }
                      className="w-10 h-10 bg-white rounded-xl flex items-center justify-center hover:bg-neutral-200 transition-all shadow-sm border border-neutral-200"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white hover:bg-primary-dark transition-all shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-primary">
                    Rs {item.price * item.quantity}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary */}
        <div className="space-y-4 mb-6 p-5 bg-neutral-50 rounded-2xl">
          <div className="flex justify-between text-neutral-600">
            <span>Subtotal</span>
            <span className="text-neutral-900">
              Rs {subtotal}
            </span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-neutral-600">
              <span>Discount</span>
              <span className="text-success">
                -Rs {discount}
              </span>
            </div>
          )}
          <div className="border-t border-neutral-200 pt-4 flex justify-between">
            <span className="text-neutral-800">Total</span>
            <h3 className="text-primary">Rs {total}</h3>
          </div>
        </div>

        {/* Quick Discount Buttons */}
        {!showCheckout && orderItems.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-neutral-500 mb-2">
              Quick Discount:
            </p>
            <div className="grid grid-cols-3 gap-2">
              {[5, 10, 15].map((percent) => (
                <button
                  key={percent}
                  onClick={() => applyQuickDiscount(percent)}
                  className="py-2 px-3 bg-neutral-200 text-neutral-700 rounded-xl hover:bg-neutral-300 transition-all text-sm"
                >
                  {percent}% OFF
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {!showCheckout ? (
            <>
              <button
                onClick={() => setShowCheckout(true)}
                disabled={orderItems.length === 0}
                className="w-full py-5 bg-gradient-to-r from-primary to-secondary text-white rounded-2xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Checkout (Rs {total})
                <span className="block text-xs mt-1 opacity-80">
                  Ctrl+Enter
                </span>
              </button>
              <button
                onClick={clearOrder}
                disabled={orderItems.length === 0}
                className="w-full py-3 bg-neutral-200 text-neutral-700 rounded-2xl hover:bg-neutral-300 transition-all disabled:opacity-50"
              >
                Clear Order (Esc)
              </button>
            </>
          ) : (
            <div className="space-y-3">
              <p className="text-center text-neutral-600 mb-2 pt-2">
                Select Payment Method
              </p>
              <button
                onClick={() => handlePayment("cash")}
                className="w-full py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <Banknote className="w-5 h-5" />
                Cash Payment
              </button>
              <button
                onClick={() => handlePayment("card")}
                className="w-full py-4 bg-neutral-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <CreditCard className="w-5 h-5" />
                Card Payment
              </button>
              <button
                onClick={() => handlePayment("mobile")}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <Smartphone className="w-5 h-5" />
                Mobile Payment
              </button>
              <button
                onClick={() => setShowCheckout(false)}
                className="w-full py-3 bg-neutral-200 text-neutral-700 rounded-2xl hover:bg-neutral-300 transition-all"
              >
                Back
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}