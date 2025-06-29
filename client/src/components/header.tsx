import { useAuth } from "@/hooks/useAuth";
import { Bell, User, PawPrint } from "lucide-react";

export default function Header() {
  const { user } = useAuth();

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  return (
    <header className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-100">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-paw-brown rounded-xl flex items-center justify-center">
          <PawPrint className="text-white" size={20} />
        </div>
        <div>
          <h1 className="text-paw-dark font-bold text-lg">PawConnect</h1>
          <p className="text-paw-light text-xs">Find your furry friend</p>
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
