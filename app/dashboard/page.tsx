// app/dashboard/page.tsx
import AuthGate from "@/components/auth/AuthGate";
import ClientDashboard from "@/components/dashboard/ClientDashboard";

export default function DashboardPage() {
  return (
    <AuthGate>
      <div className="relative">
        {/* animated background (enhanced movement) */}
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -left-1/3 -top-1/3 h-[140vh] w-[140vw] animate-[spin_80s_linear_infinite] rounded-full bg-[radial-gradient(circle_at_25%_30%,rgba(16,185,129,0.12),transparent_52%),radial-gradient(circle_at_75%_40%,rgba(239,68,68,0.09),transparent_50%),radial-gradient(circle_at_50%_70%,rgba(24,24,27,0.7),transparent_62%)] blur-3xl" />
          <div className="absolute left-1/2 top-1/2 h-[120vh] w-[120vw] -translate-x-1/2 -translate-y-1/2 animate-[pulse_16s_ease-in-out_infinite] rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03),transparent_60%)] blur-2xl" />
        </div>
        <ClientDashboard />
      </div>
    </AuthGate>
  );
}


