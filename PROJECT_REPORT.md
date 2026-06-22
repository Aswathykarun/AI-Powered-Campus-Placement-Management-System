# Project Submission Report: AI-Powered Campus Placement Management System

---

## 1. Selected Track
* **Track:** Full-Stack Web Development / EdTech & Career Placement Services *(Please adjust based on your specific track list)*

---

## 2. Project Title
**AI-Powered Campus Placement Management System (CampusPlace AI)**

---

## 3. Problem Statement
Traditional campus placement procedures are often manual, scattered, and inefficient. Key challenges include:
- **Scattered Information:** Lack of a centralized portal for students, recruiters, and placement officers to interact seamlessly.
- **Manual Eligibility Checking:** Sorting students for job drives manually by CGPA, backlogs, and branch is prone to human error and time-consuming.
- **Lack of Career Guidance:** Students frequently struggle to identify skill gaps, evaluate resume strengths, or build targeted prep plans for upcoming placement drives.
- **Inefficient Tracking:** Recruiter coordination, interview scheduling, and shortlisting status are difficult to track and update in real-time.

---

## 4. Proposed Solution
**CampusPlace AI** is a role-based full-stack ready web portal that automates and streamlines the entire placement workflow. It provides:
1. **Unified Portal:** Integrated interface for Students, Recruiters, and Admins.
2. **Automated Eligibility Check:** Instant eligibility status evaluation for students when viewing jobs.
3. **AI Career Co-Pilot:** Real-time resume parsing evaluation, skill-gap analysis relative to active job drives, customized role recommendations, and a weekly preparation roadmap.
4. **Recruiter-Admin Workflow:** Direct job drive posting, admin verification, and applicant shortlisting state management.

---

## 5. Project Idea / Overview
The system enables three roles to work collaboratively:
* **Students:** Maintain profiles, verify skills, receive AI feedback on resume details, view job listings tailored to their eligibility, and track applications.
* **Recruiters:** Post recruitment drives, review applicants' profiles, shortlist candidates, set interview details, and release results.
* **Placement Officers (Admin):** Review student profile verifications, approve recruiter registration statuses, approve job listings, and view department-wise placement analytics.

---

## 6. Objectives and Goals
- **Automate** eligibility verification to reduce admin overhead.
- **Provide Actionable Insights** to students about their resumes and preparation tracks.
- **Improve Transparency** in the shortlisting and interview scheduling lifecycle.
- **Deliver Real-time Reports** on placement percentages across departments.

---

## 7. Working / Methodology
1. **User Portal Toggling:** The frontend handles views conditionally based on the user's logged-in role.
2. **Eligibility Calculation Engine:** An eligibility algorithm computes conditions in real-time, matching student attributes against job criteria.
3. **AI Analysis Simulation:** The client-side AI analysis module evaluates resume metrics and provides dynamic preparation steps and gap items.
4. **Lifecycle States:** Applications transition from *Applied* to *Shortlisted*, *Interview Scheduled*, and *Selected/Rejected*, notifying the student dynamically.

---

## 8. Tech Stack Used
* **Frontend Library:** React.js (v19)
* **Build Tool:** Vite
* **Programming Language:** JavaScript / HTML5
* **Styling:** Custom Vanilla CSS (with modern dark/glassmorphic tokens)
* **Backend Database & Services:** Firebase (Auth, Firestore, and Storage ready config)

---

## 9. AI Tools and Models Used
* **AI Assistance:** Anthropic Claude / Google Gemini (for architecture consultation, initial UI/UX styling design, and project structuring support).
* **AI Algorithms Simulated:** Rule-based heuristics representing resume scoring engines, skill-gap comparisons, and natural language study plan generators.

---

## 10. Project URL / Repository Link / Deployment Link
* **GitHub Repository:** [AI-Powered-Campus-Placement-Management-System](https://github.com/Aswathykarun/AI-Powered-Campus-Placement-Management-System)
* **Deployment/Local Host:** [http://127.0.0.1:4173/](http://127.0.0.1:4173/) *(Local preview environment)*
