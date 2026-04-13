"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Activity, LogOut } from "lucide-react";

import { useAuth } from "../../lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function Header() {
  const [online, setOnline] = useState<boolean | null>(null);
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    async function ping() {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 4000);
      try {
        const r = await fetch(`${API_URL}/health`, { cache: "no-store", signal: controller.signal });
        if (!cancelled) {
          setOnline(r.ok);
        }
      } catch {
        if (!cancelled) {
          setOnline(false);
        }
      } finally {
        clearTimeout(timer);
      }
    }
    void ping();
    const t = setInterval(ping, 30000);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="app-header">
      <div>
        <h1 className="app-header__title">Brand intelligence</h1>
        <p className="app-header__meta">Monitor mentions, domains, and impersonation risk</p>
      </div>
      <div className="app-header__actions">
        <div
          className={`app-header__status ${online === true ? "is-online" : online === false ? "is-offline" : "is-unknown"}`}
          title={online === true ? "API connected" : online === false ? "API offline" : "Checking…"}
        >
          <Activity size={16} />
          <span>
            {online === true ? "Online" : online === false ? "Offline" : "Checking…"}
          </span>
        </div>
        {isAuthenticated && (
          <button className="btn-icon" onClick={handleLogout} title="Logout">
            <LogOut size={16} />
          </button>
        )}
      </div>
    </header>
  );
}
