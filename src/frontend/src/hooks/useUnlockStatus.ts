import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';

export function useUnlockStatus() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  const query = useQuery<boolean>({
    queryKey: ['unlockStatus', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.getIsUnlocked();
      } catch (error) {
        // If error checking unlock status, assume locked
        return false;
      }
    },
    enabled: !!actor && !!identity && !actorFetching,
    retry: false,
    staleTime: 30000, // 30 seconds
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}
