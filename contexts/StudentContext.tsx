"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

export type StudentState = {
  languageCode: string | null;
  level: string | null;
  courseId: string | null;
};

type StudentContextType = {
  student: StudentState;
  setEnrollment: (languageCode: string, level: string, courseId: string) => void;
  clearEnrollment: () => void;
};

const StudentContext = createContext<StudentContextType | null>(null);

const STORAGE_KEY = "koshei_student";

export function StudentProvider({ children }: { children: ReactNode }) {
  const [student, setStudent] = useState<StudentState>({
    languageCode: null,
    level: null,
    courseId: null,
  });

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as StudentState;
        setStudent(parsed);
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  function setEnrollment(
    languageCode: string,
    level: string,
    courseId: string
  ) {
    const next: StudentState = { languageCode, level, courseId };
    setStudent(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore storage errors
    }
  }

  function clearEnrollment() {
    setStudent({ languageCode: null, level: null, courseId: null });
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore storage errors
    }
  }

  return (
    <StudentContext.Provider value={{ student, setEnrollment, clearEnrollment }}>
      {children}
    </StudentContext.Provider>
  );
}

export function useStudent() {
  const ctx = useContext(StudentContext);
  if (!ctx) throw new Error("useStudent must be used within StudentProvider");
  return ctx;
}
