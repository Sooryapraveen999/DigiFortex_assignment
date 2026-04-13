import DashboardHome from "../../../components/dashboard/DashboardHome";
import ProtectedRoute from "../../../components/ProtectedRoute";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardHome />
    </ProtectedRoute>
  );
}
