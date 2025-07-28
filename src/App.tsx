import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { HomePage } from "./components/HomePage";
import { Dashboard } from "./components/Dashboard";
import { useState } from "react";

export default function App() {
  const [currentView, setCurrentView] = useState<"home" | "dashboard">("home");
  const loggedInUser = useQuery(api.auth.loggedInUser);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm h-16 flex justify-between items-center border-b shadow-sm px-4">
        <div className="flex items-center gap-4">
          <h2 
            className="text-xl font-semibold text-primary cursor-pointer"
            onClick={() => setCurrentView("home")}
          >
            Text Behind Image
          </h2>
          <Authenticated>
            <button
              onClick={() => setCurrentView("dashboard")}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary transition-colors"
            >
              My Projects
            </button>
          </Authenticated>
        </div>
        <div className="flex items-center gap-4">
          <Authenticated>
            <span className="text-sm text-gray-600">
              {loggedInUser?.email || loggedInUser?.name || "User"}
            </span>
            <SignOutButton />
          </Authenticated>
          <Unauthenticated>
            <button
              onClick={() => setCurrentView("home")}
              className="px-4 py-2 text-sm font-medium text-white bg-primary rounded hover:bg-primary-hover transition-colors"
            >
              Sign In
            </button>
          </Unauthenticated>
        </div>
      </header>
      
      <main className="flex-1">
        {currentView === "home" && <HomePage />}
        <Authenticated>
          {currentView === "dashboard" && <Dashboard />}
        </Authenticated>
      </main>
      
      <Toaster />
    </div>
  );
}
