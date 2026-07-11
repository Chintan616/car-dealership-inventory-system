import { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.success) {
        login(response.data.data.token, response.data.data.user);
        toast.success('Welcome back to the Archive.');
        navigate('/');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Image Side */}
      <div className="hidden lg:flex w-1/2 relative bg-zinc-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent z-10" />
        <img
          src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"
          alt="Luxury Car"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <div className="absolute bottom-20 left-20 z-20 max-w-md">
          <h1 className="font-serif text-5xl text-white mb-6 leading-tight">
            Return to the
            <br />
            <span className="italic font-light">Hangar.</span>
          </h1>
          <p className="text-muted-foreground text-lg font-light leading-relaxed">
            Access private inventory, pending reservations, and concierge logistics — all in one
            place.
          </p>
        </div>
      </div>

      {/* Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24">
        <div className="w-full max-w-md space-y-12">
          <div className="space-y-4">
            <h3 className="text-primary text-xs font-bold tracking-[0.2em] uppercase">Sign In</h3>
            <h2 className="font-serif text-5xl tracking-tight">
              Welcome <span className="italic font-light">back.</span>
            </h2>
            <p className="text-muted-foreground">
              Enter your credentials to access your dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-xs font-bold tracking-widest uppercase text-muted-foreground"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                required
                className="bg-card h-14 border-border/50 text-base focus:border-primary transition-colors"
                placeholder="collector@veloce.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-xs font-bold tracking-widest uppercase text-muted-foreground"
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                required
                className="bg-card h-14 border-border/50 text-lg tracking-widest focus:border-primary transition-colors"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-base rounded-md mt-4 shadow-[0_0_20px_rgba(255,51,51,0.2)] transition-all"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <>
                  Authenticate <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-muted-foreground">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-foreground border-b border-foreground/30 hover:border-foreground pb-0.5 transition-colors"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
