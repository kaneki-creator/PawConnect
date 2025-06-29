import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Header from "@/components/header";
import SearchFilter from "@/components/search-filter";
import PetCard from "@/components/pet-card";
import PetDetailModal from "@/components/pet-detail-modal";
import BottomNavigation from "@/components/bottom-navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface Pet {
  id: number;
  name: string;
  breed: string;
  species: string;
  age: string;
  gender: string;
  size: string;
  images: string[];
  status: string;
}

export default function Home() {
  const [filters, setFilters] = useState({
    species: "",
    size: "",
    search: "",
  });
  const [selectedPetId, setSelectedPetId] = useState<number | null>(null);
  const [limit] = useState(20);
  const [offset, setOffset] = useState(0);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: pets = [], isLoading } = useQuery({
    queryKey: ["/api/pets", filters, limit, offset],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.species) params.set("species", filters.species);
      if (filters.size) params.set("size", filters.size);
      if (filters.search) params.set("search", filters.search);
      params.set("limit", limit.toString());
      params.set("offset", offset.toString());
      
      const response = await fetch(`/api/pets?${params}`);
      if (!response.ok) throw new Error(`${response.status}: ${response.statusText}`);
      return response.json();
    },
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: async ({ petId, isFavorite }: { petId: number; isFavorite: boolean }) => {
      if (isFavorite) {
        await apiRequest("DELETE", `/api/favorites/${petId}`);
      } else {
        await apiRequest("POST", "/api/favorites", { petId });
      }
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to update favorites",
        variant: "destructive",
      });
    },
  });

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setOffset(0);
  };

  const handleLoadMore = () => {
    setOffset(prev => prev + limit);
  };

  const handleToggleFavorite = (petId: number, isFavorite: boolean) => {
    toggleFavoriteMutation.mutate({ petId, isFavorite });
  };

  return (
    <div className="min-h-screen bg-paw-cream">
      {/* Status Bar */}
      <div className="bg-paw-brown h-6 w-full"></div>
      
      <div className="max-w-md mx-auto bg-white min-h-screen relative">
        <Header />
        
        {/* Location Bar */}
        <div className="bg-paw-cream px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <i className="fas fa-map-marker-alt text-paw-orange"></i>
            <span className="text-paw-dark font-medium">Hills District, NSW</span>
          </div>
          <button className="text-paw-brown text-sm font-medium">
            Change
          </button>
        </div>

        <SearchFilter filters={filters} onFiltersChange={handleFilterChange} />

        {/* Pet Grid */}
        <div className="px-4 pb-24">
          {isLoading ? (
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-3xl overflow-hidden card-shadow animate-pulse">
                  <div className="w-full h-32 bg-gray-200"></div>
                  <div className="p-3 space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    <div className="flex justify-between">
                      <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : pets.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-paw-cream rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-search text-paw-light text-2xl"></i>
              </div>
              <h3 className="text-lg font-bold text-paw-dark mb-2">No pets found</h3>
              <p className="text-paw-light">Try adjusting your search filters</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                {pets.map((pet: Pet) => (
                  <PetCard
                    key={pet.id}
                    pet={pet}
                    onToggleFavorite={handleToggleFavorite}
                    onClick={() => setSelectedPetId(pet.id)}
                  />
                ))}
              </div>
              
              {pets.length >= limit && (
                <div className="mt-6 flex justify-center">
                  <Button
                    onClick={handleLoadMore}
                    variant="outline"
                    className="bg-paw-cream text-paw-brown border-paw-light hover:bg-paw-light hover:text-white"
                  >
                    Load More Pets
                  </Button>
                </div>
              )}
            </>
          )}
        </div>

        <BottomNavigation />

        {/* Floating Action Button */}
        <button className="fixed bottom-20 right-4 w-14 h-14 bg-paw-orange text-white rounded-full flex items-center justify-center card-shadow">
          <Plus size={24} />
        </button>

        {selectedPetId && (
          <PetDetailModal
            petId={selectedPetId}
            onClose={() => setSelectedPetId(null)}
          />
        )}
      </div>
    </div>
  );
}
