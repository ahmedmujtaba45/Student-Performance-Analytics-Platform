"use client";

import { useSyncExternalStore } from "react";
import { students as sampleStudents, type Student } from "@/lib/mock-data";

const storageKey = "classroom-students-v1";

type StudentStoreSnapshot = {
  students: Student[];
  error: string | null;
};

const serverSnapshot: StudentStoreSnapshot = { students: sampleStudents, error: null };
let snapshot = serverSnapshot;
let initialized = false;
const listeners = new Set<() => void>();

function isStudent(value: unknown): value is Student {
  if (typeof value !== "object" || value === null) return false;
  const student = value as Record<string, unknown>;
  return (
    typeof student.id === "string" && student.id.trim().length > 0 &&
    typeof student.name === "string" && student.name.trim().length > 0 &&
    typeof student.initials === "string" && student.initials.trim().length > 0 &&
    typeof student.className === "string" && student.className.trim().length > 0 &&
    typeof student.score === "number" && Number.isInteger(student.score) && student.score >= 0 && student.score <= 100 &&
    typeof student.attendance === "number" && Number.isInteger(student.attendance) && student.attendance >= 0 && student.attendance <= 100 &&
    ["up", "down", "steady"].includes(String(student.trend)) &&
    ["On track", "Watch", "At risk"].includes(String(student.risk)) &&
    ["lavender", "peach", "mint", "blue", "rose", "yellow", "teal", "orange"].includes(String(student.color))
  );
}

function loadSnapshot() {
  if (initialized || typeof window === "undefined") return snapshot;
  initialized = true;
  try {
    const savedStudents = window.localStorage.getItem(storageKey);
    if (savedStudents !== null) {
      const parsed: unknown = JSON.parse(savedStudents);
      if (!Array.isArray(parsed) || !parsed.every(isStudent) ||
        new Set(parsed.map((student) => student.id)).size !== parsed.length) {
        throw new Error("Saved student data has an invalid format.");
      }
      snapshot = { students: parsed, error: null };
    }
  } catch {
    snapshot = { students: sampleStudents, error: "Could not load the saved roster from browser storage." };
  }
  return snapshot;
}

function notify() {
  listeners.forEach((listener) => listener());
}

function handleStorageChange() {
  initialized = false;
  loadSnapshot();
  notify();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (typeof window !== "undefined") window.addEventListener("storage", handleStorageChange);
  return () => {
    listeners.delete(listener);
    if (typeof window !== "undefined") window.removeEventListener("storage", handleStorageChange);
  };
}

function getSnapshot() {
  return loadSnapshot();
}

function getServerSnapshot() {
  return serverSnapshot;
}

export function useStudentRoster() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function saveStudentRoster(students: Student[]) {
  const current = loadSnapshot();
  if (current.error) return false;
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(students));
    snapshot = { students, error: null };
    initialized = true;
    notify();
    return true;
  } catch {
    snapshot = { students: current.students, error: "Could not save the roster to browser storage." };
    notify();
    return false;
  }
}
