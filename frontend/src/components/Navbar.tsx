import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, LogIn, UserPlus } from 'lucide-react';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="font-serif text-2xl tracking-tight text-foreground transition-colors group-hover:text-primary">
              Auto<span className="italic font-light">Inventory</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6 ml-4">
            <Link
              to="/"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Inventory
            </Link>
            {user?.role === 'ADMIN' && (
              <Link
                to="/admin"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Control
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground border-r border-border pr-4">
                <span className="font-medium text-foreground">{user.name}</span>
                <span className="text-xs uppercase tracking-wider opacity-60">({user.role})</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-muted-foreground hover:text-foreground hover:bg-white/5"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground hover:bg-white/5"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6 shadow-[0_0_15px_rgba(255,51,51,0.3)] transition-all hover:shadow-[0_0_25px_rgba(255,51,51,0.5)]"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
