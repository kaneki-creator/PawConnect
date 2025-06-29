import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Users, Shield, MapPin } from "lucide-react";
import pawConnectLogo from "@assets/ChatGPT Image May 2, 2025, 06_49_52 AM_1751171914710.png";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-paw-cream">
      {/* Status Bar */}
      <div className="bg-paw-brown h-6 w-full"></div>
      
      <div className="max-w-md mx-auto bg-white min-h-screen">
        {/* Hero Section */}
        <div className="px-6 py-12 text-center">
          <div className="w-24 h-24 bg-paw-cream rounded-3xl flex items-center justify-center mx-auto mb-6 p-2">
            <img 
              src={pawConnectLogo} 
              alt="PawConnect Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          
          <h1 className="text-3xl font-bold text-paw-dark mb-2">
            Welcome to PawConnect
          </h1>
          <p className="text-paw-brown text-sm font-medium mb-4">
            At the Heart of Hills
          </p>
          
          <p className="text-paw-light text-lg mb-8">
            Find your perfect furry companion and make a difference in their life
          </p>
          
          <div className="bg-paw-cream rounded-3xl p-8 mb-8">
            <img 
              src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
              alt="Happy pets waiting for adoption"
              className="w-full h-48 object-cover rounded-2xl"
            />
          </div>
        </div>

        {/* Features */}
        <div className="px-6 space-y-4 mb-12">
          <div className="flex items-center space-x-4 bg-white rounded-2xl p-4 card-shadow">
            <div className="w-12 h-12 bg-paw-cream rounded-xl flex items-center justify-center">
              <Heart className="text-paw-orange" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-paw-dark">Find Love</h3>
              <p className="text-paw-light text-sm">Browse adorable pets looking for homes</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 bg-white rounded-2xl p-4 card-shadow">
            <div className="w-12 h-12 bg-paw-cream rounded-xl flex items-center justify-center">
              <Users className="text-paw-orange" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-paw-dark">Connect</h3>
              <p className="text-paw-light text-sm">Connect directly with local shelters</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 bg-white rounded-2xl p-4 card-shadow">
            <div className="w-12 h-12 bg-paw-cream rounded-xl flex items-center justify-center">
              <Shield className="text-paw-orange" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-paw-dark">Safe Process</h3>
              <p className="text-paw-light text-sm">Secure and verified adoption process</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="px-6 pb-12">
          <Button 
            onClick={handleLogin}
            className="w-full bg-paw-brown hover:bg-paw-dark text-white py-4 text-lg font-bold rounded-2xl"
            size="lg"
          >
            Get Started
          </Button>
          
          <p className="text-center text-paw-light text-sm mt-4">
            Join thousands of happy pet families
          </p>
        </div>
      </div>
    </div>
  );
}
