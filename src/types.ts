// Core Data Types adhering strictly to Section 11 of the PRD

export type Role = 'super_admin' | 'vc' | 'coe' | 'dean' | 'hod' | 'faculty' | 'student';

export interface User {
  id: string;
  email: string;
  name: string;
  roles: Role[];
  activeRole: Role;
  scope_id: string; // school or dept or institution
  sso_subject?: string;
  photo_url?: string;
  status: 'active' | 'suspended';
  roll_number?: string; // for students (e.g. 2301044)
  batch_id?: string;
}

export interface Institution {
  id: string;
  name: string;
  email_domain: string;
  plan: 'Pro' | 'Elite';
  plan_start: string;
  plan_end: string;
  ai_total_cap: number; // 125 for Pro, 250 for Elite
  ai_daily_cap: number; // 5 for Pro, 7 for Elite
  ai_used_total: number;
  ai_used_today: number;
}

export interface CourseDetails {
  code: string;
  title: string;
  ltpc: string;
  semester: string;
  department: string;
  className: string;
  facultyInCharge: string;
  hodEmail: string;
}

export interface CourseOutcome {
  id: string;
  code: string; // CO1, CO2...
  statement: string;
  btl: 'L1 Remember' | 'L2 Understand' | 'L3 Apply' | 'L4 Analyse' | 'L5 Evaluate' | 'L6 Create';
  target_percentage: number; // default 60%
}

export interface COPOMap {
  co_code: string;
  po_scores: Record<string, number>; // PO1..PO12, PSO1, PSO2 (0 to 3)
}

export interface MarkingRubric {
  attendance: number; // 10
  pre_test: number; // 5
  post_test: number; // 5
  visible_tests: number; // 10
  hidden_tests: number; // 10
  viva: number; // 10
  // Total must be 50, scaled to 100 in reports
}

export interface TestCase {
  id: string;
  input: string;
  expected: string;
  hidden: boolean;
  marks: number;
}

export interface ReferenceSolution {
  lang: 'c' | 'cpp' | 'java' | 'python' | 'rust' | 'go';
  code: string;
  status: 'passed' | 'failed';
}

export interface Question {
  id: string;
  title: string;
  kind: 'lab' | 'endsem' | 'task';
  co_id: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  statement: string;
  input_format: string;
  output_format: string;
  constraints: string;
  test_cases: TestCase[];
  reference_solutions: ReferenceSolution[];
  status: 'candidate' | 'approved' | 'declined';
  source: 'ai' | 'faculty';
  session_id?: string;
  is_selected?: boolean;
}

export interface BankItem {
  id: string;
  session_id: string;
  bank: 'pre' | 'post';
  level: 'Easy' | 'Medium' | 'Hard';
  stem: string;
  options: string[];
  answer: number; // index 0-3
  explanation?: string;
}

export interface Session {
  id: string;
  n: number; // 1 to 30
  title: string;
  date: string;
  topic: string;
  co_id: string;
  btl: string;
  status: 'none' | 'draft' | 'active' | 'completed';
  pre_open: string;
  pre_close: string;
  post_close: string;
  questions: Question[];
  pre_bank: BankItem[];
  post_bank: BankItem[];
}

export interface Batch {
  id: string;
  name: string; // e.g., Batch A
  class_code: string;
  slot: string; // e.g., Wed 10:00 - 12:00
  room: string; // Lab 304
  students_count: number;
}

export interface StudentProgress {
  student_id: string;
  roll: string;
  name: string;
  seat_number: number;
  attendance_status: 'present' | 'late' | 'absent';
  pre_test_score: number; // out of 5
  post_test_score: number; // out of 5
  post_test_unlocked: boolean;
  q1_status: 'not_started' | 'visible_passed' | 'all_passed';
  q2_status: 'not_started' | 'visible_passed' | 'all_passed';
  runs_count: number;
  last_activity: string;
  flags: string[];
  viva_score: number; // out of 10
  submissions: {
    question_id: string;
    code: string;
    lang: string;
    visible_passed: number;
    hidden_passed: number;
    created_at: string;
    verdict: 'Accepted' | 'Wrong Answer' | 'Compile Error' | 'Runtime Error';
  }[];
}

export interface EndSemAssessment {
  id: string;
  batch_id: string;
  stage: 1 | 2 | 3 | 4 | 5 | 6; // 1 Rules, 2 Generate 40, 3 HOD approval, 4 Schedule, 5 Attendance & Conduct, 6 Marks & Attainment
  rules: {
    questions_per_student: number; // 2
    difficulty_mix: { easy: number; medium: number; hard: number }; // 12, 16, 12 = 40
    visible_test_cases: number; // 2
    hidden_test_cases: number; // 3
    marks_per_visible: number; // 5
    marks_per_hidden: number; // 5
    viva_marks: number; // 10
    duration_min: number; // 120
  };
  questions_pool: Question[]; // 40 questions
  approved_30_count: number;
  hod_status: 'pending' | 'approved' | 'declined';
  hod_remark?: string;
  scheduled_date?: string;
  scheduled_room?: string;
  is_active: boolean;
  started_at?: string;
  ended_at?: string;
}

export interface ClassroomItem {
  id: string;
  week_label: string; // e.g. "Week of 8 Feb", "Week of 15 Feb"
  kind: 'task' | 'resource' | 'announcement';
  task_type?: 'quiz' | 'fill_in_code' | 'predict_output' | 'debug' | 'coding' | 'poll';
  title: string;
  description: string;
  due_date?: string;
  stats?: string; // "59/63 done", "61 views"
  created_at: string;
}

export interface CourseFileSection {
  num: number;
  title: string;
  source: string;
  status: 'Ready' | 'To date (S1–S14)' | 'After end-sem';
}
