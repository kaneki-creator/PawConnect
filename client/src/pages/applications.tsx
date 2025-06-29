import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";
import BottomNavigation from "@/components/bottom-navigation";
import { FileText, Clock, CheckCircle, XCircle } from "lucide-react";

interface Application {
  id: number;
  status: string;
  message: string;
  createdAt: string;
  pet: {
    id: number;
    name: string;
    breed: string;
    species: string;
    images: string[];
  };
}

export default function Applications() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, authLoading, toast]);

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ["/api/applications"],
    enabled: isAuthenticated,
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="text-yellow-500" size={20} />;
      case "approved":
        return <CheckCircle className="text-paw-success" size={20} />;
      case "rejected":
        return <XCircle className="text-red-500" size={20} />;
      default:
        return <FileText className="text-paw-light" size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-paw-cream">
        <div className="bg-paw-brown h-6 w-full"></div>
        <div className="max-w-md mx-auto bg-white min-h-screen">
          <Header />
          <div className="px-4 py-8 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 card-shadow animate-pulse">
                <div className="flex space-x-3">
                  <div className="w-16 h-16 bg-gray-200 rounded-xl"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paw-cream">
      <div className="bg-paw-brown h-6 w-full"></div>
      
      <div className="max-w-md mx-auto bg-white min-h-screen relative">
        <Header />
        
        {/* Page Header */}
        <div className="px-4 py-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-paw-cream rounded-xl flex items-center justify-center">
              <FileText className="text-paw-orange" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-paw-dark">My Applications</h1>
              <p className="text-paw-light text-sm">
                {applications.length} application{applications.length !== 1 ? 's' : ''} submitted
              </p>
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div className="px-4 py-4 pb-24 space-y-4">
          {applications.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-paw-cream rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText className="text-paw-light" size={32} />
              </div>
              <h3 className="text-lg font-bold text-paw-dark mb-2">No applications yet</h3>
              <p className="text-paw-light mb-6">
                Start your adoption journey by applying for a pet
              </p>
              <button 
                onClick={() => window.location.href = "/"}
                className="bg-paw-brown text-white px-6 py-3 rounded-2xl font-medium"
              >
                Browse Pets
              </button>
            </div>
          ) : (
            applications.map((application: Application) => (
              <div key={application.id} className="bg-white rounded-2xl p-4 card-shadow">
                <div className="flex space-x-3">
                  <img
                    src={application.pet.images[0] || "/placeholder-pet.jpg"}
                    alt={application.pet.name}
                    className="w-16 h-16 object-cover rounded-xl"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-paw-dark">{application.pet.name}</h3>
                        <p className="text-paw-light text-sm">{application.pet.breed}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(application.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-paw-light text-sm mb-2 line-clamp-2">
                      {application.message}
                    </p>
                    
                    <p className="text-paw-light text-xs">
                      Applied {new Date(application.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                {application.status === "approved" && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex space-x-2">
                      <button className="flex-1 bg-paw-cream text-paw-brown py-2 px-4 rounded-xl text-sm font-medium">
                        Contact Shelter
                      </button>
                      <button className="flex-1 bg-paw-brown text-white py-2 px-4 rounded-xl text-sm font-medium">
                        Complete Adoption
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <BottomNavigation />
      </div>
    </div>
  );
}
