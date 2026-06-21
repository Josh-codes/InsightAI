import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'

/* ─── Intersection Observer hook for scroll reveal ─── */
function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } }, { threshold })
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

/* ─── Typewriter hook ─── */
const PROMPTS = [
  'Show me revenue trends by region…',
  'Compare Q1 vs Q2 sales performance…',
  'What are the top 10 products by profit?',
  'Create a dashboard for monthly KPIs…',
  'Predict next quarter revenue growth…',
]

function useTypewriter(speed = 60, pause = 2000) {
  const [text, setText] = useState('')
  const [promptIdx, setPromptIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = PROMPTS[promptIdx]
    let timer: ReturnType<typeof setTimeout>

    if (!deleting && charIdx < current.length) {
      timer = setTimeout(() => { setText(current.slice(0, charIdx + 1)); setCharIdx(c => c + 1) }, speed)
    } else if (!deleting && charIdx === current.length) {
      timer = setTimeout(() => setDeleting(true), pause)
    } else if (deleting && charIdx > 0) {
      timer = setTimeout(() => { setText(current.slice(0, charIdx - 1)); setCharIdx(c => c - 1) }, speed / 2)
    } else if (deleting && charIdx === 0) {
      setDeleting(false)
      setPromptIdx(i => (i + 1) % PROMPTS.length)
    }
    return () => clearTimeout(timer)
  }, [charIdx, deleting, promptIdx, speed, pause])

  return text
}

/* ─── SVG Icons ─── */
const ChartBarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
  </svg>
)
const SparklesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
  </svg>
)
const BoltIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
  </svg>
)
const TableCellsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M10.875 12c-.621 0-1.125.504-1.125 1.125M12 12c.621 0 1.125.504 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 0v1.5c0 .621-.504 1.125-1.125 1.125M12 15.375c0-.621.504-1.125 1.125-1.125" />
  </svg>
)
const CloudArrowUpIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
  </svg>
)
const ShareIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
  </svg>
)
const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
  </svg>
)
const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
  </svg>
)

/* ─── Mini CSS Chart Components ─── */
function MiniBarChart({ colors }: { colors: string[] }) {
  const heights = [40, 70, 55, 85, 60, 75, 50]
  return (
    <div className="flex items-end gap-1.5 h-20">
      {heights.map((h, i) => (
        <div key={i} className="w-3 rounded-sm transition-all duration-500" style={{ height: `${h}%`, background: colors[i % colors.length] }} />
      ))}
    </div>
  )
}

function MiniLineChart() {
  return (
    <svg viewBox="0 0 200 80" className="w-full h-20" fill="none">
      <defs>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E07A5F" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#E07A5F" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M0,60 Q25,55 40,45 T80,35 T120,25 T160,30 T200,15" stroke="#E07A5F" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M0,60 Q25,55 40,45 T80,35 T120,25 T160,30 T200,15 V80 H0 Z" fill="url(#lineGrad)" />
      {[{ x: 40, y: 45 }, { x: 80, y: 35 }, { x: 120, y: 25 }, { x: 160, y: 30 }, { x: 200, y: 15 }].map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="#E07A5F" stroke="#1E1B18" strokeWidth="1.5" />
      ))}
    </svg>
  )
}

function MiniPieChart() {
  return (
    <svg viewBox="0 0 80 80" className="w-16 h-16">
      <circle cx="40" cy="40" r="35" fill="none" stroke="#3A3530" strokeWidth="8" />
      <circle cx="40" cy="40" r="35" fill="none" stroke="#E07A5F" strokeWidth="8" strokeDasharray="110 110" strokeDashoffset="0" transform="rotate(-90 40 40)" />
      <circle cx="40" cy="40" r="35" fill="none" stroke="#E8937A" strokeWidth="8" strokeDasharray="55 165" strokeDashoffset="-110" transform="rotate(-90 40 40)" />
      <circle cx="40" cy="40" r="35" fill="none" stroke="#C96A50" strokeWidth="8" strokeDasharray="35 185" strokeDashoffset="-165" transform="rotate(-90 40 40)" />
    </svg>
  )
}

/* ─── Category pills ─── */
const CATEGORIES = ['Data Visualization', 'Data Preparation', 'Data Science', 'Dashboards', 'Real-time Data', 'Presentations']

/* ─── Dashboard preview cards ─── */
const DASHBOARD_CARDS = [
  { title: 'Executive', subtitle: 'Clean Corporate', gradient: 'from-blue-500/20 to-indigo-500/20', accent: '#6366f1' },
  { title: 'Terminal', subtitle: 'Maximum Density', gradient: 'from-emerald-500/20 to-teal-500/20', accent: '#10b981' },
  { title: 'Glass', subtitle: 'Premium Cinematic', gradient: 'from-violet-500/20 to-purple-500/20', accent: '#8b5cf6' },
  { title: 'Editorial', subtitle: 'Narrative Authority', gradient: 'from-amber-500/20 to-orange-500/20', accent: '#f59e0b' },
]

/* ─── Capabilities ─── */
const CAPABILITIES = [
  { icon: <SparklesIcon />, title: 'Natural Language Queries', desc: 'Ask questions in plain English and get instant, accurate answers from your data.' },
  { icon: <ChartBarIcon />, title: 'Automated Visualizations', desc: 'AI picks the best chart type and generates beautiful visuals automatically.' },
  { icon: <TableCellsIcon />, title: 'Data Cleaning & Prep', desc: 'Detect anomalies, fill gaps, and transform messy data in seconds.' },
  { icon: <BoltIcon />, title: 'Smart Dashboards', desc: 'Generate fully interactive dashboards with a single prompt.' },
  { icon: <CloudArrowUpIcon />, title: 'Real-time Data Sync', desc: 'Connect live data sources and keep your insights always up to date.' },
  { icon: <ShareIcon />, title: 'Export & Share', desc: 'Download charts as PNG, export reports to PDF, and share with your team.' },
]

/* ─── Main Landing Page ─── */
export default function LandingPage() {
  const typedText = useTypewriter()
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const heroRef = useReveal()
  const dashRef = useReveal()
  const howRef = useReveal()
  const capRef = useReveal()
  const demoRef = useReveal()
  const ctaRef = useReveal()

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMobileMenuOpen(false)
  }, [])

  return (
    <div className="min-h-screen bg-landing-bg font-inter text-warm-white overflow-x-hidden">

      {/* ════════════════════ 1. NAVBAR ════════════════════ */}
      <nav
        id="landing-navbar"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-landing-bg/90 backdrop-blur-lg shadow-lg shadow-black/20 border-b border-warm-border' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-xl font-bold tracking-tight text-warm-white hover:text-accent transition-colors">
            InsightAI
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollTo('features')} className="text-sm text-warm-muted hover:text-warm-white transition-colors">Features</button>
            <button onClick={() => scrollTo('how-it-works')} className="text-sm text-warm-muted hover:text-warm-white transition-colors">How It Works</button>
            <button onClick={() => scrollTo('capabilities')} className="text-sm text-warm-muted hover:text-warm-white transition-colors">Capabilities</button>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link to="/login" className="text-sm text-warm-muted hover:text-warm-white transition-colors px-4 py-2">
              Log In
            </Link>
            <Link
              id="nav-try-free"
              to="/register"
              className="text-sm font-semibold bg-accent hover:bg-accent-dark text-white px-5 py-2.5 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-accent/25"
            >
              Try Free
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(v => !v)}
            className="md:hidden text-warm-muted hover:text-warm-white p-2"
            aria-label="Toggle menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              {mobileMenuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-landing-bg/95 backdrop-blur-lg border-t border-warm-border px-6 py-4 space-y-3 animate-fade-in">
            <button onClick={() => scrollTo('features')} className="block w-full text-left text-sm text-warm-muted hover:text-warm-white">Features</button>
            <button onClick={() => scrollTo('how-it-works')} className="block w-full text-left text-sm text-warm-muted hover:text-warm-white">How It Works</button>
            <button onClick={() => scrollTo('capabilities')} className="block w-full text-left text-sm text-warm-muted hover:text-warm-white">Capabilities</button>
            <hr className="border-warm-border" />
            <Link to="/login" className="block text-sm text-warm-muted hover:text-warm-white">Log In</Link>
            <Link to="/register" className="block text-sm font-semibold text-accent hover:text-accent-dark">Try Free →</Link>
          </div>
        )}
      </nav>

      {/* ════════════════════ 2. HERO ════════════════════ */}
      <section className="pt-32 pb-20 px-6">
        <div ref={heroRef.ref} className={`max-w-4xl mx-auto text-center transition-all duration-700 ${heroRef.visible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] tracking-tight mb-6">
            The AI data analyst for{' '}
            <span className="block bg-gradient-to-r from-accent via-accent-light to-accent-dark bg-clip-text text-transparent italic">
              Your Business
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-warm-muted max-w-2xl mx-auto mb-10 leading-relaxed">
            Add your data, ask questions, generate insights, charts, spreadsheets, presentations &amp; more.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
            <Link
              id="hero-cta-primary"
              to="/register"
              className="group inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-white font-semibold px-8 py-4 rounded-full text-base transition-all duration-200 hover:shadow-xl hover:shadow-accent/30 hover:-translate-y-0.5"
            >
              Get started for free
              <ArrowRightIcon />
            </Link>
            <button
              id="hero-cta-secondary"
              onClick={() => scrollTo('how-it-works')}
              className="inline-flex items-center gap-2 border border-warm-border text-warm-white font-medium px-8 py-4 rounded-full text-base hover:bg-warm-border/30 transition-all duration-200"
            >
              See how it works
            </button>
          </div>
          {/* Animated prompt bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative bg-landing-card border border-warm-border rounded-2xl px-6 py-4 flex items-center gap-3 animate-pulse-glow">
              <span className="text-warm-muted text-base flex-1 text-left truncate">{typedText}<span className="inline-block w-0.5 h-5 bg-accent ml-0.5 animate-pulse align-middle" /></span>
              <button className="shrink-0 bg-accent/20 hover:bg-accent/30 text-accent rounded-xl p-2.5 transition-colors">
                <SendIcon />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ════════════════════ 3. DASHBOARD SHOWCASE ════════════════════ */}
      <section id="features" className="py-24 px-6">
        <div ref={dashRef.ref} className={`max-w-6xl mx-auto transition-all duration-700 ${dashRef.visible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <p className="text-sm font-semibold tracking-widest text-accent uppercase text-center mb-4">AI Dashboards</p>
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-4 tracking-tight">Build beautiful dashboards in seconds with AI</h2>
          <p className="text-warm-muted text-center max-w-2xl mx-auto mb-14 text-lg">
            Describe what you need and AI generates a fully interactive dashboard. Pick a template, customize every detail, and schedule automatic data refreshes.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {DASHBOARD_CARDS.map((card) => (
              <div key={card.title} className="group bg-landing-card border border-warm-border rounded-2xl overflow-hidden hover:border-accent/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20">
                <div className={`h-40 bg-gradient-to-br ${card.gradient} p-4 flex flex-col items-center justify-center gap-3`}>
                  <MiniBarChart colors={[card.accent, card.accent + '99', card.accent + '55']} />
                  <MiniPieChart />
                </div>
                <div className="p-4">
                  <p className="text-sm font-semibold" style={{ color: card.accent }}>{card.title}</p>
                  <p className="text-xs text-warm-muted">{card.subtitle}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-white font-semibold px-6 py-3 rounded-full text-sm transition-all duration-200 hover:shadow-lg hover:shadow-accent/25"
            >
              Learn More <ArrowRightIcon />
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════ 4. HOW IT WORKS ════════════════════ */}
      <section id="how-it-works" className="py-24 px-6">
        <div ref={howRef.ref} className={`max-w-5xl mx-auto transition-all duration-700 ${howRef.visible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <p className="text-sm font-semibold tracking-widest text-accent uppercase text-center mb-4">How It Works</p>
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-4 tracking-tight">
            From question to insight<br />in seconds.
          </h2>
          <p className="text-warm-muted text-center max-w-xl mx-auto mb-14 text-lg">
            Ask in plain English (or any language!). Get charts, tables, and answers instantly.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {/* Card 1: Add your data */}
            <div className="group relative bg-accent/80 rounded-3xl p-8 pt-10 overflow-hidden hover:bg-accent/90 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-12 translate-x-12" />
              <div className="relative z-10 flex flex-col items-center text-center h-full">
                <div className="bg-white/15 backdrop-blur rounded-2xl p-6 mb-6 shadow-lg">
                  {/* Upload illustration */}
                  <div className="w-24 h-24 relative">
                    <div className="absolute inset-0 bg-white/90 rounded-xl rotate-[-8deg] shadow" />
                    <div className="absolute inset-0 bg-white rounded-xl rotate-[4deg] shadow flex flex-col items-center justify-center gap-1">
                      <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                      </svg>
                      <span className="text-[10px] font-semibold text-landing-bg">Upload</span>
                    </div>
                    {/* Mini doc icons */}
                    <div className="absolute -top-2 -left-3 w-8 h-10 bg-white rounded shadow flex items-center justify-center">
                      <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" /></svg>
                    </div>
                    <div className="absolute -top-1 -right-3 w-8 h-10 bg-white rounded shadow flex items-center justify-center">
                      <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 6a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zm0 6a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" clipRule="evenodd" /></svg>
                    </div>
                  </div>
                </div>
                <div className="mt-auto">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-white">Add your data</h3>
                    <span className="text-white/50 text-sm font-medium">01</span>
                  </div>
                  <p className="text-white/80 text-sm leading-relaxed">
                    Upload, connect and combine your data across multiple data sources.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2: Create Stunning Charts */}
            <div className="group relative bg-accent/80 rounded-3xl p-8 pt-10 overflow-hidden hover:bg-accent/90 transition-all duration-300">
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-16 -translate-x-16" />
              <div className="relative z-10 flex flex-col items-center text-center h-full">
                <div className="w-full max-w-xs bg-white/15 backdrop-blur rounded-2xl p-5 mb-6 shadow-lg">
                  {/* Chat bubble */}
                  <div className="flex items-center gap-2 mb-4 justify-end">
                    <div className="bg-white rounded-xl px-4 py-2 text-sm text-landing-bg font-medium shadow">
                      How were daily sales last week?
                    </div>
                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-xs font-bold shrink-0">AI</div>
                  </div>
                  {/* Mini chart */}
                  <div className="bg-white rounded-xl p-4 shadow">
                    <p className="text-xs font-bold text-landing-bg mb-2">Sales Performance</p>
                    <MiniLineChart />
                  </div>
                </div>
                <div className="mt-auto">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-white">Create Stunning Charts</h3>
                    <span className="text-white/50 text-sm font-medium">02</span>
                  </div>
                  <p className="text-white/80 text-sm leading-relaxed">
                    Create beautiful Charts. Convert your data into clear visuals to display your insights.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Steps 3 & 4 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-landing-card border border-warm-border rounded-2xl p-8 hover:border-accent/30 transition-all duration-300 group">
              <div className="flex items-start gap-4">
                <div className="bg-accent/15 rounded-xl p-3 text-accent shrink-0 group-hover:bg-accent/25 transition-colors">
                  <BoltIcon />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold">Get Instant Insights</h3>
                    <span className="text-warm-muted/50 text-sm font-medium">03</span>
                  </div>
                  <p className="text-warm-muted text-sm leading-relaxed">
                    AI analyzes patterns, detects trends, and surfaces key takeaways from your data automatically.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-landing-card border border-warm-border rounded-2xl p-8 hover:border-accent/30 transition-all duration-300 group">
              <div className="flex items-start gap-4">
                <div className="bg-accent/15 rounded-xl p-3 text-accent shrink-0 group-hover:bg-accent/25 transition-colors">
                  <ShareIcon />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold">Share & Collaborate</h3>
                    <span className="text-warm-muted/50 text-sm font-medium">04</span>
                  </div>
                  <p className="text-warm-muted text-sm leading-relaxed">
                    Export reports, share dashboards with your team, and keep everyone aligned with live data.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════ 5. PLATFORM CAPABILITIES ════════════════════ */}
      <section id="capabilities" className="py-24 px-6">
        <div ref={capRef.ref} className={`max-w-6xl mx-auto transition-all duration-700 ${capRef.visible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <p className="text-sm font-semibold tracking-widest text-accent uppercase text-center mb-4">Platform Capabilities</p>
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-4 tracking-tight">A snapshot of the platform's key functions</h2>
          <p className="text-warm-muted text-center max-w-2xl mx-auto mb-14 text-lg">
            Everything you need to analyze, visualize, and automate your data workflows.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CAPABILITIES.map((cap) => (
              <div
                key={cap.title}
                className="group bg-landing-card border border-warm-border rounded-2xl p-7 hover:border-accent/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20 transition-all duration-300"
              >
                <div className="bg-accent/10 rounded-xl p-3 w-fit text-accent mb-5 group-hover:bg-accent/20 transition-colors">
                  {cap.icon}
                </div>
                <h3 className="text-lg font-bold mb-2">{cap.title}</h3>
                <p className="text-warm-muted text-sm leading-relaxed">{cap.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════ 6. PRODUCT DEMO PREVIEW ════════════════════ */}
      <section className="py-24 px-6">
        <div ref={demoRef.ref} className={`max-w-6xl mx-auto transition-all duration-700 ${demoRef.visible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <p className="text-sm font-semibold tracking-widest text-accent uppercase text-center mb-4">See It In Action</p>
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-14 tracking-tight">
            Your data, visualized instantly
          </h2>

          <div className="bg-landing-card border border-warm-border rounded-3xl overflow-hidden shadow-2xl shadow-black/30">
            {/* Top bar */}
            <div className="bg-landing-bg border-b border-warm-border px-6 py-3 flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-400/60" />
                <div className="w-3 h-3 rounded-full bg-green-400/60" />
              </div>
              <div className="flex-1 max-w-lg mx-auto">
                <div className="bg-landing-pill rounded-lg px-4 py-1.5 text-sm text-warm-muted text-center">
                  Create a chart of monthly revenue →
                </div>
              </div>
            </div>

            {/* Toolbar */}
            <div className="border-b border-warm-border px-6 py-3 flex items-center gap-4 overflow-x-auto">
              {CATEGORIES.map((cat, i) => (
                <span key={cat} className={`text-xs whitespace-nowrap px-3 py-1.5 rounded-lg transition-colors ${i === 0 ? 'bg-accent/15 text-accent font-medium' : 'text-warm-muted hover:text-warm-white'}`}>
                  {cat}
                </span>
              ))}
            </div>

            {/* Content area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[360px]">
              {/* Left: Data table */}
              <div className="border-r border-warm-border p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs bg-accent/15 text-accent font-medium px-2.5 py-1 rounded">Coffee Sales Data</span>
                  <span className="text-xs text-warm-muted">8,045 rows</span>
                </div>
                <div className="overflow-hidden rounded-lg border border-warm-border">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-landing-pill/50 text-warm-muted">
                        {['Region', 'Product', 'Sales', 'Profit', 'Date'].map(h => (
                          <th key={h} className="px-3 py-2 text-left font-medium">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ['East', 'Espresso', '$1,234', '$456', 'Jan 2026'],
                        ['West', 'Latte', '$2,891', '$823', 'Jan 2026'],
                        ['North', 'Cappuccino', '$1,567', '$612', 'Feb 2026'],
                        ['South', 'Mocha', '$3,210', '$987', 'Feb 2026'],
                        ['East', 'Americano', '$890', '$234', 'Mar 2026'],
                        ['West', 'Cold Brew', '$2,145', '$756', 'Mar 2026'],
                        ['North', 'Espresso', '$1,678', '$543', 'Apr 2026'],
                      ].map((row, i) => (
                        <tr key={i} className="border-t border-warm-border/50 hover:bg-landing-pill/30 transition-colors">
                          {row.map((cell, j) => (
                            <td key={j} className="px-3 py-2 text-warm-muted">{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right: Chart */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-warm-muted font-medium">Sales Performance by Region</span>
                  <div className="flex gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-accent/15 text-accent">Preview</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-landing-pill text-warm-muted">Download</span>
                  </div>
                </div>

                {/* Scatter-ish chart */}
                <div className="bg-landing-bg rounded-xl p-4 border border-warm-border h-[250px] relative overflow-hidden">
                  <svg viewBox="0 0 400 200" className="w-full h-full" fill="none">
                    {/* Grid */}
                    {[0, 50, 100, 150, 200].map(y => (
                      <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="#3D3832" strokeWidth="0.5" />
                    ))}
                    {/* Scatter dots with colors */}
                    {[
                      { x: 30, y: 140, c: '#E07A5F', r: 5 }, { x: 60, y: 120, c: '#E07A5F', r: 7 },
                      { x: 90, y: 100, c: '#6366f1', r: 4 }, { x: 110, y: 80, c: '#6366f1', r: 6 },
                      { x: 140, y: 130, c: '#10b981', r: 5 }, { x: 170, y: 90, c: '#10b981', r: 8 },
                      { x: 200, y: 60, c: '#f59e0b', r: 6 }, { x: 230, y: 110, c: '#E07A5F', r: 4 },
                      { x: 250, y: 50, c: '#8b5cf6', r: 7 }, { x: 280, y: 70, c: '#6366f1', r: 5 },
                      { x: 310, y: 40, c: '#10b981', r: 6 }, { x: 340, y: 95, c: '#f59e0b', r: 8 },
                      { x: 370, y: 30, c: '#8b5cf6', r: 5 }, { x: 50, y: 160, c: '#f59e0b', r: 4 },
                      { x: 150, y: 55, c: '#8b5cf6', r: 6 }, { x: 220, y: 145, c: '#E07A5F', r: 5 },
                      { x: 290, y: 85, c: '#10b981', r: 4 }, { x: 360, y: 65, c: '#6366f1', r: 7 },
                      { x: 75, y: 170, c: '#E07A5F', r: 3 }, { x: 185, y: 75, c: '#8b5cf6', r: 5 },
                    ].map((d, i) => (
                      <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={d.c} opacity="0.75" className="transition-all duration-500 hover:opacity-100" style={{ animationDelay: `${i * 0.05}s` }} />
                    ))}
                    {/* Trend line */}
                    <path d="M20,160 Q100,120 200,80 T380,30" stroke="#E07A5F" strokeWidth="2" strokeDasharray="4 3" opacity="0.5" />
                  </svg>
                </div>

                {/* Bottom action chips */}
                <div className="flex gap-2 mt-4 flex-wrap">
                  {['Refine chart', 'Add to dashboard', 'Export as PNG', 'Share with team'].map(a => (
                    <span key={a} className="text-[10px] px-3 py-1.5 rounded-full border border-warm-border text-warm-muted hover:text-warm-white hover:border-accent/30 cursor-pointer transition-colors">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom prompt bar */}
            <div className="border-t border-warm-border px-6 py-4">
              <div className="bg-landing-bg border border-warm-border rounded-xl px-4 py-3 flex items-center gap-3 max-w-2xl mx-auto">
                <span className="text-sm text-warm-muted flex-1">How can we help you today?</span>
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white shrink-0">
                  <SendIcon />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════ 7. CTA + FOOTER ════════════════════ */}
      <section className="py-24 px-6">
        <div ref={ctaRef.ref} className={`max-w-4xl mx-auto text-center transition-all duration-700 ${ctaRef.visible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <div className="bg-gradient-to-br from-accent/10 via-landing-card to-landing-card border border-warm-border rounded-3xl p-12 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full -translate-y-32 translate-x-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/5 rounded-full translate-y-24 -translate-x-24" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
                Ready to unlock your<br />data's potential?
              </h2>
              <p className="text-warm-muted text-lg mb-10 max-w-lg mx-auto">
                Join thousands of teams using InsightAI to make smarter, faster, data-driven decisions.
              </p>
              <Link
                id="footer-cta"
                to="/register"
                className="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-white font-semibold px-10 py-4 rounded-full text-lg transition-all duration-200 hover:shadow-xl hover:shadow-accent/30 hover:-translate-y-0.5"
              >
                Get Started Free <ArrowRightIcon />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-warm-border py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <h3 className="text-lg font-bold mb-3">InsightAI</h3>
              <p className="text-warm-muted text-sm leading-relaxed">The AI-powered data analyst for modern teams.</p>
            </div>
            {/* Links */}
            {[
              { title: 'Product', links: ['Features', 'Dashboards', 'Integrations', 'Pricing'] },
              { title: 'Company', links: ['About', 'Careers', 'Blog', 'Press'] },
              { title: 'Resources', links: ['Documentation', 'API Reference', 'Tutorials', 'Community'] },
              { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR'] },
            ].map(col => (
              <div key={col.title}>
                <h4 className="text-sm font-semibold mb-4 text-warm-white">{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.links.map(link => (
                    <li key={link}>
                      <a href="#" className="text-sm text-warm-muted hover:text-warm-white transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-warm-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-warm-muted">© 2026 InsightAI. All rights reserved.</p>
            <div className="flex items-center gap-6">
              {/* Social icons */}
              {['Twitter', 'GitHub', 'LinkedIn'].map(s => (
                <a key={s} href="#" className="text-sm text-warm-muted hover:text-warm-white transition-colors">{s}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
