// CURRENT STACK — exact skills from the CV
const CATEGORIES = [
  {
    label: 'Frontend', tag: 'DAILY',
    items: [
      { nm:'Angular',    role:'framework', yrs:'04Y' },
      { nm:'TypeScript', role:'language', yrs:'04Y' },
      { nm:'JavaScript', role:'language', yrs:'04Y' },
      { nm:'HTML5',      role:'markup', yrs:'04Y' },
      { nm:'SCSS',       role:'styling', yrs:'04Y' },
      { nm:'RxJS',       role:'streams', yrs:'04Y' },
      { nm:'Angular Material', role:'components', yrs:'04Y' },
      { nm:'Reactive Forms', role:'forms', yrs:'04Y' },
      { nm:'Responsive Design', role:'layout', yrs:'04Y' },
    ],
  },
  {
    label: 'Backend / BaaS', tag: 'DAILY',
    items: [
      { nm:'Firebase',   role:'platform', yrs:'04Y' },
      { nm:'Firestore',  role:'database', yrs:'04Y' },
      { nm:'Firebase Auth', role:'identity', yrs:'04Y' },
      { nm:'REST APIs',  role:'integration', yrs:'04Y' },
    ],
  },
  {
    label: 'Mobile', tag: 'GROWING',
    items: [
      { nm:'Ionic',      role:'hybrid mobile', yrs:'01Y' },
      { nm:'Capacitor',  role:'native bridge', yrs:'01Y' },
    ],
  },
  {
    label: 'Architecture', tag: 'SCALE',
    items: [
      { nm:'Microfrontends', role:'architecture', yrs:'02Y' },
      { nm:'Module Federation', role:'runtime composition', yrs:'02Y' },
      { nm:'Nx',         role:'monorepo tooling', yrs:'02Y' },
    ],
  },
  {
    label: 'Tools', tag: 'DAILY',
    items: [
      { nm:'Git',        role:'version control', yrs:'04Y' },
      { nm:'GitHub',     role:'collaboration', yrs:'04Y' },
      { nm:'Figma',      role:'design handoff', yrs:'04Y' },
    ],
  },
  {
    label: 'Methodology', tag: 'PRACTICE',
    items: [
      { nm:'Scrum',      role:'process', yrs:'04Y' },
      { nm:'Agile',      role:'process', yrs:'04Y' },
      { nm:'SOLID',      role:'design principles', yrs:'04Y' },
      { nm:'Clean Code', role:'craft', yrs:'04Y' },
    ],
  },
];

const TOOLS = [
  { nm:'Angular',       role:'framework',        yrs:'04Y', x:'4%',  y:'6%',  rot:-3, v:'pink' },
  { nm:'TypeScript',    role:'language',         yrs:'04Y', x:'22%', y:'2%',  rot:2,  v:'amber'},
  { nm:'JavaScript',    role:'language',         yrs:'04Y', x:'40%', y:'10%', rot:-2, v:''     },
  { nm:'RxJS',          role:'streams',          yrs:'04Y', x:'58%', y:'4%',  rot:4,  v:''     },
  { nm:'SCSS',          role:'styling',          yrs:'04Y', x:'78%', y:'12%', rot:-4, v:'cyan' },

  { nm:'Firebase',      role:'platform',         yrs:'04Y', x:'8%',  y:'28%', rot:3,  v:'amber'},
  { nm:'Firestore',     role:'database',         yrs:'04Y', x:'28%', y:'34%', rot:-2, v:''     },
  { nm:'Firebase Auth', role:'identity',         yrs:'04Y', x:'47%', y:'30%', rot:2,  v:'ink'  },
  { nm:'REST APIs',     role:'integration',      yrs:'04Y', x:'68%', y:'36%', rot:-3, v:''     },
  { nm:'Angular Material',role:'components',     yrs:'04Y', x:'85%', y:'32%', rot:4,  v:'pink' },

  { nm:'Module Federation',role:'architecture',  yrs:'02Y', x:'4%',  y:'54%', rot:2,  v:'cyan' },
  { nm:'Nx',            role:'monorepo',         yrs:'02Y', x:'22%', y:'60%', rot:-3, v:''     },
  { nm:'Reactive Forms',role:'forms',            yrs:'04Y', x:'44%', y:'56%', rot:3,  v:'ink'  },
  { nm:'Ionic',         role:'hybrid mobile',    yrs:'01Y', x:'64%', y:'62%', rot:-2, v:''     },
  { nm:'Capacitor',     role:'native bridge',    yrs:'01Y', x:'82%', y:'56%', rot:4,  v:'pink' },

  { nm:'Git · GitHub',  role:'version control',  yrs:'04Y', x:'10%', y:'80%', rot:-3, v:''     },
  { nm:'Figma',         role:'design handoff',   yrs:'04Y', x:'28%', y:'84%', rot:2,  v:'amber'},
  { nm:'Scrum · Agile', role:'process',          yrs:'04Y', x:'46%', y:'82%', rot:-2, v:''     },
  { nm:'SOLID',         role:'design principles',yrs:'04Y', x:'64%', y:'86%', rot:3,  v:'ink'  },
  { nm:'Clean Code',    role:'craft',            yrs:'04Y', x:'83%', y:'80%', rot:-3, v:''     },
];

const Workbench = () => {
  return (
    <section className="section workbench" id="stack" data-screen-label="04 Current Stack">
      <div className="shell">
        <div className="kicker"><span className="num">§04</span> &nbsp;/&nbsp; CURRENT STACK &nbsp;·&nbsp; INSTRUMENTS IN ROTATION</div>

        <div className="workbench-head" style={{marginTop:24}}>
          <h2>Tools, <em>laid out</em><br/>like I&rsquo;d find them<br/><em>at dawn.</em></h2>
          <div className="meta">
            A working list — what I actually use on production code today.
            <b> Years are years in shipping code,</b> not years dabbled. Angular + Firebase +
            microfrontends is the spine; Ionic/Capacitor is the newest addition.
          </div>
        </div>

        <div className="stack-cats">
          {CATEGORIES.map((cat, i) => (
            <div key={i} className="cat">
              <div className="label">
                <span>{cat.label}</span>
                <b>·&nbsp;{cat.tag}</b>
              </div>
              <div className="items">
                {cat.items.map((it, k) => (
                  <div key={k} className="item">
                    <span className="nm">{it.nm}</span>
                    <span className="role">{it.role}</span>
                    <span className="yrs">{it.yrs}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="bench">
          <div className="corner-tag">⬒ DESK VIEW · 10:42 AM · BOGOTÁ</div>
          <div className="corner-tag r">FIG. 04 — INSTRUMENT TABLEAU</div>

          {TOOLS.map((t, i) => (
            <div key={i} className={`tool ${t.v}`}
                 style={{ left: t.x, top: t.y, transform: `rotate(${t.rot}deg)` }}>
              <div className="name">{t.nm}</div>
              <div className="role">{t.role}</div>
              <div className="yrs">{t.yrs}</div>
            </div>
          ))}

          <div className="legend">
            <span>● PRIMARY &nbsp; ○ SECONDARY &nbsp; ⬓ GROWING</span>
            <span>SCALE 1:1 · ALL TOOLS IN ACTIVE ROTATION</span>
          </div>
        </div>
      </div>
    </section>
  );
};

window.Workbench = Workbench;
