// Root — status bar, rail, sections
const SECTIONS = [
  { id: 'entry',    n: '§01', t: 'FIELD ENTRY',     short: '§01' },
  { id: 'operator', n: '§02', t: 'OPERATOR',        short: '§02' },
  { id: 'systems',  n: '§03', t: 'ACTIVE SYSTEMS',  short: '§03' },
  { id: 'stack',    n: '§04', t: 'CURRENT STACK',   short: '§04' },
  { id: 'logbook',  n: '§05', t: 'LOGBOOK',         short: '§05' },
  { id: 'transmit', n: '§06', t: 'TRANSMISSION',    short: '§06' },
];

const StatusBar = ({ active }) => {
  const { lang } = useLang();
  const [t, setT] = React.useState(new Date());
  React.useEffect(() => {
    const id = setInterval(() => setT(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const time = t.toLocaleTimeString('en-GB', { hour12: false, timeZone: 'America/Bogota' });
  const path = '~/paula.labs/' + active;

  return (
    <div className="status-bar">
      <div className="l">
        <span className="cell"><span className="pulse"></span> <b>PAULA.VARGAS</b></span>
        <span className="cell hide-xs">PATH <b>{path}</b></span>
        <span className="cell hide-sm">VOL. <b>VIII</b></span>
        <span className="cell hide-sm">REV. <b>2026.05</b></span>
      </div>
      <div className="r">
        <span className="cell hide-sm">BOGOTÁ</span>
        <span className="cell">●REC <b style={{color:'var(--amber)'}}>{time}</b></span>
        <span className="cell hide-xs" style={{color:'var(--green)'}}>● {lang === 'en' ? 'OPEN FOR WORK' : 'DISPONIBLE'}</span>
      </div>
    </div>
  );
};

const Rail = ({ active, setActive }) => (
  <nav className={`rail ${active === 'entry' ? 'is-hero' : ''}`}>
    {SECTIONS.map(s => (
      <a
        key={s.id}
        href={'#' + s.id}
        className={active === s.id ? 'on' : ''}
        onClick={() => setActive(s.id)}
      >
        <span className="tick"></span>
        <span className="full">{s.n} · {s.t}</span>
        <span className="short">{s.short}</span>
      </a>
    ))}
  </nav>
);

const App = () => {
  const [active, setActive] = React.useState('entry');
  const [lang, setLangState] = React.useState(() => {
    try { return localStorage.getItem('paula-labs-lang') || 'en'; } catch (e) { return 'en'; }
  });
  const setLang = (l) => {
    setLangState(l);
    try { localStorage.setItem('paula-labs-lang', l); } catch (e) {}
  };

  React.useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting && e.intersectionRatio > 0.3) {
          setActive(e.target.id);
        }
      });
    }, { threshold: [0.3, 0.6] });

    SECTIONS.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      <div className="grain"></div>
      <div className="scanline"></div>

      <StatusBar active={active} />
      <SiteNav active={active} />

      <div className="corner">
        PAULA.LABS<br/>
        {lang === 'en' ? 'FIELD NOTEBOOK' : 'CUADERNO DE CAMPO'} · VOL. VIII<br/>
        PG. {SECTIONS.findIndex(s => s.id === active) + 1}/06
      </div>

      <main>
        <Hero />
        <Operator />
        <Systems />
        <Workbench />
        <Log />
        <Transmission />
      </main>
    </LangContext.Provider>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
