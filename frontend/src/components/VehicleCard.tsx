import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';

export interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: number;
  price: number;
  quantity: number;
  category: string;
}

interface VehicleCardProps {
  vehicle: Vehicle;
  onPurchase: (id: number) => Promise<void>;
  index: number;
}

export function VehicleCard({ vehicle, onPurchase, index }: VehicleCardProps) {
  const [isPurchasing, setIsPurchasing] = useState(false);

  // Use unspash source for placeholder images based on make and model
  const imageUrl = `https://source.unsplash.com/800x600/?${encodeURIComponent(vehicle.make + ' ' + vehicle.model + ' car')}`;

  const isOutOfStock = vehicle.quantity <= 0;

  const handlePurchase = async () => {
    setIsPurchasing(true);
    await onPurchase(vehicle.id);
    setIsPurchasing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: 'easeOut' }}
      whileHover={{ y: -5 }}
      className="group h-full"
    >
      <Card className="h-full flex flex-col overflow-hidden border-border/50 bg-card/40 backdrop-blur-sm transition-all hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20">
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={imageUrl}
            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://source.unsplash.com/800x600/?car';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Stock Badges */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            {isOutOfStock ? (
              <Badge variant="destructive" className="shadow-lg backdrop-blur-md bg-destructive/90">
                Out of Stock
              </Badge>
            ) : vehicle.quantity <= 2 ? (
              <Badge
                variant="destructive"
                className="shadow-lg backdrop-blur-md bg-orange-500/90 text-white hover:bg-orange-600"
              >
                Only {vehicle.quantity} left
              </Badge>
            ) : (
              <Badge variant="secondary" className="shadow-lg backdrop-blur-md bg-secondary/90">
                In Stock ({vehicle.quantity})
              </Badge>
            )}
            <Badge
              variant="outline"
              className="shadow-lg backdrop-blur-md bg-background/80 self-end"
            >
              {vehicle.category}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <CardContent className="flex-1 p-5 space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-primary mb-1">{vehicle.year}</p>
              <h3 className="text-xl font-bold tracking-tight line-clamp-1">
                {vehicle.make} <span className="font-light">{vehicle.model}</span>
              </h3>
            </div>
          </div>
          <div className="pt-2 flex items-baseline gap-1">
            <span className="text-2xl font-bold">${Number(vehicle.price).toLocaleString()}</span>
          </div>
        </CardContent>

        {/* Action */}
        <CardFooter className="p-5 pt-0">
          <Button
            className="w-full transition-all active:scale-[0.98]"
            disabled={isOutOfStock || isPurchasing}
            onClick={handlePurchase}
            variant={isOutOfStock ? 'secondary' : 'default'}
          >
            {isPurchasing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <ShoppingCart className="mr-2 h-4 w-4" />
            )}
            {isOutOfStock ? 'Sold Out' : 'Purchase'}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
