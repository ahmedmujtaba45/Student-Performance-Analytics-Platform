"use client";

import { useSyncExternalStore } from "react";
import { isStudentRecord, sampleRecords, type StudentRecord } from "@/lib/student-records";

const storageKey = "student-records-v1";

type RecordStoreSnapshot = {
  records: StudentRecord[];
  error: string | null;
};

const serverSnapshot: RecordStoreSnapshot = { records: sampleRecords, error: null };
let snapshot = serverSnapshot;
let initialized = false;
const listeners = new Set<() => void>();

function loadSnapshot() {
  if (initialized || typeof window === "undefined") return snapshot;
  initialized = true;
  try {
    const savedRecords = window.localStorage.getItem(storageKey);
    if (savedRecords !== null) {
      const parsed: unknown = JSON.parse(savedRecords);
      if (!Array.isArray(parsed) || !parsed.every(isStudentRecord)) {
        throw new Error("Saved records have an invalid format.");
      }
      snapshot = { records: parsed, error: null };
    }
  } catch {
    snapshot = { records: sampleRecords, error: "Could not load saved records from browser storage." };
  }
  return snapshot;
}

function getSnapshot() {
  return loadSnapshot();
}

function getServerSnapshot() {
  return serverSnapshot;
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
  if (typeof window !== "undefined") {
    window.addEventListener("storage", handleStorageChange);
  }
  return () => {
    listeners.delete(listener);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", handleStorageChange);
    }
  };
}

export function useStudentRecords() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function saveStudentRecord(record: StudentRecord) {
  const current = loadSnapshot();
  if (current.error) return false;
  const records = [record, ...current.records];
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(records));
    snapshot = { records, error: null };
    initialized = true;
    notify();
    return true;
  } catch {
    snapshot = { records: current.records, error: "Could not save this record to browser storage." };
    notify();
    return false;
  }
}
