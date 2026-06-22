# AI-Powered Campus Placement Management System

A full-stack-ready campus placement portal for students, recruiters, and placement officers.

## Features

- Role-based dashboards for Student, Recruiter, and Admin
- Student profile, academic details, skills, certifications, and resume text
- Recruiter company profile and placement drive creation
- Admin student verification, recruiter approval, and placement drive approval
- Eligibility checking using CGPA, branch, backlogs, and skills
- Student application tracking
- Recruiter shortlisting, interview scheduling, and result status updates
- Notifications and announcements
- Dashboard analytics and department-wise placement reports
- Rule-based AI resume score, skill-gap analysis, job role recommendation, interview topics, and 30-day plan

## Tech Stack

- Frontend: React.js, JavaScript, CSS
- Backend: Firebase-ready structure
- Database: Firebase Firestore
- Authentication: Firebase Authentication
- Storage: Firebase Storage for resumes
- Hosting: Firebase Hosting or Vercel

## Run Locally

```bash
npm install
npm run dev
```

## Demo Use

Use the role buttons in the top-right corner:

- Student
- Recruiter
- Admin

## Firebase Setup

Create a Firebase project, enable Email/Password Authentication, Firestore, and Storage. Add a `.env` file:

```bash
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

`src/firebase.js` is ready for real Firebase integration.

## Deployment

Vercel:

```bash
npm run build
```

Firebase Hosting:

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```
