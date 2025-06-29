import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Users, Shield, MapPin } from "lucide-react";
import pawConnectLogo from "@assets/Gemini_Generated_Image_ogsbfwogsbfwogsb_1751174714789.png";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F1E8' }}>
      {/* Status Bar */}
      <div className="h-6 w-full" style={{ backgroundColor: '#5D4E37' }}></div>
      
      <div className="max-w-md mx-auto bg-white min-h-screen">
        {/* Hero Section with Logo Colors */}
        <div className="px-6 py-8 text-center" style={{ background: 'linear-gradient(135deg, #F5F1E8 0%, #FFFFFF 100%)' }}>
          {/* Large Centered Logo */}
          <div className="w-40 h-40 mx-auto mb-8 flex items-center justify-center">
            <img 
              src={pawConnectLogo} 
              alt="PawConnect Logo" 
              className="w-full h-full object-contain drop-shadow-lg"
              style={{ filter: 'contrast(1.1) saturate(1.1)' }}
            />
          </div>
          
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#5D4E37' }}>
            Welcome to PawConnect
          </h1>
          <p className="text-sm font-medium mb-6" style={{ color: '#8B7355' }}>
            At the Heart of Hills
          </p>
          
          <p className="text-lg mb-8" style={{ color: '#6B5B47' }}>
            Find your perfect furry companion and make a difference in their life
          </p>
        </div>

        {/* Pet Image Section */}
        <div className="px-6 mb-8">
          <div className="rounded-3xl p-6" style={{ backgroundColor: '#F5F1E8' }}>
            <img 
              src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
              alt="Happy pets waiting for adoption"
              className="w-full h-48 object-cover rounded-2xl shadow-lg"
            />
          </div>
        </div>

        {/* Features */}
        <div className="px-6 space-y-4 mb-12">
          <div className="flex items-center space-x-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#F5F1E8' }}>
              <Heart className="text-red-500" size={24} />
            </div>
            <div>
              <h3 className="font-bold" style={{ color: '#5D4E37' }}>Find Love</h3>
              <p className="text-sm" style={{ color: '#8B7355' }}>Browse adorable pets looking for homes</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#F5F1E8' }}>
              <Users style={{ color: '#5D4E37' }} size={24} />
            </div>
            <div>
              <h3 className="font-bold" style={{ color: '#5D4E37' }}>Connect</h3>
              <p className="text-sm" style={{ color: '#8B7355' }}>Connect directly with local shelters</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#F5F1E8' }}>
              <Shield style={{ color: '#5D4E37' }} size={24} />
            </div>
            <div>
              <h3 className="font-bold" style={{ color: '#5D4E37' }}>Safe Process</h3>
              <p className="text-sm" style={{ color: '#8B7355' }}>Secure and verified adoption process</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="px-6 pb-12">
          <Button 
            onClick={handleLogin}
            className="w-full text-white py-4 text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200"
            style={{ 
              backgroundColor: '#5D4E37',
              borderColor: '#5D4E37'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#4A3A2A';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#5D4E37';
            }}
            size="lg"
          >
            Get Started
          </Button>
          
          <p className="text-center text-sm mt-4" style={{ color: '#8B7355' }}>
            Join thousands of happy pet families
          </p>
        </div>
      </div>
    </div>
  );
}
