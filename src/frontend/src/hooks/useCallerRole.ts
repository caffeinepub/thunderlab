import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import { UserRole } from '../backend';

/**
 * Hook to fetch the current caller's role from the backend.
 * Returns stable loading/fetched flags keyed by the current principal.
 * Treats errors or unknown states as non-admin (guest) for safety.
 */
export function useCallerRole() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  const query = useQuery<UserRole>({
    queryKey: ['callerRole', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.getCallerUserRole();
      } catch (error) {
        console.error('Error fetching caller role:', error);
        // Treat errors as guest for safety
        return UserRole.guest;
      }
    },
    enabled: !!actor && !!identity && !actorFetching,
    retry: false,
    staleTime: 60000, // 1 minute
  });

  const isAdmin = query.data === UserRole.admin;

  return {
    ...query,
    role: query.data,
    isAdmin,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

/**
 * Simpler hook that just checks if caller is admin.
 * Useful for quick admin checks without needing full role data.
 */
export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  const query = useQuery<boolean>({
    queryKey: ['isCallerAdmin', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.isCallerAdmin();
      } catch (error) {
        console.error('Error checking admin status:', error);
        return false;
      }
    },
    enabled: !!actor && !!identity && !actorFetching,
    retry: false,
    staleTime: 60000, // 1 minute
  });

  return {
    ...query,
    isAdmin: query.data ?? false,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}
