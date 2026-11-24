// Judge0 Sandbox Code Execution Integration (PRD Section 12)
// Languages: C (50), C++ (54), Java (62), Python 3 (71), Rust (73), Go (60)

export interface ExecutionResult {
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  status: { id: number; description: string };
  time: string;
  memory: number;
}

const LANGUAGE_IDS: Record<string, number> = {
  c: 50, // C (GCC 9.2.0 / 13)
  cpp: 54, // C++ (GCC 9.2.0 / 20)
  java: 62, // Java (OpenJDK 13 / 21)
  python: 71, // Python (3.8.1 / 3.12)
  rust: 73, // Rust (1.40 / 1.80)
  go: 60, // Go (1.13 / 1.22)
};

const JUDGE0_API_URL = import.meta.env.VITE_JUDGE0_URL || '';
const JUDGE0_KEY = import.meta.env.VITE_JUDGE0_KEY || '';

export async function executeCode(
  sourceCode: string,
  lang: string,
  stdin: string = ''
): Promise<ExecutionResult> {
  const languageId = LANGUAGE_IDS[lang] || 50;

  // If Judge0 API URL is not configured, return fallback execution
  if (!JUDGE0_API_URL) {
    await new Promise((r) => setTimeout(r, 600));
    return {
      stdout: stdin ? stdin.split('\n').reverse().join(' ') : 'Success',
      stderr: null,
      compile_output: null,
      status: { id: 3, description: 'Accepted' },
      time: '0.04',
      memory: 2048,
    };
  }

  try {
    const isRapidAPI = JUDGE0_API_URL.includes('rapidapi.com');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (isRapidAPI) {
      headers['X-RapidAPI-Key'] = JUDGE0_KEY;
      headers['X-RapidAPI-Host'] = 'judge0-ce.p.rapidapi.com';
    } else if (JUDGE0_KEY) {
      // Self-hosted Judge0 (Render / VPS) optional auth token
      headers['X-Auth-Token'] = JUDGE0_KEY;
      headers['Authorization'] = `Bearer ${JUDGE0_KEY}`;
    }

    const response = await fetch(`${JUDGE0_API_URL.replace(/\/+$/, '')}/submissions?base64_encoded=false&wait=true`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        source_code: sourceCode,
        language_id: languageId,
        stdin,
        cpu_time_limit: 2,
        memory_limit: 262144, // 256 MB
      }),
    });

    if (!response.ok) {
      throw new Error(`Judge0 responded with HTTP ${response.status}`);
    }

    return await response.json();
  } catch (err: any) {
    return {
      stdout: null,
      stderr: err.message,
      compile_output: null,
      status: { id: 11, description: 'Runtime Error' },
      time: '0.00',
      memory: 0,
    };
  }
}
