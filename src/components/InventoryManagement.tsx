import { useState } from "react";
import { Package, AlertTriangle, Plus, Edit, TrendingUp, Search, X } from "lucide-react";

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minLevel: number;
  supplier: string;
}

export function InventoryManagement() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState<Omit<InventoryItem, "id">>({
    name: "",
    category: "Meat",
    quantity: 0,
    unit: "kg",
    minLevel: 0,
    supplier: "",
  });

  const categories = ["All", "Meat", "Vegetables", "Spices", "Packaging", "Beverages"];
  const units = ["kg", "L", "bottles", "pcs", "g"];

  const [inventory, setInventory] = useState<InventoryItem[]>([
    { id: 1, name: "Chicken Breast", category: "Meat", quantity: 5, unit: "kg", minLevel: 10, supplier: "Fresh Meats Co." },
    { id: 2, name: "Ground Beef", category: "Meat", quantity: 8, unit: "kg", minLevel: 5, supplier: "Fresh Meats Co." },
    { id: 3, name: "Cooking Oil", category: "Spices", quantity: 2, unit: "L", minLevel: 5, supplier: "Golden Oil Supplier" },
    { id: 4, name: "Rice", category: "Vegetables", quantity: 50, unit: "kg", minLevel: 20, supplier: "Rice Traders Inc." },
    { id: 5, name: "Noodles", category: "Vegetables", quantity: 25, unit: "kg", minLevel: 15, supplier: "Noodle Distributors" },
    { id: 6, name: "Soy Sauce", category: "Spices", quantity: 12, unit: "bottles", minLevel: 10, supplier: "Spice World" },
    { id: 7, name: "Salt", category: "Spices", quantity: 8, unit: "kg", minLevel: 5, supplier: "Spice World" },
    { id: 8, name: "Pepper", category: "Spices", quantity: 15, unit: "kg", minLevel: 3, supplier: "Spice World" },
    { id: 9, name: "Takeout Containers", category: "Packaging", quantity: 150, unit: "pcs", minLevel: 100, supplier: "Pack Plus" },
    { id: 10, name: "Plastic Bags", category: "Packaging", quantity: 300, unit: "pcs", minLevel: 200, supplier: "Pack Plus" },
    { id: 11, name: "Soft Drinks", category: "Beverages", quantity: 48, unit: "bottles", minLevel: 30, supplier: "Beverage Hub" },
    { id: 12, name: "Water Bottles", category: "Beverages", quantity: 60, unit: "bottles", minLevel: 40, supplier: "Beverage Hub" },
  ]);

  const handleAddStock = () => {
    if (!newItem.name || !newItem.supplier || newItem.quantity < 0 || newItem.minLevel < 0) {
      alert("Please fill in all fields with valid values");
      return;
    }

    const newId = Math.max(...inventory.map(item => item.id), 0) + 1;
    setInventory([...inventory, { ...newItem, id: newId }]);
    setShowAddModal(false);
    setNewItem({
      name: "",
      category: "Meat",
      quantity: 0,
      unit: "kg",
      minLevel: 0,
      supplier: "",
    });
  };

  const filteredInventory = inventory.filter(item => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const lowStockItems = inventory.filter(item => item.quantity < item.minLevel);

  const getStockStatus = (item: InventoryItem) => {
    const percentage = (item.quantity / item.minLevel) * 100;
    if (percentage < 50) return { color: "bg-danger", text: "Critical", textColor: "text-danger" };
    if (percentage < 100) return { color: "bg-warning", text: "Low", textColor: "text-warning" };
    return { color: "bg-success", text: "Good", textColor: "text-success" };
  };

  return (
    <div className="p-8 space-y-8 bg-neutral-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-accent mb-2">Inventory Management</h1>
          <p className="text-neutral-600">Track and manage restaurant supplies</p>
        </div>
        <button className="px-6 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2" onClick={() => setShowAddModal(true)}>
          <Plus className="w-5 h-5" />
          Add Stock
        </button>
      </div>

      {/* Alert Banner */}
      {lowStockItems.length > 0 && (
        <div className="bg-red-50 border-l-4 border-danger rounded-3xl p-7 flex items-start gap-5 shadow-sm border border-red-100">
          <AlertTriangle className="w-7 h-7 text-danger flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-danger mb-2">Low Stock Alert</h3>
            <p className="text-neutral-700 mb-4">
              {lowStockItems.length} item{lowStockItems.length > 1 ? "s" : ""} need to be reordered
            </p>
            <div className="flex flex-wrap gap-2">
              {lowStockItems.map(item => (
                <span key={item.id} className="px-4 py-2 bg-white rounded-xl text-sm text-neutral-700 shadow-sm">
                  {item.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center">
              <Package className="w-7 h-7 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-success" />
          </div>
          <h3 className="text-neutral-800 mb-1">{inventory.length}</h3>
          <p className="text-neutral-500 text-sm">Total Items</p>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-14 h-14 bg-gradient-to-br from-danger to-red-600 rounded-2xl flex items-center justify-center">
              <AlertTriangle className="w-7 h-7 text-white" />
            </div>
          </div>
          <h3 className="text-danger mb-1">{lowStockItems.length}</h3>
          <p className="text-neutral-500 text-sm">Low Stock Items</p>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-14 h-14 bg-gradient-to-br from-success to-green-600 rounded-2xl flex items-center justify-center">
              <Package className="w-7 h-7 text-white" />
            </div>
          </div>
          <h3 className="text-success mb-1">{inventory.filter(i => i.quantity >= i.minLevel).length}</h3>
          <p className="text-neutral-500 text-sm">Well Stocked</p>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-14 h-14 bg-gradient-to-br from-neutral-400 to-neutral-600 rounded-2xl flex items-center justify-center">
              <Package className="w-7 h-7 text-white" />
            </div>
          </div>
          <h3 className="text-neutral-800 mb-1">{categories.length - 1}</h3>
          <p className="text-neutral-500 text-sm">Categories</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-3xl p-7 shadow-sm border border-neutral-100">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search inventory..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 border-2 border-neutral-200 rounded-2xl focus:border-primary focus:outline-none transition-all"
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-3 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3.5 rounded-2xl whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-primary to-secondary text-white shadow-md"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Inventory List */}
      <div className="bg-white rounded-3xl shadow-sm border border-neutral-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="px-6 py-5 text-left text-neutral-700">Item Name</th>
                <th className="px-6 py-5 text-left text-neutral-700">Category</th>
                <th className="px-6 py-5 text-left text-neutral-700">Quantity</th>
                <th className="px-6 py-5 text-left text-neutral-700">Stock Level</th>
                <th className="px-6 py-5 text-left text-neutral-700">Status</th>
                <th className="px-6 py-5 text-left text-neutral-700">Supplier</th>
                <th className="px-6 py-5 text-left text-neutral-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map((item) => {
                const status = getStockStatus(item);
                const percentage = Math.min((item.quantity / item.minLevel) * 100, 100);

                return (
                  <tr key={item.id} className="border-b border-neutral-100 hover:bg-neutral-50 transition-all">
                    <td className="px-6 py-5">
                      <p className="text-neutral-800">{item.name}</p>
                    </td>
                    <td className="px-6 py-5">
                      <span className="px-4 py-2 bg-neutral-100 rounded-xl text-sm text-neutral-600">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-neutral-800">{item.quantity} {item.unit}</p>
                    </td>
                    <td className="px-6 py-5">
                      <div className="space-y-2 w-32">
                        <div className="w-full bg-neutral-200 rounded-full h-2.5">
                          <div
                            className={`h-2.5 rounded-full ${status.color} transition-all`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <p className="text-xs text-neutral-500">Min: {item.minLevel} {item.unit}</p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-4 py-2 rounded-xl text-sm ${status.textColor} bg-opacity-10`}>
                        {status.text}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-neutral-600 text-sm">{item.supplier}</p>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex gap-2">
                        <button className="p-2.5 hover:bg-neutral-100 rounded-xl transition-all">
                          <Edit className="w-4 h-4 text-neutral-600" />
                        </button>
                        <button className="px-5 py-2.5 bg-primary text-white rounded-xl hover:bg-primary-dark transition-all text-sm shadow-sm">
                          Reorder
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Stock Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-3xl p-8 shadow-2xl w-full max-w-md">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-accent">Add New Stock</h2>
              <button className="p-2 hover:bg-neutral-100 rounded-xl transition-all" onClick={() => setShowAddModal(false)}>
                <X className="w-5 h-5 text-neutral-600" />
              </button>
            </div>
            <div className="space-y-5">
              <div>
                <label className="block text-neutral-700 mb-2">Item Name</label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="w-full px-4 py-3.5 border-2 border-neutral-200 rounded-2xl focus:border-primary focus:outline-none transition-all"
                  placeholder="Enter item name"
                />
              </div>
              <div>
                <label className="block text-neutral-700 mb-2">Category</label>
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  className="w-full px-4 py-3.5 border-2 border-neutral-200 rounded-2xl focus:border-primary focus:outline-none transition-all"
                >
                  {categories.slice(1).map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-700 mb-2">Quantity</label>
                  <input
                    type="number"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) })}
                    className="w-full px-4 py-3.5 border-2 border-neutral-200 rounded-2xl focus:border-primary focus:outline-none transition-all"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 mb-2">Unit</label>
                  <select
                    value={newItem.unit}
                    onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                    className="w-full px-4 py-3.5 border-2 border-neutral-200 rounded-2xl focus:border-primary focus:outline-none transition-all"
                  >
                    {units.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-neutral-700 mb-2">Minimum Level</label>
                <input
                  type="number"
                  value={newItem.minLevel}
                  onChange={(e) => setNewItem({ ...newItem, minLevel: parseInt(e.target.value) })}
                  className="w-full px-4 py-3.5 border-2 border-neutral-200 rounded-2xl focus:border-primary focus:outline-none transition-all"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-neutral-700 mb-2">Supplier</label>
                <input
                  type="text"
                  value={newItem.supplier}
                  onChange={(e) => setNewItem({ ...newItem, supplier: e.target.value })}
                  className="w-full px-4 py-3.5 border-2 border-neutral-200 rounded-2xl focus:border-primary focus:outline-none transition-all"
                  placeholder="Enter supplier name"
                />
              </div>
            </div>
            <div className="mt-8 flex gap-3">
              <button 
                className="flex-1 px-6 py-4 bg-neutral-200 text-neutral-700 rounded-2xl hover:bg-neutral-300 transition-all" 
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button 
                className="flex-1 px-6 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-2xl shadow-lg hover:shadow-xl transition-all" 
                onClick={handleAddStock}
              >
                Add Stock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
