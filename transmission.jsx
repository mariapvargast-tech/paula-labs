// TRANSMISSION — contact + colophon
const Transmission = () => {
  return (
    <section className="section transmission" id="transmit" data-screen-label="06 Transmission">
      <div className="shell">
        <div className="kicker" style={{marginBottom: 28}}>
          <span className="num">§06</span> &nbsp;/&nbsp; OUTBOUND TRANSMISSION &nbsp;·&nbsp; FORM 17-B
        </div>

        <div className="tx">
          <div className="tx-grid">
            <div className="tx-left">
              <div className="tx-form-tag">
                <span>FORM <b>17-B</b> · OUTBOUND · REV. 04</span>
                <span className="stamp">URGENT / OPEN</span>
              </div>

              <h2>
                Send something my way.<br/>
                <em>I read everything.</em>
              </h2>
              <p className="sub">
                Hailing frequencies open for new engagements — startups
                with an Angular frontend, teams running microfrontends, or products
                that need Firebase wired in properly. Currently finishing my Software
                Engineering degree, so I'm honest about timelines.
              </p>

              <div className="tx-fields">
                <div className="tx-row">
                  <div className="k">FROM</div>
                  <div className="v">name@your.studio &nbsp; <span style={{color:'var(--paper-faint)'}}>// sender</span></div>
                </div>
                <div className="tx-row">
                  <div className="k">SUBJECT</div>
                  <div className="v accent">a project you&rsquo;d like built well</div>
                </div>
                <div className="tx-row">
                  <div className="k">CHANNEL</div>
                  <div className="v">▣ EMAIL &nbsp; ▢ CALL &nbsp; ▢ IN PERSON &nbsp; <span style={{color:'var(--paper-faint)'}}>// pick one</span></div>
                </div>
                <div className="tx-row">
                  <div className="k">SCOPE</div>
                  <div className="v">
                    <span style={{color:'var(--cyan)'}}>▣</span> FULL BUILD &nbsp;
                    <span style={{color:'var(--cyan)'}}>▣</span> CONSULT &nbsp;
                    <span style={{color:'var(--paper-faint)'}}>▢</span> AUDIT &nbsp;
                    <span style={{color:'var(--paper-faint)'}}>▢</span> SPEAK
                  </div>
                </div>
                <div className="tx-row">
                  <div className="k">STACK</div>
                  <div className="v cyan">Angular &nbsp;·&nbsp; TypeScript &nbsp;·&nbsp; Firebase &nbsp;·&nbsp; Microfrontends</div>
                </div>
                <div className="tx-row">
                  <div className="k">MESSAGE</div>
                  <div className="v" style={{color:'var(--paper-dim)', fontFamily:'var(--f-sans)', fontSize:'15px', lineHeight:1.55}}>
                    <span style={{fontFamily:'var(--f-mono)', color:'var(--paper-faint)', fontSize:'11px'}}>┌─────</span><br/>
                    Hi Paula — we&rsquo;re a {' '}
                    <span style={{color:'var(--paper)', borderBottom:'1px dashed var(--paper-faint)'}}>three-person team</span> {' '}
                    building {' '}
                    <span style={{color:'var(--paper)', borderBottom:'1px dashed var(--paper-faint)'}}>a product on Angular</span>, {' '}
                    and we&rsquo;d love your hand on the surface layer. We have {' '}
                    <span style={{color:'var(--paper)', borderBottom:'1px dashed var(--paper-faint)'}}>a deadline</span> {' '}
                    and {' '}
                    <span style={{color:'var(--paper)', borderBottom:'1px dashed var(--paper-faint)'}}>good taste.</span><br/>
                    <span style={{fontFamily:'var(--f-mono)', color:'var(--paper-faint)', fontSize:'11px'}}>└─────</span>
                  </div>
                </div>
                <div className="tx-row signature">
                  <div className="k">SIGNATURE</div>
                  <div className="v">
                    <span className="sig">— your name here</span>
                  </div>
                </div>
              </div>

              <div className="tx-submit">
                <a href="mailto:14mariapaula09@gmail.com?subject=Form%2017-B%20%E2%80%94%20outbound" className="btn-send">
                  Transmit
                  <span className="arrow">↗</span>
                </a>
                <div className="note">REPLY · 24–48 HRS · M–F</div>
              </div>
            </div>

            <div className="tx-right">
              <div className="corner">CHANNELS · OPEN</div>
              <h3>OR REACH ME ON A DIFFERENT FREQUENCY</h3>

              <a className="channel-row" href="mailto:14mariapaula09@gmail.com">
                <div>
                  <div className="l">EMAIL · PREFERRED</div>
                  <div className="v">14mariapaula09@gmail.com</div>
                </div>
                <div className="arr">↗</div>
              </a>
              <a className="channel-row" href="tel:+573177662396">
                <div>
                  <div className="l">PHONE · WHATSAPP</div>
                  <div className="v">+57 317 766 2396</div>
                </div>
                <div className="arr">↗</div>
              </a>
              <a className="channel-row" href="https://github.com/mariapaulav03">
                <div>
                  <div className="l">GITHUB · CODE</div>
                  <div className="v">github.com/mariapaulav03</div>
                </div>
                <div className="arr">↗</div>
              </a>
              <a className="channel-row" href="https://linkedin.com/in/maria-paula-vargas-10b7a0208">
                <div>
                  <div className="l">LINKEDIN · WORK</div>
                  <div className="v">linkedin.com/in/maria-paula-vargas</div>
                </div>
                <div className="arr">↗</div>
              </a>
              <a className="channel-row" href="#">
                <div>
                  <div className="l">READ.CV · CV</div>
                  <div className="v">read.cv/mariapaulav</div>
                </div>
                <div className="arr">↗</div>
              </a>
              <a className="channel-row" href="#">
                <div>
                  <div className="l">X &amp; BLUESKY</div>
                  <div className="v">@mariapaulav · everywhere</div>
                </div>
                <div className="arr">↗</div>
              </a>

              <div className="availability">
                <div className="h"><span className="led"></span> ACCEPTING WORK · Q3 2026</div>
                <p><b>Open to new engagements.</b> Looking for Angular/Firebase/microfrontend projects. Wrapping up my degree, so I'm upfront about available hours.</p>
              </div>
            </div>
          </div>
        </div>

        {/* COLOPHON */}
        <div className="colophon">
          <div className="grid">
            <div>
              <h4>PAULA LABS</h4>
              <div className="big">Frontend systems,<br/><span className="dot">·</span> written by hand.</div>
              <div style={{marginTop: 24, color:'var(--paper-dim)', fontFamily:'var(--f-sans)', fontSize:'14px', lineHeight:1.6, maxWidth:'42ch'}}>
                A field notebook of frontend craft. Maintained from Bogotá since 2021.
                Built around Angular, Firebase and microfrontends.
              </div>
            </div>
            <div>
              <h4>INDEX</h4>
              <ul>
                <li><a href="#entry">§01 — Field entry</a></li>
                <li><a href="#operator">§02 — Operator</a></li>
                <li><a href="#systems">§03 — Active systems</a></li>
                <li><a href="#stack">§04 — Current stack</a></li>
                <li><a href="#logbook">§05 — Logbook</a></li>
                <li><a href="#transmit">§06 — Transmission</a></li>
              </ul>
            </div>
            <div>
              <h4>COLOPHON</h4>
              <ul>
                <li>Set in Space Grotesk</li>
                <li>Display in Instrument Serif</li>
                <li>Labels in JetBrains Mono</li>
                <li>Hand-coded, no template</li>
                <li>Deployed on Firebase Hosting</li>
                <li>Last revised — May 2026</li>
              </ul>
            </div>
            <div>
              <h4>STATUS</h4>
              <ul>
                <li><span style={{color:'var(--green)'}}>● ALL SYSTEMS NOMINAL</span></li>
                <li>Build · #2026.05.14</li>
                <li>Uptime · 1,892 days</li>
                <li>Lighthouse · 99 / 100 / 100 / 100</li>
                <li>Cookies · zero, always</li>
              </ul>
            </div>
          </div>
          <div className="bottom">
            <span>© 2026 MARÍA PAULA VARGAS — ALL RIGHTS, NO TEMPLATES.</span>
            <span>HAND-CODED · BOGOTÁ · 4.7110° N / 74.0721° W</span>
            <span>END OF DOCUMENT — TURN PAGE TO RESTART</span>
          </div>
        </div>
      </div>
    </section>
  );
};

window.Transmission = Transmission;
