import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Layout } from '@/components/Layout';
import { FilterBar, type FilterState } from '@/components/FilterBar';
import { VehicleCard, type Vehicle } from '@/components/VehicleCard';
import { Skeleton } from '@/components/ui/skeleton';

export default function Dashboard() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: '',
    minPrice: '',
    maxPrice: '',
  });

  const fetchVehicles = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.category) params.append('category', filters.category);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);

      const response = await api.get(`/vehicles/search?${params.toString()}`);
      if (response.data.success) {
        setVehicles(response.data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchVehicles();
    }, 400);
    return () => clearTimeout(delayDebounceFn);
  }, [filters]);

  return (
    <Layout>
      <div className="container mx-auto px-6 py-12 lg:py-20">
        {/* Veloce Hero Header */}
        <div className="max-w-3xl mb-16">
          <h4 className="text-primary text-xs font-bold tracking-[0.2em] uppercase mb-6">
            The Archive • Vol. IV
          </h4>
          <h1 className="font-serif text-6xl lg:text-7xl tracking-tight mb-6">
            Curated <span className="italic font-light">Velocity</span>
          </h1>
          <p className="text-muted-foreground text-xl font-light leading-relaxed max-w-2xl">
            A forensic selection of performance machinery. Every listing verified for mechanical
            integrity and heritage provenance.
          </p>
        </div>

        <FilterBar filters={filters} setFilters={setFilters} />

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex flex-col gap-4">
                <Skeleton className="aspect-[4/3] rounded-2xl bg-card border border-border/20" />
                <div className="space-y-2 px-2">
                  <Skeleton className="h-5 w-2/3 bg-card" />
                  <Skeleton className="h-4 w-1/3 bg-card" />
                  <Skeleton className="h-6 w-1/2 bg-card mt-2" />
                </div>
              </div>
            ))}
          </div>
        ) : vehicles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center border-t border-border/50">
            <h3 className="text-2xl font-serif mb-2">No Machinery Found</h3>
            <p className="text-muted-foreground max-w-md mx-auto font-light">
              We couldn't locate any vehicles matching your precise specifications. The archive is
              constantly evolving.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 gap-y-12">
            {vehicles.map((vehicle, index) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                index={index}
                onPurchase={fetchVehicles}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
