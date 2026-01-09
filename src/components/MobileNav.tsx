import { useState } from "react";
import { Home, ShoppingCart, Package, UtensilsCrossed, Users, FileText, Settings, LogOut, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface MobileNavProps {
  onLogout: () => void;
  userRole?: string;
}

export function MobileNav({ onLogout, userRole }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
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

  const currentPage = menuItems.find(item => item.path === location.pathname);

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-neutral-200 p-4 z-50 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-md">
              <UtensilsCrossed className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-neutral-900 text-base font-semibold leading-tight">Jervis Corner</h3>
              <p className="text-xs text-neutral-500 mt-0.5">{currentPage?.label || 'Dashboard'}</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 hover:bg-neutral-100 rounded-xl transition-all active:scale-95"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6 text-neutral-700" /> : <Menu className="w-6 h-6 text-neutral-700" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed top-0 left-0 bottom-0 w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
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
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                    isActive
                      ? "bg-gradient-to-r from-primary to-secondary text-white shadow-md"
                      : "text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 active:scale-95"
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
              onClick={() => {
                setIsOpen(false);
                onLogout();
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-danger hover:bg-red-50 w-full transition-all font-medium text-sm active:scale-95"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Spacer for mobile header */}
      <div className="md:hidden h-[72px]" />
    </>
  );
}
