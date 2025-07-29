import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { lazy, Suspense } from 'react';
import { NavbarDemo } from './components/ui/navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PublicRoute } from './components/PublicRoute';

const HomePage = lazy(() =>
  import('./components/HomePage').then((m) => ({ default: m.HomePage }))
);
const Dashboard = lazy(() =>
  import('./components/Dashboard').then((m) => ({ default: m.Dashboard }))
);
const SignInPage = lazy(() =>
  import('./components/SignInPage').then((m) => ({ default: m.SignInPage }))
);

export default function App() {
  return (
    <NavbarDemo>
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            Loading...
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/sign-in"
            element={
              <PublicRoute>
                <SignInPage />
              </PublicRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
      <Toaster />
    </NavbarDemo>
  );
}
