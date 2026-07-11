import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Layout } from '@/components/Layout';
import { AddVehicleDialog } from '@/components/AddVehicleDialog';
import { type Vehicle } from '@/components/VehicleCard';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Trash2, PackagePlus, Car, DollarSign, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchVehicles = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/vehicles');
      if (response.data.success) {
        setVehicles(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to load inventory for admin');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this vehicle permanently?')) return;

    try {
      const response = await api.delete(`/vehicles/${id}`);
      if (response.data.success) {
        toast.success('Vehicle deleted successfully');
        setVehicles((prev) => prev.filter((v) => v.id !== id));
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete vehicle');
    }
  };

  const handleRestock = async (id: number) => {
    const amountStr = prompt('How many units would you like to add to stock?');
    if (!amountStr) return;

    const amount = parseInt(amountStr, 10);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid positive number');
      return;
    }

    try {
      const response = await api.post(`/vehicles/${id}/restock`, { amount });
      if (response.data.success) {
        toast.success(`Successfully added ${amount} units to stock!`);
        setVehicles((prev) =>
          prev.map((v) => (v.id === id ? { ...v, quantity: v.quantity + amount } : v)),
        );
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to restock vehicle');
    }
  };

  const totalInventory = vehicles.reduce((sum, v) => sum + v.quantity, 0);
  const totalValue = vehicles.reduce((sum, v) => sum + Number(v.price) * v.quantity, 0);
  const lowStockCount = vehicles.filter((v) => v.quantity <= 2).length;

  return (
    <Layout>
      <div className="container mx-auto px-6 py-12 lg:py-20">
        {/* Veloce Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-16 gap-6">
          <div>
            <h4 className="text-primary text-xs font-bold tracking-[0.2em] uppercase mb-6">
              Control • Ops
            </h4>
            <h1 className="font-serif text-5xl lg:text-6xl tracking-tight mb-4">
              Inventory <span className="italic font-light">Cockpit.</span>
            </h1>
            <p className="text-muted-foreground text-lg font-light leading-relaxed max-w-xl">
              Fleet telemetry, stock discipline, and acquisition management.
            </p>
          </div>
          <div className="pb-2">
            <AddVehicleDialog onSuccess={fetchVehicles} />
          </div>
        </div>

        {/* Global Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-card/50 backdrop-blur-sm border border-border/20 p-6 rounded-2xl flex flex-col justify-between h-40">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground">
                Total Vehicles
              </span>
              <div className="w-8 h-8 rounded-full bg-foreground/5 flex items-center justify-center">
                <Car className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <div>
              <div className="text-5xl font-serif">{totalInventory}</div>
              <div className="text-xs text-muted-foreground mt-2">units in stock</div>
            </div>
          </div>

          <div className="bg-card/50 backdrop-blur-sm border border-border/20 p-6 rounded-2xl flex flex-col justify-between h-40">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground">
                Asset Value
              </span>
              <div className="w-8 h-8 rounded-full bg-foreground/5 flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <div>
              <div className="text-4xl font-serif">${totalValue.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground mt-2">aggregate market</div>
            </div>
          </div>

          <div className="bg-card/50 backdrop-blur-sm border border-border/20 p-6 rounded-2xl flex flex-col justify-between h-40">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground">
                Low Stock
              </span>
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                <AlertCircle className="h-4 w-4 text-primary" />
              </div>
            </div>
            <div>
              <div className="text-5xl font-serif text-primary">
                {String(lowStockCount).padStart(2, '0')}
              </div>
              <div className="text-xs text-muted-foreground mt-2">chassis need reorder</div>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="rounded-2xl border border-border/20 bg-card/30 backdrop-blur-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-transparent">
              <TableRow className="border-border/20 hover:bg-transparent">
                <TableHead className="text-[10px] font-bold tracking-[0.2em] uppercase py-6 px-6">
                  Chassis
                </TableHead>
                <TableHead className="text-[10px] font-bold tracking-[0.2em] uppercase py-6 px-6">
                  Category
                </TableHead>
                <TableHead className="text-[10px] font-bold tracking-[0.2em] uppercase py-6 px-6">
                  Price
                </TableHead>
                <TableHead className="text-[10px] font-bold tracking-[0.2em] uppercase py-6 px-6">
                  Stock
                </TableHead>
                <TableHead className="text-[10px] font-bold tracking-[0.2em] uppercase py-6 px-6 text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-12 text-muted-foreground font-light"
                  >
                    Loading telemetry...
                  </TableCell>
                </TableRow>
              ) : vehicles.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-12 text-muted-foreground font-light"
                  >
                    No chassis found in the active registry.
                  </TableCell>
                </TableRow>
              ) : (
                vehicles.map((vehicle) => (
                  <TableRow
                    key={vehicle.id}
                    className="group hover:bg-muted/20 transition-colors border-border/10"
                  >
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-zinc-900 border border-border/30 overflow-hidden flex-shrink-0">
                          <img
                            src={
                              vehicle.image_url ||
                              'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
                            }
                            alt={vehicle.model}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-semibold text-base">
                            {vehicle.make}{' '}
                            <span className="font-light italic">{vehicle.model}</span>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1 tracking-wider uppercase">
                            {vehicle.year} • #VH_{String(vehicle.id).padStart(3, '0')}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 font-light text-sm text-muted-foreground">
                      {vehicle.category}
                    </TableCell>
                    <TableCell className="px-6 py-4 font-medium text-sm">
                      ${Number(vehicle.price).toLocaleString()}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {vehicle.quantity <= 0 ? (
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          Out of stock
                        </div>
                      ) : vehicle.quantity <= 2 ? (
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                          {vehicle.quantity} left
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-500">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          {vehicle.quantity} in stock
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 opacity-40 group-hover:opacity-100 transition-opacity"
                          >
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-[160px] bg-card border-border/30"
                        >
                          <DropdownMenuLabel className="text-xs font-bold tracking-widest uppercase">
                            Actions
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-border/30" />
                          <DropdownMenuItem
                            onClick={() => handleRestock(vehicle.id)}
                            className="cursor-pointer text-sm"
                          >
                            <PackagePlus className="mr-2 h-4 w-4" />
                            Restock Chassis
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-border/30" />
                          <DropdownMenuItem
                            onClick={() => handleDelete(vehicle.id)}
                            className="text-primary cursor-pointer focus:text-primary focus:bg-primary/10 text-sm"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Listing
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </Layout>
  );
}
