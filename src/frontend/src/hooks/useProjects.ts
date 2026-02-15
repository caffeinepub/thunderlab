import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useActor } from './useActor';
import { backendCallWithUnlock } from '../lib/backendCallWithUnlock';
import type { Project } from '../backend';

export function useListProjects() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return backendCallWithUnlock(() => actor.listProjects());
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useCreateProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (name: string) => {
      if (!actor) throw new Error('Actor not available');
      return backendCallWithUnlock(() => actor.createProject(name), () => {
        navigate({ to: '/unlock' });
      });
    },
    onSuccess: (project) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      navigate({ to: `/projects/${project.id.toString()}` });
    },
  });
}
