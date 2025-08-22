import { Suspense } from "react";
import ProContent from "./pro-content";

export const metadata = { title: "InvestLife • Pro" };

export default function ProPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="mb-4 text-2xl font-semibold">Pro Trading</h1>
      <Suspense fallback={<div>Loading…</div>}>
        <ProContent />
      </Suspense>
    </main>
  );
}


