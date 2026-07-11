import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export interface FilterState {
  search: string;
  category: string;
  minPrice: string;
  maxPrice: string;
}

interface FilterBarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}

const CATEGORIES = ['SUV', 'Sedan', 'Truck', 'Coupe', 'Convertible', 'Hatchback'];

export function FilterBar({ filters, setFilters }: FilterBarProps) {
  return (
    <div className="w-full mb-12 border-b border-border/50 pb-6">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-3 items-center">
          <button
            onClick={() => setFilters((prev) => ({ ...prev, category: '' }))}
            className={`px-6 py-2 rounded-full text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 border ${
              filters.category === ''
                ? 'border-primary text-primary bg-primary/5'
                : 'border-border/50 text-muted-foreground hover:border-foreground/50 hover:text-foreground'
            }`}
          >
            All Chassis
          </button>

          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setFilters((prev) => ({ ...prev, category }))}
              className={`px-6 py-2 rounded-full text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 border ${
                filters.category === category
                  ? 'border-primary text-primary bg-primary/5'
                  : 'border-border/50 text-muted-foreground hover:border-foreground/50 hover:text-foreground'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Search & Price */}
        <div className="flex items-center gap-4 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search make or model..."
              className="pl-11 bg-transparent border-border/50 h-10 text-sm rounded-full transition-all focus:border-primary focus:bg-background/50"
              value={filters.search}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
            />
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <Input
              type="number"
              placeholder="Min $"
              className="w-20 bg-transparent border-border/50 h-10 text-sm rounded-full px-4"
              value={filters.minPrice}
              onChange={(e) => setFilters((prev) => ({ ...prev, minPrice: e.target.value }))}
            />
            <Input
              type="number"
              placeholder="Max $"
              className="w-20 bg-transparent border-border/50 h-10 text-sm rounded-full px-4"
              value={filters.maxPrice}
              onChange={(e) => setFilters((prev) => ({ ...prev, maxPrice: e.target.value }))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
