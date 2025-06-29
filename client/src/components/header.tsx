import { useAuth } from "@/hooks/useAuth";
import { Bell, User } from "lucide-react";
import pawConnectLogo from "@assets/ChatGPT Image May 2, 2025, 06_49_52 AM_1751171914710.png";

export default function Header() {
  const { user } = useAuth();

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  return (
    <header className="bg-white px-4 py-3 border-b border-gray-100 sticky top-0 z-50">
      {/* Professional Logo Header - Similar to Zomato */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg overflow-hidden bg-gradient-to-br from-paw-orange to-paw-brown shadow-sm">
            <img 
              src={pawConnectLogo} 
              alt="PawConnect Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-paw-dark font-bold text-lg">PawConnect</h1>
        </div>
        <div className="flex items-center space-x-2">
          <button className="w-9 h-9 bg-paw-cream/50 rounded-lg flex items-center justify-center relative hover:bg-paw-cream/70 transition-colors">
            <Bell className="text-paw-brown" size={18} />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-paw-orange rounded-full"></span>
          </button>
          <button 
            onClick={handleLogout}
            className="w-9 h-9 bg-paw-cream/50 rounded-lg flex items-center justify-center hover:bg-paw-cream/70 transition-colors"
          >
            {(user as any)?.profileImageUrl ? (
              <img 
                src={(user as any).profileImageUrl} 
                alt="Profile" 
                className="w-7 h-7 rounded-md object-cover"
              />
            ) : (
              <User className="text-paw-brown" size={18} />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}