"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await fetch("/api/session", { cache: "no-store", credentials: "include" });
        if (!isMounted) return;
        if (!res.ok) {
          router.replace("/login");
          return;
        }
        const { session } = await res.json();
        if (!session) router.replace("/login");
      } catch {
        router.replace("/login");
      } finally {
        if (isMounted) setChecked(true);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [router]);

  if (!checked) return null;
  return <>{children}</>;
}


