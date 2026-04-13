"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../lib/auth";
import Card from "../../components/ui/Card";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (login(email, password)) {
      router.push("/dashboard");
    } else {
      setError("Invalid credentials");
    }

    setLoading(false);
  };

  return (
    <div className="login-page">
      <Card className="login-card">
        <h1 className="login-card__title">BrandGuard Login</h1>
        <p className="login-card__subtitle">Brand Monitoring System</p>
        
        {error && <div className="login-card__error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-form__field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@brandguard.com"
              required
            />
          </div>
          
          <div className="login-form__field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          
          <button type="submit" className="btn-primary login-form__button" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </Card>
    </div>
  );
}
