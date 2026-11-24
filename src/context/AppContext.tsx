import React, { createContext, useContext, useState, useEffect } from 'react';
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
import { generateThirtySessions } from '../data/sessionGenerator';

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
  toggleQuestionSelection: (sessionId: string, questionId: string) => void;
  approveSession: (sessionId: string) => void;
  batches: Batch[];
  addBatch: (batch: Omit<Batch, 'id'>) => void;
  students: StudentProgress[];
  importRoster: (names: string[]) => void;
  updateStudentAttendance: (studentId: string, status: 'present' | 'late' | 'absent') => void;
  updateStudentViva: (studentId: string, marks: number) => void;
  classroomItems: ClassroomItem[];
  addClassroomItem: (item: Omit<ClassroomItem, 'id' | 'created_at'>) => void;
  updateClassroomItem: (id: string, updates: Partial<ClassroomItem>) => void;
  removeClassroomItem: (id: string) => void;
  sendStudentOnboardingEmail: (studentId: string) => void;
  resendAllOnboardingEmails: () => void;
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
    const newSessions = generateThirtySessions();
    setSessions(newSessions);
    if (newSessions.length > 0) setActiveSessionId(newSessions[0].id);
  };

  const toggleQuestionSelection = (sessionId: string, questionId: string) => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id !== sessionId) return s;
        const currentSelected = s.questions.filter((q) => q.is_selected);
        const targetQ = s.questions.find((q) => q.id === questionId);
        if (!targetQ) return s;

        if (targetQ.is_selected) {
          return {
            ...s,
            questions: s.questions.map((q) =>
              q.id === questionId ? { ...q, is_selected: false } : q
            ),
          };
        }

        if (currentSelected.length < 2) {
          return {
            ...s,
            questions: s.questions.map((q) =>
              q.id === questionId ? { ...q, is_selected: true } : q
            ),
          };
        }

        return s;
      })
    );
  };

  const approveSession = (sessionId: string) => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id !== sessionId) return s;
        return {
          ...s,
          status: 'active',
          questions: s.questions.map((q) => (q.is_selected ? { ...q, status: 'approved' } : q)),
        };
      })
    );
  };

  const importRoster = (rawLines: string[]) => {
    const generatedStudents: StudentProgress[] = rawLines.map((line, idx) => {
      const seat = idx + 1;
      const parts = line.split(/[,;\t|]/).map((p) => p.trim());

      let roll = `23010${seat.toString().padStart(2, '0')}`;
      let name = `Student ${seat}`;
      let email = `student${seat}@university.edu`;

      if (parts.length >= 3) {
        roll = parts[0] || roll;
        name = parts[1] || name;
        email = parts[2] || email;
      } else if (parts.length === 2) {
        if (parts[1].includes('@')) {
          name = parts[0];
          email = parts[1];
        } else {
          roll = parts[0];
          name = parts[1];
        }
      } else if (parts.length === 1 && parts[0]) {
        if (parts[0].includes('@')) {
          email = parts[0];
          name = parts[0].split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
        } else {
          name = parts[0];
        }
      }

      // Generate a unique 6-character onboarding accession code
      const onboardingCode = `XEI-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

      return {
        student_id: `std-${roll.replace(/[^a-zA-Z0-9]/g, '') || idx + 1}`,
        roll,
        name,
        email,
        onboarding_code: onboardingCode,
        invite_status: 'sent',
        invite_sent_at: new Date().toISOString(),
        seat_number: seat,
        attendance_status: 'present',
        pre_test_score: 0,
        post_test_score: 0,
        post_test_unlocked: false,
        q1_status: 'not_started',
        q2_status: 'not_started',
        runs_count: 0,
        last_activity: 'Enrolled & invite sent',
        flags: [],
        viva_score: 0,
        submissions: [],
      };
    });

    setStudents(generatedStudents);
    setAiMessage(`Onboarding invitations dispatched with accession codes to ${generatedStudents.length} student emails.`);
  };

  const sendStudentOnboardingEmail = (studentId: string) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.student_id === studentId) {
          return {
            ...s,
            invite_status: 'sent',
            invite_sent_at: new Date().toISOString(),
          };
        }
        return s;
      })
    );
    const target = students.find((s) => s.student_id === studentId);
    if (target) {
      setAiMessage(`Onboarding invite email re-sent to ${target.email} with accession code [${target.onboarding_code}].`);
    }
  };

  const resendAllOnboardingEmails = () => {
    const timestamp = new Date().toISOString();
    setStudents((prev) =>
      prev.map((s) => ({
        ...s,
        invite_status: 'sent',
        invite_sent_at: timestamp,
      }))
    );
    setAiMessage(`Re-dispatched onboarding invite emails with class accession codes to all ${students.length} students.`);
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
    setAiMessage(`Classroom task "${item.title}" created successfully.`);
  };

  const updateClassroomItem = (id: string, updates: Partial<ClassroomItem>) => {
    setClassroomItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
    setAiMessage(`Classroom task "${updates.title || 'item'}" successfully updated.`);
  };

  const removeClassroomItem = (id: string) => {
    setClassroomItems((prev) => prev.filter((item) => item.id !== id));
    setAiMessage('Classroom item deleted.');
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
    clearAllData();
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
        toggleQuestionSelection,
        approveSession,
        batches,
        addBatch,
        students,
        importRoster,
        updateStudentAttendance,
        updateStudentViva,
        sendStudentOnboardingEmail,
        resendAllOnboardingEmails,
        classroomItems,
        addClassroomItem,
        updateClassroomItem,
        removeClassroomItem,
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
