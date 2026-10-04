"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Check, X } from "lucide-react";
import type { Student } from "@/lib/mock-data";

const studentColors = ["lavender", "peach", "mint", "blue", "rose", "yellow", "teal", "orange"];

function initialsFor(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 3)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function statusFor(score: number, attendance: number): Student["risk"] {
  if (score < 70 || attendance < 80) return "At risk";
  if (score < 80 || attendance < 90) return "Watch";
  return "On track";
}

export function StudentForm({
  student,
  classNames,
  nextStudentId,
  existingStudentIds,
  onSave,
  onClose,
}: {
  student?: Student;
  classNames: string[];
  nextStudentId: string;
  existingStudentIds: string[];
  onSave: (student: Student) => boolean;
  onClose: () => void;
}) {
  const [name, setName] = useState(student?.name ?? "");
  const [studentId, setStudentId] = useState(student?.id ?? nextStudentId);
  const [className, setClassName] = useState(student?.className ?? classNames[0] ?? "");
  const [score, setScore] = useState(String(student?.score ?? 75));
  const [attendance, setAttendance] = useState(String(student?.attendance ?? 90));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedName = name.trim();
    const normalizedId = studentId.trim().toUpperCase();
    const numericScore = Number(score);
    const numericAttendance = Number(attendance);
    if (!normalizedName || !normalizedId || !className) {
      setError("Please complete every required field.");
      return;
    }
    if (!student && existingStudentIds.includes(normalizedId)) {
      setError("That student ID is already in use. Choose a different ID.");
      return;
    }
    if (!Number.isInteger(numericScore) || numericScore < 0 || numericScore > 100 ||
      !Number.isInteger(numericAttendance) || numericAttendance < 0 || numericAttendance > 100) {
      setError("Score and attendance must be whole numbers from 0 to 100.");
      return;
    }

    const nextStatus = statusFor(numericScore, numericAttendance);
    const nextStudent: Student = {
      id: normalizedId,
      name: normalizedName,
      initials: initialsFor(normalizedName),
      className,
      score: numericScore,
      attendance: numericAttendance,
      trend: student?.trend ?? "steady",
      risk: nextStatus,
      color: student?.color ?? studentColors[(normalizedName.length + className.length) % studentColors.length],
    };
    if (onSave(nextStudent)) onClose();
    else setError("The roster could not be saved. Check browser storage and try again.");
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section className="student-form-dialog" role="dialog" aria-modal="true" aria-labelledby="student-form-title">
        <button className="dialog-close" type="button" aria-label="Close student form" onClick={onClose}><X size={18} /></button>
        <span className="help-dialog-icon"><Check size={21} /></span>
        <h2 id="student-form-title">{student ? "Edit student" : "Add a student"}</h2>
        <p>Keep the classroom roster and support indicators up to date.</p>
        <form className="student-edit-form" onSubmit={submit}>
          <div className="form-row">
            <label className="form-field">
              <span>Student name</span>
              <input value={name} onChange={(event) => setName(event.target.value)} maxLength={80} autoFocus required />
            </label>
            <label className="form-field">
              <span>Student ID</span>
              <input value={studentId} onChange={(event) => setStudentId(event.target.value)} disabled={Boolean(student)} maxLength={20} required />
            </label>
          </div>
          <label className="form-field">
            <span>Class</span>
            <select value={className} onChange={(event) => setClassName(event.target.value)} required>
              {classNames.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <div className="form-row">
            <label className="form-field">
              <span>Average score</span>
              <div className="input-suffix"><input type="number" min="0" max="100" step="1" value={score} onChange={(event) => setScore(event.target.value)} required /><span>%</span></div>
            </label>
            <label className="form-field">
              <span>Attendance</span>
              <div className="input-suffix"><input type="number" min="0" max="100" step="1" value={attendance} onChange={(event) => setAttendance(event.target.value)} required /><span>%</span></div>
            </label>
          </div>
          <div className="student-status-preview">
            <span>Status preview</span>
            <span className={`status status-${statusFor(Number(score) || 0, Number(attendance) || 0).toLowerCase().replace(" ", "-")}`}>
              <i />{statusFor(Number(score) || 0, Number(attendance) || 0)}
            </span>
          </div>
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="student-form-actions">
            <button className="secondary-button" type="button" onClick={onClose}>Cancel</button>
            <button className="submit-record-button" type="submit"><Check size={15} />{student ? "Save changes" : "Add student"}</button>
          </div>
          <small className="student-form-note">Status is a simple demo indicator based on score and attendance, not a diagnosis.</small>
        </form>
      </section>
    </div>
  );
}
