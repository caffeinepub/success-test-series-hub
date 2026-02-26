import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Test, Question, Ranker, ContactSubmission } from '../backend';

export function useGetTests() {
  const { actor, isFetching } = useActor();
  return useQuery<Test[]>({
    queryKey: ['tests'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTests();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetTestById(id: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Test | null>({
    queryKey: ['test', id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getTestById(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useGetTopRankers() {
  const { actor, isFetching } = useActor();
  return useQuery<Ranker[]>({
    queryKey: ['topRankers'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTopRankers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGenerateQuestions() {
  const { actor } = useActor();
  return useMutation<Question[], Error, { topic: string; difficulty: string }>({
    mutationFn: async ({ topic, difficulty }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.generateQuestions(topic, difficulty);
    },
  });
}

export function useSubmitContact() {
  const { actor } = useActor();
  return useMutation<void, Error, { name: string; email: string; message: string }>({
    mutationFn: async ({ name, email, message }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.submitContact(name, email, message);
    },
  });
}

// Admin: Login
export function useAdminLogin() {
  const { actor } = useActor();
  return useMutation<string, Error, { username: string; password: string }>({
    mutationFn: async ({ username, password }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.login(username, password);
    },
  });
}

// Admin: Logout
export function useAdminLogout() {
  const { actor } = useActor();
  return useMutation<void, Error, { token: string }>({
    mutationFn: async ({ token }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.logout(token);
    },
  });
}

// Admin: Add Test
export function useAddTest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation<void, Error, { token: string; title: string; category: string; questions: Question[] }>({
    mutationFn: async ({ token, title, category, questions }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addTest(token, title, category, questions);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tests'] });
    },
  });
}

// Admin: Update Test
export function useUpdateTest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation<void, Error, { token: string; id: bigint; title: string; category: string; questions: Question[] }>({
    mutationFn: async ({ token, id, title, category, questions }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.updateTest(token, id, title, category, questions);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tests'] });
    },
  });
}

// Admin: Delete Test
export function useDeleteTest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation<void, Error, { token: string; id: bigint }>({
    mutationFn: async ({ token, id }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.deleteTest(token, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tests'] });
    },
  });
}

// Admin: Add Ranker
export function useAddRanker() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation<void, Error, { token: string; studentName: string; examCategory: string; score: bigint }>({
    mutationFn: async ({ token, studentName, examCategory, score }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addRanker(token, studentName, examCategory, score);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topRankers'] });
    },
  });
}

// Admin: Delete Ranker
export function useDeleteRanker() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation<void, Error, { token: string; rank: bigint }>({
    mutationFn: async ({ token, rank }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.deleteRanker(token, rank);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topRankers'] });
    },
  });
}

// Admin: Get Contact Submissions
export function useContactSubmissions(token: string | null) {
  const { actor, isFetching } = useActor();
  return useQuery<ContactSubmission[]>({
    queryKey: ['contactSubmissions', token],
    queryFn: async () => {
      if (!actor || !token) return [];
      return actor.getContactSubmissions(token);
    },
    enabled: !!actor && !isFetching && !!token,
  });
}
