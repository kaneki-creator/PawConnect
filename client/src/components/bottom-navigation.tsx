import { useLocation } from "wouter";
import { Home, Search, Heart, FileText, MessageCircle } from "lucide-react";

export default function BottomNavigation() {
  const [location, setLocation] = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Search, label: "Search", path: "/" }, // Same as home for now
    { icon: Heart, label: "Favorites", path: "/favorites", badge: 3 },
    { icon: FileText, label: "Applications", path: "/applications" },
    { icon: MessageCircle, label: "Messages", path: "/messages" },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white bottom-nav-shadow">
      <div className="flex items-center justify-around py-3 px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;
          
          return (
            <button
              key={item.label}
              onClick={() => setLocation(item.path)}
              className={`flex flex-col items-center space-y-1 relative ${
                isActive ? "text-paw-brown" : "text-paw-light"
              }`}
            >
              <Icon size={20} />
              <span className="text-xs font-medium">{item.label}</span>
              {item.badge && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-paw-orange rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">{item.badge}</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
