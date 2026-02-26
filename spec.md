# Specification

## Summary
**Goal:** Update the hardcoded admin credentials in the backend to new values.

**Planned changes:**
- Change the admin username to `STSHubsachin` and the admin password to `success@#2003` in `backend/main.mo`
- Ensure the `login()` function validates against the new credentials and returns a valid session token on success

**User-visible outcome:** Admins can log in using the new credentials (`STSHubsachin` / `success@#2003`), while the old credentials and any incorrect credentials are rejected.
