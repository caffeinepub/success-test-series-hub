# Specification

## Summary
**Goal:** Enhance the Success Test Series Hub with a homepage image slider, daily content sections, OTP-based student login, student profiles, admin student management, negative marking on tests, and bank payment details display.

**Planned changes:**
- Add a homepage poster/image carousel (slider) with Prev/Next navigation and auto-advance; show placeholder if no slides exist
- Add backend storage and queries for slider records (getSliders, addSlider, deleteSlider)
- Add a "Manage Sliders" panel to the Admin Dashboard sidebar to add (by URL + title) and delete poster slides
- Add a "Daily Current Affairs" section on the homepage displaying date + headline entries
- Add a "Daily Newspaper" section on the homepage displaying date + clickable link entries
- Add backend storage and queries for current affairs (getCurrentAffairs, addCurrentAffairs, deleteCurrentAffairs) and newspapers (getNewspapers, addNewspaper, deleteNewspaper)
- Add "Manage Current Affairs" and "Manage Daily Newspaper" panels to the Admin Dashboard sidebar
- Replace student username/password login with Mobile Number + OTP login on /student/login (requestOtp, verifyOtp backend functions; simulated OTP, no real SMS)
- Auto-create student accounts by mobile number on first successful OTP verification; store session token in localStorage
- Add a "My Profile" section on the Student Dashboard showing mobile number and circular profile photo with upload capability (stored as base64)
- Add backend getStudentProfile(token) and updateStudentProfilePhoto(token, photoBase64) functions
- Add a "Students" read-only panel in the Admin Dashboard showing all students' mobile numbers and circular profile photo thumbnails; backed by getStudents(token)
- Add negativeMarkValue (Float, default 0.0) to the Test record; update addTest, updateTest, getTests, getTestById accordingly
- Add a "Negative Mark per Wrong Answer" input to the Admin TestFormModal
- Display negative marking value on each test card in the Free Tests section
- Apply negative marking to score calculation in the TestTakingModal
- Add a visually distinct "Payment Details" box (gold-bordered card) below plan cards in the Paid Test Series section showing Account Number: 444418210022399, IFSC: BKID0004444, Name: Sachin Kumar, with a note to contact admin after payment

**User-visible outcome:** Students can log in via mobile OTP, view and update their profile photo, and see homepage sliders, daily current affairs, and daily newspaper links. Tests now support negative marking shown on cards and applied at scoring. The Paid Tests section displays bank payment details. Admins can manage sliders, current affairs, newspaper entries, and view the student list from the dashboard sidebar.
