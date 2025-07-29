import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { HomePage } from "./components/HomePage";
import { Dashboard } from "./components/Dashboard";
import { SignInPage } from "./components/SignInPage";
import { NavbarDemo } from "./components/ui/navbar";

export default function App() {
  const loggedInUser = useQuery(api.auth.loggedInUser);

  return (
    <NavbarDemo>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/dashboard" element={
          <Authenticated>
            <Dashboard />
          </Authenticated>
        } />
      </Routes>
      <Toaster />
    </NavbarDemo>
  );
}
