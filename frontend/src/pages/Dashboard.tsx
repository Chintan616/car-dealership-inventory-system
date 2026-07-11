import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Layout } from '@/components/Layout';
import { FilterBar, type FilterState } from '@/components/FilterBar';
import { VehicleCard, type Vehicle } from '@/components/VehicleCard';
import { Skeleton } from '@/components/ui/skeleton';
import { CarFront } from 'lucide-react';
import { toast } from 'sonner';

export default function Dashboard() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({ make: '', category: '' });

  const fetchVehicles = async () => {
    setIsLoading(true);
    try {
      // Build query string
      const params = new URLSearchParams();
      if (filters.make) params.append('make', filters.make);
      if (filters.category) params.append('category', filters.category);

      const response = await api.get(`/vehicles/search?${params.toString()}`);
      if (response.data.success) {
        setVehicles(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to load vehicles');
      setVehicles([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce search fetching
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchVehicles();
    }, 300);
    return () => clearTimeout(timer);
  }, [filters]);

  const handlePurchase = async (id: number) => {
    try {
      const response = await api.post(`/vehicles/${id}/purchase`);
      if (response.data.success) {
        toast.success('Vehicle purchased successfully!');
        // Optimistically update stock
        setVehicles((prev) =>
          prev.map((v) => (v.id === id ? { ...v, quantity: v.quantity - 1 } : v)),
        );
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to purchase vehicle');
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Inventory</h1>
          <p className="text-muted-foreground text-lg">Browse and manage premium vehicles.</p>
        </div>

        <FilterBar filters={filters} setFilters={setFilters} />

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="flex flex-col space-y-3">
                <Skeleton className="h-[250px] w-full rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))}
          </div>
        ) : vehicles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {vehicles.map((vehicle, index) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                index={index}
                onPurchase={handlePurchase}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="bg-muted p-6 rounded-full mb-6">
              <CarFront className="h-12 w-12 text-muted-foreground opacity-50" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">No vehicles found</h2>
            <p className="text-muted-foreground max-w-sm">
              We couldn't find any vehicles matching your current filters. Try adjusting your search
              criteria.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
