import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";
import PetCard from "@/components/pet-card";
import BottomNavigation from "@/components/bottom-navigation";
import { Heart } from "lucide-react";

interface FavoritePet {
  userId: string;
  petId: number;
  createdAt: string;
  pet: {
    id: number;
    name: string;
    breed: string;
    species: string;
    age: string;
    images: string[];
    status: string;
  };
}

export default function Favorites() {
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

  const { data: favorites = [], isLoading } = useQuery({
    queryKey: ["/api/favorites"],
    enabled: isAuthenticated,
  });

  const handleToggleFavorite = (petId: number) => {
    // This will remove from favorites since they're already favorited
    // The mutation will be handled by the parent component
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-paw-cream">
        <div className="bg-paw-brown h-6 w-full"></div>
        <div className="max-w-md mx-auto bg-white min-h-screen">
          <Header />
          <div className="px-4 py-8">
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-3xl overflow-hidden card-shadow animate-pulse">
                  <div className="w-full h-32 bg-gray-200"></div>
                  <div className="p-3 space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
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
              <Heart className="text-paw-orange" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-paw-dark">My Favorites</h1>
              <p className="text-paw-light text-sm">
                {favorites.length} pet{favorites.length !== 1 ? 's' : ''} saved
              </p>
            </div>
          </div>
        </div>

        {/* Favorites Grid */}
        <div className="px-4 py-4 pb-24">
          {favorites.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-paw-cream rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Heart className="text-paw-light" size={32} />
              </div>
              <h3 className="text-lg font-bold text-paw-dark mb-2">No favorites yet</h3>
              <p className="text-paw-light mb-6">
                Start browsing pets and add them to your favorites
              </p>
              <button 
                onClick={() => window.location.href = "/"}
                className="bg-paw-brown text-white px-6 py-3 rounded-2xl font-medium"
              >
                Browse Pets
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {favorites.map((favorite: FavoritePet) => (
                <PetCard
                  key={favorite.pet.id}
                  pet={favorite.pet}
                  isFavorite={true}
                  onToggleFavorite={handleToggleFavorite}
                  onClick={() => {/* Handle pet detail modal */}}
                />
              ))}
            </div>
          )}
        </div>

        <BottomNavigation />
      </div>
    </div>
  );
}
