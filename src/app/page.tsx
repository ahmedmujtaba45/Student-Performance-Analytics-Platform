"use client";

import Link from "next/link";
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Bell,
  BookOpen,
  CalendarDays,
  Check,
  ChevronDown,
  CircleHelp,
  ClipboardPenLine,
  Download,
  GraduationCap,
  LayoutDashboard,
  Search,
  Settings2,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useEffect, useMemo, useState } from "react";
import { RecordEntry } from "@/components/record-entry";
import {
  performanceByWeek,
  performanceThisTerm,
  students,
  type Student,
} from "@/lib/mock-data";
import { saveStudentRecord, useStudentRecords } from "@/lib/record-store";
import type { StudentRecord } from "@/lib/student-records";

const navigation = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Students", icon: Users },
  { label: "Record data", icon: ClipboardPenLine },
  { label: "Classes", icon: BookOpen },
  { label: "Reports", icon: Activity },
];

function MetricCard({
  label,
  value,
  caption,
  icon: Icon,
}: {
  label: string;
  value: string;
  caption: string;
  icon: typeof Users;
}) {
  return (
    <article className="metric-card">
      <div className="metric-top">
        <span className="metric-label">{label}</span>
        <span className="metric-icon"><Icon size={17} strokeWidth={1.8} /></span>
      </div>
      <div className="metric-value">{value}</div>
      <div className="metric-foot">
        <span className="metric-caption">{caption}</span>
      </div>
    </article>
  );
}

function Avatar({ student }: { student: Pick<Student, "initials" | "color"> }) {
  return <span className={`avatar avatar-${student.color}`}>{student.initials}</span>;
}

export default function Home() {
  const [activePage, setActivePage] = useState("Overview");
  const { records, error: storageError } = useStudentRecords();
  const [timeRange, setTimeRange] = useState("Last 7 weeks");
  const [classFilter, setClassFilter] = useState("All classes");
  const [searchTerm, setSearchTerm] = useState("");
  const [showHelp, setShowHelp] = useState(false);
  const [riskFilter, setRiskFilter] = useState("All students");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [recordStudentId, setRecordStudentId] = useState<string | undefined>();
  const classNames = Array.from(new Set(students.map((student) => student.className))).sort();
  const chartData = timeRange === "This term" ? performanceThisTerm : performanceByWeek;
  const averageScore = Math.round(students.reduce((total, student) => total + student.score, 0) / students.length);
  const averageAttendance = Math.round(students.reduce((total, student) => total + student.attendance, 0) / students.length);
  const atRiskStudents = students.filter((student) => student.risk === "At risk");
  const riskCounts = {
    "On track": students.filter((student) => student.risk === "On track").length,
    Watch: students.filter((student) => student.risk === "Watch").length,
    "At risk": atRiskStudents.length,
  };
  const classes = classNames.map((className) => {
    const classStudents = students.filter((student) => student.className === className);
    return {
      name: className,
      students: classStudents,
      average: Math.round(classStudents.reduce((total, student) => total + student.score, 0) / classStudents.length),
      attendance: Math.round(classStudents.reduce((total, student) => total + student.attendance, 0) / classStudents.length),
      atRisk: classStudents.filter((student) => student.risk === "At risk").length,
    };
  });

  const filteredStudents = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return students.filter((student) => {
      const matchesClass = classFilter === "All classes" || student.className === classFilter;
      const matchesQuery = !query || student.name.toLowerCase().includes(query) || student.id.toLowerCase().includes(query);
      const matchesRisk = riskFilter === "All students" || student.risk === riskFilter;
      return matchesClass && matchesQuery && matchesRisk;
    });
  }, [classFilter, riskFilter, searchTerm]);

  const interventions = [...atRiskStudents]
    .sort((first, second) => first.attendance - second.attendance)
    .slice(0, 3);

  useEffect(() => {
    if (!selectedStudent) return;
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setSelectedStudent(null);
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [selectedStudent]);

  function exportStudents() {
    const rows = [
      ["Student ID", "Name", "Class", "Average score", "Attendance", "Risk"],
      ...filteredStudents.map((student) => [
        student.id,
        student.name,
        student.className,
        `${student.score}%`,
        `${student.attendance}%`,
        student.risk,
      ]),
    ];
    const csv = rows.map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "student-performance.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  function addRecord(record: StudentRecord) {
    return saveStudentRecord(record);
  }

  function openStudentRecord(student: Student) {
    setRecordStudentId(student.id);
    setSelectedStudent(null);
    setActivePage("Record data");
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <Link className="brand" href="/" aria-label="Classroom home">
          <span className="brand-mark"><GraduationCap size={21} strokeWidth={2.1} /></span>
          <span className="brand-name">classroom<span>.</span></span>
        </Link>

        <div className="workspace-switcher">
          <span className="school-mark">N</span>
          <span className="school-copy"><strong>Northstar Academy</strong><small>Teacher workspace</small></span>
        </div>

        <div className="nav-section-label">WORKSPACE</div>
        <nav className="side-nav" aria-label="Main navigation">
          {navigation.map(({ label, icon: Icon }) => (
            <button
              className={`nav-link ${activePage === label ? "active" : ""}`}
              key={label}
              onClick={() => setActivePage(label)}
              aria-current={activePage === label ? "page" : undefined}
              type="button"
            >
              <Icon size={18} strokeWidth={1.8} />
              <span>{label}</span>
              {label === "Students" && <span className="nav-count">{students.length}</span>}
            </button>
          ))}
        </nav>

        <div className="nav-section-label class-label">YOUR CLASSES <button type="button" aria-label="View classes" onClick={() => { setActivePage("Classes"); setClassFilter("All classes"); }}><Settings2 size={14} /></button></div>
        <div className="class-list">
          {classes.map((item, index) => (
            <button
              key={item.name}
              type="button"
              className={classFilter === item.name ? "selected" : ""}
              onClick={() => { setClassFilter(item.name); setRiskFilter("All students"); setSearchTerm(""); setActivePage("Students"); }}
            >
              <i className={`class-dot dot-color-${index % 3}`} />{item.name}<span>{item.students.length}</span>
            </button>
          ))}
        </div>

        <div className="sidebar-bottom">
          <div className="upgrade-card">
            <span className="upgrade-icon"><Sparkles size={16} /></span>
            <strong>Your term, at a glance</strong>
            <p>Explore insights across all your classes.</p>
            <button type="button" onClick={() => setActivePage("Reports")}>Explore reports <ArrowRight size={14} /></button>
          </div>
          <button className="help-link" type="button" onClick={() => setShowHelp(true)}><CircleHelp size={17} /> Help &amp; support</button>
          <div className="profile-row">
            <span className="teacher-avatar">AM</span>
            <span><strong>Ahmed Mujtaba</strong><small>Mathematics teacher</small></span>
          </div>
        </div>
      </aside>

      <section className="main-panel">
        <header className="topbar">
          <div className="breadcrumbs"><span>Workspace</span><span className="crumb-divider">/</span><strong>{activePage}</strong></div>
          <div className="topbar-actions">
            <span className="term-label"><CalendarDays size={15} /> Fall term 2026</span>
            <details className="topbar-menu">
              <summary className="notification-button" aria-label="Notifications"><Bell size={18} /><i /></summary>
              <div className="popover-card notification-popover">
                <div className="popover-heading"><strong>Classroom updates</strong><span className="alert-count">{atRiskStudents.length}</span></div>
                <p>{atRiskStudents.length ? `${atRiskStudents.length} students in the sample roster could use a check-in.` : "No students are currently flagged for a check-in."}</p>
                <button type="button" onClick={() => { setRiskFilter("At risk"); setActivePage("Students"); }}>Review student updates <ArrowRight size={14} /></button>
              </div>
            </details>
            <details className="topbar-menu profile-menu">
              <summary className="profile-menu-trigger" aria-label="Account menu"><span className="topbar-avatar">AM</span><ChevronDown size={15} /></summary>
              <div className="popover-card profile-popover">
                <strong>Ahmed Mujtaba</strong>
                <span>Mathematics teacher</span>
                <button type="button" onClick={() => setShowHelp(true)}><CircleHelp size={14} /> Help &amp; support</button>
              </div>
            </details>
          </div>
        </header>

        <div className="dashboard-content">
          {activePage === "Record data" ? (
            <RecordEntry records={records} storageError={storageError} onAdd={addRecord} selectedStudentId={recordStudentId} />
          ) : activePage === "Classes" ? (
            <>
              <section className="welcome-row">
                <div>
                  <div className="eyebrow"><span className="live-dot" /> YOUR TEACHING GROUPS</div>
                  <h1>Your classes</h1>
                  <p>Quickly compare progress and open a class roster.</p>
                </div>
                <button className="export-button" onClick={() => { setActivePage("Students"); setClassFilter("All classes"); setRiskFilter("All students"); setSearchTerm(""); }} type="button"><Users size={16} /> All students</button>
              </section>
              <section className="class-cards" aria-label="Your classes">
                {classes.map((item, index) => (
                  <article className="panel class-card" key={item.name}>
                    <div className={`class-card-mark class-card-mark-${index % 3}`}><BookOpen size={20} /></div>
                    <div className="class-card-title"><div><h2>{item.name}</h2><p>{item.students.length} students in your sample roster</p></div><span className={`class-dot dot-color-${index % 3}`} /></div>
                    <div className="class-card-stats">
                      <div><span>Average score</span><strong>{item.average}%</strong><i><b style={{ width: `${item.average}%` }} /></i></div>
                      <div><span>Attendance</span><strong>{item.attendance}%</strong><i><b style={{ width: `${item.attendance}%` }} /></i></div>
                    </div>
                    <div className="class-card-footer">
                      <span>{item.atRisk ? `${item.atRisk} student${item.atRisk === 1 ? "" : "s"} need a check-in` : "Everyone is on track"}</span>
                      <button type="button" onClick={() => { setClassFilter(item.name); setRiskFilter("All students"); setSearchTerm(""); setActivePage("Students"); }}>Open roster <ArrowRight size={14} /></button>
                    </div>
                  </article>
                ))}
              </section>
            </>
          ) : (
            <>
          <section className="welcome-row">
            <div>
              <div className="eyebrow"><span className="live-dot" /> {activePage === "Students" ? "YOUR STUDENT ROSTER" : activePage === "Reports" ? "INSIGHTS & PROGRESS" : "YOUR CLASSROOM, AT A GLANCE"}</div>
              <h1>{activePage === "Students" ? "Your students" : activePage === "Reports" ? "Classroom reports" : <>Good morning, Ahmed <span className="wave">✳</span></>}</h1>
              <p>{activePage === "Students" ? "Search, filter, and keep up with each student’s progress." : activePage === "Reports" ? "Explore performance trends and export a snapshot for your records." : "Here’s what’s happening with your students this week."}</p>
            </div>
            <button className="export-button" onClick={exportStudents} type="button"><Download size={16} /> Export report</button>
          </section>

          {activePage !== "Students" && <section className="metrics-grid" aria-label="Classroom summary">
            <MetricCard label="Students in roster" value={String(students.length)} caption="Across 3 sample classes" icon={Users} />
            <MetricCard label="Average performance" value={`${averageScore}%`} caption="Current sample average" icon={Activity} />
            <MetricCard label="Attendance rate" value={`${averageAttendance}%`} caption="Across the sample roster" icon={CalendarDays} />
            <MetricCard label="Needs a check-in" value={String(atRiskStudents.length)} caption="Flagged by sample indicators" icon={ShieldAlert} />
          </section>}

          {activePage !== "Students" && <section className="insights-grid">
            <article className="panel performance-panel">
              <div className="panel-heading">
                <div><h2>Class performance</h2><p>Sample scores and attendance · Aug–Oct 2026</p></div>
                <label className="select-wrap">
                  <select value={timeRange} onChange={(event) => setTimeRange(event.target.value)} aria-label="Chart time range">
                    <option>Last 7 weeks</option>
                    <option>This term</option>
                  </select>
                  <ChevronDown size={14} />
                </label>
              </div>
              <div className="chart-legend">
                <span><i className="legend-dot score-dot" />Average score</span>
                <span><i className="legend-dot attendance-dot" />Attendance</span>
              </div>
              <div className="chart-wrap">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 12, right: 5, left: -19, bottom: 0 }}>
                    <defs>
                      <linearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8372e8" stopOpacity={0.18} />
                        <stop offset="95%" stopColor="#8372e8" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="attendanceFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#76c6a5" stopOpacity={0.13} />
                        <stop offset="95%" stopColor="#76c6a5" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke="#edf0f4" strokeDasharray="3 5" />
                    <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: "#9298a5", fontSize: 11 }} dy={10} />
                    <YAxis domain={[50, 100]} axisLine={false} tickLine={false} tick={{ fill: "#9298a5", fontSize: 11 }} tickFormatter={(value: number) => `${value}%`} />
                    <Tooltip
                      contentStyle={{ border: "1px solid #eceef2", borderRadius: 12, boxShadow: "0 8px 24px #25334d12", fontSize: 12 }}
                      formatter={(value) => [`${value}%`]}
                    />
                    <Area type="monotone" dataKey="attendance" stroke="#77c6a5" strokeWidth={2} fill="url(#attendanceFill)" />
                    <Area type="monotone" dataKey="average" stroke="#8372e8" strokeWidth={2.5} fill="url(#scoreFill)" activeDot={{ r: 5, strokeWidth: 0, fill: "#8372e8" }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="chart-summary">
                <span><span className="summary-check"><TrendingUp size={12} /></span>Latest sample scores are trending upward</span>
                <button type="button" onClick={() => setActivePage("Reports")}>View detailed report <ArrowRight size={14} /></button>
              </div>
            </article>

            <article className="panel intervention-panel" id="interventions">
              <div className="panel-heading">
                <div><h2>Needs a check-in</h2><p>A little support can go a long way</p></div>
                <span className="alert-count">{atRiskStudents.length}</span>
              </div>
              <div className="intervention-list">
                {interventions.map((item) => (
                  <button className="intervention-item" key={item.id} type="button" onClick={() => setSelectedStudent(item)} aria-label={`Open ${item.name}'s student profile`}>
                    <Avatar student={item} />
                    <div className="intervention-copy"><strong>{item.name}</strong><span>{item.attendance < 80 ? `Attendance is ${item.attendance}%` : `Current average is ${item.score}%`}</span></div>
                    <span className={`priority priority-${item.attendance < 75 || item.score < 65 ? "high" : "medium"}`}>{item.attendance < 75 || item.score < 65 ? "High" : "Medium"}</span>
                  </button>
                ))}
              </div>
              <div className="intervention-footer">
                <span><Sparkles size={14} /> Based on sample performance data</span>
                <button type="button" onClick={() => { setRiskFilter("At risk"); setActivePage("Students"); }}>See all <ArrowRight size={14} /></button>
              </div>
            </article>
          </section>}

          {(activePage === "Overview" || activePage === "Students") && <section className="panel students-panel">
            <div className="students-heading">
              <div><h2>{activePage === "Students" ? "Student roster" : "Student overview"}</h2><p>{activePage === "Students" ? "A closer look at your students’ current progress" : "A snapshot of how everyone is doing"}</p></div>
              <div className="student-controls">
                <label className="search-box"><Search size={15} /><input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search students" aria-label="Search students" /></label>
                <label className="select-wrap class-select">
                  <select value={classFilter} onChange={(event) => setClassFilter(event.target.value)} aria-label="Filter by class">
                    <option>All classes</option>
                    {classNames.map((className) => <option key={className}>{className}</option>)}
                  </select>
                  <ChevronDown size={14} />
                </label>
                <label className="select-wrap risk-select">
                  <select value={riskFilter} onChange={(event) => setRiskFilter(event.target.value)} aria-label="Filter by student status">
                    <option>All students</option>
                    <option>At risk</option>
                    <option>Watch</option>
                    <option>On track</option>
                  </select>
                  <ChevronDown size={14} />
                </label>
              </div>
            </div>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr><th>STUDENT</th><th>CLASS</th><th>AVERAGE SCORE</th><th>ATTENDANCE</th><th>TREND</th><th>STATUS</th></tr>
                </thead>
                <tbody>
                  {(activePage === "Students" ? filteredStudents : filteredStudents.slice(0, 5)).map((student) => (
                    <tr key={student.id}>
                      <td><button className="student-cell student-cell-button" type="button" onClick={() => setSelectedStudent(student)} aria-label={`View ${student.name}'s profile`}><Avatar student={student} /><span><strong>{student.name}</strong><small>{student.id}</small></span></button></td>
                      <td className="muted-cell">{student.className}</td>
                      <td><div className="score-cell"><span>{student.score}%</span><span className="score-track"><i style={{ width: `${student.score}%` }} /></span></div></td>
                      <td><span className={student.attendance < 80 ? "attendance-low" : "muted-cell"}>{student.attendance}%</span></td>
                      <td><span className={`trend trend-${student.trend}`}>{student.trend === "up" ? <ArrowUpRight size={15} /> : student.trend === "down" ? <ArrowDownRight size={15} /> : <span className="trend-dash">—</span>}{student.trend === "steady" ? "Steady" : student.trend === "up" ? "Improving" : "Declining"}</span></td>
                      <td><span className={`status status-${student.risk.toLowerCase().replace(" ", "-")}`}><i />{student.risk}</span></td>
                    </tr>
                  ))}
                  {filteredStudents.length === 0 && <tr><td className="empty-state" colSpan={6}>No students match these filters. Try another name, class, or status.</td></tr>}
                </tbody>
              </table>
            </div>
            <div className="table-footer">
              <span>Showing <strong>{filteredStudents.length === 0 ? 0 : Math.min(activePage === "Students" ? filteredStudents.length : 5, filteredStudents.length)}</strong> of <strong>{filteredStudents.length}</strong> students</span>
              {activePage !== "Students" && <button type="button" onClick={() => setActivePage("Students")}>View all students <ArrowRight size={14} /></button>}
              {activePage === "Students" && <button type="button" onClick={() => { setClassFilter("All classes"); setRiskFilter("All students"); setSearchTerm(""); }}>Clear filters <X size={13} /></button>}
            </div>
          </section>}

          {activePage === "Reports" && <section className="reports-grid" aria-label="Classroom performance report">
            <article className="panel report-breakdown">
              <div className="panel-heading"><div><h2>Class comparison</h2><p>Average performance across your sample classes</p></div><BookOpen size={18} /></div>
              <div className="report-class-list">
                {classes.map((item, index) => (
                  <div className="report-class-row" key={item.name}>
                    <div className="report-class-label"><span className={`class-dot dot-color-${index % 3}`} /><strong>{item.name}</strong><small>{item.students.length} students</small><b>{item.average}%</b></div>
                    <div className="report-track"><i className={`dot-color-fill-${index % 3}`} style={{ width: `${item.average}%` }} /></div>
                  </div>
                ))}
              </div>
              <button className="report-link-button" type="button" onClick={() => { setClassFilter("All classes"); setRiskFilter("All students"); setActivePage("Students"); }}>Explore all students <ArrowRight size={14} /></button>
            </article>
            <article className="panel report-breakdown">
              <div className="panel-heading"><div><h2>Student wellbeing</h2><p>Roster status at a glance</p></div><ShieldAlert size={18} /></div>
              <div className="wellbeing-list">
                {(["On track", "Watch", "At risk"] as const).map((risk) => (
                  <button className={`wellbeing-row status-row-${risk.toLowerCase().replace(" ", "-")}`} type="button" key={risk} onClick={() => { setRiskFilter(risk); setActivePage("Students"); }}>
                    <span className={`status status-${risk.toLowerCase().replace(" ", "-")}`}><i />{risk}</span>
                    <span className="wellbeing-meter"><i style={{ width: `${(riskCounts[risk] / students.length) * 100}%` }} /></span>
                    <strong>{riskCounts[risk]}</strong>
                  </button>
                ))}
              </div>
              <p className="report-note">Status labels are illustrative sample indicators, not an automated or predictive diagnosis.</p>
            </article>
          </section>}

          <footer className="page-footer"><span>© 2026 Classroom Analytics · Sample data for demonstration</span><span><i className="footer-status-dot" /> Saved records stay in this browser</span></footer>
            </>
          )}
        </div>
      </section>
      {showHelp && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowHelp(false); }}>
          <section className="help-dialog" role="dialog" aria-modal="true" aria-labelledby="help-title">
            <button className="dialog-close" type="button" aria-label="Close help" onClick={() => setShowHelp(false)}><X size={18} /></button>
            <span className="help-dialog-icon"><CircleHelp size={22} /></span>
            <h2 id="help-title">How can we help?</h2>
            <p>Your classroom data is a local demo saved in this browser. Search the student roster, switch classes, or add a new record from the sidebar.</p>
            <button className="submit-record-button" type="button" onClick={() => { setShowHelp(false); setActivePage("Record data"); }}>Add a student record <ArrowRight size={15} /></button>
          </section>
        </div>
      )}
      {selectedStudent && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedStudent(null); }}>
          <section className="student-dialog" role="dialog" aria-modal="true" aria-labelledby="student-dialog-title">
            <button className="dialog-close" type="button" aria-label="Close student profile" onClick={() => setSelectedStudent(null)}><X size={18} /></button>
            <div className="student-dialog-hero">
              <Avatar student={selectedStudent} />
              <div><span className={`status status-${selectedStudent.risk.toLowerCase().replace(" ", "-")}`}><i />{selectedStudent.risk}</span><h2 id="student-dialog-title">{selectedStudent.name}</h2><p>{selectedStudent.id} <span>·</span> {selectedStudent.className}</p></div>
            </div>
            <div className="student-dialog-stats">
              <div><span>Average score</span><strong>{selectedStudent.score}%</strong><i><b style={{ width: `${selectedStudent.score}%` }} /></i></div>
              <div><span>Attendance</span><strong>{selectedStudent.attendance}%</strong><i><b style={{ width: `${selectedStudent.attendance}%` }} /></i></div>
            </div>
            <div className="student-dialog-section">
              <div className="student-dialog-heading"><h3>Recent activity</h3><span>{records.filter((record) => record.studentId === selectedStudent.id).length} records</span></div>
              {records.filter((record) => record.studentId === selectedStudent.id).length > 0 ? (
                <div className="student-activity-list">
                  {records.filter((record) => record.studentId === selectedStudent.id).slice(0, 4).map((record) => (
                    <div className="student-activity-item" key={record.id}><span className={`record-type-icon type-${record.category.toLowerCase()}`}><Check size={14} /></span><div><strong>{record.category} · {record.value}</strong><span>{record.note || "No additional note"}</span></div><time>{new Date(`${record.date}T00:00:00`).toLocaleDateString("en", { month: "short", day: "numeric" })}</time></div>
                  ))}
                </div>
              ) : <p className="student-no-activity">No updates yet. Add an assessment, attendance update, or note to start a timeline.</p>}
            </div>
            <div className="student-dialog-footer">
              <span>Demonstration profile · Sample data</span>
              <button className="submit-record-button" type="button" onClick={() => openStudentRecord(selectedStudent)}><ClipboardPenLine size={15} /> Add update</button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
