import { useState } from "react";
import { Heart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";

interface Pet {
  id: number;
  name: string;
  breed: string;
  species: string;
  age: string;
  images: string[];
  status: string;
}

interface PetCardProps {
  pet: Pet;
  isFavorite?: boolean;
  onToggleFavorite: (petId: number, isFavorite: boolean) => void;
  onClick: () => void;
}

export default function PetCard({ pet, isFavorite: propIsFavorite, onToggleFavorite, onClick }: PetCardProps) {
  const { isAuthenticated } = useAuth();
  const [isAnimating, setIsAnimating] = useState(false);

  // Check if pet is favorited (only if authenticated)
  const { data: favoriteStatus } = useQuery({
    queryKey: [`/api/favorites/${pet.id}/check`],
    enabled: isAuthenticated && propIsFavorite === undefined,
  });

  const isFavorite = propIsFavorite !== undefined ? propIsFavorite : favoriteStatus?.isFavorite || false;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      window.location.href = "/api/login";
      return;
    }

    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
    onToggleFavorite(pet.id, isFavorite);
  };

  const getStatusColor = () => {
    switch (pet.status) {
      case "available":
        return "bg-paw-success";
      case "pending":
        return "bg-orange-500";
      case "adopted":
        return "bg-gray-500";
      default:
        return "bg-paw-success";
    }
  };

  const getStatusText = () => {
    switch (pet.status) {
      case "available":
        return "Available";
      case "pending":
        return "Pending";
      case "adopted":
        return "Adopted";
      default:
        return "Available";
    }
  };

  return (
    <div className="pet-card bg-white rounded-3xl overflow-hidden card-shadow cursor-pointer" onClick={onClick}>
      <div className="relative">
        <img
          src={pet.images?.[0] || "/placeholder-pet.jpg"}
          alt={pet.name}
          className="w-full h-32 object-cover"
        />
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center"
        >
          <Heart
            className={`${
              isFavorite ? "text-paw-orange fill-current" : "text-gray-400"
            } ${isAnimating ? "heart-like" : ""}`}
            size={16}
          />
        </button>
        <div className={`absolute bottom-3 left-3 ${getStatusColor()} px-2 py-1 rounded-full`}>
          <span className="text-white text-xs font-medium">{getStatusText()}</span>
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-bold text-paw-dark truncate">{pet.name}</h3>
        <p className="text-paw-light text-sm truncate">{pet.breed}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-paw-brown text-sm font-medium">{pet.age}</span>
          <span className="text-paw-light text-xs">1.2 km</span>
        </div>
      </div>
    </div>
  );
}
