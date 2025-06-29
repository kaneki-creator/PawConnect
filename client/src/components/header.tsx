import { useAuth } from "@/hooks/useAuth";
import { Bell, User, MapPin } from "lucide-react";
import pawConnectLogo from "@assets/ChatGPT Image May 2, 2025, 06_49_52 AM_1751171914710.png";

export default function Header() {
  const { user } = useAuth();

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  return (
    <header className="bg-white px-4 py-4 border-b border-gray-100">
      {/* Logo and Branding */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <img 
            src={pawConnectLogo} 
            alt="PawConnect Logo" 
            className="w-12 h-12 object-contain"
          />
          <div>
            <h1 className="text-paw-dark font-bold text-xl">PawConnect</h1>
            <p className="text-paw-light text-sm">At the Heart of Hills</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button className="w-10 h-10 bg-paw-cream rounded-xl flex items-center justify-center relative">
            <Bell className="text-paw-brown" size={20} />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-paw-orange rounded-full"></span>
          </button>
          <button 
            onClick={handleLogout}
            className="w-10 h-10 bg-paw-cream rounded-xl flex items-center justify-center"
          >
            {(user as any)?.profileImageUrl ? (
              <img 
                src={(user as any).profileImageUrl} 
                alt="Profile" 
                className="w-8 h-8 rounded-lg object-cover"
              />
            ) : (
              <User className="text-paw-brown" size={20} />
            )}
          </button>
        </div>
      </div>
      
      {/* Find Adoption Centers Feature */}
      <div className="bg-gradient-to-r from-paw-orange to-paw-brown rounded-2xl p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg mb-1">Find Adoption Centers</h3>
            <p className="text-white/90 text-sm">Discover nearby shelters and rescue centers</p>
          </div>
          <button className="bg-white/20 hover:bg-white/30 rounded-xl px-4 py-2 flex items-center space-x-2 transition-colors">
            <MapPin size={16} />
            <span className="text-sm font-medium">Near You</span>
          </button>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <button className="w-10 h-10 bg-paw-cream rounded-xl flex items-center justify-center relative">
          <Bell className="text-paw-brown" size={20} />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-paw-orange rounded-full"></span>
        </button>
        <button 
          onClick={handleLogout}
          className="w-10 h-10 bg-paw-cream rounded-xl flex items-center justify-center"
        >
          {user?.profileImageUrl ? (
            <img 
              src={user.profileImageUrl} 
              alt="Profile" 
              className="w-8 h-8 rounded-lg object-cover"
            />
          ) : (
            <User className="text-paw-brown" size={20} />
          )}
        </button>
      </div>
    </header>
  );
}
