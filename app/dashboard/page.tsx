// app/dashboard/page.tsx
import AuthGate from "@/components/auth/AuthGate";
import ClientDashboard from "@/components/dashboard/ClientDashboard";

export default function DashboardPage() {
  return (
    <AuthGate>
      <div className="relative">
        {/* animated background (subtle) */}
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -left-1/4 -top-1/4 h-[120vh] w-[120vw] animate-[pulse_12s_ease-in-out_infinite] rounded-full bg-[radial-gradient(circle_at_25%_30%,rgba(16,185,129,0.14),transparent_50%),radial-gradient(circle_at_75%_40%,rgba(239,68,68,0.10),transparent_48%),radial-gradient(circle_at_50%_70%,rgba(24,24,27,0.7),transparent_60%)] blur-3xl" />
        </div>
        <ClientDashboard />
      </div>
    </AuthGate>
  );
}


