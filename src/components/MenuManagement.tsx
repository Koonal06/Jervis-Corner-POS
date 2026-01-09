import { useState } from "react";
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, X } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  available: boolean;
  ingredients: string[];
}

export function MenuManagement() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: 1,
      name: "Crispy Fried Chicken",
      category: "Chicken",
      price: 200,
      image: "https://images.unsplash.com/photo-1694853651800-3e9b4aa96a42?w=400",
      available: true,
      ingredients: ["Chicken", "Flour", "Oil", "Spices"],
    },
    {
      id: 2,
      name: "Chicken Fried Rice",
      category: "Fried Rice",
      price: 150,
      image: "https://images.unsplash.com/photo-1646340916384-9845d7686e2e?w=400",
      available: true,
      ingredients: ["Rice", "Chicken", "Eggs", "Vegetables", "Soy Sauce"],
    },
    {
      id: 3,
      name: "Pancit Canton",
      category: "Fried Noodles",
      price: 130,
      image: "https://images.unsplash.com/photo-1635685296916-95acaf58471f?w=400",
      available: true,
      ingredients: ["Noodles", "Vegetables", "Soy Sauce", "Oil"],
    },
    {
      id: 4,
      name: "Spring Rolls (5pcs)",
      category: "Snacks",
      price: 100,
      image: "https://images.unsplash.com/photo-1762305195963-735f8bf9cad1?w=400",
      available: true,
      ingredients: ["Spring Roll Wrapper", "Vegetables", "Meat", "Oil"],
    },
    {
      id: 5,
      name: "Chicken Soup",
      category: "Soups",
      price: 110,
      image: "https://images.unsplash.com/photo-1701109876066-7fc0c08da447?w=400",
      available: false,
      ingredients: ["Chicken", "Vegetables", "Broth", "Spices"],
    },
    {
      id: 6,
      name: "Lemon Iced Tea",
      category: "Drinks",
      price: 60,
      image: "https://images.unsplash.com/photo-1716925539259-ce0115263d37?w=400",
      available: true,
      ingredients: ["Tea", "Lemon", "Sugar", "Ice"],
    },
  ]);

  const toggleAvailability = (id: number) => {
    setMenuItems(menuItems.map(item =>
      item.id === id ? { ...item, available: !item.available } : item
    ));
  };

  const EditDialog = ({ item, onClose }: { item: MenuItem; onClose: () => void }) => {
    const [formData, setFormData] = useState(item);

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
        <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-accent">Edit Menu Item</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-100 rounded-xl transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Item Image */}
            <div>
              <label className="block text-neutral-700 mb-2">Image Preview</label>
              <div className="w-full h-48 rounded-2xl overflow-hidden bg-neutral-100">
                <ImageWithFallback
                  src={formData.image}
                  alt={formData.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-neutral-700 mb-2">Item Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-primary focus:outline-none"
              />
            </div>

            {/* Category and Price */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-neutral-700 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-primary focus:outline-none"
                >
                  <option>Snacks</option>
                  <option>Fried Rice</option>
                  <option>Fried Noodles</option>
                  <option>Chicken</option>
                  <option>Soups</option>
                  <option>Drinks</option>
                </select>
              </div>
              <div>
                <label className="block text-neutral-700 mb-2">Price (Rs)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            {/* Ingredients */}
            <div>
              <label className="block text-neutral-700 mb-2">Ingredients Used</label>
              <div className="flex flex-wrap gap-2 p-4 border-2 border-neutral-200 rounded-xl min-h-[60px]">
                {formData.ingredients.map((ingredient, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-sm"
                  >
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={onClose}
                className="flex-1 py-3 bg-neutral-200 text-neutral-700 rounded-2xl hover:bg-neutral-300 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setMenuItems(menuItems.map(i => i.id === item.id ? formData : i));
                  onClose();
                }}
                className="flex-1 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-2xl shadow-lg hover:shadow-xl transition-all"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-8 space-y-8 bg-neutral-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-accent mb-2">Menu Management</h1>
          <p className="text-neutral-600">Manage menu items and pricing</p>
        </div>
        <button
          onClick={() => setShowAddDialog(true)}
          className="px-6 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add New Item
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-100">
          <h3 className="text-neutral-800 mb-1">{menuItems.length}</h3>
          <p className="text-neutral-500 text-sm">Total Menu Items</p>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-100">
          <h3 className="text-success mb-1">{menuItems.filter(i => i.available).length}</h3>
          <p className="text-neutral-500 text-sm">Available Items</p>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-100">
          <h3 className="text-danger mb-1">{menuItems.filter(i => !i.available).length}</h3>
          <p className="text-neutral-500 text-sm">Unavailable Items</p>
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <div key={item.id} className="bg-white rounded-3xl shadow-sm border border-neutral-100 overflow-hidden hover:shadow-lg transition-all">
            {/* Image */}
            <div className="relative h-52">
              <ImageWithFallback
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
              {!item.available && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                  <span className="px-5 py-2.5 bg-danger text-white rounded-2xl shadow-lg">Unavailable</span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-neutral-800 mb-2">{item.name}</h4>
                  <span className="px-4 py-1.5 bg-neutral-100 text-neutral-600 rounded-xl text-sm">
                    {item.category}
                  </span>
                </div>
                <p className="text-primary">Rs {item.price}</p>
              </div>

              {/* Ingredients */}
              <div className="mb-5">
                <p className="text-neutral-500 text-sm mb-2">Ingredients:</p>
                <div className="flex flex-wrap gap-2">
                  {item.ingredients.map((ingredient, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-neutral-100 text-neutral-600 rounded-lg text-xs"
                    >
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => toggleAvailability(item.id)}
                  className={`flex-1 py-2.5 px-3 rounded-2xl transition-all flex items-center justify-center gap-2 ${
                    item.available
                      ? "bg-success/10 text-success hover:bg-success/20"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  }`}
                >
                  {item.available ? (
                    <>
                      <ToggleRight className="w-4 h-4" />
                      Active
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="w-4 h-4" />
                      Inactive
                    </>
                  )}
                </button>
                <button
                  onClick={() => setEditingItem(item)}
                  className="px-4 py-2.5 bg-primary text-white rounded-2xl hover:bg-primary-dark transition-all shadow-sm"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button className="px-4 py-2.5 bg-danger text-white rounded-2xl hover:bg-red-600 transition-all shadow-sm">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Dialog */}
      {editingItem && (
        <EditDialog item={editingItem} onClose={() => setEditingItem(null)} />
      )}
    </div>
  );
}