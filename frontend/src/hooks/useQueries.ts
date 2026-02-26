import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Test, Question, Ranker, ContactSubmission, Student, Slider, CurrentAffairs, Newspaper } from '../backend';

// ── Public Queries ──────────────────────────────────────────────────────────

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

export function useGetTopRankers() {
  const { actor, isFetching } = useActor();
  return useQuery<Ranker[]>({
    queryKey: ['rankers'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTopRankers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetSliders() {
  const { actor, isFetching } = useActor();
  return useQuery<Slider[]>({
    queryKey: ['sliders'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSliders();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCurrentAffairs() {
  const { actor, isFetching } = useActor();
  return useQuery<CurrentAffairs[]>({
    queryKey: ['currentAffairs'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCurrentAffairs();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetNewspapers() {
  const { actor, isFetching } = useActor();
  return useQuery<Newspaper[]>({
    queryKey: ['newspapers'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getNewspapers();
    },
    enabled: !!actor && !isFetching,
  });
}

// ── Admin Auth ──────────────────────────────────────────────────────────────

export function useAdminLogin() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.login(username, password);
    },
  });
}

export function useAdminLogout() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (token: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.logout(token);
    },
    onSuccess: () => {
      queryClient.clear();
    },
  });
}

export function useValidateSession() {
  const { actor, isFetching } = useActor();
  return useMutation({
    mutationFn: async (token: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.validateSession(token);
    },
  });
}

// ── Admin Test Mutations ────────────────────────────────────────────────────

export function useAddTest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      token,
      title,
      category,
      questions,
      price,
      negativeMarkValue,
    }: {
      token: string;
      title: string;
      category: string;
      questions: Question[];
      price: bigint;
      negativeMarkValue: number;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addTest(token, title, category, questions, price, negativeMarkValue);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tests'] });
    },
  });
}

export function useUpdateTest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      token,
      id,
      title,
      category,
      questions,
      price,
      negativeMarkValue,
    }: {
      token: string;
      id: bigint;
      title: string;
      category: string;
      questions: Question[];
      price: bigint;
      negativeMarkValue: number;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateTest(token, id, title, category, questions, price, negativeMarkValue);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tests'] });
    },
  });
}

export function useDeleteTest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ token, id }: { token: string; id: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteTest(token, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tests'] });
    },
  });
}

// ── Admin Ranker Mutations ──────────────────────────────────────────────────

export function useAddRanker() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      token,
      studentName,
      examCategory,
      score,
    }: {
      token: string;
      studentName: string;
      examCategory: string;
      score: bigint;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addRanker(token, studentName, examCategory, score);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rankers'] });
    },
  });
}

export function useDeleteRanker() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ token, rank }: { token: string; rank: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteRanker(token, rank);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rankers'] });
    },
  });
}

// ── Contact Mutations ───────────────────────────────────────────────────────

export function useSubmitContact() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      name,
      email,
      message,
    }: {
      name: string;
      email: string;
      message: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitContact(name, email, message);
    },
  });
}

export function useGetContactSubmissions(token: string) {
  const { actor, isFetching } = useActor();
  return useQuery<ContactSubmission[]>({
    queryKey: ['contactSubmissions', token],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getContactSubmissionsUser(token);
    },
    enabled: !!actor && !isFetching && !!token,
  });
}

// ── AI Test Generator ───────────────────────────────────────────────────────

export function useGenerateQuestions() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      token,
      topic,
      difficulty,
    }: {
      token: string;
      topic: string;
      difficulty: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.generateQuestions(token, topic, difficulty);
    },
  });
}

// ── Slider Mutations ────────────────────────────────────────────────────────

export function useAddSlider() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      token,
      imageUrl,
      title,
    }: {
      token: string;
      imageUrl: string;
      title: string | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addSlider(token, imageUrl, title);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sliders'] });
    },
  });
}

export function useDeleteSlider() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ token, id }: { token: string; id: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteSlider(token, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sliders'] });
    },
  });
}

// ── Current Affairs Mutations ───────────────────────────────────────────────

export function useAddCurrentAffairs() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      token,
      date,
      content,
    }: {
      token: string;
      date: string;
      content: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addCurrentAffairs(token, date, content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentAffairs'] });
    },
  });
}

export function useDeleteCurrentAffairs() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ token, id }: { token: string; id: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteCurrentAffairs(token, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentAffairs'] });
    },
  });
}

// ── Newspaper Mutations ─────────────────────────────────────────────────────

export function useAddNewspaper() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      token,
      date,
      link,
    }: {
      token: string;
      date: string;
      link: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addNewspaper(token, date, link);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newspapers'] });
    },
  });
}

export function useDeleteNewspaper() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ token, id }: { token: string; id: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteNewspaper(token, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newspapers'] });
    },
  });
}

// ── Student OTP Auth ────────────────────────────────────────────────────────

export function useRequestOtp() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (mobileNumber: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.requestOtp(mobileNumber);
    },
  });
}

export function useVerifyOtp() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      mobileNumber,
      otp,
    }: {
      mobileNumber: string;
      otp: string;
    }): Promise<[string, string]> => {
      if (!actor) throw new Error('Actor not available');
      return actor.verifyOtp(mobileNumber, otp);
    },
  });
}

export function useStudentLogout() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (token: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.studentLogout(token);
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ['studentProfile'] });
    },
  });
}

// ── Student Profile ─────────────────────────────────────────────────────────

export function useGetStudentProfile(token: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Student | null>({
    queryKey: ['studentProfile', token],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getStudentProfile(token);
    },
    enabled: !!actor && !isFetching && !!token,
  });
}

export function useUpdateStudentProfilePhoto() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      token,
      photoBase64,
    }: {
      token: string;
      photoBase64: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateStudentProfilePhoto(token, photoBase64);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['studentProfile', variables.token] });
    },
  });
}

// ── Admin: Get All Students ─────────────────────────────────────────────────

export function useGetStudents(token: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Student[]>({
    queryKey: ['students', token],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getStudents(token);
    },
    enabled: !!actor && !isFetching && !!token,
  });
}

// ── Legacy student auth hooks (kept for compatibility) ──────────────────────

export function useStudentRegister() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (_params: { username: string; password: string; email: string }) => {
      throw new Error('Registration via username/password is no longer supported. Use OTP login.');
    },
  });
}

export function useStudentLogin() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (_params: { username: string; password: string }) => {
      throw new Error('Password login is no longer supported. Use OTP login.');
    },
  });
}

export function useValidateStudentSession() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (token: string): Promise<boolean> => {
      if (!actor) return false;
      const profile = await actor.getStudentProfile(token);
      return profile !== null;
    },
  });
}
