import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Beaker, CircuitBoard, FlaskConical, Cpu, Menu, X as CloseIcon, Send } from "lucide-react";

// LucidLab — Monochrome Tech Lab Landing (fixed)
// - Sticky corner beam that reveals a grid only where it hits
// - Echo, dust, bloom-on-contact, kinetic underlines, progress bar, ASCII mode, prism
// - Syntax fix: all CSS now lives INSIDE the <style>{` ... `}</style> template literal
// - Lightweight runtime tests available via window.runLucidLabTests()

const XLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M3 3h4.9l4.8 6.4L17.6 3H21l-7.4 9.5L21 21h-4.9l-5.3-6.9L6.4 21H3l7.6-9.5L3 3z" />
  </svg>
);

export default function LucidLab() {
  const rootRef = useRef<HTMLDivElement>(null);
  ;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close mobile menu when clicking outside or on navigation
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('header')) {
        setMobileMenuOpen(false);
      }
    };

    // Add a small delay to prevent immediate closing
    const timer = setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  // Parallax scroll effect for mobile
  useEffect(() => {
    if (!isMobile) return;

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile]);

  // Close modal on ESC key & prevent body scroll
  useEffect(() => {
    if (!selectedProject) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedProject(null);
    };

    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [selectedProject]);

  useEffect(() => {
    const root = rootRef.current; if (!root) return;

    // Skip expensive effects on mobile
    if (isMobile) {
      // Only add classes immediately without observer
      const elements = Array.from(root.querySelectorAll<HTMLElement>('.observed, .card, .scan'));
      elements.forEach(el => el.classList.add('lit', 'scanned'));
      return;
    }

    // Intersection: light contact + heading underline
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          (e.target as HTMLElement).classList.add('lit', 'scanned');
        }
      });
    }, {
      rootMargin: '0px 0px -5% 0px', // Less aggressive margin for mobile
      threshold: [0, 0.1] // Lower threshold so things appear earlier
    });
    const observed = Array.from(root.querySelectorAll<HTMLElement>('.observed, .card, .scan'));
    observed.forEach(el => io.observe(el));

    // Scroll progress synced with beam direction (skip on mobile)
    let onScroll: (() => void) | null = null;
    if (!isMobile) {
      onScroll = () => {
        const h = document.documentElement;
        const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight);
        const pct = Math.max(0, Math.min(1, scrolled)) * 100;
        h.style.setProperty('--progress', String(pct));

      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    // ASCII raster toggle (under beam only)
    const onKey = (e: KeyboardEvent) => { if (e.key.toLowerCase() === 'm') root.classList.toggle('ascii'); };
    window.addEventListener('keydown', onKey);

    // Micro-click sound via WebAudio (skip on mobile)
    let clickTargets: Element[] = [];
    const touchClick = () => {
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const o = ctx.createOscillator(); const g = ctx.createGain();
        o.type = 'square'; o.frequency.value = 2400; o.connect(g); g.connect(ctx.destination);
        const now = ctx.currentTime; g.gain.setValueAtTime(0.02, now); g.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
        o.start(); o.stop(now + 0.08);
      } catch { }
    };
    if (!isMobile) {
      clickTargets = Array.from(root.querySelectorAll('a, button, input, textarea'));
      clickTargets.forEach(el => el.addEventListener('click', touchClick));
    }

    // Expose lightweight runtime tests
    (window as any).runLucidLabTests = () => {
      const errs: string[] = [];
      if (!root.querySelector('.beam')) errs.push('Missing .beam');
      if (!root.querySelector('.grid-reveal')) errs.push('Missing .grid-reveal');
      if (!root.querySelector('#shimmer')) errs.push('Missing #shimmer filter');
      if (!root.querySelector('.progress')) errs.push('Missing .progress');
      const h1 = root.querySelector('h1');
      if (!h1 || !h1.className.includes('scan')) errs.push('Heading missing .scan');
      return errs.length ? errs : ['OK'];
    };

    return () => {
      if (onScroll) window.removeEventListener('scroll', onScroll);
      window.removeEventListener('keydown', onKey);
      if (clickTargets.length > 0) {
        clickTargets.forEach(el => el.removeEventListener('click', touchClick));
      }
      io.disconnect();
    };
  }, [isMobile]);

  const features = [
    { title: "On-Chain Gaming", icon: <CircuitBoard className="size-5" />, desc: "Interactive pixel canvas where every action is a transaction on Hathor Network—collaborative art meets blockchain.", projectId: "p1" },
    { title: "Provably Fair Lottery", icon: <FlaskConical className="size-5" />, desc: "Transparent lottery system with verifiable randomness and automated prize distribution on Hathor.", projectId: "p2" },
    { title: "DAO Governance", icon: <Cpu className="size-5" />, desc: "Token-weighted voting mechanisms for decentralized decision making with on-chain proposal tracking.", projectId: "p3" },
    { title: "Smart Contract Stack", icon: <Beaker className="size-5" />, desc: "Building on Hathor's DAG architecture with secure patterns and auditable logic for all our dApps.", projectId: null },
  ];

  const projects = [
    {
      k: "p1",
      symbol: "Pc",
      atomicNumber: 1,
      name: "Pixel Canvas",
      tag: "In Development",
      nets: ["HATHOR"],
      blurb: "Collaborative pixel art game inspired by the Million Dollar Homepage. Each pixel placement is a permanent transaction on Hathor.",
      status: "building",
      description: "A decentralized collaborative canvas where every pixel is a permanent transaction on the Hathor blockchain. Create art, claim space, and be part of blockchain history.",
      features: [
        "Each pixel placement is recorded on-chain",
        "Permanent, immutable artwork",
        "Community-driven collaborative creation",
        "Transparent ownership and history"
      ],
      tech: ["Hathor Smart Contracts", "React", "Canvas API", "Web3 Integration"],
      position: { row: 1, col: 1 }
    },
    {
      k: "p2",
      symbol: "Lt",
      atomicNumber: 2,
      name: "HTR Lottery",
      tag: "Planned",
      nets: ["HATHOR"],
      blurb: "Provably fair lottery with transparent draws, verifiable randomness, and automatic prize distribution on-chain.",
      status: "planned",
      description: "A fully transparent lottery system built on Hathor with verifiable randomness and automated prize distribution. Every draw is auditable and provably fair.",
      features: [
        "Provably fair random number generation",
        "Transparent on-chain draws",
        "Automatic prize distribution",
        "Auditable history of all draws"
      ],
      tech: ["Hathor Network", "VRF (Verifiable Random Function)", "Smart Contracts", "TypeScript"],
      position: { row: 1, col: 18 }
    },
    {
      k: "p3",
      symbol: "Dv",
      atomicNumber: 3,
      name: "DAO Voting",
      tag: "Planned",
      nets: ["HATHOR"],
      blurb: "Decentralized governance platform with token-weighted voting, proposal creation, and on-chain execution.",
      status: "planned",
      description: "A complete DAO governance platform enabling decentralized decision-making with token-weighted voting, proposal management, and on-chain execution.",
      features: [
        "Token-weighted voting mechanism",
        "Proposal creation and management",
        "On-chain execution of passed proposals",
        "Transparent voting history"
      ],
      tech: ["Hathor DAO Framework", "Smart Contracts", "Governance Tokens", "React Dashboard"],
      position: { row: 2, col: 13 }
    }
  ];

  return (
    <div ref={rootRef} className="relative min-h-screen bg-black text-white antialiased overflow-x-hidden" style={{ backgroundColor: '#000' }}>
      {/* Global styles for beam + spotlight */}
      <style>{`
        :root {
          /* Sticky light position (no cursor tracking) */
          --mx: 12vw; /* fixed x for spotlight/reactive gradients */
          --my: 10vh; /* fixed y for spotlight/reactive gradients */
          --nx: .2;   /* fixed normalized values for subtle beam skew */
          --ny: .2;
          /* Beam & grid variables */
          --beam-conic: conic-gradient(from 0.25turn at 0 0,
              rgba(255,255,255,.45),
              rgba(255,255,255,.10) 10%,
              rgba(255,255,255,0) 16%);
          --beam-radial-mask: radial-gradient(200vmax 200vmax at 0 0, #000 20%, transparent 42%);
          --grid-size: 20px 20px;
          --grid-pattern: linear-gradient(transparent 95%, #fff 96%), linear-gradient(90deg, transparent 95%, #fff 96%);
        }
        /* Corner beam: fixed from top-left */
        .beam {
          position: fixed;
          inset: 0;
          pointer-events: none;
          mix-blend-mode: screen;
          background: var(--beam-conic);
          transform-origin: 0 0;
          transform: skewX(1deg) skewY(0.5deg); /* subtle, constant skew */
          filter: url(#shimmer) blur(1px) brightness(1.2);
          mask-image: var(--beam-radial-mask);
          opacity: .9;
        }
        /* Grid layers (only revealed inside beam) */
        .grid-reveal { position: fixed; inset:0; pointer-events:none; opacity:.28; background: var(--grid-pattern); background-size: var(--grid-size);
          -webkit-mask-image: var(--beam-conic), var(--beam-radial-mask);
          -webkit-mask-composite: source-in;
          mask-image: var(--beam-conic), var(--beam-radial-mask);
          mask-composite: intersect;
        }
        .grid-reveal-dense { position: fixed; inset:0; pointer-events:none; opacity:.22; background: linear-gradient(transparent 92%, #fff 93%), linear-gradient(90deg, transparent 92%, #fff 93%); background-size: 12px 12px;
          -webkit-mask-image: radial-gradient(30vmax 30vmax at 0 0, #000 40%, transparent 60%), var(--beam-conic), var(--beam-radial-mask);
          -webkit-mask-composite: source-in, source-in;
          mask-image: radial-gradient(30vmax 30vmax at 0 0, #000 40%, transparent 60%), var(--beam-conic), var(--beam-radial-mask);
          mask-composite: intersect;
        }

        /* Moving caustics overlay (grainy) */
        .grain { position: fixed; inset: 0; width: 100%; height: 100%; pointer-events: none; opacity:.08;
          background: repeating-linear-gradient(0deg, #fff 0 1px, transparent 1px 2px),
                      repeating-linear-gradient(90deg, #fff 0 1px, transparent 1px 2px);
          background-size: 200% 200%;
          animation: drift 18s linear infinite; mix-blend-mode: soft-light; filter: contrast(200%);
        }
        @keyframes drift { from { background-position: 0 0 } to { background-position: 50% 50% } }

        /* Spotlight glow (sticky position) */
        .spotlight::before { content: ""; position: fixed; inset: -10vmax; pointer-events: none;
          background: radial-gradient(18vmax 18vmax at var(--mx) var(--my), rgba(255,255,255,.18), transparent 52%);
          mix-blend-mode: screen; transition: opacity .2s ease;
        }

        /* Reactive elements & contact glow */
        .reactive { 
          background-image: radial-gradient(30rem 22rem at var(--mx) var(--my), rgba(255,255,255,.12), rgba(255,255,255,0) 55%);
          background-repeat: no-repeat; 
          transition: filter .2s ease, box-shadow .2s ease;
        }
        .reactive:hover { filter: brightness(1.06); }
        .card.lit { box-shadow: 0 0 0 1px rgba(255,255,255,.18) inset, 0 0 64px rgba(255,255,255,.10); filter: brightness(1.05); }
        .card { will-change: auto; } /* Remove will-change for mobile performance */

        /* Kinetic underline on scanned headings */
        .scan { position: relative; display:inline-block; }
        .scan::after { content:""; position:absolute; left:0; right:100%; height:1px; bottom:-6px; background:#fff; opacity:.8; transition: right 700ms cubic-bezier(.2,.9,.2,1); }
        .scan.scanned::after { right:0; }

        /* Beam echo trail */
        .beam-echo { position: fixed; inset:0; pointer-events:none; mix-blend-mode: screen; opacity:.22;
          background: var(--beam-conic); transform-origin: 0 0; transform: skewX(1deg) skewY(0.5deg) scale(1.01);
          mask-image: var(--beam-radial-mask); filter: blur(2px); animation: echo 900ms ease-out infinite alternate;
        }
        @keyframes echo { from { opacity:.12; transform: skewX(1deg) skewY(0.5deg) scale(1.005);} to { opacity:.22; transform: skewX(1deg) skewY(0.5deg) scale(1.02);} }

        /* Volumetric dust inside beam */
        .dust { position: fixed; inset:0; pointer-events:none; opacity:.14; filter: blur(.3px);
          background-image: radial-gradient(rgba(255,255,255,.22) 1px, transparent 1.2px);
          background-size: 18px 18px; animation: dust-drift 60s linear infinite;
          -webkit-mask-image: var(--beam-conic), var(--beam-radial-mask); -webkit-mask-composite: source-in;
          mask-image: var(--beam-conic), var(--beam-radial-mask); mask-composite: intersect;
        }
        @keyframes dust-drift { from { transform: translate3d(0,0,0) } to { transform: translate3d(-8%, -12%, 0) } }

        /* Beam-synced progress bar */
        .progress { position: fixed; left:0; top:0; height:2px; background:#fff; width: calc(var(--progress, 0%) * 1%); z-index:40; }

        /* Project card blueprints */
        .card::before { content:""; position:absolute; inset:0; pointer-events:none; opacity:0; transition: opacity .25s ease; }
        .card:hover::before { opacity:.18; background:
          repeating-linear-gradient(0deg, rgba(255,255,255,.3) 0 1px, transparent 1px 10px),
          repeating-linear-gradient(90deg, rgba(255,255,255,.3) 0 1px, transparent 1px 10px);
        }

        /* ASCII raster mode (under beam only) */
        .ascii .ascii-reveal { display:block; }
        .ascii-reveal { display:none; position: fixed; inset:0; pointer-events:none; opacity:.22;
          background-image: radial-gradient(#fff 0.6px, transparent 0.6px); background-size: 8px 8px;
          -webkit-mask-image: var(--beam-conic), var(--beam-radial-mask); -webkit-mask-composite: source-in;
          mask-image: var(--beam-conic), var(--beam-radial-mask); mask-composite: intersect;
        }

        /* Corner prism */
        .prism { position: fixed; left:0; top:0; width:10px; height:10px; background:#fff; box-shadow: 0 0 12px 4px rgba(255,255,255,.45); mix-blend-mode: screen; opacity:.9; border-radius: 2px; }

        /* Mobile optimizations - Disable heavy effects but keep subtle grid */
        @media (max-width: 768px) {
          .beam { display: none !important; }
          .beam-echo { display: none !important; }
          .dust { display: none !important; }
          .grain { display: none !important; }
          .ascii-reveal { display: none !important; }
          .prism { display: none !important; }
          .spotlight::before { display: none !important; }
          .reactive { background-image: none !important; }
          .progress { display: none !important; }
          .card { backdrop-filter: none !important; -webkit-backdrop-filter: none !important; }
          
          /* Subtle grid on mobile - fades from center */
          .grid-reveal { 
            opacity: .06 !important;
            background-size: 30px 30px !important;
            -webkit-mask-image: radial-gradient(circle at center, black 20%, transparent 70%) !important;
            mask-image: radial-gradient(circle at center, black 20%, transparent 70%) !important;
          }
          .grid-reveal-dense { 
            display: none !important;
          }
          
          /* Enable hardware acceleration for parallax */
          h1, .card, section > div {
            will-change: transform;
            transform: translateZ(0);
          }
        }
        
        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) { 
          .beam-echo, .dust, .progress { animation: none !important; } 
          * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }
      `}</style>

      {/* LIGHT BEAM + EFFECTS */}
      <div className="beam" />
      <div className="beam-echo" />
      <div className="dust" />
      <div className="grid-reveal" />
      <div className="grid-reveal-dense" />
      <div className="ascii-reveal" />
      <div className="grain" />
      <div className="progress" />
      <div className="prism" />
      <svg className="hidden" aria-hidden="true" focusable="false" width="0" height="0">
        <defs>
          <filter id="shimmer">
            <feTurbulence type="fractalNoise" baseFrequency="0.006" numOctaves="2" seed="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {/* NAV */}
      <header className="relative z-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 md:px-6 md:py-6">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="relative h-12 w-12 md:h-14 md:w-14 border-2 border-white bg-black overflow-hidden">
              <img src="/HL.png" alt="heleolabs logo" className="h-full w-full object-contain" />
            </div>
            <span className="font-mono text-lg md:text-xl tracking-widest">heleolabs</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden gap-6 md:flex lg:gap-8">
            {['about', 'projects', 'stack', 'community', 'contact'].map(i => (
              <a
                key={i}
                href={`#${i}`}
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById(i);
                  if (element) {
                    const yOffset = -80;
                    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                  }
                }}
                className="text-sm uppercase tracking-[0.2em] text-white/80 hover:text-white transition cursor-pointer"
              >
                {i}
              </a>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="md:hidden p-2 rounded-lg border border-white/20 hover:border-white/40 transition z-50"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <CloseIcon className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/10 bg-black z-40"
            style={{ backgroundColor: '#000' }}
          >
            <nav className="flex flex-col px-4 py-4 gap-4">
              {['about', 'projects', 'stack', 'community', 'contact'].map(i => (
                <a
                  key={i}
                  href={`#${i}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setMobileMenuOpen(false);
                    setTimeout(() => {
                      const element = document.getElementById(i);
                      if (element) {
                        const yOffset = -80;
                        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                        window.scrollTo({ top: y, behavior: 'smooth' });
                      }
                    }, 100);
                  }}
                  className="text-sm uppercase tracking-[0.2em] text-white/80 hover:text-white transition py-2 border-b border-white/5 last:border-0 cursor-pointer"
                >
                  {i}
                </a>
              ))}
            </nav>
          </motion.div>
        )}
      </header>

      {/* HERO */}
      <main className="spotlight relative z-10 overflow-x-hidden">
        <section id="about" className="relative mx-auto max-w-7xl px-4 pt-8 md:px-6 md:pt-24 observed">
          <motion.h1
            initial={isMobile ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: isMobile ? 0 : 0.4, ease: "easeOut" }}
            className="scan reactive text-4xl font-extrabold leading-[1.1] tracking-tight md:text-6xl lg:text-7xl"
            style={isMobile ? { transform: `translateY(${scrollY * -0.1}px)` } : {}}
          >
            Hathor Network <span className="inline-block bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">R&D Studio</span>
          </motion.h1>
          <motion.p
            initial={isMobile ? false : { opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: isMobile ? 0 : 0.3, ease: "easeOut" }}
            className="mt-4 md:mt-6 max-w-2xl text-base md:text-lg text-balance text-white/70 leading-relaxed"
          >
            Building the future of on-chain applications on Hathor Network. We're creating a collaborative pixel canvas, a provably fair lottery, and a DAO voting platform—all leveraging Hathor's scalable DAG architecture.
          </motion.p>

          <div className="mt-8 md:mt-10 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 md:gap-4">
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById('contact');
                if (element) {
                  const yOffset = -80;
                  const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                  window.scrollTo({ top: y, behavior: 'smooth' });
                }
              }}
              className="group inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 px-6 py-3.5 md:px-5 md:py-3 font-medium tracking-wide transition hover:-translate-y-0.5 hover:border-white hover:bg-white hover:text-black touch-manipulation cursor-pointer"
            >
              Engage <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
            </a>
            <a
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById('projects');
                if (element) {
                  const yOffset = -80;
                  const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                  window.scrollTo({ top: y, behavior: 'smooth' });
                }
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 px-6 py-3.5 md:px-5 md:py-3 font-medium text-white/70 transition hover:text-white touch-manipulation cursor-pointer"
            >
              What We're Building
            </a>
          </div>

          {/* Stats strip */}
          <div
            className="mt-10 md:mt-14 grid grid-cols-2 gap-3 md:gap-4 md:grid-cols-4 observed"
            style={isMobile ? { transform: `translateY(${scrollY * 0.05}px)` } : {}}
          >
            {[
              ["In Development", "3"],
              ["Network", "Hathor"],
              ["Launch", "Q2 2026"],
              ["Status", "Building"],
            ].map(([k, v]) => (
              <div key={k} className="reactive rounded-xl md:rounded-2xl card border border-white/10 p-3 md:p-4">
                <div className="text-[10px] md:text-xs uppercase tracking-widest text-white/50">{k}</div>
                <div className="mt-1 text-xl md:text-2xl font-semibold">{v}</div>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURES */}
        <section id="stack" className="relative mx-auto mt-12 md:mt-28 max-w-7xl px-4 md:px-6 observed">
          <div
            className="grid gap-3 md:gap-4 md:grid-cols-2"
            style={isMobile ? { transform: `translateY(${scrollY * 0.03}px)` } : {}}
          >
            {features.map((f) => (
              <motion.div key={f.title}
                initial={isMobile ? false : { opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "0px", amount: 0.2 }}
                transition={{ duration: isMobile ? 0 : 0.3, ease: "easeOut" }}
                className="reactive group rounded-xl md:rounded-2xl card border border-white/10 p-4 md:p-6 transition hover:border-white/30 touch-manipulation"
              >
                <div className="flex items-center gap-3">
                  <div className="grid size-8 md:size-9 place-items-center rounded-lg border border-white/20 bg-white/5 shrink-0">{f.icon}</div>
                  <h3 className="font-semibold tracking-wide text-sm md:text-base">{f.title}</h3>
                </div>
                <p className="mt-3 text-xs md:text-sm text-white/70 leading-relaxed">{f.desc}</p>
                <div className="mt-4 h-px w-full bg-gradient-to-r from-white/40 to-transparent" />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.getElementById('projects');
                    if (element) {
                      const yOffset = -80;
                      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                      window.scrollTo({ top: y, behavior: 'smooth' });

                      // Open modal after scroll completes (if project linked)
                      if (f.projectId) {
                        setTimeout(() => {
                          setSelectedProject(f.projectId);
                        }, 800);
                      }
                    }
                  }}
                  className="mt-3 md:mt-4 inline-flex items-center gap-2 text-[10px] md:text-xs uppercase tracking-[0.25em] text-white/70 transition hover:text-white touch-manipulation cursor-pointer"
                >
                  Explore <ArrowRight className="size-3" />
                </button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* PROJECTS - Periodic Table Style */}
        <section id="projects" className="relative mx-auto mt-12 md:mt-28 max-w-7xl px-4 md:px-6 observed">
          <div className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
            <div>
              <h2 className="scan text-xl md:text-2xl lg:text-3xl font-semibold tracking-tight">Building on Hathor</h2>
              <p className="mt-1 text-xs md:text-sm text-white/50">Periodic Table of dApps</p>
            </div>
            <span className="hidden sm:inline text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/50">2025 ROADMAP</span>
          </div>

          {/* Mobile: Simple card grid */}
          <div className="md:hidden grid grid-cols-1 gap-3">
            {projects.map((p) => (
              <motion.div
                key={p.k}
                initial={false}
                onClick={() => setSelectedProject(p.k)}
                className="relative border-2 border-white bg-black p-4 cursor-pointer hover:border-white/60 hover:bg-white/5 transition-all touch-manipulation"
              >
                <div className="flex items-center gap-4">
                  {/* Element box */}
                  <div className="relative h-16 w-16 border-2 border-white bg-black flex flex-col items-center justify-center shrink-0">
                    <div className="absolute top-0.5 left-0.5 text-[8px] text-white/60 font-mono">
                      {p.atomicNumber}
                    </div>
                    <div className="text-2xl font-bold text-white font-mono">
                      {p.symbol}
                    </div>
                    {p.status === 'building' && (
                      <div className="absolute top-0.5 right-0.5">
                        <div className="h-1.5 w-1.5 rounded-full bg-white/50 animate-pulse" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-mono text-lg font-bold text-white">{p.name}</h3>
                    <div className="mt-1 flex items-center gap-2">
                      <span className={`inline-block rounded px-2 py-0.5 text-[10px] uppercase tracking-wider ${p.status === 'building' ? 'bg-white/10 text-white/80' : 'bg-white/5 text-white/60'
                        }`}>
                        {p.tag}
                      </span>
                      <span className="text-xs text-white/50 font-mono">HATHOR</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Desktop: Real Periodic Table Grid - 18 columns x 7 rows */}
          <div
            className="hidden md:grid gap-1 md:gap-2 pb-4"
            style={{
              gridTemplateColumns: 'repeat(18, minmax(35px, 1fr))'
            }}
          >
            {/* Generate authentic periodic table structure */}
            {Array.from({ length: 126 }).map((_, index) => {
              const row = Math.floor(index / 18) + 1;
              const col = (index % 18) + 1;

              // Determine if this position should be invisible (authentic periodic table shape)
              const isInvisible =
                // Row 1: only columns 1 and 18 (H and He)
                (row === 1 && col > 1 && col < 18) ||
                // Rows 2-3: only columns 1-2 and 13-18 (no transition metals yet)
                ((row === 2 || row === 3) && col > 2 && col < 13);

              const project = projects.find(p => p.position.row === row && p.position.col === col);

              if (isInvisible) {
                // Invisible space to create authentic periodic table shape
                return (
                  <div key={`invisible-${index}`} className="aspect-square" />
                );
              } else if (project) {
                return (
                  <motion.div
                    key={project.k}
                    initial={isMobile ? false : { opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: false, margin: "0px", amount: 0.2 }}
                    transition={{ duration: isMobile ? 0 : 0.5, ease: "easeOut" }}
                    onClick={() => setSelectedProject(project.k)}
                    className="relative aspect-square border-2 border-white bg-black p-1 md:p-2 cursor-pointer hover:border-white/60 hover:bg-white/5 transition-all touch-manipulation group"
                  >
                    {/* Atomic Number */}
                    <div className="absolute top-0.5 left-0.5 text-[6px] md:text-[8px] text-white/60 font-mono">
                      {project.atomicNumber}
                    </div>

                    {/* Status Indicator */}
                    {project.status === 'building' && (
                      <div className="absolute top-0.5 right-0.5">
                        <div className="h-1 w-1 md:h-1.5 md:w-1.5 rounded-full bg-white/50 animate-pulse" />
                      </div>
                    )}

                    {/* Element Symbol */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-base md:text-xl lg:text-2xl font-bold text-white font-mono group-hover:scale-110 transition-transform">
                        {project.symbol}
                      </div>
                    </div>

                    {/* Element Name - hidden on small screens */}
                    <div className="hidden lg:block absolute bottom-0.5 left-0 right-0 text-center text-[6px] text-white/50 uppercase tracking-wider font-mono truncate px-0.5">
                      {project.name}
                    </div>
                  </motion.div>
                );
              } else {
                // Empty space in periodic table - future project slot
                return (
                  <div
                    key={`empty-${index}`}
                    className="aspect-square border border-white/[0.03] bg-black/20 hover:border-white/10 transition-colors relative group"
                  >
                    {/* Question mark hint on hover for empty slots */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-30 transition-opacity">
                      <span className="text-[10px] md:text-xs text-white/30 font-mono">?</span>
                    </div>
                  </div>
                );
              }
            })}
          </div>

          {/* Legend - Desktop only (shows future slots) */}
          <div className="hidden md:flex mt-6 md:mt-8 flex-wrap items-center gap-4 text-xs text-white/50">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-white/50 animate-pulse" />
              <span>In Development</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 border border-white/30" />
              <span>Planned</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 border border-white/5 bg-transparent" />
              <span>Future Slots</span>
            </div>
          </div>

          {/* Legend - Mobile (simpler) */}
          <div className="md:hidden mt-4 flex flex-wrap items-center gap-4 text-xs text-white/50">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-white/50 animate-pulse" />
              <span>In Development</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 border border-white/30" />
              <span>Planned</span>
            </div>
          </div>
        </section>

        {/* COMMUNITY */}
        <section id="community" className="relative mx-auto mt-12 md:mt-28 max-w-7xl px-4 md:px-6 observed">
          <div className="grid gap-6 md:grid-cols-5">
            <div className="md:col-span-2">
              <h2 className="scan text-xl md:text-2xl lg:text-3xl font-semibold tracking-tight">Join the Community</h2>
              <p className="mt-3 max-w-sm text-sm md:text-base text-white/70 leading-relaxed">
                Stay close to the lab—connect with builders, get realtime drops, and share feedback as we ship.
              </p>
            </div>
            <div className="md:col-span-3 grid gap-3 sm:grid-cols-2">
              <a
                href="https://t.me/HeleoLabs"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center justify-between rounded-xl border border-white/15 bg-black/40 px-4 py-4 md:px-5 md:py-6 transition hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/5 card reactive"
              >
                <div>
                  <span className="text-xs uppercase tracking-[0.3em] text-white/50">Telegram</span>
                  <p className="mt-1 text-sm md:text-base font-medium text-white">HeleoLabs Relay</p>
                  <span className="mt-2 inline-flex items-center gap-2 text-xs text-white/60 group-hover:text-white">
                    <Send className="size-4 text-white/60 group-hover:text-white" />
                    Enter the channel
                  </span>
                </div>
                <div className="ml-4 hidden sm:flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5">
                  <Send className="size-5 text-white/70" />
                </div>
              </a>
              <a
                href="https://x.com/heleolabs"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center justify-between rounded-xl border border-white/15 bg-black/40 px-4 py-4 md:px-5 md:py-6 transition hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/5 card reactive"
              >
                <div>
                  <span className="text-xs uppercase tracking-[0.3em] text-white/50">X</span>
                  <p className="mt-1 text-sm md:text-base font-medium text-white">@heleolabs</p>
                  <span className="mt-2 inline-flex items-center gap-2 text-xs text-white/60 group-hover:text-white">
                    <XLogo className="size-4 text-white/60 group-hover:text-white" />
                    Follow updates
                  </span>
                </div>
                <div className="ml-4 hidden sm:flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5">
                  <XLogo className="size-5 text-white/70" />
                </div>
              </a>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="relative mx-auto mt-12 md:mt-32 max-w-7xl px-4 md:px-6 pb-16 md:pb-24 observed">
          <div className="grid gap-6 md:gap-8 md:grid-cols-5">
            <div className="md:col-span-2">
              <h2 className="scan text-xl md:text-2xl lg:text-3xl font-semibold tracking-tight">Get In Touch</h2>
              <p className="mt-3 max-w-md text-sm md:text-base text-white/70 leading-relaxed">Interested in our projects or want to collaborate? Reach out and let's build on Hathor together.</p>
              <a href="mailto:hello@heleolabs.dev" className="mt-6 inline-block rounded-xl border border-white/30 px-5 py-3.5 md:py-3 font-medium tracking-wide transition hover:-translate-y-0.5 hover:border-white hover:bg-white hover:text-black text-sm md:text-base touch-manipulation">hello@heleolabs.dev</a>
            </div>
            <form
              className="reactive md:col-span-3 rounded-xl md:rounded-2xl border border-white/10 p-4 md:p-6 card"
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const name = formData.get('name') as string;
                const email = formData.get('email') as string;
                const brief = formData.get('brief') as string;

                const subject = encodeURIComponent(`Project Inquiry from ${name || 'Website Contact'}`);
                const body = encodeURIComponent(
                  `Name: ${name}\nEmail: ${email}\n\nMessage:\n${brief}`
                );

                window.location.href = `mailto:hello@heleolabs.dev?subject=${subject}&body=${body}`;
              }}
            >
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/60">Name
                  <input
                    name="name"
                    className="mt-2 w-full rounded-lg border border-white/15 bg-black px-3 py-2.5 md:py-2 text-sm md:text-base text-white placeholder:text-white/30 focus:border-white/40 focus:outline-none touch-manipulation"
                    placeholder="Your Name"
                  />
                </label>
                <label className="block text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/60">Email
                  <input
                    name="email"
                    type="email"
                    className="mt-2 w-full rounded-lg border border-white/15 bg-black px-3 py-2.5 md:py-2 text-sm md:text-base text-white placeholder:text-white/30 focus:border-white/40 focus:outline-none touch-manipulation"
                    placeholder="you@email.com"
                  />
                </label>
              </div>
              <label className="mt-4 block text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/60">Brief
                <textarea
                  name="brief"
                  className="mt-2 min-h-32 md:min-h-36 w-full rounded-lg border border-white/15 bg-black px-3 py-2.5 md:py-2 text-sm md:text-base text-white placeholder:text-white/30 focus:border-white/40 focus:outline-none resize-none touch-manipulation"
                  placeholder="What are we building and why?"
                />
              </label>
              <button
                type="submit"
                className="mt-5 w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 px-6 py-3.5 md:px-5 md:py-3 font-medium tracking-wide transition hover:-translate-y-0.5 hover:border-white hover:bg-white hover:text-black touch-manipulation"
              >
                Transmit <ArrowRight className="size-4" />
              </button>
            </form>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/10 px-4 md:px-6 py-6 md:py-8 text-center text-xs md:text-sm text-white/50">
        © {new Date().getFullYear()} heleolabs — Building on Hathor Network
      </footer>

      {/* PROJECT MODAL */}
      {selectedProject && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedProject(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-black border border-white/20 rounded-2xl p-6 md:p-8"
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 p-2 rounded-lg border border-white/20 hover:border-white/40 transition"
              aria-label="Close"
            >
              <CloseIcon className="size-5" />
            </button>

            {projects.filter(p => p.k === selectedProject).map(project => (
              <div key={project.k}>
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-2">{project.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className={`inline-block rounded px-2 py-1 text-xs uppercase tracking-wider ${project.status === 'building' ? 'bg-white/10 text-white/80' : 'bg-white/5 text-white/60'
                        }`}>
                        {project.tag}
                      </span>
                      {project.nets?.map((n) => (
                        <span key={n} className="rounded-full border border-white/20 px-2 py-1 text-xs uppercase tracking-widest text-white/70">
                          {n}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Status indicator */}
                {project.status === 'building' && (
                  <div className="mb-6 flex items-center gap-2 text-sm text-white/50">
                    <div className="h-2 w-2 rounded-full bg-white/50 animate-pulse" />
                    <span className="uppercase tracking-wider">Active Development</span>
                  </div>
                )}

                {/* Description */}
                <p className="text-white/70 leading-relaxed mb-6">
                  {project.description}
                </p>

                {/* Features */}
                <div className="mb-6">
                  <h4 className="text-sm uppercase tracking-widest text-white/50 mb-3">Key Features</h4>
                  <ul className="space-y-2">
                    {project.features?.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-white/70">
                        <span className="text-white/50 mt-1">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tech Stack */}
                <div>
                  <h4 className="text-sm uppercase tracking-widest text-white/50 mb-3">Tech Stack</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.tech?.map((tech, idx) => (
                      <span key={idx} className="px-3 py-1 text-xs border border-white/10 rounded-full text-white/70">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="mt-8 pt-6 border-t border-white/10">
                  <a
                    href="#contact"
                    onClick={() => setSelectedProject(null)}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-5 py-3 font-medium tracking-wide transition hover:-translate-y-0.5 hover:border-white hover:bg-white hover:text-black"
                  >
                    Get Involved <ArrowRight className="size-4" />
                  </a>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
