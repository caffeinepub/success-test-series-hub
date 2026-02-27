# Specification

## Summary
**Goal:** Replace the OTP-based student login with a mobile number + password authentication flow in STS Hub.

**Planned changes:**
- Add a `password` field to the Student data type in the backend
- Add `registerStudent` backend function accepting mobile number and password
- Add `studentLogin` backend function that verifies mobile number + password and returns a session token
- Add `useStudentLogin` and `useStudentRegister` React Query mutation hooks in `useQueries.ts`
- Replace the existing `StudentLogin.tsx` page with a two-tab form: "Login" (mobile number + password) and "Register" (mobile number + password + confirm password)
- On successful login, store session token and redirect to the student dashboard
- Show inline errors for invalid credentials, password mismatch, and empty/invalid fields

**User-visible outcome:** Students can register and log in using their mobile number and password instead of OTP, with a clean two-tab form that validates input and redirects to the dashboard on success.
