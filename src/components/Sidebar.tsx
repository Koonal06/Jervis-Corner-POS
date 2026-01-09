import { Home, ShoppingCart, Package, UtensilsCrossed, Users, FileText, Settings, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface SidebarProps {
  onLogout: () => void;
  userRole?: string;
}

export function Sidebar({ onLogout, userRole }: SidebarProps) {
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: ShoppingCart, label: "Orders (POS)", path: "/pos" },
    { icon: UtensilsCrossed, label: "Kitchen", path: "/kitchen" },
    { icon: Package, label: "Inventory", path: "/inventory" },
    { icon: UtensilsCrossed, label: "Menu Items", path: "/menu" },
    { icon: Users, label: "Staff", path: "/staff" },
    { icon: FileText, label: "Reports", path: "/reports" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <div className="w-64 bg-white h-screen shadow-lg flex flex-col border-r border-neutral-200 hidden md:flex">
      {/* Logo */}
      <div className="p-6 border-b border-neutral-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-md">
            <UtensilsCrossed className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-accent text-lg leading-tight">Jervis Corner</h3>
            <p className="text-xs text-neutral-500 mt-0.5">Snack Shop</p>
          </div>
        </div>
        {userRole && (
          <div className="mt-4 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-medium text-center capitalize">
            {userRole}
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                isActive
                  ? "bg-gradient-to-r from-primary to-secondary text-white shadow-md"
                  : "text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900"
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-neutral-200">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-danger hover:bg-red-50 w-full transition-all font-medium text-sm"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}