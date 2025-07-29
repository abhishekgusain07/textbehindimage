import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useConvexAuth } from 'convex/react';

export function useUser() {
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const user = useQuery(api.auth.loggedInUser);

  return {
    user,
    isLoading: authLoading || user === undefined,
    isAuthenticated,
  };
}
