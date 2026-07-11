import { useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: number;
  price: number;
  quantity: number;
  category: string;
  image_url?: string;
}

interface VehicleCardProps {
  vehicle: Vehicle;
  onPurchase: () => void;
  index: number;
}

export function VehicleCard({ vehicle, onPurchase, index }: VehicleCardProps) {
  const [isPurchasing, setIsPurchasing] = useState(false);

  // Use custom image or fallback to a static car placeholder
  const imageUrl =
    vehicle.image_url ||
    'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';

  const isOutOfStock = vehicle.quantity <= 0;
  const isLowStock = vehicle.quantity > 0 && vehicle.quantity <= 2;

  const handlePurchase = async () => {
    setIsPurchasing(true);
    try {
      const response = await api.post(`/vehicles/${vehicle.id}/purchase`);
      if (response.data.success) {
        toast.success(`Successfully reserved ${vehicle.make} ${vehicle.model}!`);
        onPurchase();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to process reservation');
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <div className="group flex flex-col gap-4">
      {/* Image Box */}
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-900 border border-border/20">
        <img
          src={imageUrl}
          alt={`${vehicle.make} ${vehicle.model}`}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
        />

        {/* Top Badges */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
          {isOutOfStock ? (
            <div className="bg-background/90 backdrop-blur text-foreground text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1.5 rounded-full border border-border/50 shadow-lg">
              Out of Stock
            </div>
          ) : isLowStock ? (
            <div className="bg-primary text-primary-foreground text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1.5 rounded-full shadow-[0_0_15px_rgba(255,51,51,0.5)]">
              Only {vehicle.quantity} Left
            </div>
          ) : (
            <div className="bg-background/80 backdrop-blur text-foreground text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1.5 rounded-full border border-border/50 shadow-lg">
              Available
            </div>
          )}
        </div>

        {/* Hover Overlay Actions */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
          <Button
            onClick={handlePurchase}
            disabled={isOutOfStock || isPurchasing}
            className="w-full bg-foreground text-background hover:bg-white rounded-full h-12 font-medium"
          >
            {isPurchasing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              'Initiate Acquisition'
            )}
          </Button>
        </div>
      </div>

      {/* Details Box */}
      <div className="flex flex-col px-2">
        <h3 className="text-lg font-light tracking-wide text-foreground">
          <span className="font-medium">{vehicle.make}</span> {vehicle.model}
        </h3>
        <p className="text-muted-foreground text-sm mb-2">
          {vehicle.year} • {vehicle.category}
        </p>
        <p className="text-xl font-serif">${vehicle.price.toLocaleString()}</p>
      </div>
    </div>
  );
}
