# Project Report: AI-Powered Campus Placement Management System

---

## 1. Selected Track
* **Track Name:** Productivity & Careers
* **Category:** Full-Stack Web Development / EdTech & Career Placement Services

---

## 2. Project Title
**AI-Powered Campus Placement Management System (CampusPlace AI)**

---

## 3. Problem Statement
Colleges currently manage placement registration, recruiter communication, eligibility checking, applications, interview scheduling, and results through separate forms or manual records. This fragmented approach causes significant operational challenges:
* Delays and duplicate work due to scattered systems and processes.
* Missed updates and difficulty in tracking individual student progress through the placement lifecycle.
* Manual eligibility verification based on CGPA, backlogs, and branch is error-prone and time-consuming.
* Students lack structured guidance to improve their resumes, identify skill gaps, and prepare effectively for interviews.
* Recruiters face difficulty managing drives, applicant data, shortlisting, and results in a unified view.
* Placement officers struggle to maintain oversight and generate analytics across departments.

---

## 4. Proposed Solution
CampusPlace AI is a centralized, role-based full-stack web platform that connects students, recruiters, and placement officers in a single unified portal. The platform digitizes and automates the entire placement workflow:
* Centralized portal for all stakeholders — students, recruiters, and placement officers.
* Automated eligibility checking using CGPA, branch, backlogs, and skills criteria.
* Full lifecycle management: placement drives, applications, shortlisting, interview scheduling, results, and notifications.
* Rule-based AI engine for resume scoring, skill-gap analysis, role recommendations, and 30-day preparation planning.
* Real-time analytics dashboard for placement officers with department-wise statistics.

---

## 5. Project Idea / Overview
CampusPlace AI enables three distinct user roles to collaborate seamlessly within a single platform. Each role has a tailored experience designed around their specific responsibilities in the placement process.

### 5.1 Student Portal
* Maintain academic profile including CGPA, department, skills, certifications, and resume.
* View placement drives filtered by personal eligibility in real time.
* Apply to eligible drives and track application status through all lifecycle stages.
* Receive AI-generated resume feedback, skill-gap analysis, and a personalized 30-day preparation roadmap.

### 5.2 Recruiter Portal
* Post and manage campus placement drives with detailed eligibility criteria.
* Browse and review applicant profiles and resume details.
* Shortlist candidates, schedule interviews (online/offline), and publish results.
* Track all drive activity from a single dashboard.

### 5.3 Placement Officer (Admin) Portal
* Verify and approve student profiles and recruiter registrations.
* Review and approve job drive listings before they go live.
* Monitor all placement activity and generate department-wise analytics.
* Maintain overall oversight of the placement lifecycle.

---

## 6. Objectives and Goals
1. Centralize all campus placement activities on a single, unified platform.
2. Automate eligibility checking using CGPA, branch, backlog count, and skill criteria.
3. Track the full application lifecycle: applications, interviews, results, and notifications.
4. Equip recruiters with tools to manage drives, applicant shortlisting, and result publication.
5. Provide real-time analytics and reporting for placement officers.
6. Use rule-based AI to offer resume scoring, skill-gap analysis, and structured preparation plans for students.
7. Improve transparency and communication between all three stakeholder groups.
8. Reduce administrative overhead and manual effort across the placement process.

---

## 7. Working / Methodology
The system follows a structured end-to-end workflow across all user roles:

| Step | Actor | Action |
|---|---|---|
| 1 | Student | Updates academic profile, skills, certifications, and resume. |
| 2 | Recruiter | Creates a placement drive with eligibility criteria (CGPA, branch, backlogs, skills). |
| 3 | Admin | Reviews and approves the placement drive listing. |
| 4 | System | Eligibility engine automatically checks each student against drive criteria. |
| 5 | Student | Views eligible drives and submits an application. |
| 6 | Recruiter | Reviews applicants, updates status, schedules interviews, and publishes results. |
| 7 | System | Dashboards and notifications update all relevant users in real time. |
| 8 | AI Module | Generates resume score, missing skills list, interview topics, and 30-day plan for students. |

### 7.1 Key System Components
* **User Portal Toggling:** Frontend renders role-specific views based on authenticated user role.
* **Eligibility Calculation Engine:** Real-time algorithm matches student attributes against each job drive's criteria.
* **AI Analysis Module:** Rule-based heuristic engine evaluates resume length, skills, certifications, project keywords, and links to produce actionable scores and recommendations.
* **Lifecycle State Machine:** Applications transition through Applied ➔ Shortlisted ➔ Interview Scheduled ➔ Selected/Rejected with dynamic student notifications at each stage.

---

## 8. Tech Stack Used
* **Frontend:** React.js (v19), JavaScript (ES6+), HTML5
* **Build Tool:** Vite
* **Styling:** Custom Vanilla CSS with modern dark/glassmorphic design tokens
* **Backend:** Firebase-ready backend structure
* **Database:** Firebase Firestore
* **Authentication:** Firebase Authentication
* **File Storage:** Firebase Storage (for resume PDF upload)
* **Hosting:** GitHub Pages (Automated via GitHub Actions)

---

## 9. AI Tools and Models Used

### 9.1 Development Assistance
* **Anthropic Claude:** Architecture consultation, UI/UX design direction, and project structuring support.
* **Google Gemini:** Additional design and structure consultation.

### 9.2 In-Application AI (Rule-Based Engine)
The AI analysis module runs entirely client-side using rule-based heuristics. No paid external AI API is required in the current implementation. The module evaluates:
* Resume length and completeness scoring.
* Skills inventory comparison against active job drive requirements.
* Certifications and project keyword analysis.
* Portfolio/GitHub link presence detection.

Outputs generated by the AI module:
* Quantified resume score (0–100).
* Missing skills list relative to target job drives.
* Recommended job roles based on student profile.
* Interview preparation topics.
* Personalized 30-day placement preparation roadmap.

### 9.3 Future AI Integration
* Integration with Gemini API or OpenAI API for deeper, context-aware resume analysis.
* Natural language processing for more sophisticated skill extraction from resume text.

---

## 10. Database Schema
The system uses Firebase Firestore with the following collections:

| Collection | Primary Fields |
|---|---|
| **users** | uid, role, name, email, phone, status |
| **students** | studentId, uid, department, cgpa, backlogs, skills, certifications, resumeUrl, resumeText |
| **recruiters** | recruiterId, uid, companyId, designation, status |
| **companies** | companyId, companyName, industry, location, website |
| **placementDrives** | driveId, companyId, recruiterId, role, skills, minCgpa, branches, maxBacklogs, package, status |
| **applications** | applicationId, studentId, driveId, status, appliedAt |
| **interviews** | interviewId, applicationId, studentId, driveId, date, time, mode, link |
| **results** | resultId, applicationId, studentId, driveId, resultStatus, remarks |
| **notifications** | notificationId, recipientId, title, message, read |

### 10.1 Entity Relationships
* Users map to Students or Recruiters based on their assigned role.
* Companies own many placement drives.
* Students submit many applications across multiple drives.
* Placement drives receive many applications from eligible students.
* Each application can have exactly one interview record and one result record.
* Users (all roles) receive many notifications throughout the lifecycle.

---

## 11. Project Links
* **GitHub Repository:** [github.com/Aswathykarun/AI-Powered-Campus-Placement-Management-System](https://github.com/Aswathykarun/AI-Powered-Campus-Placement-Management-System)
* **Live Deployment Link:** [https://aswathykarun.github.io/AI-Powered-Campus-Placement-Management-System/](https://aswathykarun.github.io/AI-Powered-Campus-Placement-Management-System/)
* **Local Preview:** [http://127.0.0.1:4173/](http://127.0.0.1:4173/) *(Vite preview server)*
* **Local Project Path:** `work/placement-system`

---

## 12. Future Scope
* Real Firebase Authentication and Firestore persistence for live data management.
* Resume PDF upload through Firebase Storage with automatic text extraction.
* Email notification integration for application status updates.
* PDF and Excel export of analytics reports for placement officers.
* In-platform chat support between students and recruiters.
* Integration with Gemini API or OpenAI API for advanced, context-aware resume analysis.
* Mobile application development for on-the-go placement tracking.
* Alumni placement data integration for longitudinal placement analytics.

---
*— End of Report —*
