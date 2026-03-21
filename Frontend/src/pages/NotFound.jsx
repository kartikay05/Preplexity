import { Link } from "react-router";

const NotFound = () => {
  return (
    <div
      className="flex h-screen w-full items-center justify-center overflow-hidden font-sans relative transition-colors duration-300"
      style={{ background: "var(--gradient-bg)", color: "var(--text-primary)" }}
    >
      {/* Ambient Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] rounded-full animate-pulse"
          style={{ background: "rgba(99,102,241,0.08)", filter: "blur(140px)" }} />
        <div className="absolute bottom-[-15%] right-[-10%] w-[45%] h-[45%] rounded-full"
          style={{ background: "rgba(124,58,237,0.08)", filter: "blur(140px)", animationDelay: "1.5s" }} />
      </div>

      {/* Card */}
      <div
        className="relative z-10 flex flex-col items-center text-center px-8 py-12 max-w-lg w-full mx-4 rounded-3xl animate-fade-in"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-color)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        {/* SVG Illustration */}
        <div className="mb-6">
          <svg
            width="110"
            height="110"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outer dashed ring */}
            <circle cx="60" cy="60" r="56" stroke="url(#ring-grad)" strokeWidth="1.5" strokeDasharray="8 4" opacity="0.5" />
            {/* Inner glow circle */}
            <circle cx="60" cy="60" r="44" fill="url(#bg-grad)" opacity="0.12" />
            <circle cx="60" cy="60" r="44" stroke="url(#ring-grad)" strokeWidth="1.5" opacity="0.35" />
            {/* Magnifying glass circle */}
            <circle cx="52" cy="52" r="18" stroke="url(#ring-grad)" strokeWidth="3" fill="none" />
            {/* Shine */}
            <circle cx="46" cy="46" r="6" fill="white" opacity="0.07" />
            {/* Question mark */}
            <text x="52" y="58" textAnchor="middle" fontSize="17" fontWeight="bold"
              fill="url(#text-grad)" fontFamily="Inter, system-ui, sans-serif">?</text>
            {/* Handle */}
            <line x1="65" y1="65" x2="78" y2="78" stroke="url(#ring-grad)" strokeWidth="4" strokeLinecap="round" />
            {/* Sparkle dots */}
            <circle cx="88" cy="30" r="2.5" fill="#818cf8" opacity="0.8" />
            <circle cx="30" cy="85" r="2" fill="#a78bfa" opacity="0.7" />
            <circle cx="93" cy="76" r="1.5" fill="#6366f1" opacity="0.6" />
            <circle cx="22" cy="38" r="1.5" fill="#c4b5fd" opacity="0.5" />

            <defs>
              <linearGradient id="ring-grad" x1="10" y1="10" x2="110" y2="110" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
              <linearGradient id="bg-grad" x1="20" y1="20" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#7c3aed" />
              </linearGradient>
              <linearGradient id="text-grad" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
                <stop offset="0%" stopColor="#a5b4fc" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* 404 */}
        <h1
          className="text-8xl font-black tracking-tighter mb-3 leading-none"
          style={{
            background: "var(--gradient-btn)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          404
        </h1>

        {/* Title */}
        <h2 className="text-2xl font-bold mb-3 tracking-tight" style={{ color: "var(--text-primary)" }}>
          Page Not Found
        </h2>

        {/* Description */}
        <p className="text-base leading-relaxed mb-8 max-w-sm" style={{ color: "var(--text-secondary)" }}>
          Oops! The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </p>

        {/* Divider */}
        <div
          className="w-16 h-px mb-8"
          style={{ background: "linear-gradient(to right, transparent, var(--accent), transparent)" }}
        />

        {/* CTA Button */}
        <Link
          to="/"
          className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl font-semibold text-white text-sm transition-all duration-300 hover:-translate-y-0.5 active:scale-95 focus:outline-none"
          style={{
            background: "var(--gradient-btn)",
            boxShadow: "0 4px 15px rgba(99,102,241,0.35)",
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
          onMouseLeave={e => e.currentTarget.style.opacity = "1"}
        >
          <svg
            className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Return Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
