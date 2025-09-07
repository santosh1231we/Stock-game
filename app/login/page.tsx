"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
<<<<<<< HEAD
    fetch("/api/session")
=======
    fetch("/api/session", { credentials: "include" })
>>>>>>> c72da89 (commit)
      .then((r) => r.json())
      .then(({ session }) => {
        if (session) router.replace("/dashboard");
      })
      .catch(() => {});
  }, [router]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const username = name.trim() || "Player";
    const userEmail = email.trim();
    if (!userEmail || !userEmail.includes("@")) {
      setError("Enter a valid email");
      return;
    }
    fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: username, email: userEmail }),
<<<<<<< HEAD
=======
      credentials: "include",
>>>>>>> c72da89 (commit)
    })
      .then((r) => (r.ok ? router.push("/dashboard") : r.json()))
      .catch(() => setError("Login failed"));
  };

  return (
    <main className="grid min-h-screen place-items-center bg-black text-zinc-100">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-2xl border border-zinc-800 p-6">
        <h1 className="text-2xl font-bold">Welcome to InvestLife</h1>
        <p className="mt-2 text-zinc-400">Choose a display name to start investing with virtual cash.</p>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="mt-6 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 outline-none focus:border-emerald-500"
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          className="mt-3 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 outline-none focus:border-emerald-500"
        />
        <button className="mt-4 w-full rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-black hover:bg-emerald-400">
          Enter Dashboard
        </button>
        {error && <div className="mt-2 text-sm text-red-400">{error}</div>}
        <p className="mt-3 text-xs text-zinc-500">No signup, no emails. We’ll add OAuth later.</p>
      </form>
    </main>
  );
}


