"use client";

import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowDownRight,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
} from "lucide-react";
import { usePagination } from "@/hooks/use-pagination";
import type { Student } from "@/lib/mock-data";

type SortKey = "name" | "className" | "score" | "attendance";

function Avatar({ student }: { student: Pick<Student, "initials" | "color"> }) {
  return <span className={`avatar avatar-${student.color}`}>{student.initials}</span>;
}

export function StudentTable({
  students,
  allStudents,
  classNames,
  searchTerm,
  classFilter,
  riskFilter,
  compact = false,
  onSearchChange,
  onClassChange,
  onRiskChange,
  onSelectStudent,
  onAddStudent,
  onExportSelected,
  onClearFilters,
}: {
  students: Student[];
  allStudents: Student[];
  classNames: string[];
  searchTerm: string;
  classFilter: string;
  riskFilter: string;
  compact?: boolean;
  onSearchChange: (value: string) => void;
  onClassChange: (value: string) => void;
  onRiskChange: (value: string) => void;
  onSelectStudent: (student: Student) => void;
  onAddStudent: () => void;
  onExportSelected: (students: Student[]) => void;
  onClearFilters: () => void;
}) {
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const sortedStudents = useMemo(() => [...students].sort((a, b) => {
    const first = a[sortKey];
    const second = b[sortKey];
    const comparison = typeof first === "number" && typeof second === "number"
      ? first - second
      : String(first).localeCompare(String(second));
    return sortDirection === "asc" ? comparison : -comparison;
  }), [students, sortDirection, sortKey]);
  const pagination = usePagination(sortedStudents);
  const visibleStudents = compact ? sortedStudents.slice(0, 5) : pagination.pageItems;
  const visibleIds = visibleStudents.map((student) => student.id);
  const allVisibleSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedIds.includes(id));
  const selectedStudents = allStudents.filter((student) => selectedIds.includes(student.id));

  function sortBy(key: SortKey) {
    if (sortKey === key) setSortDirection((direction) => direction === "asc" ? "desc" : "asc");
    else {
      setSortKey(key);
      setSortDirection(key === "name" || key === "className" ? "asc" : "desc");
    }
    pagination.setPage(1);
  }

  function toggleStudent(id: string) {
    setSelectedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  function toggleVisible() {
    setSelectedIds((current) => allVisibleSelected
      ? current.filter((id) => !visibleIds.includes(id))
      : [...new Set([...current, ...visibleIds])]);
  }

  function sortLabel(label: string, key: SortKey) {
    const active = sortKey === key;
    return (
      <button className="sort-button" type="button" onClick={() => sortBy(key)} aria-label={`Sort by ${label}`}>
        {label}{active ? sortDirection === "asc" ? <ArrowUp size={12} /> : <ArrowDown size={12} /> : null}
      </button>
    );
  }

  const start = sortedStudents.length ? compact ? 1 : (pagination.page - 1) * pagination.pageSize + 1 : 0;
  const end = compact ? Math.min(5, sortedStudents.length) : Math.min(pagination.page * pagination.pageSize, sortedStudents.length);

  return (
    <section className={`panel students-panel ${compact ? "students-panel-compact" : ""}`}>
      <div className="students-heading">
        <div>
          <h2>{compact ? "Student overview" : "Student roster"}</h2>
          <p>{compact ? "A snapshot of how everyone is doing" : "Search, sort, and review student progress"}</p>
        </div>
        {!compact && (
          <button className="add-student-button" type="button" onClick={onAddStudent}><Plus size={15} /> Add student</button>
        )}
      </div>
      <div className="roster-toolbar">
        <div className="student-controls">
          <label className="search-box"><span className="sr-only">Search students</span><input value={searchTerm} onChange={(event) => { onSearchChange(event.target.value); pagination.setPage(1); }} placeholder="Search name or ID" /></label>
          <label className="select-wrap class-select">
            <span className="sr-only">Filter by class</span>
            <select value={classFilter} onChange={(event) => { onClassChange(event.target.value); pagination.setPage(1); }}>
              <option>All classes</option>
              {classNames.map((name) => <option key={name}>{name}</option>)}
            </select>
          </label>
          <label className="select-wrap risk-select">
            <span className="sr-only">Filter by student status</span>
            <select value={riskFilter} onChange={(event) => { onRiskChange(event.target.value); pagination.setPage(1); }}>
              <option>All students</option>
              <option>At risk</option>
              <option>Watch</option>
              <option>On track</option>
            </select>
          </label>
        </div>
        {!compact && (
          <div className="selection-actions" aria-live="polite">
            {selectedStudents.length > 0 ? (
              <>
                <span>{selectedStudents.length} selected</span>
                <button className="text-action" type="button" onClick={() => onExportSelected(selectedStudents)}>Export selected <ArrowRight size={13} /></button>
                <button className="clear-selection-button" type="button" aria-label="Clear selection" onClick={() => setSelectedIds([])}><X size={14} /></button>
              </>
            ) : <span>Select rows to export a custom report</span>}
          </div>
        )}
      </div>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              {!compact && <th className="checkbox-column"><input type="checkbox" aria-label="Select all visible students" checked={allVisibleSelected} onChange={toggleVisible} /></th>}
              <th>STUDENT</th>
              <th>{sortLabel("CLASS", "className")}</th>
              <th>{sortLabel("AVERAGE SCORE", "score")}</th>
              <th>{sortLabel("ATTENDANCE", "attendance")}</th>
              <th>TREND</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {visibleStudents.map((student) => (
              <tr key={student.id}>
                {!compact && <td className="checkbox-column"><input type="checkbox" aria-label={`Select ${student.name}`} checked={selectedIds.includes(student.id)} onChange={() => toggleStudent(student.id)} /></td>}
                <td><button className="student-cell student-cell-button" type="button" onClick={() => onSelectStudent(student)} aria-label={`View ${student.name}'s profile`}><Avatar student={student} /><span><strong>{student.name}</strong><small>{student.id}</small></span></button></td>
                <td className="muted-cell">{student.className}</td>
                <td><div className="score-cell"><span>{student.score}%</span><span className="score-track"><i style={{ width: `${student.score}%` }} /></span></div></td>
                <td><span className={student.attendance < 80 ? "attendance-low" : "muted-cell"}>{student.attendance}%</span></td>
                <td><span className={`trend trend-${student.trend}`}>{student.trend === "up" ? <ArrowUpRight size={15} /> : student.trend === "down" ? <ArrowDownRight size={15} /> : <span className="trend-dash">—</span>}{student.trend === "steady" ? "Steady" : student.trend === "up" ? "Improving" : "Declining"}</span></td>
                <td><span className={`status status-${student.risk.toLowerCase().replace(" ", "-")}`}><i />{student.risk}</span></td>
              </tr>
            ))}
            {visibleStudents.length === 0 && <tr><td className="empty-state" colSpan={compact ? 6 : 7}>No students match these filters. Try another name, class, or status.</td></tr>}
          </tbody>
        </table>
      </div>
      <div className="table-footer">
        <span>Showing <strong>{start}–{end}</strong> of <strong>{sortedStudents.length}</strong> students</span>
        {compact ? (
          <button type="button" onClick={() => onClearFilters()}>View all students <ArrowRight size={14} /></button>
        ) : (
          <div className="pagination-controls">
            <label>Rows
              <select value={pagination.pageSize} onChange={(event) => pagination.setPageSize(Number(event.target.value))} aria-label="Rows per page">
                {[5, 8, 12].map((size) => <option key={size} value={size}>{size}</option>)}
              </select>
            </label>
            <span>Page {pagination.page} of {pagination.pageCount}</span>
            <button type="button" aria-label="Previous page" disabled={pagination.page <= 1} onClick={() => pagination.setPage(pagination.page - 1)}><ChevronLeft size={15} /></button>
            <button type="button" aria-label="Next page" disabled={pagination.page >= pagination.pageCount} onClick={() => pagination.setPage(pagination.page + 1)}><ChevronRight size={15} /></button>
            <button className="text-action" type="button" onClick={onClearFilters}>Clear filters <X size={13} /></button>
          </div>
        )}
      </div>
    </section>
  );
}
