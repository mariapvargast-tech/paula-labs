// ACTIVE SYSTEMS — Paula Vargas real projects: PAPPCORN, Cooking Program, Ink Agencia Digital
// Visualizations reused from prior version, kept abstract (blueprint / arch / schema / paint).

const VizBlueprint = () => (
  <div className="viz-blueprint">
    <svg viewBox="0 0 400 300" preserveAspectRatio="none">
      <g stroke="rgba(111,141,255,0.9)" fill="none" strokeWidth="1">
        <rect x="40" y="60" width="120" height="80"/>
        <text x="100" y="105" textAnchor="middle" fill="rgba(237,231,214,0.9)" fontFamily="JetBrains Mono" fontSize="9" letterSpacing="1.5">SHELL.APP</text>
        <rect x="200" y="60" width="120" height="80"/>
        <text x="260" y="105" textAnchor="middle" fill="rgba(237,231,214,0.9)" fontFamily="JetBrains Mono" fontSize="9" letterSpacing="1.5">REMOTE.MFE</text>
        <rect x="120" y="180" width="160" height="60"/>
        <text x="200" y="216" textAnchor="middle" fill="rgba(255,111,174,0.9)" fontFamily="JetBrains Mono" fontSize="10" letterSpacing="2">FIREBASE / FIRESTORE</text>
        <line x1="100" y1="140" x2="180" y2="180" strokeDasharray="3 3"/>
        <line x1="260" y1="140" x2="220" y2="180" strokeDasharray="3 3"/>
        <circle cx="180" cy="180" r="3" fill="rgba(255,111,174,1)"/>
        <circle cx="220" cy="180" r="3" fill="rgba(255,111,174,1)"/>
        <text x="40" y="42" fill="rgba(237,231,214,0.8)" fontFamily="JetBrains Mono" fontSize="9" letterSpacing="1.8">MODULE FEDERATION</text>
        <text x="40" y="270" fill="rgba(237,231,214,0.6)" fontFamily="JetBrains Mono" fontSize="8" letterSpacing="1.5">FIG. A.1 · NX WORKSPACE</text>
      </g>
    </svg>
    <span className="stamp">PAPPCORN · v3.x</span>
  </div>
);

const VizArch = ({ children }) => <div className="viz-arch">{children}</div>;

const VizSchema = () => (
  <div className="viz-schema">
    <span className="c">// module-federation.config.ts</span><br/>
    <span className="c">{"{"}</span><br/>
    &nbsp;&nbsp;<span className="k">"name"</span>: <span className="v">"gestion-shell"</span>,<br/>
    &nbsp;&nbsp;<span className="k">"remotes"</span>: [<br/>
    &nbsp;&nbsp;&nbsp;&nbsp;<span className="p">"inventario@remoteEntry.js"</span>,<br/>
    &nbsp;&nbsp;&nbsp;&nbsp;<span className="p">"facturacion@remoteEntry.js"</span><br/>
    &nbsp;&nbsp;],<br/>
    &nbsp;&nbsp;<span className="k">"exposes"</span>: <span className="n">{"{ \"./Dashboard\": \"./src/app/dashboard\" }"}</span><br/>
    <span className="c">{"}"}</span><br/>
    <br/>
    <span style={{color:'var(--paper-faint)'}}>$ nx serve gestion-shell --devRemotes=inventario</span><br/>
    <span style={{color:'var(--green)'}}>✓ 2 remotes attached · independent deploy ready</span>
  </div>
);

const VizPaint = () => {
  const swatches = [
    {c:'#ff5d9a', n:'01·CARMINE'},
    {c:'#ff6fae', n:'02·ROSE'},
    {c:'#3affd6', n:'03·SIGNAL'},
    {c:'#6f8dff', n:'04·BLUEPRINT'},
    {c:'#87e36b', n:'05·CHLORINE'},
    {c:'#ede7d6', n:'06·BONE'},
  ];
  return (
    <div className="viz-paint" style={{gridTemplateColumns:'repeat(6, 1fr)'}}>
      {swatches.map((s,i) => (
        <div key={i} className="swatch" style={{background: s.c}}>
          <span className="l" style={{color: i === 5 || i === 1 || i === 2 ? '#111' : '#ede7d6'}}>{s.n}</span>
        </div>
      ))}
      {swatches.map((s,i) => (
        <div key={'b'+i} className="swatch" style={{background: s.c, filter:'brightness(0.45)'}}>
          <span className="l" style={{color:'#ede7d6'}}>{s.n.replace('·','/')}.D</span>
        </div>
      ))}
    </div>
  );
};

const VIZ = {
  blueprint: <VizBlueprint/>,
  arch: <VizArch>
    <div className="node ng">[ Angular · Reactive Forms ]</div>
    <div className="arrow">│</div>
    <div className="node fb">[ Firebase · Firestore + Auth ]</div>
    <div className="arrow">│</div>
    <div className="node">[ REST APIs ]</div>
  </VizArch>,
  schema: <VizSchema/>,
  paint: <VizPaint/>,
};

// ─── DATA — three real, verifiable engagements ─────────────────────────
const SYSTEMS = [
  {
    cat: 'N°1', sub: 'ENTERPRISE · ACTIVE',
    name: 'PAPPCORN', italic: '— gestión empresarial',
    blurb: 'Enterprise management web application, in continuous production since 2021. Angular + TypeScript frontend, Firebase for data and identity, migrating toward independently-deployable microfrontends.',
    meta: [
      { k:'SYSTEM',  v:'ACTIVE',           cls:'green' },
      { k:'STATUS',  v:'IN PRODUCTION',    cls:'cyan'  },
      { k:'STACK',   v:'Angular · TypeScript · Firebase',  cls:'accent' },
      { k:'ROLE',    v:'FRONTEND DEVELOPER · REMOTE' },
      { k:'YEAR',    v:'2021 ─ ONGOING' },
    ],
    viz: 'blueprint',
    problem: 'PAPPCORN is a long-running enterprise management platform — the kind of system where every new feature has to sit next to four years of existing decisions without breaking them. The frontend needed room for multiple teams to ship independently, and a cleaner story for how data and auth were handled.',
    decisions:
      'Development and maintenance of the Angular + TypeScript frontend, with Firebase (Firestore + Authentication) wired in for data and identity. Introduced a microfrontend architecture using Module Federation and Nx, so features can be built and deployed independently rather than through one shared release train. New functionality is built with Angular Material and Reactive Forms, with an eye on visual consistency and the actual experience of the person using it — not just the ticket description.',
    arch: [
      ['nx workspace/', 'shell + N independently-deployed remotes'],
      ['└─ shell-app/', 'Angular · routing · auth guard'],
      ['└─ mfe-inventario/', 'Module Federation remote'],
      ['└─ mfe-facturacion/', 'Module Federation remote'],
      ['Firebase', 'Firestore · Authentication'],
      ['REST APIs', 'legacy service integration'],
    ],
    stats: [
      { n:'4+',   l:'YEARS IN PRODUCTION' },
      { n:'2021', l:'FIRST COMMIT' },
      { n:'MFE',  l:'ARCHITECTURE · IN MIGRATION' },
    ],
    tags: ['Angular','TypeScript','Firebase','Firestore','Module Federation','Nx','Angular Material','Reactive Forms','Agile'],
    tagsKey: ['k','k','k','k','m','m','m','m','m'],
  },
  {
    cat: 'N°2', sub: 'EDUCATION · 2021–2023',
    name: 'Cooking Program', italic: '— plataformas educativas',
    blurb: 'Interfaces for educational and technical-training platforms, built with Angular and Firebase — including automated testing to keep delivered features stable as the platform grew.',
    meta: [
      { k:'SYSTEM',  v:'ARCHIVED',         cls:'red'   },
      { k:'STATUS',  v:'DELIVERED',        cls:'pink'  },
      { k:'STACK',   v:'Angular · Firebase', cls:'accent' },
      { k:'ROLE',    v:'FRONTEND DEVELOPER' },
      { k:'YEAR',    v:'2021 ─ 2023' },
    ],
    viz: 'schema',
    problem: 'An educational and technical-training platform needed interfaces that could keep up with a fast-moving curriculum team — new modules, new content types, new forms — without the codebase turning into something nobody wanted to touch.',
    decisions:
      'Built interfaces with Angular and Firebase, applying SOLID principles and Clean Code to keep things maintainable as scope grew. Implemented automated tests to guard the stability of delivered functionality, and worked directly with the team on technical training and the adoption of better development practices along the way.',
    arch: [
      ['Angular app', 'course modules · content forms'],
      ['└─ Firebase', 'content storage · auth'],
      ['└─ automated tests', 'stability guard on delivery'],
      ['Clean Code / SOLID', 'applied across the codebase'],
    ],
    stats: [
      { n:'2Y',  l:'ENGAGEMENT LENGTH' },
      { n:'SOLID', l:'PRINCIPLES APPLIED' },
      { n:'✓',   l:'AUTOMATED TEST COVERAGE' },
    ],
    tags: ['Angular','Firebase','SOLID','Clean Code','Automated Testing'],
    tagsKey: ['k','k','m','m','m'],
  },
  {
    cat: 'N°3', sub: 'AGENCY · 2021',
    name: 'Ink Agencia Digital', italic: '— sitios corporativos',
    blurb: 'Corporate WordPress sites, built from Figma designs — visual implementation, theme customization, plugin work, and the ongoing maintenance that keeps a marketing site actually working.',
    meta: [
      { k:'SYSTEM',  v:'ARCHIVED',         cls:'red'   },
      { k:'STATUS',  v:'DELIVERED',        cls:'pink'  },
      { k:'STACK',   v:'WordPress · Figma', cls:'accent' },
      { k:'ROLE',    v:'FRONTEND DEVELOPER' },
      { k:'YEAR',    v:'2021' },
    ],
    viz: 'paint',
    problem: 'A digital agency needed corporate websites turned around quickly and faithfully from Figma designs, for clients who cared about brand consistency but had ongoing WordPress sites that still needed care after launch.',
    decisions:
      'Visual implementation of websites straight from Figma designs, with theme customization and WordPress plugin work to match. Provided ongoing maintenance and technical support for sites already in production — the unglamorous half of agency frontend work that keeps a client happy for years, not just on launch day.',
    arch: [
      ['Figma designs', 'client-approved visual spec'],
      ['└─ WordPress theme', 'customized to spec'],
      ['└─ Plugins', 'configured per site'],
      ['Ongoing support', 'maintenance after launch'],
    ],
    stats: [
      { n:'2021', l:'ENGAGEMENT' },
      { n:'WP',   l:'THEME + PLUGINS' },
      { n:'✓',    l:'POST-LAUNCH SUPPORT' },
    ],
    tags: ['WordPress','Figma','Theming','Plugins','Maintenance'],
    tagsKey: ['k','k','m','m','m'],
  },
];

// ─── COMPONENT ──────────────────────────────────────────────────────────
const System = ({ data, open, onToggle }) => {
  return (
    <div className={`system ${open ? 'open' : ''}`} onClick={onToggle}>
      <div className="sys-head">
        <div className="cat">
          <span>{data.cat}</span>
          <span className="sub">{data.sub}</span>
        </div>
      </div>
      <div className="sys-name">
        <div className="name">
          {data.name} <em>{data.italic}</em>
          <span className="blurb">{data.blurb}</span>
        </div>
      </div>
      <div className="meta">
        {data.meta.map((m, i) => (
          <div key={i} className="row">
            <span className="k">{m.k}</span>
            <span className={`v ${m.cls || ''}`}>{m.v}</span>
          </div>
        ))}
      </div>
      <div className="viz">{VIZ[data.viz]}</div>
      <div className="open-arr">{open ? '×' : '↗'}</div>

      <div className="expand">
        <div className="expand-inner">
          <div>
            <h4>PROBLEM &amp; CONTEXT</h4>
            <p>{data.problem}</p>
            <h4 style={{marginTop:24}}>TECHNICAL DECISIONS</h4>
            <p>{data.decisions}</p>
            <div className="tags">
              {data.tags.map((t, i) => (
                <span key={t} className={`tag ${data.tagsKey ? data.tagsKey[i] : ''}`}>{t}</span>
              ))}
            </div>
          </div>
          <div>
            <h4>ARCHITECTURE SKETCH</h4>
            <div className="arch-block">
              {data.arch.map((row, i) => (
                <div key={i}>
                  <span className="a">{row[0]}</span>{'  '}<span className="f">{row[1]}</span>
                </div>
              ))}
            </div>
            <h4 style={{marginTop:24}}>OUTCOMES</h4>
            <div className="stat-grid">
              {data.stats.map((s, i) => (
                <div key={i} className="stat">
                  <div className="n">{s.n}</div>
                  <div className="l">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Systems = () => {
  const [open, setOpen] = React.useState(0);
  return (
    <section className="section systems" id="systems" data-screen-label="03 Active Systems">
      <div className="shell">
        <div className="kicker" style={{marginBottom: 16}}>
          <span className="num">§03</span> &nbsp;/&nbsp; ACTIVE SYSTEMS &nbsp;·&nbsp; FROM THE ARCHIVE
        </div>
        <div className="systems-head">
          <h2>Three systems, <em>built in<br/>the real world.</em></h2>
          <div className="filter">
            <span><b>ALL</b></span><span>ENTERPRISE</span><span>EDU</span><span>AGENCY</span>
          </div>
          <div className="count"><b>03 / 03</b>SHOWN<br/>2021 → 2026</div>
        </div>

        <div className="system-list">
          {SYSTEMS.map((s, i) => (
            <System
              key={i}
              data={s}
              open={open === i}
              onToggle={() => setOpen(open === i ? -1 : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

window.Systems = Systems;
