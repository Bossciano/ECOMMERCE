import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Toggle } from "@/components/ui/toggle";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, X } from "lucide-react";

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  selectedColors: string[];
  onColorToggle: (color: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  onClearFilters: () => void;
}

const categories = ["All", "Watches", "Footwear", "Electronics", "Bags"];

const colors = [
  { name: "Black", value: "#000000" },
  { name: "White", value: "#FFFFFF" },
  { name: "Silver", value: "#C0C0C0" },
  { name: "Gold", value: "#FFD700" },
  { name: "Navy", value: "#1E3A5F" },
  { name: "Brown", value: "#8B4513" },
];

const FilterBar = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  selectedColors,
  onColorToggle,
  sortBy,
  onSortChange,
  onClearFilters,
}: FilterBarProps) => {
  return (
    <div className="bg-card border-b border-border">
      <div className="container mx-auto px-4 py-6">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Category Filters */}
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-foreground mb-3">Category</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => onCategoryChange(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Price Range: ${priceRange[0]} - ${priceRange[1]}
            </h3>
            <Slider
              value={priceRange}
              onValueChange={(value) => onPriceRangeChange(value as [number, number])}
              min={0}
              max={500}
              step={10}
              className="w-full"
            />
          </div>

          {/* Color Filters */}
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-foreground mb-3">Colors</h3>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <Toggle
                  key={color.name}
                  pressed={selectedColors.includes(color.name)}
                  onPressedChange={() => onColorToggle(color.name)}
                  className="w-10 h-10 rounded-full p-0 border-2"
                  style={{
                    backgroundColor: color.value,
                    borderColor: selectedColors.includes(color.name) ? "hsl(var(--primary))" : "hsl(var(--border))",
                  }}
                  aria-label={color.name}
                />
              ))}
            </div>
          </div>

          {/* Sort Options */}
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-foreground mb-3">Sort By</h3>
            <Select value={sortBy} onValueChange={onSortChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select sort order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="popularity">Most Popular</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Clear Filters */}
        <div className="mt-4 flex justify-end">
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            <X size={16} className="mr-2" />
            Clear All Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
