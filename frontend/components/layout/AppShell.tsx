"use client";

import Header from "./Header";
import Sidebar from "./Sidebar";

import "../../styles/app-shell.css";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-root">
      <Sidebar />
      <div className="app-main">
        <Header />
        <main className="app-content">{children}</main>
      </div>
    </div>
  );
}
