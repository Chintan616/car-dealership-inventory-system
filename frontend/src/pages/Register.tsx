import { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export default function Register() {
  const [name, setName] = useState('');
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
      const response = await api.post('/auth/register', { name, email, password });
      if (response.data.success) {
        // Automatically login the user after registration
        const loginResponse = await api.post('/auth/login', { email, password });
        if (loginResponse.data.success) {
          login(loginResponse.data.data.token, loginResponse.data.data.user);
        }
        toast.success('Registration successful. Welcome to the Circle.');
        navigate('/');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Form Side (Left for Register) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 order-2 lg:order-1">
        <div className="w-full max-w-md space-y-12">
          <div className="space-y-4">
            <h3 className="text-primary text-xs font-bold tracking-[0.2em] uppercase">
              New Membership
            </h3>
            <h2 className="font-serif text-5xl tracking-tight">
              Join the <span className="italic font-light">Circle.</span>
            </h2>
            <p className="text-muted-foreground">
              A private registry for collectors of consequential machinery.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-xs font-bold tracking-widest uppercase text-muted-foreground"
              >
                Full Name
              </Label>
              <Input
                id="name"
                required
                className="bg-card h-14 border-border/50 text-base focus:border-primary transition-colors"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

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
                  Initiate Registration <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-muted-foreground">
            Already registered?{' '}
            <Link
              to="/login"
              className="text-foreground border-b border-foreground/30 hover:border-foreground pb-0.5 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Image Side (Right for Register) */}
      <div className="hidden lg:flex w-1/2 relative bg-zinc-900 overflow-hidden order-1 lg:order-2 border-l border-border/50">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background z-10" />
        <img
          src="https://images.unsplash.com/photo-1503376762367-25e2e854d909?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"
          alt="Luxury Car Rear"
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
        <div className="absolute top-20 left-20 z-20">
          <h3 className="text-primary text-xs font-bold tracking-[0.2em] uppercase mb-4">
            Membership • Benefits
          </h3>
        </div>
        <div className="absolute bottom-20 left-20 z-20 max-w-md">
          <h1 className="font-serif text-5xl text-white mb-8 leading-tight">
            A quiet room for <span className="italic font-light">the serious.</span>
          </h1>
          <ul className="space-y-4 text-muted-foreground font-light">
            <li className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
              </div>{' '}
              Pre-market acquisition rights
            </li>
            <li className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
              </div>{' '}
              White-glove logistics & delivery
            </li>
            <li className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
              </div>{' '}
              Private collection management tools
            </li>
            <li className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
              </div>{' '}
              Members-only heritage archive access
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
