import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Car, LogOut, User as UserIcon, LayoutDashboard } from 'lucide-react';
import { motion } from 'framer-motion';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 transition-opacity hover:opacity-80">
          <div className="bg-primary p-1.5 rounded-lg">
            <Car className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg tracking-tight">AutoInventory</span>
        </Link>

        <div className="flex items-center space-x-4">
          {user?.role === 'ADMIN' && (
            <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
              <Link to="/admin">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Admin Panel
              </Link>
            </Button>
          )}

          <div className="flex items-center space-x-3 pl-4 border-l border-border">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-medium leading-none">{user?.name}</span>
              <span className="text-xs text-muted-foreground mt-1">{user?.role}</span>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
              <span className="sr-only">Log out</span>
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
