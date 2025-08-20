// app/dashboard/page.tsx
import AuthGate from "@/components/auth/AuthGate";
import ClientDashboard from "@/components/dashboard/ClientDashboard";

export default function DashboardPage() {
  return (
    <AuthGate>
      <ClientDashboard />
    </AuthGate>
  );
}


