import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { lazy, Suspense } from "react";
import { NavbarDemo } from "./components/ui/navbar";

const HomePage = lazy(() => import("./components/HomePage").then(m => ({ default: m.HomePage })));
const Dashboard = lazy(() => import("./components/Dashboard").then(m => ({ default: m.Dashboard })));
const SignInPage = lazy(() => import("./components/SignInPage").then(m => ({ default: m.SignInPage })));

export default function App() {
  const loggedInUser = useQuery(api.auth.loggedInUser);

  return (
    <NavbarDemo>
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/dashboard" element={
            <Authenticated>
              <Dashboard />
            </Authenticated>
          } />
        </Routes>
      </Suspense>
      <Toaster />
    </NavbarDemo>
  );
}
