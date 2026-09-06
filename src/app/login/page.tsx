"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const API_BASE = "";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || "Login failed");
      const user = payload.data;
      localStorage.setItem("attendifyUser", JSON.stringify(user));
      setUser(user);
      const route = user.role === "ADMIN" ? "/admin" : user.role === "CR" ? "/cr" : "/dashboard";
      router.replace(route);
    } catch (err: any) {
      setError(err.message || "Login failed. Check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-brand">
          <div className="brand-icon">A</div>
          <h1>Attendify</h1>
          <p>Smart Attendance Management for College</p>
        </div>
        <div className="login-card">
          <h2>Welcome Back</h2>
          <p className="login-subtitle">Sign in to continue to Attendify</p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="Enter your email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Password</label>
              <div className="password-input">
                <input type={showPassword ? "text" : "password"} placeholder="Enter your password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>👁</button>
              </div>
            </div>
            <div className="login-options">
              <label className="checkbox"><input type="checkbox" /> Remember me</label>
              <a href="#">Forgot password?</a>
            </div>
            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>
          {error && <p style={{ color: "#dc2626", marginTop: 12, textAlign: "center" }}>{error}</p>}
        </div>
      </div>
    </div>
  );
}
