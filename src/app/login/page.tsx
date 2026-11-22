"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ThemeToggle from "@/components/ui/ThemeToggle";
import {
  Sparkles,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Users,
  CheckCircle2,
  CalendarCheck,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { setUser } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const payload = await res.json();
      if (!res.ok) {
        throw new Error(payload.error || "Login failed. Check your credentials.");
      }
      const user = payload.data;
      localStorage.setItem("attendifyUser", JSON.stringify(user));
      setUser(user);

      const route = user.role === "ADMIN" ? "/admin" : user.role === "CR" ? "/cr" : "/dashboard";
      router.replace(route);
    } catch (err: any) {
      setError(err.message || "Failed to sign in. Please verify your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (em: string, pw: string) => {
    setEmail(em);
    setPassword(pw);
    setError("");
  };

  return (
    <div className="login-wrapper">
      {/* Top Floating Controls */}
      <div className="login-topbar">
        <div className="login-top-brand">
          <div className="brand-mark" style={{ width: 32, height: 32 }}>
            <Sparkles size={16} strokeWidth={2.3} />
            <div className="brand-dot" />
          </div>
          <span className="brand-name" style={{ fontSize: "1.05rem" }}>Attendify</span>
        </div>
        <ThemeToggle />
      </div>

      <div className="login-container">
        {/* Left Column: Visual Showcase & Brand Narrative */}
        <div className="login-hero-col">
          <div className="hero-brand-badge">
            <Sparkles size={14} className="hero-badge-icon" />
            <span>Smart Attendance Management for College</span>
          </div>

          <h1 className="hero-heading">
            Classroom attendance, <span className="hero-heading-highlight">elevated.</span>
          </h1>

          <p className="hero-description">
            Track student attendance in real-time, generate comprehensive semester reports,
            and monitor eligibility criteria with ease.
          </p>

          {/* Interactive Showcase Preview Cards */}
          <div className="hero-cards-stack">
            {/* Live Stats Preview Card */}
            <div className="hero-card hero-card-main">
              <div className="hero-card-header">
                <div className="hero-card-header-left">
                  <div className="hero-card-icon">
                    <CalendarCheck size={18} />
                  </div>
                  <div>
                    <div className="hero-card-title">B.Tech CSE — Semester III (Sec E)</div>
                    <div className="hero-card-sub">Class Representative: Debadrita Goswami</div>
                  </div>
                </div>
                <span className="badge badge-lime">Active Session</span>
              </div>

              <div className="hero-metric-grid">
                <div className="hero-metric-box">
                  <span className="hero-metric-label">Present Today</span>
                  <div className="hero-metric-val" style={{ color: "var(--status-present)" }}>56 / 61</div>
                  <span className="hero-metric-tag" style={{ color: "var(--status-present)" }}>91.8% rate</span>
                </div>
                <div className="hero-metric-box">
                  <span className="hero-metric-label">Average Attendance</span>
                  <div className="hero-metric-val" style={{ color: "var(--accent)" }}>88.4%</div>
                  <span className="hero-metric-tag" style={{ color: "var(--text-muted)" }}>+3.2% vs last wk</span>
                </div>
              </div>

              <div className="hero-progress-bar-wrap">
                <div className="hero-progress-label">
                  <span>Semester Eligibility Threshold</span>
                  <span style={{ fontWeight: 600 }}>75% Target</span>
                </div>
                <div className="hero-progress-track">
                  <div className="hero-progress-fill" style={{ width: "88%" }} />
                  <div className="hero-progress-marker" style={{ left: "75%" }} />
                </div>
              </div>
            </div>

            {/* Quick Benefits Pill Strip */}
            <div className="hero-features-strip">
              <div className="hero-feature-item">
                <CheckCircle2 size={15} style={{ color: "var(--status-present)" }} />
                <span>One-tap bulk marking</span>
              </div>
              <div className="hero-feature-item">
                <Users size={15} style={{ color: "var(--accent)" }} />
                <span>60+ students roster</span>
              </div>
              <div className="hero-feature-item">
                <TrendingUp size={15} style={{ color: "var(--status-warning)" }} />
                <span>Instant analytics</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Clean Sign-In Form */}
        <div className="login-form-col">
          <div className="login-form-card">
            <div className="login-form-header">
              <h2 className="login-form-title">Welcome back.</h2>
              <p className="login-form-subtitle">
                Sign in to manage your classroom attendance and student records.
              </p>
            </div>

            {error && (
              <div className="login-error-alert" role="alert">
                <AlertCircle size={17} style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <div style={{ fontWeight: 600 }}>{error}</div>
                  {error.toLowerCase().includes("database") && (
                    <div style={{ fontSize: "0.8rem", marginTop: 6, lineHeight: 1.4 }}>
                      Your MongoDB Atlas cluster may be <strong>Paused</strong> due to inactivity. Log in to{" "}
                      <a
                        href="https://cloud.mongodb.com"
                        target="_blank"
                        rel="noreferrer"
                        style={{ textDecoration: "underline", color: "inherit", fontWeight: 600 }}
                      >
                        cloud.mongodb.com
                      </a>{" "}
                      and click <strong>Resume</strong>, or run <code>npm run check:db</code> in your terminal.
                    </div>
                  )}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label className="form-label" htmlFor="login-email">Email Address</label>
                <div className="input-with-icon">
                  <Mail size={16} className="input-leading-icon" />
                  <input
                    id="login-email"
                    type="email"
                    className="form-input"
                    style={{ paddingLeft: 38 }}
                    placeholder="e.g. deba@attendify.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <label className="form-label" htmlFor="login-password">Password</label>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    Forgot? Contact Admin
                  </span>
                </div>
                <div className="input-with-icon">
                  <Lock size={16} className="input-leading-icon" />
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    className="form-input"
                    style={{ paddingLeft: 38, paddingRight: 40 }}
                    placeholder="Enter your password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="login-options-row">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember me</span>
                </label>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-full btn-lg"
                disabled={loading}
              >
                {loading ? (
                  <span>Signing in...</span>
                ) : (
                  <>
                    <span>Sign In to Attendify</span>
                    <ArrowRight size={17} />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Credentials */}
            <div className="demo-credentials-wrap">
              <div className="demo-credentials-title">Quick Demo Login</div>
              <div className="demo-pills-row">
                <button
                  type="button"
                  className="demo-pill"
                  onClick={() => fillCredentials("deba@attendify.com", "deba123")}
                  title="CR: deba@attendify.com / deba123"
                >
                  <span className="demo-pill-badge">CR</span>
                  <span>deba@attendify.com</span>
                </button>
                <button
                  type="button"
                  className="demo-pill"
                  onClick={() => fillCredentials("admin@attendify.com", "admin123")}
                  title="Admin: admin@attendify.com / admin123"
                >
                  <span className="demo-pill-badge" style={{ backgroundColor: "var(--accent)" }}>Admin</span>
                  <span>admin@attendify.com</span>
                </button>
                <button
                  type="button"
                  className="demo-pill"
                  onClick={() => fillCredentials("stu@attendify.com", "stu123")}
                  title="Student: stu@attendify.com / stu123"
                >
                  <span className="demo-pill-badge" style={{ backgroundColor: "var(--status-warning)" }}>Student</span>
                  <span>stu@attendify.com</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .login-wrapper {
          min-height: 100vh;
          background-color: var(--bg-app);
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .login-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 36px;
          width: 100%;
        }

        .login-top-brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .login-container {
          flex: 1;
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          max-width: 1280px;
          width: 100%;
          margin: 0 auto;
          padding: 10px 36px 48px;
          gap: 48px;
          align-items: center;
        }

        /* Left Hero Column */
        .login-hero-col {
          display: flex;
          flex-direction: column;
          gap: 20px;
          padding-right: 24px;
        }

        .hero-brand-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 0.82rem;
          font-weight: 600;
          padding: 5px 12px;
          border-radius: var(--radius-full);
          background-color: var(--highlight-lime-bg);
          color: var(--highlight-lime-text);
          border: 1px solid var(--highlight-lime-border);
          width: fit-content;
        }

        .hero-heading {
          font-size: 2.85rem;
          font-weight: 700;
          line-height: 1.12;
          letter-spacing: -0.035em;
          color: var(--text-primary);
        }

        .hero-heading-highlight {
          color: var(--accent);
          position: relative;
        }

        :global(html.dark) .hero-heading-highlight {
          color: #E5849E;
        }

        .hero-description {
          font-size: 1.05rem;
          line-height: 1.55;
          color: var(--text-secondary);
          max-width: 520px;
        }

        .hero-cards-stack {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-top: 12px;
        }

        .hero-card {
          background-color: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-xl);
          padding: 24px;
          box-shadow: var(--shadow-md);
        }

        .hero-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 20px;
        }

        .hero-card-header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .hero-card-icon {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-md);
          background-color: var(--accent-light);
          color: var(--accent);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        :global(html.dark) .hero-card-icon {
          color: #E5849E;
        }

        .hero-card-title {
          font-weight: 600;
          font-size: 0.98rem;
          color: var(--text-primary);
        }

        .hero-card-sub {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .hero-metric-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin-bottom: 20px;
        }

        .hero-metric-box {
          background-color: var(--bg-surface-subtle);
          padding: 14px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-subtle);
        }

        .hero-metric-label {
          font-size: 0.74rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
          display: block;
          margin-bottom: 4px;
        }

        .hero-metric-val {
          font-size: 1.55rem;
          font-weight: 700;
          line-height: 1.1;
        }

        .hero-metric-tag {
          font-size: 0.76rem;
          font-weight: 500;
          display: block;
          margin-top: 3px;
        }

        .hero-progress-bar-wrap {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .hero-progress-label {
          display: flex;
          justify-content: space-between;
          font-size: 0.78rem;
          color: var(--text-secondary);
        }

        .hero-progress-track {
          position: relative;
          height: 8px;
          background-color: var(--bg-surface-subtle);
          border-radius: var(--radius-full);
          overflow: visible;
        }

        .hero-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--accent) 0%, var(--highlight-lime) 100%);
          border-radius: var(--radius-full);
        }

        .hero-progress-marker {
          position: absolute;
          top: -3px;
          bottom: -3px;
          width: 2px;
          background-color: var(--text-primary);
          border-radius: 1px;
        }

        .hero-features-strip {
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }

        .hero-feature-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--text-secondary);
        }

        /* Right Form Column */
        .login-form-col {
          display: flex;
          justify-content: center;
        }

        .login-form-card {
          width: 100%;
          max-width: 440px;
          background-color: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-xl);
          padding: 36px 32px;
          box-shadow: var(--shadow-lg);
        }

        .login-form-header {
          margin-bottom: 24px;
        }

        .login-form-title {
          font-size: 1.65rem;
          font-weight: 700;
          letter-spacing: -0.025em;
          color: var(--text-primary);
        }

        .login-form-subtitle {
          font-size: 0.88rem;
          color: var(--text-secondary);
          margin-top: 4px;
        }

        .login-error-alert {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 11px 14px;
          border-radius: var(--radius-md);
          background-color: var(--status-absent-bg);
          color: var(--status-absent-text);
          border: 1px solid var(--status-absent-border);
          font-size: 0.86rem;
          margin-bottom: 20px;
          line-height: 1.35;
        }

        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-leading-icon {
          position: absolute;
          left: 14px;
          color: var(--text-muted);
          pointer-events: none;
        }

        .password-toggle-btn {
          position: absolute;
          right: 12px;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
        }

        .password-toggle-btn:hover {
          color: var(--text-primary);
        }

        .login-options-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 22px;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          color: var(--text-secondary);
          cursor: pointer;
        }

        .demo-credentials-wrap {
          margin-top: 28px;
          padding-top: 20px;
          border-top: 1px solid var(--border-subtle);
        }

        .demo-credentials-title {
          font-size: 0.74rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--text-muted);
          margin-bottom: 10px;
          text-align: center;
        }

        .demo-pills-row {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .demo-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 10px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border);
          background-color: var(--bg-surface-subtle);
          font-size: 0.78rem;
          color: var(--text-primary);
          transition: all 0.15s ease;
          width: 100%;
        }

        .demo-pill:hover {
          background-color: var(--bg-surface);
          border-color: var(--border-focus);
          transform: translateX(2px);
        }

        .demo-pill-badge {
          font-size: 0.65rem;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: var(--radius-sm);
          background-color: var(--accent);
          color: #FFFFFF;
        }

        @media (max-width: 960px) {
          .login-container {
            grid-template-columns: 1fr;
            padding: 10px 20px 40px;
            gap: 32px;
          }

          .login-hero-col {
            padding-right: 0;
            text-align: center;
            align-items: center;
          }

          .hero-brand-badge {
            margin: 0 auto;
          }

          .hero-heading {
            font-size: 2.2rem;
          }

          .hero-cards-stack {
            display: none;
          }

          .login-topbar {
            padding: 16px 20px;
          }
        }
      `}</style>
    </div>
  );
}
