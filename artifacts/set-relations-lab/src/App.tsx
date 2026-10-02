import { Fragment, type ReactNode, useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { ArrowDown, ArrowRight, Check, CircleHelp, RotateCcw, Sparkles } from 'lucide-react';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

function Home() {
  const students = ['Ari', 'Bo', 'Cy'];
  const courses = ['Web', 'Logic'];
  const pairKey = (student: string, course: string) => `${student}|${course}`;
  const workedPairs = ['Ari|Web', 'Bo|Web', 'Bo|Logic'];
  const [selected, setSelected] = useState<string[]>(workedPairs);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  const selectedPairs = useMemo(() => selected.map((key) => {
    const [student, course] = key.split('|');
    return { student, course };
  }), [selected]);
  const domain = students.filter((student) => selectedPairs.some((pair) => pair.student === student));
  const range = courses.filter((course) => selectedPairs.some((pair) => pair.course === course));
  const isFunction = students.every((student) => selectedPairs.filter((pair) => pair.student === student).length === 1);
  const functionIssue = students.map((student) => ({
    student,
    count: selectedPairs.filter((pair) => pair.student === student).length,
  })).find((item) => item.count !== 1);
  const relationNotation = selectedPairs.length
    ? `{${selectedPairs.map(({ student, course }) => `(${student}, ${course})`).join(', ')}}`
    : '∅';

  const setPreset = (preset: 'empty' | 'worked' | 'full') => {
    setSelected(preset === 'empty' ? [] : preset === 'worked' ? workedPairs : students.flatMap((student) => courses.map((course) => pairKey(student, course))));
  };
  const togglePair = (key: string) => setSelected((current) => current.includes(key) ? current.filter((item) => item !== key) : [...current, key]);
  const exerciseData = [
    { prompt: 'Let A = {1, 2} and B = {x}. Which ordered pair belongs to A × B: (x, 2) or (2, x)? Enter the one that belongs.', answer: '(2, x)', hint: 'The first coordinate must come from A; the second comes from B.' },
    { prompt: 'Is S = {(1, x), (1, y)} a relation from A = {1} to B = {x, y}? Enter yes or no.', answer: 'yes', hint: 'A relation is any subset of A × B. A source may appear in more than one pair.' },
    { prompt: 'For R = {(Mina, Art), (Noah, Art), (Noah, Music)}, enter the domain followed by the range, separated by a semicolon.', answer: '{Mina, Noah}; {Art, Music}', hint: 'Collect first coordinates for the domain and second coordinates for the range. Do not repeat values.' },
    { prompt: 'If |A| = 3 and |B| = 2, how many distinct relations are possible from A to B? Enter the number.', answer: '64', hint: 'There are 3 × 2 possible pairs, and each pair is either included or not: 2⁶.' },
    { prompt: 'For A = {a, b}, B = {u, v}, is R = {(a, u), (b, u), (b, v)} a function from A to B? Enter yes or no.', answer: 'no', hint: 'A function requires exactly one partner for every element of A. Check b.' },
    { prompt: 'A Students table and Courses table are connected by Enrollments(student_id, course_id). Which Cartesian product contains each pair stored in Enrollments? Enter Students × Courses or Courses × Students.', answer: 'Students × Courses', hint: 'Keep the foreign-key order in the junction table: student first, course second.' },
  ];
  const normalized = (value: string) => value.toLowerCase().replace(/\s+/g, ' ').trim();
  const checkAnswer = (index: number) => setChecked((prev) => ({ ...prev, [index]: true }));

  return (
    <div className="lab-shell">
      <header className="topbar">
        <div className="brand"><span className="brand-mark" aria-hidden="true">R</span><span>Set Relations Lab</span></div>
        <div className="top-meta"><span className="module-pill">Module 03</span><span>Discrete structures</span></div>
      </header>
      <div className="lesson-layout">
        <aside className="lesson-nav" aria-label="Lesson navigation">
          <div className="nav-caption">In this lesson</div>
          <nav>
            <a href="#definitions" data-testid="link-definitions"><span className="nav-index">01</span> Definitions</a>
            <a href="#worked-example" data-testid="link-worked-example"><span className="nav-index">02</span> Worked example</a>
            <a href="#relation-lab" data-testid="link-relation-lab"><span className="nav-index">03</span> Relation lab</a>
            <a href="#databases" data-testid="link-databases"><span className="nav-index">04</span> Databases</a>
            <a href="#practice" data-testid="link-practice"><span className="nav-index">05</span> Practice</a>
          </nav>
        </aside>
        <main className="main-content">
          <section className="hero">
            <div className="eyebrow"><span className="eyebrow-line" /> Module 3 / Cartesian products &amp; relations</div>
            <h1>Finding structural relations <em>between distinct sets.</em></h1>
            <p className="hero-copy">Start with two collections. Pair their elements in order. Then choose which pairings matter. That simple move is the structure behind relations—and the quiet logic inside a database.</p>
            <div className="hero-footer"><a className="hero-cta" href="#relation-lab" data-testid="link-start-exploring">Start exploring <ArrowDown size={14} /></a><span className="duration">12 MIN · 1 INTERACTIVE LAB · 6 CHECKS</span></div>
          </section>

          <section className="section" id="definitions">
            <div className="section-heading"><div><div className="section-kicker">01 — The building blocks</div><h2>First, make every possible pair.</h2></div></div>
            <div className="definition-grid">
              <article className="definition primary-def">
                <div className="def-label">Cartesian product</div>
                <div className="math-line">A × B = {'{'}(a, b) | a ∈ A, b ∈ B{'}'}</div>
                <p>Take one element from A, then one from B. Order matters: (a, b) is not generally the same as (b, a).</p>
              </article>
              <article className="definition">
                <div className="def-label">A relation from A to B</div>
                <div className="math-line">R ⊆ A × B</div>
                <p>A relation is any selection of pairs from that product. No rule says every element must be paired—or paired only once.</p>
              </article>
            </div>
            <div className="insight-strip"><CircleHelp size={17} /><span><strong>How many relations?</strong> With finite sets, each of the |A|·|B| possible pairs is either in R or out. So there are <span className="math-inline">2<sup>|A|·|B|</sup></span> possible relations. Empty relation: ∅. Full (universal) relation: A × B.</span></div>
            <div className="insight-strip" style={{ background: '#e4ece2', borderColor: '#71936d' }}><ArrowRight size={17} /><span><strong>Domain and range.</strong> The domain collects first coordinates that actually appear in R; the range collects second coordinates that actually appear. A relation is a function A → B only when every element of A is paired with exactly one element of B.</span></div>
          </section>

          <section className="section" id="worked-example">
            <div className="section-heading"><div><div className="section-kicker">02 — See the structure</div><h2>Six possible pairs. Three chosen.</h2></div><div className="section-kicker">Worked example</div></div>
            <div className="example-panel">
              <div>
                <div className="set-block"><div className="set-label">Set A · students</div><div className="set-values">A = {'{'}Ari, Bo, Cy{'}'}</div></div>
                <div className="set-block"><div className="set-label">Set B · courses</div><div className="set-values">B = {'{'}Web, Logic{'}'}</div></div>
                <div className="set-block"><div className="set-label">Cartesian product</div><div className="set-values">|A × B| = 3 × 2 = 6</div></div>
              </div>
              <div className="worked-rel">
                <div className="def-label">A particular relation R</div>
                <div className="math-line">R = {'{'}(Ari, Web), (Bo, Web),<br />(Bo, Logic){'}'}</div>
                <div className="result-chips"><span className="chip">domain = {'{'}Ari, Bo{'}'}</span><span className="chip">range = {'{'}Web, Logic{'}'}</span><span className="chip">2⁶ = 64 relations</span></div>
                <p>Cy is unpaired, and Bo has two partners. So R is a valid relation, but not a function from A to B.</p>
              </div>
            </div>
            <div className="experiment"><Sparkles className="experiment-icon" size={18} /><p><strong>Predict before you toggle:</strong> In the lab below, add the pair (Cy, Web). Before clicking, predict what changes in the domain, pair count, and function test. Then try it and compare your prediction.</p></div>
          </section>

          <section className="section" id="relation-lab">
            <div className="section-heading"><div><div className="section-kicker">03 — Your turn to compose</div><h2>Build a relation, one pair at a time.</h2></div><div className="section-kicker">Click any cell</div></div>
            <p style={{ maxWidth: 650, color: '#718077', fontSize: 12, lineHeight: 1.75 }}>Each cell represents one possible ordered pair. Select a cell to include that pair in R. The diagram and set summaries update together—watch what happens when an element gets zero or two partners.</p>
            <div className="tool-wrap">
              <div className="tool-head">
                <div><div className="tool-title">Enrollment relation</div><div className="tool-subtitle">A = Students · B = Courses · A × B contains 6 candidate pairs</div></div>
                <div className="preset-actions" aria-label="Relation presets">
                  <button className="mini-btn" onClick={() => setPreset('empty')} data-testid="button-preset-empty">Empty</button>
                  <button className="mini-btn" onClick={() => setPreset('worked')} data-testid="button-preset-worked">Worked example</button>
                  <button className="mini-btn" onClick={() => setPreset('full')} data-testid="button-preset-full">Full</button>
                  <button className="mini-btn" onClick={() => setPreset('empty')} data-testid="button-clear-relation"><RotateCcw size={12} /> Clear</button>
                </div>
              </div>
              <div className="tool-body">
                <div className="grid-area">
                  <div className="grid-intro"><span>CHOOSE PAIRS · ROW → COLUMN</span><span data-testid="text-selected-count">{selected.length} / 6 selected</span></div>
                  <div className="relation-grid" role="group" aria-label="Toggle student-course pairs">
                    <div className="grid-corner" />
                    {courses.map((course) => <div className="grid-head" key={course}>{course}</div>)}
                    {students.map((student) => <Fragment key={student}>
                      <div className="row-head"><span className="person-dot" />{student}</div>
                      {courses.map((course) => {
                        const key = pairKey(student, course);
                        const active = selected.includes(key);
                        return <button key={key} className={`pair-toggle${active ? ' is-selected' : ''}`} aria-pressed={active} aria-label={`${active ? 'Remove' : 'Add'} pair (${student}, ${course})`} onClick={() => togglePair(key)} data-testid={`toggle-pair-${student.toLowerCase()}-${course.toLowerCase()}`}>
                          <span className="pair-mark">{active ? '●' : '○'}</span><span className="pair-state">{active ? 'in R' : 'add pair'}</span>
                        </button>;
                      })}
                    </Fragment>)}
                  </div>
                </div>
                <div className="tool-results" aria-live="polite">
                  <div className="result-counts">
                    <div className="count-box"><div className="count-label">Pairs in R</div><div className="count-value" data-testid="text-pair-count">{selected.length}</div></div>
                    <div className="count-box"><div className="count-label">Possible</div><div className="count-value" data-testid="text-product-size">6</div></div>
                    <div className="count-box"><div className="count-label">Relations</div><div className="count-value" data-testid="text-relation-count">64</div></div>
                  </div>
                  <div className="diagram-title">Arrow diagram · current R</div>
                  <div className="diagram" data-testid="diagram-current-relation">
                    <svg className="diagram-svg" viewBox="0 0 300 130" preserveAspectRatio="none" aria-hidden="true">
                      {selectedPairs.map(({ student, course }) => {
                        const leftY = { Ari: 24, Bo: 65, Cy: 106 }[student];
                        const rightY = course === 'Web' ? 44 : 88;
                        return <line key={`${student}-${course}`} className="diagram-line" x1="78" y1={leftY} x2="222" y2={rightY} />;
                      })}
                    </svg>
                    <div className="diagram-col">{students.map((student) => <div className="diagram-node" key={student}><span className="node-circle">{student[0]}</span><span>{student}</span></div>)}</div>
                    <div className="diagram-col">{courses.map((course) => <div className="diagram-node right" key={course}><span className="node-circle">{course[0]}</span><span>{course}</span></div>)}</div>
                  </div>
                  <div className="notation-title">Ordered-pair notation · R</div>
                  <div className="notation-output" data-testid="text-relation-notation">{relationNotation}</div>
                  <div className="domain-range">
                    <div><strong>Domain</strong><span data-testid="text-domain">{domain.length ? `{${domain.join(', ')}}` : '∅'}</span></div>
                    <div><strong>Range</strong><span data-testid="text-range">{range.length ? `{${range.join(', ')}}` : '∅'}</span></div>
                  </div>
                  <div className={`function-status ${isFunction ? 'yes' : 'no'}`} data-testid="status-function">
                    <span className="status-title">{isFunction ? 'This relation is a function.' : 'This relation is not a function.'}</span>
                    {isFunction ? 'Every student in A has exactly one course partner.' : functionIssue?.count === 0 ? `${functionIssue.student} has no course partner. A function must assign every element of A exactly once.` : `${functionIssue?.student} has ${functionIssue?.count} course partners. A function must assign each element of A exactly once.`}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="section" id="databases">
            <div className="section-heading"><div><div className="section-kicker">04 — Same idea, real systems</div><h2>A relation becomes a junction table.</h2></div></div>
            <div className="db-card">
              <div className="db-card-head"><div><h3>From set pairs to SQL rows</h3><p>Students and Courses are separate entity tables. Enrollments stores the pairing: one row for each student–course pair in R. A JOIN follows those keys to reconstruct readable records.</p></div><span className="sql-tag">relational SQL</span></div>
              <div className="table-row">
                <div className="db-table"><b>Students</b><small>student_id · PK<br />name</small></div>
                <div className="db-table"><b>Courses</b><small>course_id · PK<br />title</small></div>
                <div className="db-table"><b>Enrollments</b><small>student_id · FK<br />course_id · FK<br />PRIMARY KEY (student_id, course_id)</small></div>
              </div>
              <pre className="sql-code"><code><span className="sql-key">SELECT</span> s.name, c.title<br /><span className="sql-key">FROM</span> Enrollments e<br /><span className="sql-key">JOIN</span> Students s ON s.student_id = e.student_id<br /><span className="sql-key">JOIN</span> Courses c ON c.course_id = e.course_id;</code></pre>
              <p className="db-note">The math treats R as a set, so duplicate ordered pairs do not exist. SQL tables can contain duplicate rows unless a constraint prevents them; a composite primary key on (student_id, course_id) enforces unique pairs.</p>
            </div>
            <div className="insight-strip"><ArrowRight size={17} /><span>Concept mapping: <strong>A ↔ Students</strong> · <strong>B ↔ Courses</strong> · <strong>R ↔ Enrollments</strong>. The junction table is the stored relation; joining it to both entity tables restores the paired values.</span></div>
          </section>

          <section className="section" id="practice">
            <div className="section-heading"><div><div className="section-kicker">05 — Check your understanding</div><h2>Six small proofs of understanding.</h2></div><div className="section-kicker">{Object.values(checked).filter(Boolean).length} / {exerciseData.length} checked</div></div>
            <div className="exercise-list">
              {exerciseData.map((exercise, index) => {
                const isCorrect = normalized(answers[index] || '') === normalized(exercise.answer);
                const isChecked = checked[index];
                return <article className="exercise" key={index} data-testid={`exercise-${index + 1}`}>
                  <div className="exercise-top"><span className="exercise-num">{String(index + 1).padStart(2, '0')}</span><div className="exercise-prompt">{exercise.prompt}</div></div>
                  <div className="exercise-controls">
                    <input className="answer-input" value={answers[index] || ''} onChange={(event) => { setAnswers((prev) => ({ ...prev, [index]: event.target.value })); if (checked[index]) setChecked((prev) => ({ ...prev, [index]: false })); }} onKeyDown={(event) => { if (event.key === 'Enter') checkAnswer(index); }} placeholder="Type your answer…" aria-label={`Answer to exercise ${index + 1}`} data-testid={`input-answer-${index + 1}`} />
                    <button className="mini-btn primary-mini" onClick={() => checkAnswer(index)} data-testid={`button-check-answer-${index + 1}`}><Check size={12} /> Check</button>
                  </div>
                  {isChecked && <div className={`feedback ${isCorrect ? 'correct' : 'try-again'}`} role="status" data-testid={`feedback-exercise-${index + 1}`}>
                    {isCorrect ? 'Correct. Nice work.' : 'Not quite—try again.'}<span className="hint">{isCorrect ? exercise.hint : `Hint: ${exercise.hint}`}</span>
                  </div>}
                </article>;
              })}
            </div>
            <div className="completion"><div><strong>One structure, many lenses.</strong><p>Any subset makes a relation. A function is the special case with exactly one outgoing pair per input.</p></div><a className="mini-btn" href="#definitions" data-testid="link-review-definitions">Review definitions <ArrowRight size={12} /></a></div>
            <div className="footer-note"><span>Set Relations Lab · Module 03</span><span>Distinct sets · Ordered pairs · Relations</span></div>
          </section>
        </main>
      </div>
    </div>
  );
}

function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
