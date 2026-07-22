// OPERATOR — Paula Vargas real dossier
const Operator = () => {
  return (
    <section className="section operator" id="operator" data-screen-label="02 Operator">
      <div className="shell">
        <div className="kicker op-kicker">
          <span className="num">§02</span> &nbsp;/&nbsp; OPERATOR DOSSIER &nbsp;·&nbsp; A SHORT FILE
        </div>

        <div className="operator-grid">
          {/* Portrait card */}
          <div className="op-portrait">
            <div className="op-stamp">VERIFIED</div>
            <div className="frame">
              <div className="silhouette">P</div>
              <span className="px" style={{top:'12%', left:'14%'}}></span>
              <span className="px" style={{top:'86%', left:'82%'}}></span>
              <span className="px" style={{top:'40%', right:'8%', background:'var(--cyan)'}}></span>
              <span className="px" style={{bottom:'10%', left:'10%', background:'var(--pink)'}}></span>
            </div>
            <div className="cap">
              <span>PORTRAIT · <b>M.P. VARGAS</b></span>
              <span>OP–001</span>
            </div>
            <div className="cap" style={{marginTop:6}}>
              <span>BOGOTÁ · CO</span>
              <span>HAND <b>RIGHT</b></span>
            </div>
          </div>

          {/* Editorial body */}
          <div className="op-body">
            <h2 className="op-h">
              I build interfaces<br/>
              <em>that have to work</em><br/>
              in production, <em>while</em><br/>
              <span style={{color:'var(--amber)'}}>I&rsquo;m still learning.</span>
            </h2>

            <div className="op-cols">
              <p>
                Frontend engineer, Bogotá. More than <b>four years</b> building web applications
                with <b>Angular and TypeScript</b> in real production environments — while finishing
                the last stretch of a Software Engineering degree at night.
              </p>
              <p>
                I work with <b>microfrontend architectures</b> (Module Federation, Nx) that let
                teams ship independently without stepping on each other, and with <b>Firebase</b>{' '}
                (Firestore + Authentication) as the backend for data and identity. I care about{' '}
                <span className="hl">SOLID and Clean Code</span> not as slogans but as the reason a
                three-year-old codebase is still pleasant to open.
              </p>

              <p className="op-quote">
                "I'd rather ship one product well for four years than ship ten products
                badly. <i>Depth teaches you things breadth can't.</i>"
              </p>

              <p>
                Day to day I maintain <b>PAPPCORN</b>, an enterprise management platform I've
                worked on since 2021 — new features, microfrontend migrations, performance
                passes, functional testing, all inside an agile team. Before that I built
                interfaces for educational platforms and corporate WordPress sites, which is
                where I learned to care about the parts non-engineers actually notice.
              </p>
              <p>
                I read English documentation daily, write Spanish natively, and I'm still
                two semesters from my degree — which keeps me honestly aware of how much
                there still is to learn, and comfortable saying so.
              </p>
            </div>
          </div>

          {/* Right inventory column */}
          <aside className="op-side">
            <div className="inv-card">
              <div className="h"><span>ACTIVE MISSIONS</span><b>WK / 19 · 2026</b></div>
              <div className="inv-row now">
                <span className="n">01</span>
                <span className="t">Module Federation migration · PAPPCORN</span>
                <span className="m">●●●○</span>
              </div>
              <div className="inv-row now">
                <span className="n">02</span>
                <span className="t">Final semester · Ingeniería de Software</span>
                <span className="m">●●●●</span>
              </div>
              <div className="inv-row now">
                <span className="n">03</span>
                <span className="t">Reactive Forms overhaul · new module</span>
                <span className="m">●●○○</span>
              </div>
              <div className="inv-row now">
                <span className="n">04</span>
                <span className="t">Ionic + Capacitor experiments, off-hours</span>
                <span className="m">●○○○</span>
              </div>
            </div>

            <div className="inv-card">
              <div className="h"><span>EDUCATION</span><b>2021 → 2026</b></div>
              <div className="inv-row book"><span className="n">▪</span><span className="t">Ingeniería de Software <i>· Politécnico Grancolombiano</i></span><span className="m">7/8</span></div>
              <div className="inv-row book"><span className="n">▪</span><span className="t">Técnico Front-End <i>· Instituto Kuepa</i></span><span className="m">2021</span></div>
              <div className="inv-row book"><span className="n">▪</span><span className="t">Beca Jóvenes a la U <i>· Politécnico</i></span><span className="m">★</span></div>
              <div className="inv-row book"><span className="n">▪</span><span className="t">Beca Fundación Citibank <i>· Kuepa</i></span><span className="m">★</span></div>
            </div>

            <div className="inv-card">
              <div className="h"><span>WAYS OF WORKING</span><b>DAILY</b></div>
              <div className="inv-row"><span className="n">·</span><span className="t">Scrum / Agile ceremonies, taken seriously</span><span className="m">04Y</span></div>
              <div className="inv-row"><span className="n">·</span><span className="t">SOLID before clever</span><span className="m">04Y</span></div>
              <div className="inv-row"><span className="n">·</span><span className="t">Functional testing before merge</span><span className="m">03Y</span></div>
              <div className="inv-row"><span className="n">·</span><span className="t">English docs, every single day</span><span className="m">04Y</span></div>
            </div>

            <div className="inv-card">
              <div className="h"><span>LANGUAGES</span><b>SPOKEN</b></div>
              <div className="inv-row"><span className="n">ES</span><span className="t">Español</span><span className="m ok">NATIVE</span></div>
              <div className="inv-row"><span className="n">EN</span><span className="t">English</span><span className="m">A2</span></div>
            </div>

            <div className="inv-card">
              <div className="h"><span>OBSESSIONS</span><b>RECURRING</b></div>
              <div className="inv-row"><span className="n">∞</span><span className="t">Independent deploys across teams</span><span className="m">ARCH</span></div>
              <div className="inv-row"><span className="n">∞</span><span className="t">Reactive Forms that validate themselves</span><span className="m">UX</span></div>
              <div className="inv-row"><span className="n">∞</span><span className="t">A design system that survives four years</span><span className="m">CRAFT</span></div>
              <div className="inv-row"><span className="n">∞</span><span className="t">Ionic + Capacitor, properly this time</span><span className="m">SOON</span></div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

window.Operator = Operator;
