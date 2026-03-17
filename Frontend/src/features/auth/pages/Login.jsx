import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const { handleLogin } = useAuth();

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ── Change handler (two-way binding) ──
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // ── Validation ──
  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
    }
    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }
    return newErrors;
  };

  // ── Submit handler ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      await handleLogin(formData);
      await new Promise((r) => setTimeout(r, 1500)) // Simulated delay
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: "var(--gradient-bg)" }}
    >
      {/* ── Card ── */}
      <div
        className="w-full max-w-md rounded-2xl p-8 sm:p-10"
        style={{
          background: "var(--bg-card)",
          boxShadow: "var(--shadow-card)",
          border: "1px solid var(--border-color)",
        }}
      >
        {/* ── Logo / Brand ── */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-white text-xl font-bold"
            style={{ background: "var(--gradient-btn)" }}
          >
            P
          </div>
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            Welcome back
          </h1>
          <p
            className="text-sm mt-1"
            style={{ color: "var(--text-secondary)" }}
          >
            Sign in to your Perplexity account
          </p>
        </div>

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="login-email"
              className="text-sm font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              Email address
            </label>
            <input
              value={formData.email}
              id="login-email"
              type="email"
              name="email"
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
              style={{
                background: "var(--input-bg)",
                border: `1.5px solid ${errors.email ? "var(--danger)" : "var(--input-border)"}`,
                color: "var(--text-primary)",
              }}
              onFocus={(e) =>
                (e.target.style.borderColor = errors.email
                  ? "var(--danger)"
                  : "var(--input-focus)")
              }
              onBlur={(e) =>
                (e.target.style.borderColor = errors.email
                  ? "var(--danger)"
                  : "var(--input-border)")
              }
            />
            {errors.email && (
              <span
                className="text-xs font-medium"
                style={{ color: "var(--danger)" }}
              >
                {errors.email}
              </span>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="login-password"
                className="text-sm font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                Password
              </label>
            </div>
            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full px-4 py-3 pr-11 rounded-xl text-sm outline-none transition-all duration-200"
                style={{
                  background: "var(--input-bg)",
                  border: `1.5px solid ${errors.password ? "var(--danger)" : "var(--input-border)"}`,
                  color: "var(--text-primary)",
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor = errors.password
                    ? "var(--danger)"
                    : "var(--input-focus)")
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = errors.password
                    ? "var(--danger)"
                    : "var(--input-border)")
                }
              />
              {/* Show/hide toggle */}
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-lg select-none cursor-pointer"
                style={{ color: "var(--text-muted)" }}
                aria-label="Toggle password visibility"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            {errors.password && (
              <span
                className="text-xs font-medium"
                style={{ color: "var(--danger)" }}
              >
                {errors.password}
              </span>
            )}
          </div>

          {/* Submit Button */}
          <button
            id="login-submit-btn"
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white tracking-wide transition-all duration-200 mt-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            style={{
              background: "var(--gradient-btn)",
              boxShadow: "0 4px 15px rgba(99,102,241,0.35)",
            }}
            onMouseEnter={(e) => {
              if (!isLoading) e.target.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
            }}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                Signing in…
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* ── Footer ── */}
        <div className="mt-6 text-center">
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold hover:underline transition-colors"
              style={{ color: "var(--accent)" }}
            >
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
