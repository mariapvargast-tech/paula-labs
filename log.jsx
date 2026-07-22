// LOGBOOK — real deployment history, 2021 → 2026
const COMMITS = [
  {
    hash: 'a7f3c91', when: '2021 · OCT', label: 'HEAD', head: true,
    branch: 'main', tag: 'role/active',
    msg: 'feat: still shipping PAPPCORN, four years in',
    italic: '— current',
    where: 'PAPPCORN · Enterprise management, remote',
    text: 'Developing and maintaining the Angular + TypeScript frontend since 2021 — Firebase integration for data and auth, a migration to microfrontends with Module Federation and Nx, new features in Angular Material and Reactive Forms, and performance passes alongside functional testing in an agile team.',
    add: '+38,120', rem: '−9,480', files: '210 files',
  },
  {
    hash: '9bce014', when: '2021 · JUN',
    branch: 'exp', tag: 'edu/2021-2023',
    msg: 'feat(cooking-program): educational interfaces, SOLID by default',
    italic: '',
    where: 'Cooking Program · Educational platforms',
    text: 'Built interfaces for educational and technical-training platforms with Angular and Firebase, applying SOLID and Clean Code to keep things maintainable. Added automated tests to protect delivered functionality, and helped train the team on better development practices.',
    add: '+14,208', rem: '−2,340', files: '96 files',
  },
  {
    hash: '4d18ee2', when: '2021 · MAR',
    branch: 'exp', tag: 'agency/wp',
    msg: 'feat(ink): corporate sites, pixel-faithful to Figma',
    italic: '',
    where: 'Ink Agencia Digital · WordPress',
    text: 'Visual implementation of corporate websites from Figma designs, with WordPress theme customization and plugin configuration. Kept providing maintenance and technical support on sites already live.',
    add: '+6,140', rem: '−820', files: '38 files',
  },
  {
    hash: 'f1e8d05', when: '2021 · JAN',
    branch: 'main', tag: 'init',
    msg: 'init: Técnico Front-End, Instituto Kuepa',
    italic: '— Beca Fundación Citibank',
    where: 'Instituto Kuepa · Data Processing & Front-End',
    text: 'Finished a technical program in Data Processing and Front-End development on a Fundación Citibank scholarship. First real exposure to shipping web interfaces — and the year everything else on this page started from.',
    add: '+1', rem: '−0', files: '1 file',
  },
];

const Log = () => {
  return (
    <section className="section log" id="logbook" data-screen-label="05 Logbook">
      <div className="shell">
        <div className="log-head">
          <div className="kicker"><span className="num">§05</span> &nbsp;/&nbsp; LOGBOOK &nbsp;·&nbsp; DEPLOYMENT HISTORY</div>
          <div style={{height:16}}></div>
          <div className="row">
            <h2>The career, <em>rebased</em><br/>chronologically.</h2>
            <div className="meta">
              The story as it happened — <b>HEAD points at today,</b> commits scroll back to the
              first push in 2021. No résumé bullets, no metrics theatre. Just the
              order things actually shipped, alongside a Software Engineering degree
              finishing this year.
              <div className="branch">git log --since=&quot;2021-01&quot; --oneline · branch=main</div>
            </div>
          </div>
        </div>

        <div className="commits">
          {COMMITS.map((c, i) => (
            <div key={i} className={`commit ${c.head ? 'h' : ''}`}>
              <div className="dot"></div>
              <div className="when">
                {c.when}
                {c.label ? <b style={{color:'var(--green)'}}>← {c.label}</b> : null}
              </div>
              <div className="body">
                <div className="when-inline">{c.when}{c.label ? ' · ← ' + c.label : ''}</div>
                <div className="head-row">
                  <span className="hash">{c.hash}</span>
                  <span className={`branch-pill ${c.branch === 'main' ? 'main' : 'exp'}`}>{c.branch}</span>
                  <span className="branch-pill">{c.tag}</span>
                </div>
                <div className="msg">{c.msg} {c.italic ? <em>{c.italic}</em> : null}</div>
                <div className="where">where: <b>{c.where}</b></div>
                <div className="text">{c.text}</div>
                <div className="changes">
                  <span className="add">{c.add}</span>
                  <span className="rem">{c.rem}</span>
                  <span className="file">{c.files}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: 24, fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--paper-faint)',
          letterSpacing: '0.08em', wordBreak: 'break-word'
        }}>
          $ <span style={{color:'var(--green)'}}>git log</span> --oneline · <span style={{color:'var(--paper)'}}>4 of 4 commits shown</span> · <span style={{color:'var(--amber)'}}>q to quit</span>
        </div>
      </div>
    </section>
  );
};

window.Log = Log;
