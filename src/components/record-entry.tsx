"use client";

import { ArrowDownRight, ArrowUpRight, CalendarDays, Check, ClipboardPlus, FileText, UserRound } from "lucide-react";
import { useState, type FormEvent } from "react";
import { students } from "@/lib/mock-data";
import type { RecordCategory, StudentRecord } from "@/lib/student-records";

const categories: RecordCategory[] = ["Assessment", "Attendance", "Assignment", "Behavior"];

export function RecordEntry({
  records,
  storageError,
  onAdd,
  selectedStudentId,
}: {
  records: StudentRecord[];
  storageError: string | null;
  onAdd: (record: StudentRecord) => boolean;
  selectedStudentId?: string;
}) {
  const [category, setCategory] = useState<RecordCategory>("Assessment");
  const [studentId, setStudentId] = useState(() => students.find((student) => student.id === selectedStudentId)?.id ?? students[0].id);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [value, setValue] = useState("");
  const [note, setNote] = useState("");
  const [success, setSuccess] = useState(false);

  const selectedStudent = students.find((student) => student.id === studentId) ?? students[0];
  const latestRecords = [...records].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8);

  function submitRecord(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const record: StudentRecord = {
      id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `record-${Date.now()}`,
      studentId: selectedStudent.id,
      studentName: selectedStudent.name,
      className: selectedStudent.className,
      category,
      value: category === "Assessment" ? `${value}%` : value,
      date,
      note: note.trim(),
    };

    if (onAdd(record)) {
      setValue("");
      setNote("");
      setSuccess(true);
      window.setTimeout(() => setSuccess(false), 3500);
    }
  }

  return (
    <>
      <section className="welcome-row record-welcome">
        <div>
          <div className="eyebrow"><span className="live-dot" /> KEEP STUDENT RECORDS UP TO DATE</div>
          <h1>Record student data</h1>
          <p>Add an assessment, attendance update, assignment, or behavior note.</p>
        </div>
      </section>

      {storageError && <div className="storage-error" role="alert">{storageError} Your existing entries are still available, but new entries cannot be saved in this browser.</div>}
      {success && <div className="save-success" role="status"><Check size={15} /> Record saved in this browser.</div>}

      <div className="record-layout">
        <section className="panel record-form-panel">
          <div className="record-panel-heading">
            <span className="record-heading-icon"><ClipboardPlus size={18} /></span>
            <div><h2>New student record</h2><p>Choose the student and enter the latest information.</p></div>
          </div>
          <form className="record-form" onSubmit={submitRecord}>
            <label className="form-field">
              <span>Record type</span>
              <select value={category} onChange={(event) => { setCategory(event.target.value as RecordCategory); setValue(""); }}>
                {categories.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label className="form-field">
              <span>Student</span>
              <select value={studentId} onChange={(event) => setStudentId(event.target.value)}>
                {students.map((student) => <option key={student.id} value={student.id}>{student.name} · {student.className}</option>)}
              </select>
            </label>
            <div className="form-row">
              <label className="form-field">
                <span>{category === "Assessment" ? "Score (out of 100)" : category === "Attendance" ? "Attendance" : category === "Assignment" ? "Assignment status" : "Behavior"}</span>
                {category === "Assessment" ? (
                  <div className="input-suffix"><input type="number" min="0" max="100" step="1" value={value} onChange={(event) => setValue(event.target.value)} placeholder="e.g. 85" required /><span>%</span></div>
                ) : (
                  <select value={value} onChange={(event) => setValue(event.target.value)} required>
                    <option value="" disabled>Select an option</option>
                    {(category === "Attendance" ? ["Present", "Absent", "Late"] : category === "Assignment" ? ["Submitted", "Missing", "Late"] : ["Positive", "Needs support"]).map((option) => <option key={option}>{option}</option>)}
                  </select>
                )}
              </label>
              <label className="form-field">
                <span>Date</span>
                <span className="date-input"><input type="date" value={date} onChange={(event) => setDate(event.target.value)} required /><CalendarDays size={15} /></span>
              </label>
            </div>
            <label className="form-field">
              <span>Note <small>Optional</small></span>
              <textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder={category === "Assessment" ? "Add the assessment name or a short note..." : "Add context for this record..."} rows={3} maxLength={240} />
            </label>
            <div className="form-submit-row">
              <span className="mock-data-note">Saved locally in this browser</span>
              <button className="submit-record-button" type="submit" disabled={Boolean(storageError)}><Check size={15} /> Save record</button>
            </div>
          </form>
        </section>

        <section className="panel recent-records-panel">
          <div className="panel-heading recent-heading">
            <div><h2>Recent records</h2><p>Your latest student updates</p></div>
            <span className="record-total">{records.length}</span>
          </div>
          <div className="recent-record-list">
            {latestRecords.length === 0 ? (
              <div className="records-empty"><FileText size={21} /><span>No records yet</span><small>Saved updates will appear here.</small></div>
            ) : latestRecords.map((record) => (
              <article className="recent-record" key={record.id}>
                <span className={`record-type-icon type-${record.category.toLowerCase()}`}>{record.category === "Assessment" ? <FileText size={15} /> : record.category === "Attendance" ? <CalendarDays size={15} /> : record.category === "Assignment" ? <Check size={15} /> : <UserRound size={15} />}</span>
                <div className="recent-record-copy">
                  <div className="recent-record-title"><strong>{record.studentName}</strong><span>{record.value}</span></div>
                  <div className="recent-record-meta">{record.category} · {record.className}</div>
                  {record.note && <div className="recent-record-note">{record.note}</div>}
                  <time dateTime={record.date}>{new Date(`${record.date}T00:00:00`).toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" })}</time>
                </div>
                {record.category === "Assessment" && Number.parseInt(record.value, 10) >= 80 ? <ArrowUpRight className="record-trend-up" size={15} /> : record.category === "Assessment" ? <ArrowDownRight className="record-trend-down" size={15} /> : null}
              </article>
            ))}
          </div>
          <p className="browser-storage-note">Demo data is stored in local browser storage only. It is not shared with other devices or users.</p>
        </section>
      </div>
    </>
  );
}
