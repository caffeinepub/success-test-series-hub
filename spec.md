# Specification

## Summary
**Goal:** Add a secure admin panel with login system to the Success Test Series Hub, allowing an admin to manage tests, rankers, and view contact submissions.

**Planned changes:**
- Add backend admin authentication: hardcoded credentials, `login()` returning a session token, `validateSession()`, and `logout()` to invalidate tokens
- Add backend admin CRUD functions for tests: `addTest()`, `updateTest()`, `deleteTest()`, all requiring a valid session token
- Add backend admin functions for managing the top rankers leaderboard: `addRanker()` and `deleteRanker()`, with automatic re-ranking
- Add backend `getContactSubmissions(token)` query that returns all contact form submissions, requiring a valid session token
- Add React Router to the frontend, routing `/` to the existing public app, `/admin` to the Admin Login page, and `/admin/dashboard` to the Admin Dashboard
- Create an `/admin` login page with a centered card (username, password, login button), inline error on failure, and redirect to dashboard on success, styled with the dark navy and gold theme
- Create a protected `/admin/dashboard` page with a sidebar (Tests, Rankers, Contact Submissions links, Logout button); unauthenticated visits redirect to `/admin`
- Implement a Tests management panel: table of tests with Add/Edit/Delete actions, modal form with title, category dropdown, and dynamic questions editor
- Implement a Rankers management panel: ranked table with Add/Delete actions and a modal form for student name, exam category, and score
- Implement a read-only Contact Submissions panel: table showing name, email, message, and timestamp with a loading state while fetching

**User-visible outcome:** An admin can navigate to `/admin`, log in with credentials, and manage tests, rankers, and view contact submissions from a protected dashboard, while the existing public-facing site remains unchanged.
