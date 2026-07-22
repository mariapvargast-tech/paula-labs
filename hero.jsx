// FIELD ENTRY 001 — Paula Vargas
const HERO_COPY = {
  en: {
    doc1: 'DOCUMENT', doc1ref: 'PL-2026.05 / V.08',
    doc2: 'FIELD', doc2ref: 'NOTEBOOK · ENTRY 001 · OPEN',
    vol: 'Vol. VIII — “Frontend systems, written by hand.”',
    local: 'LOCAL',
    tag: '★ FIELD ENTRY 001 ─ OPERATOR INTRODUCES HERSELF',
    h1a: 'Paula Vargas', h1b: 'runs a small', h1c: 'laboratory', h1d: 'for Angular,', h1e: 'Firebase & microfrontends.',
    lede: (<React.Fragment>
      Frontend engineer based in <b>Bogotá, Colombia</b>. I build <b>enterprise management apps,
      microfrontend architectures and the Firebase backends behind them</b> — while finishing my
      last year of a Software Engineering degree. Architecture first, motion second, and a paper
      notebook open at all times. {' '}
      <span className="ink">4+ years shipping</span>, one long-running product, always in production.
    </React.Fragment>),
    btn1: 'Enter the archive', btn2: 'Open transmission',
    specHead: 'SPEC ── OPERATOR', live: 'LIVE',
    rows: [
      ['NAME', (<React.Fragment><span className="ital">Paula Vargas</span> &nbsp; <span className="accent">// frontend.eng</span></React.Fragment>)],
      ['FOCUS', (<React.Fragment>Angular · Firebase · <span className="accent">Microfrontends</span> · TS</React.Fragment>)],
      ['SINCE', (<React.Fragment>2021 · <span style={{color:'var(--paper-faint)'}}>4+ years in production</span></React.Fragment>)],
      ['STATUS', (<React.Fragment><span className="ok">● OPEN</span> &nbsp; freelance / contract / full-time</React.Fragment>)],
      ['STUDYING', (<React.Fragment><span className="pink">Software Eng.</span> · 7th of 8 semesters</React.Fragment>)],
      ['UPTIME', (<React.Fragment><span className="cyan">PAPPCORN</span> in production since 2021</React.Fragment>)],
      ['COFFEE', (<React.Fragment>cup 3 of 4 · <span className="accent">▮▮▮▯</span></React.Fragment>)],
    ],
    ticker: ['ANGULAR · FIREBASE · MICROFRONTENDS','FIELD NOTEBOOK / VOL. VIII','BUILDING FROM BOGOTÁ SINCE 2021','MODULE FEDERATION · NX · TYPESCRIPT','FINISHING SOFTWARE ENGINEERING, 2026'],
  },
  es: {
    doc1: 'DOCUMENTO', doc1ref: 'PL-2026.05 / V.08',
    doc2: 'ENTRADA', doc2ref: 'DE CAMPO · N.º 001 · ABIERTA',
    vol: 'Vol. VIII — “Sistemas de frontend, escritos a mano.”',
    local: 'HORA LOCAL',
    tag: '★ ENTRADA DE CAMPO 001 ─ LA OPERADORA SE PRESENTA',
    h1a: 'Paula Vargas', h1b: 'dirige un pequeño', h1c: 'laboratorio', h1d: 'de Angular,', h1e: 'Firebase y microfrontends.',
    lede: (<React.Fragment>
      Ingeniera frontend en <b>Bogotá, Colombia</b>. Construyo <b>aplicaciones de gestión empresarial,
      arquitecturas de microfrontends y los backends en Firebase</b> que hay detrás — mientras termino
      el último año de mi carrera de Ingeniería de Software. Primero la arquitectura, luego la animación,
      y un cuaderno de papel siempre abierto. {' '}
      <span className="ink">4+ años en producción</span>, un solo producto de larga vida, siempre en vivo.
    </React.Fragment>),
    btn1: 'Entrar al archivo', btn2: 'Abrir transmisión',
    specHead: 'ESPEC ── OPERADORA', live: 'EN VIVO',
    rows: [
      ['NOMBRE', (<React.Fragment><span className="ital">Paula Vargas</span> &nbsp; <span className="accent">// frontend.eng</span></React.Fragment>)],
      ['ENFOQUE', (<React.Fragment>Angular · Firebase · <span className="accent">Microfrontends</span> · TS</React.Fragment>)],
      ['DESDE', (<React.Fragment>2021 · <span style={{color:'var(--paper-faint)'}}>4+ años en producción</span></React.Fragment>)],
      ['ESTADO', (<React.Fragment><span className="ok">● ABIERTA</span> &nbsp; freelance / contrato / tiempo completo</React.Fragment>)],
      ['ESTUDIANDO', (<React.Fragment><span className="pink">Ing. de Software</span> · semestre 7 de 8</React.Fragment>)],
      ['ACTIVA', (<React.Fragment><span className="cyan">PAPPCORN</span> en producción desde 2021</React.Fragment>)],
      ['CAFÉ', (<React.Fragment>taza 3 de 4 · <span className="accent">▮▮▮▯</span></React.Fragment>)],
    ],
    ticker: ['ANGULAR · FIREBASE · MICROFRONTENDS','CUADERNO DE CAMPO / VOL. VIII','CONSTRUYENDO DESDE BOGOTÁ DESDE 2021','MODULE FEDERATION · NX · TYPESCRIPT','TERMINANDO ING. DE SOFTWARE, 2026'],
  },
};

const Hero = () => {
  const { lang } = useLang();
  const c = HERO_COPY[lang];
  const [now, setNow] = React.useState(new Date());
  React.useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const t = now.toLocaleTimeString('en-GB', { hour12: false, timeZone: 'America/Bogota' });
  const d = now.toLocaleDateString(lang === 'en' ? 'en-US' : 'es-CO', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();

  return (
    <section className="section hero" id="entry" data-screen-label="01 Field Entry">
      <div className="shell">
        <div className="hero-top">
          <div className="hero-stamp">
            <div className="doc">{c.doc1} <span className="ref">{c.doc1ref}</span></div>
            <div className="doc">{c.doc2} <span className="ref">{c.doc2ref}</span></div>
            <div className="vol">{c.vol}</div>
          </div>
          <div className="hero-locator">
            <span style={{whiteSpace:'nowrap'}}>4.7110° N · 74.0721° W</span><br/>
            BOGOTÁ / CO<br/>
            {c.local} <b>{t}</b><br/>
            {d}
          </div>
        </div>

        <div className="hero-body">
          <div className="hero-headline">
            <div className="tag">{c.tag}</div>
            <h1>
              <span className="lab">{c.h1a}</span>
              <span className="ital">{c.h1b}</span>
              <span className="stamp lab" style={{display:'inline-block'}}>{c.h1c}</span>
              <span className="ital">{c.h1d}</span>
              <span className="lab">{c.h1e}</span>
            </h1>

            <p className="lede">{c.lede}</p>

            <div className="hero-actions">
              <a href="#systems" className="btn-ink">
                {c.btn1}
                <span className="arrow">↘</span>
              </a>
              <a href="#transmit" className="btn-outline">
                ↗ &nbsp;{c.btn2}
              </a>
            </div>
          </div>

          <aside className="specimen">
            <div className="specimen-head">
              <span>{c.specHead}</span>
              <span className="live"><span className="led"></span> {c.live}</span>
            </div>

            <div className="specimen-portrait">
              <div className="crosshair"><span className="center-tag">FIG. 01</span></div>
              <span className="label"><span>FOCAL POINT</span><span>4:3 / OBSERVED</span></span>
            </div>

            <div>
              {c.rows.map((r, i) => (
                <div key={i} className="specimen-row">
                  <div className="k">{r[0]}</div>
                  <div className="v">{r[1]}</div>
                </div>
              ))}
            </div>
          </aside>
        </div>

        <div className="hero-ticker">
          <div className="track">
            {[...c.ticker, ...c.ticker].map((s, i) => (
              <React.Fragment key={i}><span>{s}</span><span className="dot">✦</span></React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

window.Hero = Hero;
