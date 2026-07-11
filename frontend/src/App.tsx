import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-border/50 bg-card/50 backdrop-blur-xl shadow-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight">
              Welcome to AutoInventory
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Your premium SaaS dashboard foundation is ready.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input type="email" placeholder="Enter your email" className="bg-background/50" />
              <Input type="password" placeholder="Password" className="bg-background/50" />
            </div>
            <Button className="w-full transition-all active:scale-[0.98]">Continue</Button>
          </CardContent>
        </Card>
      </div>

      <Routes>
        <Route path="/" element={null} />
        <Route path="/login" element={null} />
        <Route path="/admin" element={null} />
      </Routes>
    </Router>
  );
}

export default App;
