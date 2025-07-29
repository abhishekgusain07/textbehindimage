import { useAuthActions } from "@convex-dev/auth/react";

// Create a simple auth client wrapper
export const authClient = {
  signOut: async () => {
    // This will be used in the navbar component
    // The actual signOut will be handled by useAuthActions
    return Promise.resolve();
  }
}; 