import { useState } from "react";
import { Search, Calendar, Ruler } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchFilterProps {
  filters: {
    species: string;
    size: string;
    search: string;
  };
  onFiltersChange: (filters: any) => void;
}

export default function SearchFilter({ filters, onFiltersChange }: SearchFilterProps) {
  const [localSearch, setLocalSearch] = useState(filters.search);

  const handleSearchChange = (value: string) => {
    setLocalSearch(value);
    onFiltersChange({ ...filters, search: value });
  };

  const handleSpeciesFilter = (species: string) => {
    const newSpecies = filters.species === species ? "" : species;
    onFiltersChange({ ...filters, species: newSpecies });
  };

  return (
    <div className="px-4 py-3 space-y-3">
      {/* Search Input */}
      <div className="relative">
        <Input
          type="text"
          placeholder="Search by breed, name, or age..."
          value={localSearch}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full bg-white rounded-2xl px-4 py-3 pl-11 text-paw-dark placeholder:text-paw-light border border-gray-100 focus:border-paw-orange"
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-paw-light" size={16} />
      </div>
      
      {/* Species Filter Buttons */}
      <div className="flex space-x-3 overflow-x-auto scrollbar-hide">
        <Button
          variant={!filters.species ? "default" : "outline"}
          className={`flex-shrink-0 rounded-xl text-sm font-medium ${
            !filters.species
              ? "bg-paw-brown text-white hover:bg-paw-dark"
              : "bg-white text-paw-brown border-gray-100 hover:bg-paw-cream"
          }`}
          onClick={() => onFiltersChange({ ...filters, species: "" })}
        >
          All Pets
        </Button>
        <Button
          variant={filters.species === "dog" ? "default" : "outline"}
          className={`flex-shrink-0 rounded-xl text-sm font-medium ${
            filters.species === "dog"
              ? "bg-paw-brown text-white hover:bg-paw-dark"
              : "bg-white text-paw-brown border-gray-100 hover:bg-paw-cream"
          }`}
          onClick={() => handleSpeciesFilter("dog")}
        >
          🐕 Dogs
        </Button>
        <Button
          variant={filters.species === "cat" ? "default" : "outline"}
          className={`flex-shrink-0 rounded-xl text-sm font-medium ${
            filters.species === "cat"
              ? "bg-paw-brown text-white hover:bg-paw-dark"
              : "bg-white text-paw-brown border-gray-100 hover:bg-paw-cream"
          }`}
          onClick={() => handleSpeciesFilter("cat")}
        >
          🐱 Cats
        </Button>
        <Button
          variant={filters.species === "rabbit" ? "default" : "outline"}
          className={`flex-shrink-0 rounded-xl text-sm font-medium ${
            filters.species === "rabbit"
              ? "bg-paw-brown text-white hover:bg-paw-dark"
              : "bg-white text-paw-brown border-gray-100 hover:bg-paw-cream"
          }`}
          onClick={() => handleSpeciesFilter("rabbit")}
        >
          🐰 Others
        </Button>
      </div>
      
      {/* Filter Options */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-3">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center space-x-2 bg-white px-3 py-2 rounded-xl border-gray-100 text-paw-dark hover:bg-paw-cream"
          >
            <Calendar className="text-paw-light" size={14} />
            <span className="text-sm">Age</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center space-x-2 bg-white px-3 py-2 rounded-xl border-gray-100 text-paw-dark hover:bg-paw-cream"
          >
            <Ruler className="text-paw-light" size={14} />
            <span className="text-sm">Size</span>
          </Button>
        </div>
        <span className="text-paw-light text-sm">127 pets nearby</span>
      </div>
    </div>
  );
}
