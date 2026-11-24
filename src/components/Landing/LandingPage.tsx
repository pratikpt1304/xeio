import React, { useEffect } from 'react';
import '../../landing/landing.css';

interface LandingPageProps {
  onSignInClick: () => void;
  isAuthenticated?: boolean;
  userRole?: string;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onSignInClick,
  isAuthenticated = false,
  userRole = 'Faculty',
}) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="xeio-landing-wrap bg-[#f4f3ef] text-[#141413] min-h-screen font-sans selection:bg-[#E6F0EC] selection:text-[#0E5E52]">
      <a className="skip" href="#main">
        Skip to content
      </a>

      {/* Top Header */}
      <header className="top select-none">
        <a href="/" className="mark" aria-label="XeIO home">
          Xe<span>IO</span>
        </a>
        <nav aria-label="Main" className="flex items-center gap-6">
          <a href="#journey">How it works</a>
          <a href="#faculty">Faculty</a>
          <a href="#students">Students</a>
          <a href="#integrity">Integrity</a>
          <button
            onClick={onSignInClick}
            className="go border-0 cursor-pointer text-white font-medium"
          >
            {isAuthenticated ? `Go to Portal (${userRole})` : 'Sign in'}
          </button>
        </nav>
      </header>

      <main id="main">
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-text">
            <p className="kicker">For programming labs in Indian engineering colleges</p>
            <h1>
              Every lab, <em>planned, run and reported</em> without the paperwork.
            </h1>
            <p className="lead">
              XeIO is an AI faculty assistant. It drafts the session plan, the questions and the test
              banks; you approve them. Students code in a real workspace, the end-sem is proctored,
              and the course file writes itself as the semester runs.
            </p>
            <div className="cta flex items-center gap-4 flex-wrap">
              <button
                onClick={onSignInClick}
                className="go border-0 cursor-pointer text-white font-medium shadow-sm hover:scale-[1.02] transition-transform"
              >
                {isAuthenticated
                  ? `Enter Workspace (${userRole}) →`
                  : 'Sign in with your institution →'}
              </button>
              <a className="plain cursor-pointer" href="#journey">
                See how a semester flows
              </a>
            </div>
          </div>
          <figure className="hero-shot">
            <img
              src="/landing/faculty-live.webp"
              width="1400"
              height="875"
              alt="XeIO faculty workspace during a live lab: steps on the left, attendance and progress of each student, and Assist's next best actions on the right."
              fetchPriority="high"
            />
          </figure>
        </section>

        {/* Semester Journey Section */}
        <section id="journey" className="journey" aria-labelledby="journey-h">
          <h2 id="journey-h">One path through the semester</h2>
          <ol className="path">
            <li>
              <b>Plan</b>
              <span>
                Course outcomes with Bloom's levels, CO–PO map and rubric. Your HOD approves once.
              </span>
            </li>
            <li>
              <b>Prepare</b>
              <span>
                Thirty sessions from the academic calendar. Assist drafts four questions per
                session; you pick two.
              </span>
            </li>
            <li>
              <b>Run</b>
              <span>
                Attendance opens the lab and closes the pre-test. Watch every student's progress live.
              </span>
            </li>
            <li>
              <b>Assess</b>
              <span>
                Forty new end-sem questions per batch, thirty approved, sent to the HOD, then
                proctored.
              </span>
            </li>
            <li>
              <b>Report</b>
              <span>
                Mark lists, CO attainment, bell curves and a fourteen-section course file, ready for
                NBA and NAAC.
              </span>
            </li>
          </ol>
        </section>

        {/* For Faculty Split Section */}
        <section id="faculty" className="split" aria-labelledby="faculty-h">
          <div className="copy">
            <p className="kicker">For faculty</p>
            <h2 id="faculty-h">Assist drafts. You decide.</h2>
            <p>
              Nothing reaches a student until you approve it. Questions are checked by running their
              reference solutions against every test before you can even select them, and banks keep
              pre-lab and post-lab items apart.
            </p>
            <p>
              When the semester ends, the work is already done: internal marks follow the rubric your
              HOD approved, attainment is computed per CO, and slow and fast learners are named with
              reasons.
            </p>
          </div>
          <figure className="shot right">
            <img
              src="/landing/endsem-approve.webp"
              width="1400"
              height="875"
              loading="lazy"
              alt="Approving thirty of forty AI-generated end-sem questions, with coverage per course outcome and questions that failed validation greyed out."
            />
          </figure>
        </section>

        {/* For Students Dark Section */}
        <section id="students" className="dark" aria-labelledby="students-h">
          <div className="copy">
            <p className="kicker">For students</p>
            <h2 id="students-h">A real coding workspace, not a form.</h2>
            <p>
              The problem on the left, the editor on the right, the console underneath. Write in C,
              C++, Java, Python, Rust or Go. Run checks the visible tests; Submit runs the hidden
              ones too. The post-lab test opens the moment every hidden test passes.
            </p>
          </div>
          <figure className="shot wide">
            <img
              src="/landing/student-ide.webp"
              width="1400"
              height="875"
              loading="lazy"
              alt="Student lab workspace with the problem statement, visible tests, a C editor and console output."
            />
          </figure>
        </section>

        {/* Numbers Section */}
        <section className="numbers" aria-label="XeIO in numbers">
          <p>
            <b>30</b> sessions planned from your calendar
          </p>
          <p>
            <b>45 + 45</b> pre and post items per session
          </p>
          <p>
            <b>40 → 30</b> new end-sem questions per batch, HOD-approved
          </p>
          <p>
            <b>14</b> course-file sections, filled as you teach
          </p>
        </section>

        {/* Integrity and Privacy Split Reverse Section */}
        <section id="integrity" className="split reverse" aria-labelledby="integrity-h">
          <figure className="shot left">
            <img
              src="/landing/attainment.webp"
              width="1400"
              height="875"
              loading="lazy"
              alt="Internal attainment report with CO bars against the target, a bell curve of marks and lists of slow and fast learners."
            />
          </figure>
          <div className="copy">
            <p className="kicker">Integrity and privacy</p>
            <h2 id="integrity-h">Built for audits, not just demos.</h2>
            <ul className="facts">
              <li>Sign-in only with institutional accounts that were invited; no self-signup.</li>
              <li>
                Students can start the end-sem only after being marked present and the faculty
                activates the test.
              </li>
              <li>
                Fullscreen, camera and screen checks; copy, paste and AI tools blocked; events
                logged for the examiner, never auto-penalised.
              </li>
              <li>Hidden tests never leave the server. Code runs in an isolated sandbox.</li>
              <li>Every approval and mark change is recorded in an append-only audit log.</li>
              <li>
                Student data stays with your institution's database, in line with the DPDP Act.
              </li>
            </ul>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="faq" aria-labelledby="faq-h">
          <h2 id="faq-h">Questions colleges ask</h2>
          <details>
            <summary>Does AI decide marks?</summary>
            <p>
              No. Marks come only from attendance, test results and examiner entries. AI drafts
              questions, banks and summaries; faculty approve everything first.
            </p>
          </details>
          <details>
            <summary>Who approves what?</summary>
            <p>
              Faculty approve questions and banks. HODs approve course plans, end-sem sets and final
              marks. The CoE accepts HOD-approved internals into results.
            </p>
          </details>
          <details>
            <summary>How do students join?</summary>
            <p>
              Faculty import the section roster; students receive an invitation with their batch's
              class code and sign in with their institutional account.
            </p>
          </details>
        </section>
      </main>

      {/* Footer */}
      <footer className="foot">
        <div>
          <span className="mark">
            Xe<span>IO</span>
          </span>
          <p>Designed and maintained by Elzeo Future Technologies Pvt Ltd, India.</p>
        </div>
        <img
          src="/brand/elzeo-full-light.png"
          width="300"
          height="136"
          alt="Elzeo · Innovate | Transform"
          loading="lazy"
        />
        <p className="small">
          © {new Date().getFullYear()} Elzeo Future Technologies Pvt Ltd. XeIO is a product of
          Elzeo.
        </p>
      </footer>
    </div>
  );
};
