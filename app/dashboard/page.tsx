// app/dashboard/page.tsx
import AuthGate from "@/components/auth/AuthGate";
import ClientDashboard from "@/components/dashboard/ClientDashboard";

export default function DashboardPage() {
  return (
    <AuthGate>
      <div className="relative">
        {/* animated background (enhanced movement) */}
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -left-1/2 -top-1/2 h-[180vh] w-[180vw] animate-[spin_28s_linear_infinite] rounded-full bg-[radial-gradient(circle_at_25%_30%,rgba(16,185,129,0.26),transparent_55%),radial-gradient(circle_at_75%_40%,rgba(239,68,68,0.22),transparent_52%),radial-gradient(circle_at_50%_70%,rgba(24,24,27,0.7),transparent_65%)] blur-3xl" />
          <div className="absolute left-1/2 top-1/2 h-[150vh] w-[150vw] -translate-x-1/2 -translate-y-1/2 animate-[pulse_9s_ease-in-out_infinite] rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.06),transparent_62%)] blur-2xl" />
        </div>
        <ClientDashboard />
      </div>
    </AuthGate>
  );
}


