export type Student = {
  id: string;
  name: string;
  initials: string;
  className: string;
  score: number;
  attendance: number;
  trend: "up" | "down" | "steady";
  risk: "On track" | "Watch" | "At risk";
  color: string;
};

const baseStudents: Student[] = [
  { id: "ST-1042", name: "Haroon Abdullah", initials: "HA", className: "Year 10A", score: 92, attendance: 98, trend: "up", risk: "On track", color: "lavender" },
  { id: "ST-1038", name: "Muhammad Hassan", initials: "MH", className: "Year 10A", score: 68, attendance: 76, trend: "down", risk: "At risk", color: "peach" },
  { id: "ST-1046", name: "Taimoor Ali", initials: "TA", className: "Year 9B", score: 84, attendance: 91, trend: "up", risk: "On track", color: "mint" },
  { id: "ST-1029", name: "Raja Mamnoon Abbas", initials: "RMA", className: "Year 10B", score: 73, attendance: 82, trend: "steady", risk: "Watch", color: "blue" },
  { id: "ST-1051", name: "Abdul Rehman", initials: "AR", className: "Year 9B", score: 59, attendance: 68, trend: "down", risk: "At risk", color: "rose" },
  { id: "ST-1033", name: "Ali Sher", initials: "AS", className: "Year 10A", score: 88, attendance: 95, trend: "up", risk: "On track", color: "yellow" },
  { id: "ST-1049", name: "Nauman Manzoor", initials: "NM", className: "Year 10B", score: 77, attendance: 87, trend: "steady", risk: "Watch", color: "teal" },
  { id: "ST-1025", name: "Zain Hamdani", initials: "ZH", className: "Year 9B", score: 91, attendance: 96, trend: "up", risk: "On track", color: "orange" },
  { id: "ST-1061", name: "Samir Khan", initials: "SK", className: "Year 10A", score: 81, attendance: 94, trend: "up", risk: "On track", color: "blue" },
  { id: "ST-1062", name: "Bilal Ahmed", initials: "BA", className: "Year 10A", score: 72, attendance: 85, trend: "steady", risk: "Watch", color: "mint" },
  { id: "ST-1063", name: "Hamza Malik", initials: "HM", className: "Year 10A", score: 64, attendance: 72, trend: "down", risk: "At risk", color: "rose" },
  { id: "ST-1064", name: "Umar Farooq", initials: "UF", className: "Year 10A", score: 86, attendance: 97, trend: "up", risk: "On track", color: "yellow" },
  { id: "ST-1065", name: "Daniyal Iqbal", initials: "DI", className: "Year 10A", score: 74, attendance: 89, trend: "steady", risk: "Watch", color: "teal" },
  { id: "ST-1066", name: "Hassan Raza", initials: "HR", className: "Year 10B", score: 82, attendance: 93, trend: "up", risk: "On track", color: "lavender" },
  { id: "ST-1067", name: "Ibrahim Shah", initials: "IS", className: "Year 10B", score: 66, attendance: 79, trend: "down", risk: "At risk", color: "peach" },
  { id: "ST-1068", name: "Saad Qureshi", initials: "SQ", className: "Year 10B", score: 89, attendance: 96, trend: "up", risk: "On track", color: "orange" },
  { id: "ST-1069", name: "Ayan Malik", initials: "AM", className: "Year 10B", score: 71, attendance: 80, trend: "steady", risk: "Watch", color: "blue" },
  { id: "ST-1070", name: "Rayyan Siddiqui", initials: "RS", className: "Year 10B", score: 78, attendance: 88, trend: "steady", risk: "Watch", color: "mint" },
  { id: "ST-1071", name: "Ahmed Raza", initials: "AR", className: "Year 9B", score: 83, attendance: 90, trend: "up", risk: "On track", color: "yellow" },
  { id: "ST-1072", name: "Bilal Hassan", initials: "BH", className: "Year 9B", score: 62, attendance: 74, trend: "down", risk: "At risk", color: "rose" },
  { id: "ST-1073", name: "Huzaifa Ali", initials: "HA", className: "Year 9B", score: 87, attendance: 95, trend: "up", risk: "On track", color: "teal" },
  { id: "ST-1074", name: "Talha Mahmood", initials: "TM", className: "Year 9B", score: 75, attendance: 84, trend: "steady", risk: "Watch", color: "peach" },
  { id: "ST-1075", name: "Arham Khan", initials: "AK", className: "Year 9B", score: 94, attendance: 99, trend: "up", risk: "On track", color: "lavender" },
  { id: "ST-1076", name: "Hamza Yousuf", initials: "HY", className: "Year 9B", score: 69, attendance: 78, trend: "down", risk: "At risk", color: "orange" },
];

const additionalStudentNames = [
  "Yusuf Rahman", "Salman Rafiq", "Abdullah Sheikh", "Mohammad Zaid",
  "Yasir Mehmood", "Saif Mustafa", "Ehsan Khan", "Kashif Raza",
  "Naveed Iqbal", "Affan Mirza", "Daniyal Shah", "Furqan Haider",
  "Rameez Akhtar", "Shahzaib Tariq", "Muneeb Aslam", "Waleed Hussain",
  "Taha Javed", "Subhan Qureshi", "Adeel Mahmood", "Rayan Saeed",
  "Zohair Ahmad", "Shayan Raza", "Sameer Nawaz", "Areeb Butt",
];
const sampleScores = [78, 86, 67, 91, 73, 82, 64, 88, 75, 93, 69, 80, 84, 71, 96, 62, 89, 76, 83, 68, 92, 74, 87, 65];
const sampleAttendance = [91, 96, 78, 99, 86, 93, 71, 95, 88, 98, 76, 90, 94, 82, 99, 69, 97, 85, 92, 74, 98, 87, 95, 79];
const sampleColors = ["lavender", "peach", "mint", "blue", "rose", "yellow", "teal", "orange"];
const additionalStudents = additionalStudentNames.map((name, index): Student => {
  const score = sampleScores[index];
  const attendance = sampleAttendance[index];
  const risk: Student["risk"] = score < 70 || attendance < 80
    ? "At risk"
    : score < 80 || attendance < 90
      ? "Watch"
      : "On track";
  return {
    id: `ST-${2001 + index}`,
    name,
    initials: name.split(" ").map((part) => part[0]).join(""),
    className: ["Year 10A", "Year 10B", "Year 9B"][index % 3],
    score,
    attendance,
    trend: score >= 82 ? "up" : score < 70 ? "down" : "steady",
    risk,
    color: sampleColors[index % sampleColors.length],
  };
});

export const students: Student[] = [...baseStudents, ...additionalStudents];

export const performanceByWeek = [
  { week: "Aug 19", average: 69, attendance: 81 },
  { week: "Aug 26", average: 72, attendance: 84 },
  { week: "Sep 2", average: 71, attendance: 82 },
  { week: "Sep 9", average: 74, attendance: 86 },
  { week: "Sep 16", average: 72, attendance: 84 },
  { week: "Sep 23", average: 78, attendance: 89 },
  { week: "Sep 30", average: 76, attendance: 87 },
];

export const performanceThisTerm = [
  { week: "Aug", average: 68, attendance: 80 },
  { week: "Aug 15", average: 71, attendance: 83 },
  { week: "Sep", average: 74, attendance: 85 },
  { week: "Sep 15", average: 77, attendance: 88 },
  { week: "Oct", average: 79, attendance: 87 },
];
