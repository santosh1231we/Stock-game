"use client";
import { useRouter } from "next/navigation";
import { login } from "@/lib/auth";
import { initUser } from "@/lib/sim";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [name, setName] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const username = name.trim() || "Player";
    login(username);
    initUser(username);
    router.push("/dashboard");
  };

  return (
    <main className="grid min-h-screen place-items-center bg-black text-zinc-100">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-2xl border border-zinc-800 p-6">
        <h1 className="text-2xl font-bold">Welcome to Finly</h1>
        <p className="mt-2 text-zinc-400">Choose a display name to start investing with virtual cash.</p>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="mt-6 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 outline-none focus:border-emerald-500"
        />
        <button className="mt-4 w-full rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-black hover:bg-emerald-400">
          Enter Dashboard
        </button>
        <p className="mt-3 text-xs text-zinc-500">No signup, no emails. We’ll add OAuth later.</p>
      </form>
    </main>
  );
}


