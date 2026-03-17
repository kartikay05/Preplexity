import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Register = () => {
  // ── Two-way binding state ──
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  })

  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // ── Change handler (two-way binding) ──
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear field error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  // ── Validation ──
  const validate = () => {
    const newErrors = {}
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required.'
    } else if (formData.username.trim().length < 3) {
      newErrors.username = 'Username must be at least 3 characters.'
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address.'
    }
    if (!formData.password) {
      newErrors.password = 'Password is required.'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.'
    }
    return newErrors
  }

  // ── Submit handler ──
  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsLoading(true)
    try {
      
      await new Promise((r) => setTimeout(r, 1500)) // Simulated delay
    } catch (err) {
      console.error('Register error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // ── Password strength indicator ──
  const getPasswordStrength = (pwd) => {
    if (!pwd) return null
    if (pwd.length < 6) return { label: 'Weak', color: '#ef4444', width: '33%' }
    if (pwd.length < 10 || !/[A-Z]/.test(pwd) || !/[0-9]/.test(pwd))
      return { label: 'Fair', color: '#f59e0b', width: '66%' }
    return { label: 'Strong', color: '#22c55e', width: '100%' }
  }

  const strength = getPasswordStrength(formData.password)

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: 'var(--gradient-bg)' }}
    >
      {/* ── Card ── */}
      <div
        className="w-full max-w-md rounded-2xl p-8 sm:p-10"
        style={{
          background: 'var(--bg-card)',
          boxShadow: 'var(--shadow-card)',
          border: '1px solid var(--border-color)',
        }}
      >
        {/* ── Logo / Brand ── */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-white text-xl font-bold"
            style={{ background: 'var(--gradient-btn)' }}
          >
            P
          </div>
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            Create an account
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Join Perplexity and start exploring
          </p>
        </div>

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} noValidate className="space-y-5">

          {/* Username */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="register-username"
              className="text-sm font-medium"
              style={{ color: 'var(--text-primary)' }}
            >
              Username
            </label>
            <input
              id="register-username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="johndoe"
              autoComplete="username"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
              style={{
                background: 'var(--input-bg)',
                border: `1.5px solid ${errors.username ? 'var(--danger)' : 'var(--input-border)'}`,
                color: 'var(--text-primary)',
              }}
              onFocus={(e) =>
                (e.target.style.borderColor = errors.username
                  ? 'var(--danger)'
                  : 'var(--input-focus)')
              }
              onBlur={(e) =>
                (e.target.style.borderColor = errors.username
                  ? 'var(--danger)'
                  : 'var(--input-border)')
              }
            />
            {errors.username && (
              <span className="text-xs font-medium" style={{ color: 'var(--danger)' }}>
                {errors.username}
              </span>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="register-email"
              className="text-sm font-medium"
              style={{ color: 'var(--text-primary)' }}
            >
              Email address
            </label>
            <input
              id="register-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
              style={{
                background: 'var(--input-bg)',
                border: `1.5px solid ${errors.email ? 'var(--danger)' : 'var(--input-border)'}`,
                color: 'var(--text-primary)',
              }}
              onFocus={(e) =>
                (e.target.style.borderColor = errors.email
                  ? 'var(--danger)'
                  : 'var(--input-focus)')
              }
              onBlur={(e) =>
                (e.target.style.borderColor = errors.email
                  ? 'var(--danger)'
                  : 'var(--input-border)')
              }
            />
            {errors.email && (
              <span className="text-xs font-medium" style={{ color: 'var(--danger)' }}>
                {errors.email}
              </span>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="register-password"
              className="text-sm font-medium"
              style={{ color: 'var(--text-primary)' }}
            >
              Password
            </label>
            <div className="relative">
              <input
                id="register-password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                autoComplete="new-password"
                className="w-full px-4 py-3 pr-11 rounded-xl text-sm outline-none transition-all duration-200"
                style={{
                  background: 'var(--input-bg)',
                  border: `1.5px solid ${errors.password ? 'var(--danger)' : 'var(--input-border)'}`,
                  color: 'var(--text-primary)',
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor = errors.password
                    ? 'var(--danger)'
                    : 'var(--input-focus)')
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = errors.password
                    ? 'var(--danger)'
                    : 'var(--input-border)')
                }
              />
              {/* Show/hide toggle */}
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-lg select-none cursor-pointer"
                style={{ color: 'var(--text-muted)' }}
                aria-label="Toggle password visibility"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>

            {/* Password strength bar */}
            {formData.password && strength && (
              <div className="mt-1">
                <div
                  className="w-full rounded-full h-1"
                  style={{ background: 'var(--border-color)' }}
                >
                  <div
                    className="h-1 rounded-full transition-all duration-300"
                    style={{ width: strength.width, background: strength.color }}
                  />
                </div>
                <p className="text-xs mt-1 font-medium" style={{ color: strength.color }}>
                  {strength.label} password
                </p>
              </div>
            )}

            {errors.password && (
              <span className="text-xs font-medium" style={{ color: 'var(--danger)' }}>
                {errors.password}
              </span>
            )}
          </div>

          {/* Submit Button */}
          <button
            id="register-submit-btn"
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white tracking-wide transition-all duration-200 mt-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            style={{
              background: 'var(--gradient-btn)',
              boxShadow: '0 4px 15px rgba(99,102,241,0.35)',
            }}
            onMouseEnter={(e) => {
              if (!isLoading) e.target.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)'
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
                Creating account…
              </span>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* ── Footer ── */}
        <div className="mt-6 text-center">
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold hover:underline transition-colors"
              style={{ color: 'var(--accent)' }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register