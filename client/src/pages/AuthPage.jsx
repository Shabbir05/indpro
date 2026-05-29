import { useState } from "react";
import API from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

function AuthPage() {
  const [mode, setMode] = useState("login"); // "login" or "register"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = "Email is required";
    } else if (!isValidEmail(email)) {
      errs.email = "Please enter a valid email";
    }
    if (!password) {
      errs.password = "Password is required";
    } else if (password.length < 6) {
      errs.password = "Password must be at least 6 characters";
    }
    if (mode === "register") {
      if (!confirmPassword) {
        errs.confirmPassword = "Please confirm your password";
      } else if (password !== confirmPassword) {
        errs.confirmPassword = "Passwords do not match";
      }
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const { data } = await API.post(endpoint, { email, password });
      login(data.token, data.user);
      navigate("/dashboard");
    } catch (err) {
      const message =
        err.response?.data?.message || "Something went wrong. Please try again.";
      setApiError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleMode = () => {
    setMode((prev) => (prev === "login" ? "register" : "login"));
    setErrors({});
    setApiError("");
    setConfirmPassword("");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Brand */}
        <div className="auth-brand">
          <div className="auth-logo">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <rect width="40" height="40" rx="12" fill="#022A23" />
              <path d="M12 20L17 25L28 14" stroke="#E7B961" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1>TaskFlow</h1>
          <p className="auth-subtitle">Clear priorities. Structured execution.</p>
        </div>

        {/* API Error Banner */}
        {apiError && (
          <div className="error-banner" id="auth-error-banner">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm-.75 4a.75.75 0 011.5 0v3a.75.75 0 01-1.5 0V5zm.75 6.5a1 1 0 100-2 1 1 0 000 2z" />
            </svg>
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={errors.email ? "input-error" : ""}
              autoComplete="email"
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={errors.password ? "input-error" : ""}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
            />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          {mode === "register" && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={errors.confirmPassword ? "input-error" : ""}
                autoComplete="new-password"
              />
              {errors.confirmPassword && (
                <span className="field-error">{errors.confirmPassword}</span>
              )}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={submitting}
            id="auth-submit-btn"
          >
            {submitting ? (
              <span className="btn-spinner" />
            ) : mode === "login" ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <p className="auth-toggle">
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <button type="button" className="link-btn" onClick={toggleMode}>
            {mode === "login" ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default AuthPage;
