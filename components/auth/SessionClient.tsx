"use client";
import { useEffect, useState } from "react";

export type Session = { name: string; email: string; ts: number } | null;

// Reads cookie via an API bridge to avoid hydration mismatch
export default function SessionClient({ children }: { children: (s: Session) => React.ReactNode }) {
  const [session, setSession] = useState<Session>(null);
  useEffect(() => {
    (async () => {
      try {
<<<<<<< HEAD
        const res = await fetch("/api/session", { cache: "no-store" });
=======
        const res = await fetch("/api/session", { cache: "no-store", credentials: "include" });
>>>>>>> c72da89 (commit)
        if (!res.ok) return setSession(null);
        const json = await res.json();
        setSession(json.session ?? null);
      } catch {
        setSession(null);
      }
    })();
  }, []);
  return <>{children(session)}</>;
}


