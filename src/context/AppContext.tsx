import React, { createContext, useContext, useState } from 'react';
import {
  User,
  Role,
  Institution,
  CourseDetails,
  CourseOutcome,
  COPOMap,
  MarkingRubric,
  Session,
  Batch,
  StudentProgress,
  EndSemAssessment,
  ClassroomItem,
  CourseFileSection,
} from '../types';
import {
  cleanInstitution,
  defaultUsers,
  cleanCourseDetails,
  defaultRubric,
  cleanEndSemAssessment,
  defaultCourseFileSections,
} from '../data/mockData';

interface AppContextType {
  currentUser: User;
  switchRole: (role: Role) => void;
  institution: Institution;
  course: CourseDetails;
  updateCourse: (updates: Partial<CourseDetails>) => void;
  cos: CourseOutcome[];
  addCO: (co: Omit<CourseOutcome, 'id'>) => void;
  removeCO: (id: string) => void;
  copoMap: COPOMap[];
  rubric: MarkingRubric;
  updateRubric: (rubric: MarkingRubric) => void;
  planStatus: 'draft' | 'sent' | 'approved' | 'declined';
  sendPlanToHOD: () => void;
  hodPlanDecision: (decision: 'approved' | 'declined', remark?: string) => void;
  hodPlanRemark?: string;
  sessions: Session[];
  generateSessions: () => void;
  activeSessionId: string;
  setActiveSessionId: (id: string) => void;
  batches: Batch[];
  addBatch: (batch: Omit<Batch, 'id'>) => void;
  students: StudentProgress[];
  importRoster: (names: string[]) => void;
  updateStudentAttendance: (studentId: string, status: 'present' | 'late' | 'absent') => void;
  updateStudentViva: (studentId: string, marks: number) => void;
  classroomItems: ClassroomItem[];
  addClassroomItem: (item: Omit<ClassroomItem, 'id' | 'created_at'>) => void;
  endSem: EndSemAssessment;
  setEndSemStage: (stage: 1 | 2 | 3 | 4 | 5 | 6) => void;
  approveEndSemQuestion: (qId: string) => void;
  hodEndSemDecision: (decision: 'approved' | 'declined', remark?: string) => void;
  activateEndSem: () => void;
  courseFileSections: CourseFileSection[];
  useAICredit: (featureName: string) => boolean;
  aiMessage: string | null;
  clearAIMessage: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedStudentForDetail: StudentProgress | null;
  setSelectedStudentForDetail: (student: StudentProgress | null) => void;
  clearAllData: () => void;
  loadDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(defaultUsers[0]);
  const [institution, setInstitution] = useState<Institution>(cleanInstitution);
  const [course, setCourse] = useState<CourseDetails>(cleanCourseDetails);
  const [cos, setCOs] = useState<CourseOutcome[]>([]);
  const [copoMap, setCOPOMap] = useState<COPOMap[]>([]);
  const [rubric, setRubric] = useState<MarkingRubric>(defaultRubric);
  const [planStatus, setPlanStatus] = useState<'draft' | 'sent' | 'approved' | 'declined'>('draft');
  const [hodPlanRemark, setHodPlanRemark] = useState<string>('');
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>('');
  const [batches, setBatches] = useState<Batch[]>([]);
  const [students, setStudents] = useState<StudentProgress[]>([]);
  const [classroomItems, setClassroomItems] = useState<ClassroomItem[]>([]);
  const [endSem, setEndSem] = useState<EndSemAssessment>(cleanEndSemAssessment);
  const [courseFileSections] = useState<CourseFileSection[]>(defaultCourseFileSections);
  const [aiMessage, setAiMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStudentForDetail, setSelectedStudentForDetail] = useState<StudentProgress | null>(null);

  const switchRole = (role: Role) => {
    const matchedUser = defaultUsers.find((u) => u.roles.includes(role)) || {
      ...defaultUsers[0],
      roles: [role],
      activeRole: role,
    };
    setCurrentUser({ ...matchedUser, activeRole: role });
  };

  const updateCourse = (updates: Partial<CourseDetails>) => {
    setCourse((prev) => ({ ...prev, ...updates }));
  };

  const addCO = (newCO: Omit<CourseOutcome, 'id'>) => {
    const id = `co-${Date.now()}`;
    setCOs((prev) => [...prev, { ...newCO, id }]);
    setCOPOMap((prev) => [
      ...prev,
      {
        co_code: newCO.code,
        po_scores: { PO1: 2, PO2: 2, PO3: 1, PO5: 0, PO12: 1, PSO1: 2 },
      },
    ]);
  };

  const removeCO = (id: string) => {
    const target = cos.find((c) => c.id === id);
    setCOs((prev) => prev.filter((c) => c.id !== id));
    if (target) {
      setCOPOMap((prev) => prev.filter((m) => m.co_code !== target.code));
    }
  };

  const updateRubric = (newRubric: MarkingRubric) => {
    setRubric(newRubric);
  };

  const sendPlanToHOD = () => {
    setPlanStatus('sent');
  };

  const hodPlanDecision = (decision: 'approved' | 'declined', remark = '') => {
    setPlanStatus(decision);
    setHodPlanRemark(remark);
  };

  const addBatch = (newBatch: Omit<Batch, 'id'>) => {
    const id = `batch-${Date.now()}`;
    setBatches((prev) => [...prev, { ...newBatch, id }]);
  };

  const generateSessions = () => {
    const newSessions: Session[] = Array.from({ length: 15 }, (_, i) => {
      const n = i + 1;
      return {
        id: `s-${n}`,
        n,
        title: `Session ${n}`,
        date: `2027-0${Math.floor(i / 4) + 1}-${((i % 4) * 7 + 6).toString().padStart(2, '0')}`,
        topic: `Lab Module ${n}`,
        co_id: cos.length > 0 ? cos[i % cos.length].code : 'CO1',
        btl: 'L3 Apply',
        status: 'draft',
        pre_open: '18:00 previous day',
        pre_close: '09:59 same day',
        post_close: '23:59 same day',
        questions: [],
        pre_bank: [],
        post_bank: [],
      };
    });
    setSessions(newSessions);
    if (newSessions.length > 0) setActiveSessionId(newSessions[0].id);
  };

  const importRoster = (studentNames: string[]) => {
    const generatedStudents: StudentProgress[] = studentNames.map((name, idx) => {
      const seat = idx + 1;
      const roll = `23010${seat.toString().padStart(2, '0')}`;
      return {
        student_id: `std-${roll}`,
        roll,
        name,
        seat_number: seat,
        attendance_status: 'present',
        pre_test_score: 0,
        post_test_score: 0,
        post_test_unlocked: false,
        q1_status: 'not_started',
        q2_status: 'not_started',
        runs_count: 0,
        last_activity: 'Just enrolled',
        flags: [],
        viva_score: 0,
        submissions: [],
      };
    });
    setStudents(generatedStudents);
  };

  const updateStudentAttendance = (studentId: string, status: 'present' | 'late' | 'absent') => {
    setStudents((prev) =>
      prev.map((s) => (s.student_id === studentId ? { ...s, attendance_status: status } : s))
    );
  };

  const updateStudentViva = (studentId: string, marks: number) => {
    setStudents((prev) =>
      prev.map((s) => (s.student_id === studentId ? { ...s, viva_score: marks } : s))
    );
  };

  const addClassroomItem = (item: Omit<ClassroomItem, 'id' | 'created_at'>) => {
    const newItem: ClassroomItem = {
      ...item,
      id: `ci-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    setClassroomItems((prev) => [newItem, ...prev]);
  };

  const setEndSemStage = (stage: 1 | 2 | 3 | 4 | 5 | 6) => {
    setEndSem((prev) => ({ ...prev, stage }));
  };

  const approveEndSemQuestion = (_qId: string) => {
    setEndSem((prev) => ({
      ...prev,
      approved_30_count: Math.min(30, prev.approved_30_count + 1),
    }));
  };

  const hodEndSemDecision = (decision: 'approved' | 'declined', remark = '') => {
    setEndSem((prev) => ({
      ...prev,
      hod_status: decision,
      hod_remark: remark,
      stage: decision === 'approved' ? 4 : 2,
    }));
  };

  const activateEndSem = () => {
    setEndSem((prev) => ({
      ...prev,
      is_active: true,
      stage: 5,
      started_at: new Date().toLocaleTimeString(),
    }));
  };

  const useAICredit = (featureName: string): boolean => {
    if (institution.ai_used_today >= institution.ai_daily_cap) {
      setAiMessage('Daily AI credit cap reached (5/5). Resets at midnight IST.');
      return false;
    }
    if (institution.ai_used_total >= institution.ai_total_cap) {
      setAiMessage('Subscription AI total runs used up (125/125).');
      return false;
    }
    setInstitution((prev) => ({
      ...prev,
      ai_used_today: prev.ai_used_today + 1,
      ai_used_total: prev.ai_used_total + 1,
    }));
    setAiMessage(`AI Assist: Generated draft for "${featureName}". (1 run deducted)`);
    return true;
  };

  const clearAIMessage = () => setAiMessage(null);

  const clearAllData = () => {
    setCourse(cleanCourseDetails);
    setCOs([]);
    setCOPOMap([]);
    setRubric(defaultRubric);
    setPlanStatus('draft');
    setHodPlanRemark('');
    setSessions([]);
    setActiveSessionId('');
    setBatches([]);
    setStudents([]);
    setClassroomItems([]);
    setEndSem(cleanEndSemAssessment);
    setSelectedStudentForDetail(null);
  };

  const loadDemoData = () => {
    setCourse({
      code: 'CSL-101',
      title: 'Programming in C Lab',
      ltpc: '0-0-2-1',
      semester: 'IV · 2026–27',
      department: 'Computer Science and Engineering',
      className: 'SY-B',
      facultyInCharge: 'Dr. Ramesh Kulkarni',
      hodEmail: 'hod.cse@sanjivani.edu.in',
    });
    setCOs([
      { id: 'co-1', code: 'CO1', statement: 'Write C programs using input, output, operators and decisions', btl: 'L3 Apply', target_percentage: 60 },
      { id: 'co-2', code: 'CO2', statement: 'Use loops to solve iterative problems and patterns', btl: 'L3 Apply', target_percentage: 60 },
      { id: 'co-3', code: 'CO3', statement: 'Process arrays and strings with searching and sorting', btl: 'L4 Analyse', target_percentage: 60 },
      { id: 'co-4', code: 'CO4', statement: 'Design modular programs with functions and pointers', btl: 'L4 Analyse', target_percentage: 60 },
      { id: 'co-5', code: 'CO5', statement: 'Manage records with structures and binary files', btl: 'L6 Create', target_percentage: 60 },
    ]);
    setBatches([
      { id: 'b-1', name: 'Batch A', class_code: 'CSL101-SYB-7Q4K', slot: 'Wednesday 10:00–12:00', room: 'Lab 304', students_count: 60 },
      { id: 'b-2', name: 'Batch B', class_code: 'CSL101-SYB-9W2P', slot: 'Wednesday 14:00–16:00', room: 'Lab 304', students_count: 60 },
    ]);
    generateSessions();
    setPlanStatus('approved');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        switchRole,
        institution,
        course,
        updateCourse,
        cos,
        addCO,
        removeCO,
        copoMap,
        rubric,
        updateRubric,
        planStatus,
        sendPlanToHOD,
        hodPlanDecision,
        hodPlanRemark,
        sessions,
        generateSessions,
        activeSessionId,
        setActiveSessionId,
        batches,
        addBatch,
        students,
        importRoster,
        updateStudentAttendance,
        updateStudentViva,
        classroomItems,
        addClassroomItem,
        endSem,
        setEndSemStage,
        approveEndSemQuestion,
        hodEndSemDecision,
        activateEndSem,
        courseFileSections,
        useAICredit,
        aiMessage,
        clearAIMessage,
        searchQuery,
        setSearchQuery,
        selectedStudentForDetail,
        setSelectedStudentForDetail,
        clearAllData,
        loadDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
