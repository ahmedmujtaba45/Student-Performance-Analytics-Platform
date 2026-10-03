export type RecordCategory = "Assessment" | "Attendance" | "Assignment" | "Behavior";

export type StudentRecord = {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  category: RecordCategory;
  value: string;
  date: string;
  note: string;
};

export const sampleRecords: StudentRecord[] = [
  {
    id: "record-1",
    studentId: "ST-1038",
    studentName: "Muhammad Hassan",
    className: "Year 10A",
    category: "Assessment",
    value: "68%",
    date: "2026-10-02",
    note: "Algebra quiz",
  },
  {
    id: "record-2",
    studentId: "ST-1051",
    studentName: "Abdul Rehman",
    className: "Year 9B",
    category: "Attendance",
    value: "Absent",
    date: "2026-10-02",
    note: "",
  },
  {
    id: "record-3",
    studentId: "ST-1042",
    studentName: "Haroon Abdullah",
    className: "Year 10A",
    category: "Assignment",
    value: "Submitted",
    date: "2026-10-01",
    note: "Chapter 4 practice",
  },
  {
    id: "record-4",
    studentId: "ST-1051",
    studentName: "Abdul Rehman",
    className: "Year 9B",
    category: "Assessment",
    value: "59%",
    date: "2026-10-01",
    note: "Fractions and decimals check-in",
  },
  {
    id: "record-5",
    studentId: "ST-1063",
    studentName: "Hamza Malik",
    className: "Year 10A",
    category: "Attendance",
    value: "Absent",
    date: "2026-10-02",
    note: "Follow up with family",
  },
  {
    id: "record-6",
    studentId: "ST-1067",
    studentName: "Ibrahim Shah",
    className: "Year 10B",
    category: "Assessment",
    value: "66%",
    date: "2026-09-30",
    note: "Linear equations quiz",
  },
  {
    id: "record-7",
    studentId: "ST-1072",
    studentName: "Bilal Hassan",
    className: "Year 9B",
    category: "Behavior",
    value: "Needs support",
    date: "2026-10-02",
    note: "Requested extra help with homework",
  },
  {
    id: "record-8",
    studentId: "ST-1076",
    studentName: "Hamza Yousuf",
    className: "Year 9B",
    category: "Attendance",
    value: "Late",
    date: "2026-10-01",
    note: "Check-in after three late arrivals",
  },
];

export function isStudentRecord(value: unknown): value is StudentRecord {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.id === "string" &&
    typeof record.studentId === "string" &&
    typeof record.studentName === "string" &&
    typeof record.className === "string" &&
    ["Assessment", "Attendance", "Assignment", "Behavior"].includes(String(record.category)) &&
    typeof record.value === "string" &&
    typeof record.date === "string" &&
    typeof record.note === "string"
  );
}
