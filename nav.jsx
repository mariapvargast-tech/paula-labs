// SITE NAV — fixed header below the status bar
const NAV_LINKS = {
  en: [
    { id: 'operator', label: './about' },
    { id: 'systems',  label: './systems' },
    { id: 'stack',    label: './stack' },
    { id: 'logbook',  label: './log' },
    { id: 'transmit', label: './contact' },
  ],
  es: [
    { id: 'operator', label: './acerca' },
    { id: 'systems',  label: './sistemas' },
    { id: 'stack',    label: './stack' },
    { id: 'logbook',  label: './log' },
    { id: 'transmit', label: './contacto' },
  ],
};

const SiteNav = ({ active }) => {
  const { lang, setLang } = useLang();
  const links = NAV_LINKS[lang];
  return (
    <header className="site-nav">
      <a href="#entry" className="brand">
        <span className="dot"></span>
        paula.vargas <span className="sep">// {lang === 'en' ? 'online' : 'en línea'}</span>
      </a>
      <nav className="links">
        {links.map(l => (
          <a key={l.id} href={'#' + l.id} className={active === l.id ? 'on' : ''}>{l.label}</a>
        ))}
      </nav>
      <div className="actions">
        <div className="lang-toggle" role="group" aria-label="Language">
          <button type="button" className={lang === 'en' ? 'on' : ''} onClick={() => setLang('en')}>EN</button>
          <button type="button" className={lang === 'es' ? 'on' : ''} onClick={() => setLang('es')}>ES</button>
        </div>
        <a href="#" className="btn-nav-ghost">↓ CV</a>
        <a href="#transmit" className="btn-nav-pink">{lang === 'en' ? 'contact' : 'contacto'}</a>
      </div>
    </header>
  );
};

window.SiteNav = SiteNav;
