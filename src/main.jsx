import React, { useMemo, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Bell, Briefcase, Building2, Calendar, CheckCircle2, FileText, GraduationCap, LayoutDashboard, Search, ShieldCheck, Sparkles, Users } from "lucide-react";
import "./styles.css";

const studentsSeed = [
  { id: "s1", name: "Anjana Varghese", email: "anjana@student.edu", department: "CSE", semester: "S6", cgpa: 8.4, backlogs: 0, skills: ["React", "JavaScript", "Firebase", "Python"], certifications: ["React Basics"], resume: "Frontend student with React Firebase projects, GitHub portfolio and internship work.", github: "github.com/anjana", linkedin: "linkedin.com/in/anjana", verified: true },
  { id: "s2", name: "Rahul Nair", email: "rahul@student.edu", department: "ECE", semester: "S6", cgpa: 7.2, backlogs: 1, skills: ["Python", "SQL", "Excel"], certifications: ["Data Analytics"], resume: "Data analysis student with Python SQL Excel mini project.", github: "", linkedin: "linkedin.com/in/rahul", verified: false },
];

const recruitersSeed = [
  { id: "r1", name: "Meera Joseph", email: "meera@innovatech.com", company: "InnovaTech Solutions", designation: "Talent Lead", status: "approved" },
  { id: "r2", name: "Arun Menon", email: "arun@datavista.com", company: "DataVista Labs", designation: "HR Manager", status: "pending" },
];

const drivesSeed = [
  { id: "d1", recruiterId: "r1", company: "InnovaTech Solutions", role: "Frontend Developer Intern", description: "Build React dashboards and Firebase modules.", skills: ["React", "JavaScript", "Firebase", "GitHub"], minCgpa: 7.5, branches: ["CSE", "IT"], maxBacklogs: 0, package: "4.5 LPA", deadline: "2026-06-30", date: "2026-07-05", status: "open" },
  { id: "d2", recruiterId: "r2", company: "DataVista Labs", role: "Data Analyst Trainee", description: "Prepare SQL reports and business dashboards.", skills: ["Python", "SQL", "Excel", "Power BI"], minCgpa: 7, branches: ["CSE", "IT", "ECE"], maxBacklogs: 1, package: "3.8 LPA", deadline: "2026-07-03", date: "2026-07-12", status: "pending" },
];

function nice(value) {
  if (!value) return "";
  return value.replaceAll("_", " ").replace(/\b\w/g, (x) => x.toUpperCase());
}

function eligibility(student, drive) {
  if (!student || !drive) return { ok: false, reasons: ["No context"], matched: [], missing: [] };
  const studentSkills = (student.skills || []).map((s) => s.toLowerCase());
  const matched = (drive.skills || []).filter((s) => studentSkills.includes(s.toLowerCase()));
  const missing = (drive.skills || []).filter((s) => !studentSkills.includes(s.toLowerCase()));
  const reasons = [];
  if (student.cgpa < drive.minCgpa) reasons.push("CGPA below requirement");
  if (!drive.branches.includes(student.department)) reasons.push("Branch not eligible");
  if (student.backlogs > drive.maxBacklogs) reasons.push("Backlogs exceed limit");
  if (!matched.length) reasons.push("Required skills missing");
  if (drive.status !== "open") reasons.push("Drive is not approved/open");
  return { ok: reasons.length === 0, reasons, matched, missing };
}

function aiAnalysis(student, drives) {
  if (!student) return { score: 0, tips: [], missing: [], roles: [], topics: [], plan: [] };
  let score = 25;
  const tips = [];
  if ((student.resume || "").length > 70) score += 15; else tips.push("Add more project and internship details to the resume.");
  if ((student.skills || []).length >= 4) score += 15; else tips.push("Add more job-related technical skills.");
  if ((student.certifications || []).length) score += 10; else tips.push("Add certifications or workshop achievements.");
  if (student.github) score += 10; else tips.push("Add a GitHub profile link.");
  if (student.linkedin) score += 10; else tips.push("Add a LinkedIn profile link.");
  if (/project|internship|github/i.test(student.resume || "")) score += 15; else tips.push("Mention projects, GitHub repositories, and achievements.");
  const target = drives.find((d) => d.status === "open") || drives[0];
  const gap = target ? eligibility(student, target).missing : [];
  return {
    score: Math.min(score, 100),
    tips: tips.length ? tips : ["Resume is strong. Keep updating it with new projects."],
    missing: gap.length ? gap : ["No major skill gap for the selected drive."],
    roles: (student.skills || []).includes("SQL") ? ["Data Analyst", "BI Intern", "Junior Data Engineer"] : ["Frontend Developer", "Web Developer Intern", "Software Developer Intern"],
    topics: ["Aptitude", "HR questions", "Projects explanation", ...gap],
    plan: ["Week 1: Update resume and revise aptitude.", "Week 2: Learn missing skills.", "Week 3: Build one mini project and upload to GitHub.", "Week 4: Practice mock interviews and apply to drives."],
  };
}

const getLocalStorageItem = (key, seed) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : seed;
};

function AuthScreen({ onLogin, students, setStudents, recruiters, setRecruiters }) {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = f.get("email");
    const password = f.get("password");
    const name = f.get("name");

    const isFirebaseDemo = !import.meta.env.VITE_FIREBASE_API_KEY || import.meta.env.VITE_FIREBASE_API_KEY === "demo-api-key";

    if (isLogin) {
      if (isFirebaseDemo) {
        if (email === "admin@admin.com" && password === "admin123") {
          onLogin({ role: "admin", name: "Placement Officer", email, uid: "admin" });
          return;
        }

        if (role === "student") {
          const st = students.find(s => s.email === email);
          if (st) {
            onLogin({ role: "student", name: st.name, email, ref: st.id, uid: st.id });
          } else {
            setError("Student account not found or invalid credentials.");
          }
        } else if (role === "recruiter") {
          const rc = recruiters.find(r => r.email === email);
          if (rc) {
            onLogin({ role: "recruiter", name: rc.name, email, ref: rc.id, uid: rc.id });
          } else {
            setError("Recruiter account not found or invalid credentials.");
          }
        }
      } else {
        import("./firebase").then(({ auth }) => {
          import("firebase/auth").then(({ signInWithEmailAndPassword }) => {
            signInWithEmailAndPassword(auth, email, password)
              .then((userCredential) => {
                const u = userCredential.user;
                let userRole = role;
                if (email.includes("admin")) userRole = "admin";
                onLogin({ role: userRole, name: u.displayName || name || "User", email, uid: u.uid });
              })
              .catch((err) => {
                setError(err.message);
              });
          });
        });
      }
    } else {
      if (isFirebaseDemo) {
        const uid = `u_${Date.now()}`;
        if (role === "student") {
          const newStudent = { id: uid, name, email, department: f.get("department") || "CSE", semester: "S6", cgpa: Number(f.get("cgpa")) || 8.0, backlogs: 0, skills: [], certifications: [], resume: "", github: "", linkedin: "", verified: false };
          setStudents([...students, newStudent]);
          onLogin({ role: "student", name, email, ref: uid, uid });
        } else if (role === "recruiter") {
          const newRecruiter = { id: uid, name, email, company: f.get("company") || "Company Name", designation: f.get("designation") || "HR Manager", status: "pending" };
          setRecruiters([...recruiters, newRecruiter]);
          onLogin({ role: "recruiter", name, email, ref: uid, uid });
        }
      } else {
        import("./firebase").then(({ auth, db }) => {
          import("firebase/auth").then(({ createUserWithEmailAndPassword, updateProfile }) => {
            createUserWithEmailAndPassword(auth, email, password)
              .then((userCredential) => {
                const u = userCredential.user;
                updateProfile(u, { displayName: name }).then(() => {
                  import("firebase/firestore").then(({ doc, setDoc }) => {
                    const userRef = doc(db, "users", u.uid);
                    setDoc(userRef, { uid: u.uid, name, email, role, status: role === "student" ? "active" : "pending" }).then(() => {
                      onLogin({ role, name, email, uid: u.uid });
                    });
                  });
                });
              })
              .catch((err) => {
                setError(err.message);
              });
          });
        });
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="brand" style={{ justifyContent: "center", marginBottom: "15px" }}>
          <ShieldCheck size={28} />
          <div><strong>CampusPlace AI</strong><span>Placement Portal</span></div>
        </div>
        <h2>{isLogin ? "Sign In" : "Create Account"}</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="stack">
          {!isLogin && (
            <label>Full Name
              <input name="name" required placeholder="John Doe" />
            </label>
          )}
          <label>Email Address
            <input type="email" name="email" required placeholder="name@domain.com" />
          </label>
          <label>Password
            <input type="password" name="password" required placeholder="••••••••" />
          </label>

          <label>Select Role
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="student">Student</option>
              <option value="recruiter">Recruiter</option>
              <option value="admin">Placement Officer (Admin)</option>
            </select>
          </label>

          {!isLogin && role === "student" && (
            <>
              <label>Department
                <input name="department" required placeholder="CSE, ECE, ME" />
              </label>
              <label>Current CGPA
                <input name="cgpa" type="number" step="0.01" required placeholder="8.5" />
              </label>
            </>
          )}

          {!isLogin && role === "recruiter" && (
            <>
              <label>Company Name
                <input name="company" required placeholder="Google Inc." />
              </label>
              <label>Designation
                <input name="designation" required placeholder="HR Manager" />
              </label>
            </>
          )}

          <button type="submit" className="selected" style={{ marginTop: "10px" }}>{isLogin ? "Sign In" : "Register"}</button>
        </form>

        <p className="toggle-auth">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span onClick={() => { setIsLogin(!isLogin); setError(""); }} style={{ color: "#2364d2", cursor: "pointer", fontWeight: "bold", textDecoration: "underline" }}>
            {isLogin ? "Register here" : "Sign in here"}
          </span>
        </p>

        {isLogin && (
          <div className="demo-hint">
            <p><strong>Demo Accounts:</strong></p>
            <p>🎓 Student: <code>anjana@student.edu</code> (any password)</p>
            <p>💼 Recruiter: <code>meera@innovatech.com</code> (any password)</p>
            <p>🛡️ Admin: <code>admin@admin.com</code> / password: <code>admin123</code></p>
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  const [currentUser, setCurrentUser] = useState(() => getLocalStorageItem("cp_user", null));
  const [page, setPage] = useState("dashboard");
  const [students, setStudents] = useState(() => getLocalStorageItem("cp_students", studentsSeed));
  const [recruiters, setRecruiters] = useState(() => getLocalStorageItem("cp_recruiters", recruitersSeed));
  const [drives, setDrives] = useState(() => getLocalStorageItem("cp_drives", drivesSeed));
  const [apps, setApps] = useState(() => getLocalStorageItem("cp_apps", [{ id: "a1", studentId: "s1", driveId: "d1", student: "Anjana Varghese", company: "InnovaTech Solutions", role: "Frontend Developer Intern", status: "interview_scheduled", date: "2026-06-20" }]));
  const [interviews, setInterviews] = useState(() => getLocalStorageItem("cp_interviews", [{ id: "i1", appId: "a1", studentId: "s1", driveId: "d1", date: "2026-07-06", time: "10:30 AM", mode: "Online", link: "https://meet.example/interview" }]));
  const [notifications, setNotifications] = useState(() => getLocalStorageItem("cp_notifications", ["Interview scheduled for InnovaTech Solutions.", "DataVista Labs drive is waiting for admin approval."]));
  const [query, setQuery] = useState("");

  useEffect(() => {
    localStorage.setItem("cp_user", JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("cp_students", JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem("cp_recruiters", JSON.stringify(recruiters));
  }, [recruiters]);

  useEffect(() => {
    localStorage.setItem("cp_drives", JSON.stringify(drives));
  }, [drives]);

  useEffect(() => {
    localStorage.setItem("cp_apps", JSON.stringify(apps));
  }, [apps]);

  useEffect(() => {
    localStorage.setItem("cp_interviews", JSON.stringify(interviews));
  }, [interviews]);

  useEffect(() => {
    localStorage.setItem("cp_notifications", JSON.stringify(notifications));
  }, [notifications]);

  const student = useMemo(() => {
    if (!currentUser || currentUser.role !== "student") return null;
    return students.find((s) => s.email === currentUser.email) || students[0];
  }, [currentUser, students]);

  const recruiter = useMemo(() => {
    if (!currentUser || currentUser.role !== "recruiter") return null;
    return recruiters.find((r) => r.email === currentUser.email) || recruiters[0];
  }, [currentUser, recruiters]);

  const openDrives = useMemo(() => drives.filter((d) => d.status === "open"), [drives]);
  const recruiterDrives = useMemo(() => recruiter ? drives.filter((d) => d.recruiterId === recruiter.id) : [], [drives, recruiter]);
  const recruiterApps = useMemo(() => apps.filter((a) => recruiterDrives.some((d) => d.id === a.driveId)), [apps, recruiterDrives]);
  const analysis = useMemo(() => student ? aiAnalysis(student, drives) : null, [student, drives]);

  const stats = useMemo(() => ({
    students: students.length,
    recruiters: recruiters.length,
    drives: drives.length,
    applications: apps.length,
    selected: apps.filter((a) => a.status === "selected").length,
  }), [students, recruiters, drives, apps]);

  function notify(text) {
    setNotifications((items) => [text, ...items]);
  }

  function apply(drive) {
    if (!student) return;
    if (apps.some((a) => a.studentId === student.id && a.driveId === drive.id)) return;
    if (!eligibility(student, drive).ok) return;
    setApps([{ id: `a${Date.now()}`, studentId: student.id, driveId: drive.id, student: student.name, company: drive.company, role: drive.role, status: "applied", date: "2026-06-22" }, ...apps]);
    notify(`${student.name} applied for ${drive.role}.`);
  }

  function updateStatus(appId, status) {
    const app = apps.find((a) => a.id === appId);
    setApps(apps.map((a) => a.id === appId ? { ...a, status } : a));
    if (status === "interview_scheduled" && app) {
      setInterviews([{ id: `i${Date.now()}`, appId, studentId: app.studentId, driveId: app.driveId, date: "2026-07-10", time: "11:00 AM", mode: "Online", link: "https://meet.example/new" }, ...interviews]);
    }
    if (app) notify(`${app.student}'s application status changed to ${nice(status)}.`);
  }

  function addDrive(e) {
    e.preventDefault();
    if (!recruiter) return;
    const f = new FormData(e.currentTarget);
    setDrives([{ id: `d${Date.now()}`, recruiterId: recruiter.id, company: recruiter.company, role: f.get("role"), description: f.get("description"), skills: split(f.get("skills")), minCgpa: Number(f.get("cgpa")), branches: split(f.get("branches")), maxBacklogs: Number(f.get("backlogs")), package: f.get("package"), deadline: f.get("deadline"), date: f.get("date"), status: "pending" }, ...drives]);
    notify(`${recruiter.company} submitted a new placement drive for approval.`);
    e.currentTarget.reset();
  }

  function saveStudent(e) {
    e.preventDefault();
    if (!student) return;
    const f = new FormData(e.currentTarget);
    const updated = { ...student, name: f.get("name"), department: f.get("department"), semester: f.get("semester"), cgpa: Number(f.get("cgpa")), backlogs: Number(f.get("backlogs")), skills: split(f.get("skills")), certifications: split(f.get("certifications")), resume: f.get("resume"), github: f.get("github"), linkedin: f.get("linkedin") };
    setStudents(students.map((s) => s.id === student.id ? updated : s));
  }

  if (!currentUser) {
    return <AuthScreen onLogin={(u) => { setCurrentUser(u); setPage("dashboard"); }} students={students} setStudents={setStudents} recruiters={recruiters} setRecruiters={setRecruiters} />;
  }

  const profileCompletion = student ? Math.round(([student.email, student.cgpa, (student.skills || []).length, student.resume, student.github, student.linkedin].filter(Boolean).length / 6) * 100) : 0;
  const nav = currentUser.role === "student" ? ["dashboard", "profile", "drives", "applications", "ai", "notifications"] : currentUser.role === "recruiter" ? ["dashboard", "company", "manage drives", "applicants", "notifications"] : ["dashboard", "students", "recruiters", "approvals", "reports", "notifications"];

  return (
    <main>
      <aside style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <div className="brand"><ShieldCheck /><div><strong>CampusPlace AI</strong><span>Placement Portal</span></div></div>
          <nav>{nav.map((item) => <button key={item} onClick={() => setPage(item)} className={page === item ? "active" : ""}>{icon(item)} {nice(item)}</button>)}</nav>
        </div>
        <button onClick={() => setCurrentUser(null)} style={{ background: "transparent", color: "#f8fafc", border: "1px solid rgba(255,255,255,0.2)", padding: "10px", width: "100%", borderRadius: "8px", cursor: "pointer", display: "flex", gap: "8px", alignItems: "center", justifyContent: "center" }}>
          Log Out
        </button>
      </aside>
      <section className="workspace">
        <header>
          <div><h1>{nice(currentUser.role)} {nice(page)}</h1><p>{currentUser.role === "student" ? student?.name : currentUser.role === "recruiter" ? recruiter?.company : "Placement officer/admin"}</p></div>
        </header>

        {page === "dashboard" && currentUser.role === "student" && student && <StudentDash student={student} drives={openDrives} apps={apps} interviews={interviews} analysis={analysis} profileCompletion={profileCompletion} />}
        {page === "dashboard" && currentUser.role === "recruiter" && recruiter && <RecruiterDash recruiter={recruiter} drives={recruiterDrives} apps={recruiterApps} />}
        {page === "dashboard" && currentUser.role === "admin" && <AdminDash stats={stats} students={students} apps={apps} />}
        {page === "profile" && student && <Profile student={student} saveStudent={saveStudent} />}
        {page === "drives" && student && <Drives drives={openDrives} student={student} apps={apps} apply={apply} query={query} setQuery={setQuery} />}
        {page === "applications" && student && <Applications apps={apps.filter((a) => a.studentId === student.id)} interviews={interviews} />}
        {page === "ai" && analysis && <AI analysis={analysis} />}
        {page === "company" && recruiter && <Company recruiter={recruiter} />}
        {page === "manage drives" && recruiter && <ManageDrives drives={recruiterDrives} addDrive={addDrive} />}
        {page === "applicants" && recruiter && <Applicants apps={recruiterApps} students={students} updateStatus={updateStatus} />}
        {page === "students" && <Students students={students} setStudents={setStudents} />}
        {page === "recruiters" && <Recruiters recruiters={recruiters} setRecruiters={setRecruiters} />}
        {page === "approvals" && <Approvals drives={drives} setDrives={setDrives} notify={notify} />}
        {page === "reports" && <Reports stats={stats} students={students} apps={apps} />}
        {page === "notifications" && <Panel title="Notifications and Announcements">{notifications.map((n) => <div className="mini" key={n}><strong>Notification</strong><span>{n}</span></div>)}</Panel>}
      </section>
    </main>
  );
}

function split(value) {
  return String(value).split(",").map((x) => x.trim()).filter(Boolean);
}

function icon(item) {
  const map = { dashboard: <LayoutDashboard />, profile: <GraduationCap />, drives: <Briefcase />, applications: <FileText />, ai: <Sparkles />, notifications: <Bell />, company: <Building2 />, "manage drives": <Briefcase />, applicants: <Users />, students: <GraduationCap />, recruiters: <Building2 />, approvals: <CheckCircle2 />, reports: <FileText /> };
  return React.cloneElement(map[item] || <FileText />, { size: 18 });
}

function Stat({ label, value, Icon = CheckCircle2 }) {
  return <div className="stat"><Icon /><span>{label}</span><strong>{value}</strong></div>;
}

function Panel({ title, children }) {
  return <section className="panel"><h2>{title}</h2>{children}</section>;
}

function Badge({ value, good }) {
  return <span className={`badge ${good ? "good" : ""}`}>{value}</span>;
}

function StudentDash({ student, drives, apps, interviews, analysis, profileCompletion }) {
  const eligible = drives.filter((d) => eligibility(student, d).ok);
  return <><div className="stats"><Stat label="Profile" value={`${profileCompletion}%`} Icon={GraduationCap} /><Stat label="Eligible Drives" value={eligible.length} Icon={Briefcase} /><Stat label="Applications" value={apps.filter((a) => a.studentId === student.id).length} Icon={FileText} /><Stat label="Resume Score" value={`${analysis?.score || 0}/100`} Icon={Sparkles} /></div><div className="grid"><Panel title="Recommended Drives">{eligible.map((d) => <Job key={d.id} drive={d} student={student} compact />)}</Panel><Panel title="Interview Schedules">{interviews.filter((i) => i.studentId === student.id).map((i) => <div className="mini" key={i.id}><strong>{i.date} at {i.time}</strong><span>{i.mode}: {i.link}</span></div>)}</Panel></div></>;
}

function RecruiterDash({ recruiter, drives, apps }) {
  return <><div className="stats"><Stat label="Company" value={recruiter.company} Icon={Building2} /><Stat label="Drives" value={drives.length} Icon={Briefcase} /><Stat label="Applicants" value={apps.length} Icon={Users} /><Stat label="Selected" value={apps.filter((a) => a.status === "selected").length} Icon={CheckCircle2} /></div><DriveTable drives={drives} /></>;
}

function AdminDash({ stats, students, apps }) {
  return <><div className="stats"><Stat label="Students" value={stats.students} Icon={GraduationCap} /><Stat label="Recruiters" value={stats.recruiters} Icon={Building2} /><Stat label="Drives" value={stats.drives} Icon={Briefcase} /><Stat label="Selected" value={stats.selected} Icon={CheckCircle2} /></div><Department students={students} apps={apps} /></>;
}

function Profile({ student, saveStudent }) {
  return <Panel title="Student Profile Management"><form className="form" onSubmit={saveStudent}>{["name", "department", "semester", "cgpa", "backlogs", "github", "linkedin"].map((k) => <label key={k}>{nice(k)}<input name={k} defaultValue={student[k] || ""} /></label>)}<label>Skills<input name="skills" defaultValue={(student.skills || []).join(", ")} /></label><label>Certifications<input name="certifications" defaultValue={(student.certifications || []).join(", ")} /></label><label className="wide">Resume Text<textarea name="resume" defaultValue={student.resume || ""} /></label><button type="submit">Save Profile</button></form></Panel>;
}

function Drives({ drives, student, apps, apply, query, setQuery }) {
  const filtered = drives.filter((d) => `${d.company} ${d.role} ${(d.skills || []).join(" ")}`.toLowerCase().includes(query.toLowerCase()));
  return <Panel title="Eligible Companies and Placement Drives"><div className="search"><Search size={18} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search company, role or skill" /></div>{filtered.map((d) => <Job key={d.id} drive={d} student={student} applied={apps.some((a) => a.driveId === d.id && a.studentId === student.id)} apply={apply} />)}</Panel>;
}

function Job({ drive, student, applied, apply, compact }) {
  const e = eligibility(student, drive);
  return <article className="job"><div><h3>{drive.role}</h3><p>{drive.company} - {drive.package}</p></div><Badge value={e.ok ? "Eligible to Apply" : "Not Eligible"} good={e.ok} /><div className="chips">{(drive.skills || []).map((s) => <span key={s}>{s}</span>)}</div>{!compact && <><p>{drive.description}</p><small>{e.ok ? `Deadline: ${drive.deadline}` : e.reasons.join(", ")}</small><button disabled={!e.ok || applied} onClick={() => apply(drive)}>{applied ? "Applied" : "Apply Now"}</button></>}</article>;
}

function Applications({ apps, interviews }) {
  return <Panel title="Application Tracking"><Table heads={["Company", "Role", "Applied On", "Status", "Interview"]}>{apps.map((a) => { const i = interviews.find((x) => x.appId === a.id); return <tr key={a.id}><td>{a.company}</td><td>{a.role}</td><td>{a.date}</td><td><Badge value={nice(a.status)} good /></td><td>{i ? `${i.date} ${i.time}` : "Waiting"}</td></tr>; })}</Table></Panel>;
}

function AI({ analysis }) {
  return <Panel title="AI Resume Analysis, Skill Gap and Recommendation"><div className="stats"><Stat label="Resume Score" value={`${analysis?.score || 0}/100`} Icon={Sparkles} /><Stat label="Best Role" value={analysis?.roles?.[0] || ""} Icon={Briefcase} /></div><div className="grid"><List title="Resume Tips" items={analysis?.tips || []} /><List title="Missing Skills" items={analysis?.missing || []} /><List title="Interview Topics" items={analysis?.topics || []} /><List title="30-Day Plan" items={analysis?.plan || []} /></div></Panel>;
}

function List({ title, items }) {
  return <div className="mini"><h3>{title}</h3><ul>{items.map((x) => <li key={x}>{x}</li>)}</ul></div>;
}

function Company({ recruiter }) {
  return <Panel title="Company Profile Management"><div className="company"><Building2 size={44} /><div><h3>{recruiter.company}</h3><p>Recruiter: {recruiter.name}, {recruiter.designation}</p><span>Status: {recruiter.status}</span></div></div></Panel>;
}

function ManageDrives({ drives, addDrive }) {
  return <div className="grid"><Panel title="Create Placement Drive"><form className="stack" onSubmit={addDrive}><input name="role" placeholder="Job role" required /><textarea name="description" placeholder="Job description" required /><input name="skills" placeholder="Required skills: React, Firebase" required /><input name="cgpa" type="number" step="0.1" placeholder="Minimum CGPA" required /><input name="branches" placeholder="Branches: CSE, IT" required /><input name="backlogs" type="number" placeholder="Max backlogs" required /><input name="package" placeholder="Package" required /><input name="date" type="date" required /><input name="deadline" type="date" required /><button type="submit">Submit for Approval</button></form></Panel><Panel title="Manage Drives"><DriveRows drives={drives} /></Panel></div>;
}

function DriveTable({ drives }) {
  return <Panel title="Drive Summary"><DriveRows drives={drives} /></Panel>;
}

function DriveRows({ drives }) {
  return <Table heads={["Company", "Role", "CGPA", "Branches", "Status"]}>{drives.map((d) => <tr key={d.id}><td>{d.company}</td><td>{d.role}</td><td>{d.minCgpa}</td><td>{(d.branches || []).join(", ")}</td><td><Badge value={nice(d.status)} good={d.status === "open"} /></td></tr>)}</Table>;
}

function Applicants({ apps, students, updateStatus }) {
  return <Panel title="Applicants, Shortlisting, Interviews and Results"><Table heads={["Student", "Role", "CGPA", "Skills", "Status", "Action"]}>{apps.map((a) => { const s = students.find((x) => x.id === a.studentId); return <tr key={a.id}><td>{a.student}</td><td>{a.role}</td><td>{s?.cgpa}</td><td>{(s?.skills || []).join(", ")}</td><td>{nice(a.status)}</td><td><select value={a.status} onChange={(e) => updateStatus(a.id, e.target.value)}>{["applied", "shortlisted", "interview_scheduled", "selected", "rejected"].map((x) => <option key={x} value={x}>{nice(x)}</option>)}</select></td></tr>; })}</Table></Panel>;
}

function Students({ students, setStudents }) {
  return <Panel title="Manage Students and Verify Profiles"><Table heads={["Name", "Department", "CGPA", "Backlogs", "Verified", "Action"]}>{students.map((s) => <tr key={s.id}><td>{s.name}</td><td>{s.department}</td><td>{s.cgpa}</td><td>{s.backlogs}</td><td>{s.verified ? "Yes" : "No"}</td><td><button onClick={() => setStudents(students.map((x) => x.id === s.id ? { ...x, verified: !x.verified } : x))}>Toggle</button></td></tr>)}</Table></Panel>;
}

function Recruiters({ recruiters, setRecruiters }) {
  return <Panel title="Manage Recruiters and Companies"><Table heads={["Recruiter", "Company", "Email", "Status", "Action"]}>{recruiters.map((r) => <tr key={r.id}><td>{r.name}</td><td>{r.company}</td><td>{r.email}</td><td>{r.status}</td><td><button onClick={() => setRecruiters(recruiters.map((x) => x.id === r.id ? { ...x, status: "approved" } : x))}>Approve</button></td></tr>)}</Table></Panel>;
}

function Approvals({ drives, setDrives, notify }) {
  function update(id, status) {
    const drive = drives.find((d) => d.id === id);
    setDrives(drives.map((d) => d.id === id ? { ...d, status } : d));
    if (drive) notify(`${drive.company} ${drive.role} drive was ${status}.`);
  }
  return <Panel title="Approve Placement Drives"><Table heads={["Company", "Role", "Package", "Deadline", "Status", "Action"]}>{drives.map((d) => <tr key={d.id}><td>{d.company}</td><td>{d.role}</td><td>{d.package}</td><td>{d.deadline}</td><td>{d.status}</td><td><button onClick={() => update(d.id, "open")}>Approve</button><button onClick={() => update(d.id, "rejected")}>Reject</button></td></tr>)}</Table></Panel>;
}

function Reports({ stats, students, apps }) {
  return <Panel title="Reports, Statistics and Export"><div className="stats"><Stat label="Applications" value={stats.applications} Icon={FileText} /><Stat label="Selected" value={stats.selected} Icon={CheckCircle2} /></div><Department students={students} apps={apps} /><button>Export PDF / Excel</button></Panel>;
}

function Department({ students, apps }) {
  const depts = useMemo(() => [...new Set(students.map((s) => s.department))], [students]);
  return <Panel title="Department-wise Placement Count">{depts.map((d) => { const ids = students.filter((s) => s.department === d).map((s) => s.id); const count = apps.filter((a) => a.status === "selected" && ids.includes(a.studentId)).length; return <div className="bar" key={d}><span>{d}</span><i style={{ width: `${Math.max(6, count * 50)}%` }} /><strong>{count}</strong></div>; })}</Panel>;
}

function Table({ heads, children }) {
  return <div className="table"><table><thead><tr>{heads.map((h) => <th key={h}>{h}</th>)}</tr></thead><tbody>{children}</tbody></table></div>;
}

createRoot(document.getElementById("root")).render(<App />);
