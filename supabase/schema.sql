-- ==============================================================================
-- XeIO Database Schema (PRD Section 11)
-- Database: PostgreSQL / Supabase
-- Every table carries institution_id with Row-Level Security (RLS)
-- IDs are UUIDs; timestamps are timestamptz (displayed in IST)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. INSTITUTION
CREATE TABLE institutions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email_domain TEXT NOT NULL UNIQUE,
    plan TEXT NOT NULL CHECK (plan IN ('Pro', 'Elite')),
    plan_start DATE NOT NULL,
    plan_end DATE NOT NULL,
    ai_total_cap INTEGER NOT NULL DEFAULT 125,
    ai_daily_cap INTEGER NOT NULL DEFAULT 5,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. SCHOOL & DEPARTMENT
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    school_name TEXT NOT NULL,
    dean_id UUID,
    hod_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. USERS
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    roles TEXT[] NOT NULL DEFAULT '{student}',
    scope_id UUID,
    sso_subject TEXT,
    photo_url TEXT,
    roll_number TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. SUBSCRIPTION REQUESTS
CREATE TABLE subscription_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    plan TEXT NOT NULL,
    start_date DATE NOT NULL,
    months INTEGER NOT NULL CHECK (months IN (3, 6, 12)),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    decided_by UUID REFERENCES users(id),
    decided_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. COURSES
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    title TEXT NOT NULL,
    ltpc TEXT NOT NULL DEFAULT '0-0-2-1',
    semester TEXT NOT NULL,
    section TEXT NOT NULL,
    academic_year TEXT NOT NULL,
    faculty_id UUID REFERENCES users(id),
    plan_status TEXT NOT NULL DEFAULT 'draft' CHECK (plan_status IN ('draft', 'sent', 'approved', 'declined')),
    rubric JSONB NOT NULL DEFAULT '{"attendance": 10, "pre_test": 5, "post_test": 5, "visible_tests": 10, "hidden_tests": 10, "viva": 10}'::jsonb,
    allowed_langs TEXT[] NOT NULL DEFAULT '{"c", "cpp", "java", "python", "rust", "go"}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_course_code_per_inst UNIQUE (institution_id, code, semester, section)
);

-- 6. COURSE OUTCOMES (COs)
CREATE TABLE course_outcomes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    code TEXT NOT NULL, -- CO1, CO2...
    statement TEXT NOT NULL,
    btl TEXT NOT NULL, -- L1 Remember to L6 Create
    target_percentage NUMERIC(5,2) NOT NULL DEFAULT 60.00,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. CO-PO / PSO MAP
CREATE TABLE co_po_maps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    co_id UUID NOT NULL REFERENCES course_outcomes(id) ON DELETE CASCADE,
    po_code TEXT NOT NULL, -- PO1..PO12, PSO1, PSO2
    level INTEGER NOT NULL CHECK (level BETWEEN 0 AND 3),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. BATCHES
CREATE TABLE batches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    class_code TEXT NOT NULL UNIQUE,
    slot TEXT,
    room TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. ENROLLMENTS
CREATE TABLE enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    seat_number INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_student_batch UNIQUE (batch_id, student_id)
);

-- 10. SESSIONS
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    n INTEGER NOT NULL, -- 1 to 30
    date DATE,
    topic TEXT NOT NULL,
    co_id UUID REFERENCES course_outcomes(id),
    btl TEXT,
    status TEXT NOT NULL DEFAULT 'none' CHECK (status IN ('none', 'draft', 'active', 'completed')),
    pre_open TIMESTAMPTZ,
    pre_close TIMESTAMPTZ,
    post_close TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. QUESTIONS
CREATE TABLE questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    kind TEXT NOT NULL CHECK (kind IN ('lab', 'endsem', 'task')),
    co_id UUID REFERENCES course_outcomes(id),
    difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
    statement TEXT NOT NULL,
    input_format TEXT,
    output_format TEXT,
    constraints TEXT,
    status TEXT NOT NULL DEFAULT 'candidate' CHECK (status IN ('candidate', 'approved', 'declined')),
    source TEXT NOT NULL DEFAULT 'ai' CHECK (source IN ('ai', 'faculty')),
    approved_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. TEST CASES
CREATE TABLE test_cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    input TEXT NOT NULL,
    expected TEXT NOT NULL,
    hidden BOOLEAN NOT NULL DEFAULT false,
    marks INTEGER NOT NULL DEFAULT 5
);

-- 13. BANK ITEMS (PRE & POST)
CREATE TABLE bank_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    bank TEXT NOT NULL CHECK (bank IN ('pre', 'post')),
    level TEXT NOT NULL CHECK (level IN ('Easy', 'Medium', 'Hard')),
    stem TEXT NOT NULL,
    options JSONB NOT NULL,
    answer INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. ATTENDANCE
CREATE TABLE attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    state TEXT NOT NULL CHECK (state IN ('present', 'late', 'absent')),
    marked_by UUID REFERENCES users(id),
    marked_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. SUBMISSIONS
CREATE TABLE submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    context TEXT NOT NULL CHECK (context IN ('lab', 'exam')),
    lang TEXT NOT NULL,
    code TEXT NOT NULL,
    visible_passed INTEGER NOT NULL DEFAULT 0,
    hidden_passed INTEGER NOT NULL DEFAULT 0,
    runtime_ms INTEGER,
    verdict TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. VIVA
CREATE TABLE viva_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
    marks INTEGER NOT NULL CHECK (marks BETWEEN 0 AND 10),
    examiner_id UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. ASSESSMENTS (END-SEM)
CREATE TABLE assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    batch_id UUID REFERENCES batches(id) ON DELETE CASCADE,
    rules JSONB NOT NULL,
    stage INTEGER NOT NULL DEFAULT 1 CHECK (stage BETWEEN 1 AND 6),
    hod_status TEXT NOT NULL DEFAULT 'pending' CHECK (hod_status IN ('pending', 'approved', 'declined')),
    hod_remark TEXT,
    scheduled_at TIMESTAMPTZ,
    activated_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. AUDIT LOG (OWASP ASVS L2 append-only)
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES users(id),
    action TEXT NOT NULL,
    object_type TEXT NOT NULL,
    object_id TEXT,
    before JSONB,
    after JSONB,
    ip INET,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Rule: Hidden test cases NEVER leave server to clients
CREATE POLICY "Public read only for visible test cases" ON test_cases
    FOR SELECT USING (hidden = false);

-- Rule: Students can only view their own submissions
CREATE POLICY "Students see own submissions" ON submissions
    FOR SELECT USING (auth.uid() = student_id);

-- Rule: Faculty can read all submissions for courses they coordinate
CREATE POLICY "Faculty can inspect course submissions" ON submissions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM courses
            JOIN questions ON questions.course_id = courses.id
            WHERE questions.id = submissions.question_id
            AND courses.faculty_id = auth.uid()
        )
    );
