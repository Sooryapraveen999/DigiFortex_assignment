import ScanWorkspace from "../../../components/ScanWorkspace";
import ProtectedRoute from "../../../components/ProtectedRoute";

export default function ScanPage() {
  return (
    <ProtectedRoute>
      <ScanWorkspace />
    </ProtectedRoute>
  );
}
