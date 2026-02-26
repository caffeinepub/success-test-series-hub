import { useState, useEffect } from 'react';

const STUDENT_TOKEN_KEY = 'studentToken';
const STUDENT_NAME_KEY = 'studentName';

export function getStudentToken(): string | null {
  return localStorage.getItem(STUDENT_TOKEN_KEY);
}

export function setStudentToken(token: string): void {
  localStorage.setItem(STUDENT_TOKEN_KEY, token);
  window.dispatchEvent(new Event('studentAuthChange'));
}

export function clearStudentToken(): void {
  localStorage.removeItem(STUDENT_TOKEN_KEY);
  localStorage.removeItem(STUDENT_NAME_KEY);
  window.dispatchEvent(new Event('studentAuthChange'));
}

export function getStudentName(): string | null {
  return localStorage.getItem(STUDENT_NAME_KEY);
}

export function setStudentName(name: string): void {
  localStorage.setItem(STUDENT_NAME_KEY, name);
}

// Legacy aliases
export const getStudentAuthToken = getStudentToken;
export const setStudentAuthToken = setStudentToken;
export const clearStudentAuthToken = clearStudentToken;
export const getStudentUsername = getStudentName;
export const setStudentUsername = setStudentName;

export function useStudentAuthToken() {
  const [token, setTokenState] = useState<string | null>(getStudentToken());
  const [name, setNameState] = useState<string | null>(getStudentName());

  useEffect(() => {
    const handleChange = () => {
      setTokenState(getStudentToken());
      setNameState(getStudentName());
    };
    window.addEventListener('studentAuthChange', handleChange);
    window.addEventListener('storage', handleChange);
    return () => {
      window.removeEventListener('studentAuthChange', handleChange);
      window.removeEventListener('storage', handleChange);
    };
  }, []);

  return { token, name };
}
