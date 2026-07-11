import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface FilterState {
  make: string;
  category: string;
}

interface FilterBarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}

const CATEGORIES = ['SUV', 'Sedan', 'Truck', 'Coupe', 'Convertible', 'Hatchback'];

export function FilterBar({ filters, setFilters }: FilterBarProps) {
  const handleCategoryToggle = (cat: string) => {
    setFilters((prev) => ({
      ...prev,
      category: prev.category === cat ? '' : cat,
    }));
  };

  const handleClearFilters = () => {
    setFilters({ make: '', category: '' });
  };

  const hasActiveFilters = filters.make || filters.category;

  return (
    <div className="w-full space-y-4 mb-8">
      {/* Search Input & Clear */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by Make (e.g. Ford, Toyota)..."
            className="pl-9 bg-card/50 backdrop-blur-sm border-border/50 h-12 text-base transition-all focus:bg-background"
            value={filters.make}
            onChange={(e) => setFilters((prev) => ({ ...prev, make: e.target.value }))}
          />
        </div>

        <AnimatePresence>
          {hasActiveFilters && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, width: 0 }}
              animate={{ opacity: 1, scale: 1, width: 'auto' }}
              exit={{ opacity: 0, scale: 0.9, width: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                variant="destructive"
                className="h-12 w-full sm:w-auto"
                onClick={handleClearFilters}
              >
                <X className="mr-2 h-4 w-4" />
                Clear Filters
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Categories Chips */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-sm font-medium text-muted-foreground mr-2">Categories:</span>
        {CATEGORIES.map((cat) => (
          <Badge
            key={cat}
            variant={filters.category === cat ? 'default' : 'outline'}
            className="cursor-pointer text-sm py-1 px-3 hover:bg-primary/90 transition-colors"
            onClick={() => handleCategoryToggle(cat)}
          >
            {cat}
          </Badge>
        ))}
      </div>
    </div>
  );
}
