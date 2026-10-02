import { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, ArrowRight, ArrowUpRight, Check, ChevronRight, Globe2, Menu, ShieldCheck, Sparkles, X, Zap } from 'lucide-react';

const ease = [0.22, 1, 0.36, 1];

function CountUp({ value, suffix = '', prefix = '', decimals = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    if (!isInView) return undefined;
    const controls = animate(0, value, {
      duration: 1.8,
      ease,
      onUpdate: (latest) => setDisplay(latest.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })),
    });
    return () => controls.stop();
  }, [isInView, value]);

  return <span ref={ref}>{prefix}{display}{suffix}</span>;
}

function Brand({ light = false }) {
  return (
    <a className={`brand${light ? ' brand-light' : ''}`} href="#top" aria-label="NeoBank home">
      <span className="brand-mark"><span /><span /><span /></span>
      <span>neo<span className="brand-light-text">bank</span></span>
    </a>
  );
}

function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState({ status: 'idle', message: '' });

  async function handleSubmit(event) {
    event.preventDefault();
    setState({ status: 'loading', message: '' });
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Something went wrong. Please try again.');
      setState({ status: 'success', message: result.message });
      setEmail('');
    } catch (error) {
      setState({ status: 'error', message: error.message || 'Could not reach the server. Please try again.' });
    }
  }

  return (
    <form className="waitlist-form" onSubmit={handleSubmit}>
      <label className="visually-hidden" htmlFor="waitlist-email">Email address</label>
      <input
        id="waitlist-email"
        type="email"
        autoComplete="email"
        placeholder="Your email address"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
        maxLength={254}
        disabled={state.status === 'loading'}
      />
      <button className="button button-blue" type="submit" disabled={state.status === 'loading'}>
        {state.status === 'loading' ? 'Joining...' : <>Get early access <ArrowRight size={17} /></>}
      </button>
      <p className={`form-message${state.status === 'error' ? ' form-error' : ''}`} aria-live="polite">
        {state.message || 'No spam. Just your invite when it’s ready.'}
      </p>
    </form>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const blobY = useTransform(scrollYProgress, [0, 0.7], [0, -190]);
  const cardY = useTransform(scrollYProgress, [0, 0.3], [0, 100]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <main id="top">
      <header className="site-header">
        <div className="nav-shell">
          <Brand />
          <button className="mobile-menu-toggle" type="button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <nav className={menuOpen ? 'main-nav nav-open' : 'main-nav'} aria-label="Main navigation">
            <a href="#features" onClick={closeMenu}>Features</a>
            <a href="#pricing" onClick={closeMenu}>Pricing</a>
            <a href="#stories" onClick={closeMenu}>Our people</a>
            <a className="nav-cta" href="#waitlist" onClick={closeMenu}>Get early access <ArrowUpRight size={15} /></a>
          </nav>
        </div>
      </header>

      <section className="hero" aria-labelledby="hero-title">
        <motion.div className="hero-glow glow-one" style={{ y: blobY }} />
        <motion.div className="hero-glow glow-two" style={{ y: cardY }} />
        <div className="hero-grid">
          <motion.div
            className="hero-copy"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
          >
            <div className="eyebrow eyebrow-light"><span className="eyebrow-dot" /> THE BANK THAT GETS YOU</div>
            <h1 id="hero-title">Money, minus<br />the <span>runaround.</span></h1>
            <p className="hero-lede">Your whole financial life, finally on the same page. Spend smarter, save on autopilot, and get on with everything else.</p>
            <div className="hero-actions">
              <a className="button button-blue" href="#waitlist">Get early access <ArrowRight size={17} /></a>
              <a className="text-link text-link-light" href="#features"><span className="play-icon"><ArrowDown size={15} /></span> See what’s inside</a>
            </div>
            <div className="hero-proof"><div className="avatar-stack"><span>JM</span><span>AL</span><span>RK</span><span>+</span></div><span><strong>12,400+</strong> already on the list</span></div>
          </motion.div>

          <motion.div className="hero-visual" style={{ y: cardY }}>
            <motion.div
              className="orbit orbit-large"
              animate={{ rotate: 360 }}
              transition={{ duration: 42, ease: 'linear', repeat: Infinity }}
            />
            <motion.div
              className="account-card"
              initial={{ opacity: 0, y: 35, rotate: 4 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ duration: 1, delay: 0.25, ease }}
            >
              <div className="card-topline"><span className="card-chip"><span /><span /><span /><span /></span><span className="contactless">)))</span></div>
              <div className="card-balance-label">TOTAL BALANCE <span className="balance-eye">◉</span></div>
              <div className="card-balance">$24,680<span>.50</span></div>
              <div className="card-chart" aria-label="Balance trend rising"><svg viewBox="0 0 420 84" preserveAspectRatio="none"><defs><linearGradient id="chart-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#00d4ff" stopOpacity=".33" /><stop offset="1" stopColor="#00d4ff" stopOpacity="0" /></linearGradient></defs><path className="chart-area" d="M0 70 C30 68 32 55 61 58 S103 37 129 47 S165 58 193 37 S228 43 252 29 S290 47 318 22 S354 38 378 12 S405 19 420 4 V84 H0Z" /><path className="chart-line" d="M0 70 C30 68 32 55 61 58 S103 37 129 47 S165 58 193 37 S228 43 252 29 S290 47 318 22 S354 38 378 12 S405 19 420 4" /></svg></div>
              <div className="card-footer"><span>•••• &nbsp; 4829</span><span>VISA <i>••</i></span></div>
            </motion.div>
            <motion.div className="mini-card mini-spend" animate={{ y: [0, -9, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>
              <span className="mini-icon"><ArrowUpRight size={16} /></span><span className="mini-caption">You saved</span><strong>$248.60</strong><span className="mini-note">this month <i>↗ 18%</i></span>
            </motion.div>
            <motion.div className="mini-card mini-transfer" animate={{ y: [0, 8, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}>
              <span className="transfer-mark">M</span><span><strong>Payment received</strong><small>From Maya · just now</small></span><b>+$320</b>
            </motion.div>
            <div className="visual-caption"><span className="caption-line" /> BUILT AROUND YOUR LIFE</div>
          </motion.div>
        </div>
        <div className="hero-bottom"><span>01 / A BETTER WAY TO BANK</span><span>SCROLL TO EXPLORE <ArrowDown size={13} /></span></div>
      </section>

      <section className="trust-strip" aria-label="NeoBank highlights">
        <p>GOOD MONEY ENERGY, FROM DAY ONE</p>
        <div className="trust-stats"><span><strong><CountUp value={0} suffix="$ fees" /></strong><small>on your everyday account</small></span><i /><span><strong><CountUp value={4.25} suffix="%" decimals={2} /></strong><small>interest on your savings</small></span><i /><span><strong><CountUp value={150} suffix="+" /></strong><small>countries, one card</small></span></div>
      </section>

      <section className="features section-pad" id="features">
        <div className="section-head">
          <div><div className="eyebrow"><span className="eyebrow-dot" /> THE LITTLE THINGS, SORTED</div><h2>One app. A lot<br />less <span>“where did it go?”</span></h2></div>
          <p className="section-intro">The everyday stuff should feel effortless. We brought your money into one beautifully useful place.</p>
        </div>
        <div className="feature-grid">
          <article className="feature-card feature-spending">
            <div className="feature-copy"><span className="feature-icon"><Sparkles size={19} /></span><h3>Know your money.<br />Without the math.</h3><p>Clear, real-time spending insights that make sense at a glance. No spreadsheets. No surprises.</p><a href="#waitlist" className="feature-link">Explore insights <ChevronRight size={16} /></a></div>
            <div className="spending-widget"><div className="widget-top"><span>Monthly spending</span><span className="widget-period">APR <ChevronRight size={12} /></span></div><div className="widget-amount">$2,840<span>.18</span></div><div className="widget-sub"><span className="positive-pill">↓ 12.4%</span> vs. last month</div><div className="bar-chart" aria-hidden="true"><i style={{ height: '32%' }} /><i style={{ height: '47%' }} /><i style={{ height: '39%' }} /><i style={{ height: '68%' }} /><i style={{ height: '54%' }} /><i style={{ height: '82%' }} /><i style={{ height: '62%' }} /><i style={{ height: '91%' }} /><i style={{ height: '73%' }} /><i style={{ height: '100%' }} /><i style={{ height: '64%' }} /><i style={{ height: '46%' }} /></div><div className="chart-labels"><span>JAN</span><span>JUN</span><span>DEC</span></div></div>
          </article>
          <article className="feature-card feature-global"><div className="feature-copy"><span className="feature-icon"><Globe2 size={19} /></span><h3>Goodbye, “foreign transaction fee.”</h3><p>Tap to pay in 150+ countries. The exchange rate is the real one. Imagine that.</p><a href="#waitlist" className="feature-link">Go places <ChevronRight size={16} /></a></div><div className="globe-visual" aria-hidden="true"><div className="globe-ring ring-a" /><div className="globe-ring ring-b" /><div className="globe-core"><span className="globe-dot dot-a" /><span className="globe-dot dot-b" /><span className="globe-dot dot-c" /><span className="globe-dot dot-d" /></div><span className="map-tag tag-london">LONDON <i>£</i></span><span className="map-tag tag-tokyo">TOKYO <i>¥</i></span><span className="map-tag tag-ny">NEW YORK <i>$</i></span></div></article>
          <article className="feature-card feature-save"><div className="feature-copy"><span className="feature-icon"><Zap size={19} /></span><h3>Saving that just… happens.</h3><p>Set a goal, round up spare change, and watch the little wins add up.</p><a href="#waitlist" className="feature-link">Meet your goals <ChevronRight size={16} /></a></div><div className="save-widget"><div className="save-widget-top"><span className="save-icon"><ArrowUpRight size={16} /></span><span className="save-change">+8.4%</span></div><div className="save-label">NEXT ADVENTURE</div><strong>$3,240<span> / $5,000</span></strong><div className="progress-track"><i /></div><div className="save-footer"><span>Almost there</span><span>65% saved</span></div><div className="coin coin-one">¢</div><div className="coin coin-two">¢</div></div></article>
          <article className="feature-card feature-secure"><span className="security-halo"><ShieldCheck size={36} strokeWidth={1.5} /></span><div><h3>Big-bank security.<br />Small-bank nonsense? Never.</h3><p>FDIC insured up to $250,000. Your data stays yours. Always.</p></div><a href="#waitlist" className="feature-link">Security, explained <ChevronRight size={16} /></a><span className="secure-stamp">256-BIT<br />ENCRYPTION</span></article>
        </div>
      </section>

      <section className="manifesto">
        <div className="manifesto-inner"><div className="manifesto-mark">“</div><p>We think your bank should be the least stressful thing in your life.</p><span>SO WE MADE ONE THAT IS.</span></div>
        <div className="manifesto-side">NEOBANK / EST. FOR WHAT’S NEXT</div>
      </section>

      <section className="pricing section-pad" id="pricing">
        <div className="section-head pricing-head"><div><div className="eyebrow"><span className="eyebrow-dot" /> STRAIGHT-UP PRICING</div><h2>Simple enough<br />to <span>actually read.</span></h2></div><p className="section-intro">No gotchas tucked into page 47. Start free. Upgrade only if it makes sense for you.</p></div>
        <div className="pricing-grid">
          <article className="price-card"><div className="price-card-head"><span className="plan-name">THE EVERYDAY</span><span className="plan-mark">01</span></div><div className="price">$0<span> / forever</span></div><p className="plan-desc">Everything you need to make your money feel easier.</p><a className="button button-outline" href="#waitlist">Get the basics <ArrowRight size={16} /></a><div className="plan-divider" /><ul><li><Check size={16} /> No-fee checking account</li><li><Check size={16} /> 4.25% APY savings</li><li><Check size={16} /> Virtual + physical debit card</li><li><Check size={16} /> Smart spending insights</li><li><Check size={16} /> 150+ countries, no FX fees</li></ul></article>
          <article className="price-card price-featured"><div className="popular-tag"><Sparkles size={12} /> A LITTLE EXTRA</div><div className="price-card-head"><span className="plan-name">THE PLUS SIDE</span><span className="plan-mark">02</span></div><div className="price">$8<span> / month</span></div><p className="plan-desc">For the ones who want a bit more out of their money.</p><a className="button button-blue" href="#waitlist">Try Plus free <ArrowRight size={16} /></a><div className="plan-divider" /><ul><li><Check size={16} /> Everything in Everyday</li><li><Check size={16} /> 5.00% APY on savings</li><li><Check size={16} /> 3x ATM fee reimbursements</li><li><Check size={16} /> Travel protection + lounge passes</li><li><Check size={16} /> One-tap subscription manager</li></ul></article>
        </div>
        <p className="pricing-note">NeoBank is a financial technology company, not a bank. Banking services provided by partner banks, Members FDIC.</p>
      </section>

      <section className="stories section-pad" id="stories">
        <div className="stories-top"><div><div className="eyebrow"><span className="eyebrow-dot" /> WORD ON THE STREET</div><h2>Less bank stress.<br /><span>More “oh, nice.”</span></h2></div><div className="story-count">001 — 003 <span>✳</span> REAL PEOPLE, REAL TALK</div></div>
        <div className="testimonial-grid">
          <article className="quote-card quote-blue"><div className="quote-stars">★★★★★</div><blockquote>“I finally know where my money goes. Turns out it wasn’t ‘just disappearing.’ Who knew.”</blockquote><div className="quote-person"><span className="quote-avatar avatar-j">J</span><span><strong>Jamie M.</strong><small>NeoBank member since 2024</small></span><ArrowUpRight size={17} /></div><span className="quote-index">01</span></article>
          <article className="quote-card quote-white"><div className="quote-stars">★★★★★</div><blockquote>“Switched my savings over in the time it took to make coffee. And the app actually makes me want to check my balance?”</blockquote><div className="quote-person"><span className="quote-avatar avatar-a">A</span><span><strong>Alex R.</strong><small>NeoBank member since 2023</small></span><ArrowUpRight size={17} /></div><span className="quote-index">02</span></article>
          <article className="quote-card quote-white"><div className="quote-stars">★★★★★</div><blockquote>“No fees on my last trip abroad. I checked three times because I didn’t believe it. I believe it now.”</blockquote><div className="quote-person"><span className="quote-avatar avatar-k">K</span><span><strong>Kim L.</strong><small>NeoBank member since 2024</small></span><ArrowUpRight size={17} /></div><span className="quote-index">03</span></article>
        </div>
      </section>

      <section className="waitlist" id="waitlist">
        <div className="waitlist-orbit orbit-waitlist" />
        <div className="waitlist-content"><div className="eyebrow eyebrow-light"><span className="eyebrow-dot" /> YOUR MONEY ERA STARTS HERE</div><h2>Good things<br />are <span>in the balance.</span></h2><p>We’re opening the doors soon. Get on the list and we’ll save you a spot up front.</p><WaitlistForm /><div className="waitlist-footnote"><ShieldCheck size={15} /> Your inbox is safe with us. Pinky promise.</div></div>
        <div className="waitlist-side-note">A BETTER BANKING DAY IS CLOSER THAN YOU THINK <span>↗</span></div>
      </section>

      <footer className="site-footer">
        <div className="footer-main"><div className="footer-brand-block"><Brand light /><p>Money should work for you.<br />Finally, one that does.</p></div><div className="footer-links"><div><span>THE GOOD STUFF</span><a href="#features">Features</a><a href="#pricing">Pricing</a><a href="#stories">Our people</a></div><div><span>THE FINE PRINT</span><a href="#waitlist">Privacy</a><a href="#waitlist">Terms of use</a><a href="#waitlist">Contact</a></div></div><a className="back-top" href="#top" aria-label="Back to top"><ArrowUpRight size={19} /></a></div>
        <div className="footer-bottom"><span>© 2025 NEOBANK FINANCIAL, INC.</span><span>MADE FOR REAL LIFE <i>✳</i></span><span>MEMBER FDIC THROUGH PARTNER BANKS</span></div>
      </footer>
    </main>
  );
}

export default App;