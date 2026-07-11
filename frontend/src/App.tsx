import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/sonner';
import { ProtectedRoute } from '@/components/ProtectedRoute';

import Login from '@/pages/Login';
import Register from '@/pages/Register';

// Temporary Dashboard Placeholder
function Dashboard() {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">Welcome, {user?.name}</h1>
      <p className="text-muted-foreground">Your Role: {user?.role}</p>
      <button onClick={logout} className="text-destructive hover:underline">
        Log out
      </button>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes (Any logged in user) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
          </Route>

          {/* Protected Routes (Admin only) */}
          <Route element={<ProtectedRoute adminOnly />}>
            <Route
              path="/admin"
              element={<div className="p-4 text-center">Admin Dashboard Placeholder</div>}
            />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <Toaster />
    </AuthProvider>
  );
}

export default App;
