import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Heart, Phone, Calendar, Weight, MapPin, Home, Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface PetDetailModalProps {
  petId: number;
  onClose: () => void;
}

interface PetDetail {
  id: number;
  name: string;
  breed: string;
  species: string;
  age: string;
  weight?: string;
  gender: string;
  description?: string;
  characteristics?: string[];
  images: string[];
  status: string;
  shelter: {
    id: number;
    name: string;
    location: string;
    rating?: string;
    reviewCount?: number;
  };
}

export default function PetDetailModal({ petId, onClose }: PetDetailModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: pet, isLoading } = useQuery<PetDetail>({
    queryKey: [`/api/pets/${petId}`],
  });

  const { data: favoriteStatus } = useQuery({
    queryKey: [`/api/favorites/${petId}/check`],
    enabled: isAuthenticated,
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: async () => {
      if (favoriteStatus?.isFavorite) {
        await apiRequest("DELETE", `/api/favorites/${petId}`);
      } else {
        await apiRequest("POST", "/api/favorites", { petId });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/favorites/${petId}/check`] });
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
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

  const applyMutation = useMutation({
    mutationFn: async (applicationData: any) => {
      await apiRequest("POST", "/api/applications", applicationData);
    },
    onSuccess: () => {
      toast({
        title: "Application Submitted",
        description: "Your adoption application has been submitted successfully!",
      });
      setShowApplicationForm(false);
      queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
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
        description: "Failed to submit application",
        variant: "destructive",
      });
    },
  });

  const handleFavoriteToggle = () => {
    if (!isAuthenticated) {
      window.location.href = "/api/login";
      return;
    }
    toggleFavoriteMutation.mutate();
  };

  const handleApply = () => {
    if (!isAuthenticated) {
      window.location.href = "/api/login";
      return;
    }
    
    const applicationData = {
      petId,
      message: `I would like to adopt ${pet?.name}. I believe I can provide a loving home.`,
      contactInfo: {},
      experienceInfo: {},
    };
    
    applyMutation.mutate(applicationData);
  };

  const handleContactShelter = () => {
    // In a real app, this would open a contact form or dial number
    toast({
      title: "Contact Information",
      description: `Please contact ${pet?.shelter.name} for more information about ${pet?.name}.`,
    });
  };

  if (isLoading || !pet) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-md mx-auto h-[90vh] p-0 overflow-hidden">
          <div className="animate-pulse">
            <div className="w-full h-64 bg-gray-200"></div>
            <div className="p-6 space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="grid grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="text-center space-y-2">
                    <div className="w-12 h-12 bg-gray-200 rounded-2xl mx-auto"></div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto h-[90vh] p-0 overflow-hidden">
        <div className="relative h-full overflow-y-auto">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center"
          >
            <X size={20} />
          </button>

          {/* Photo Gallery */}
          <div className="relative">
            <div className="photo-gallery flex overflow-x-auto scrollbar-hide">
              {pet.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${pet.name} photo ${index + 1}`}
                  className="w-full h-64 object-cover flex-shrink-0"
                  onLoad={() => {
                    // Update current image index based on scroll position
                    const gallery = document.querySelector('.photo-gallery');
                    if (gallery) {
                      const scrollLeft = gallery.scrollLeft;
                      const itemWidth = gallery.clientWidth;
                      const newIndex = Math.round(scrollLeft / itemWidth);
                      setCurrentImageIndex(newIndex);
                    }
                  }}
                />
              ))}
            </div>
            
            {/* Photo Indicators */}
            {pet.images.length > 1 && (
              <div className="flex justify-center space-x-2 py-3">
                {pet.images.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === currentImageIndex ? "bg-paw-brown" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Pet Info */}
          <div className="px-6 pb-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-paw-dark">{pet.name}</h2>
                <p className="text-paw-light">{pet.breed} • {pet.gender}</p>
              </div>
              <button
                onClick={handleFavoriteToggle}
                className="w-12 h-12 bg-paw-cream rounded-full flex items-center justify-center"
              >
                <Heart
                  className={favoriteStatus?.isFavorite ? "text-paw-orange fill-current" : "text-paw-light"}
                  size={24}
                />
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-paw-cream rounded-2xl flex items-center justify-center mx-auto mb-2">
                  <Calendar className="text-paw-brown" size={20} />
                </div>
                <p className="text-paw-dark font-medium">{pet.age}</p>
                <p className="text-paw-light text-sm">Age</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-paw-cream rounded-2xl flex items-center justify-center mx-auto mb-2">
                  <Weight className="text-paw-brown" size={20} />
                </div>
                <p className="text-paw-dark font-medium">{pet.weight || "N/A"}</p>
                <p className="text-paw-light text-sm">Weight</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-paw-cream rounded-2xl flex items-center justify-center mx-auto mb-2">
                  <MapPin className="text-paw-brown" size={20} />
                </div>
                <p className="text-paw-dark font-medium">1.2 km</p>
                <p className="text-paw-light text-sm">Distance</p>
              </div>
            </div>

            {/* About */}
            {pet.description && (
              <div className="mb-6">
                <h3 className="text-lg font-bold text-paw-dark mb-3">About {pet.name}</h3>
                <p className="text-paw-light leading-relaxed">{pet.description}</p>
              </div>
            )}

            {/* Characteristics */}
            {pet.characteristics && pet.characteristics.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-bold text-paw-dark mb-3">Characteristics</h3>
                <div className="flex flex-wrap gap-2">
                  {pet.characteristics.map((trait, index) => (
                    <span key={index} className="bg-paw-cream text-paw-brown px-3 py-1 rounded-full text-sm">
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Shelter Info */}
            <div className="bg-paw-cream rounded-2xl p-4 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-paw-brown rounded-xl flex items-center justify-center">
                  <Home className="text-white" size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-paw-dark">{pet.shelter.name}</h4>
                  <p className="text-paw-light text-sm">{pet.shelter.location}</p>
                  {pet.shelter.rating && (
                    <div className="flex items-center space-x-1">
                      <div className="flex text-yellow-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={12} className="fill-current" />
                        ))}
                      </div>
                      <span className="text-paw-light text-xs">
                        {pet.shelter.rating} ({pet.shelter.reviewCount} reviews)
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <Button
                onClick={handleContactShelter}
                variant="outline"
                className="flex-1 bg-paw-cream text-paw-brown border-paw-light hover:bg-paw-light hover:text-white py-4 rounded-2xl font-bold"
              >
                <Phone size={16} className="mr-2" />
                Contact
              </Button>
              <Button
                onClick={handleApply}
                disabled={pet.status !== "available"}
                className="flex-1 bg-paw-brown text-white hover:bg-paw-dark py-4 rounded-2xl font-bold disabled:opacity-50"
              >
                <Heart size={16} className="mr-2" />
                Adopt {pet.name}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
