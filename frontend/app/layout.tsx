import "../styles/globals.css";

import { AuthProvider } from "../lib/auth";

export const metadata = {
  title: "BrandGuard — Brand monitoring",
  description: "Brand intelligence dashboard — mentions, domains, impersonation risk",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="app-body">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
