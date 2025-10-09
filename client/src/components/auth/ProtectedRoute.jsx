import { Navigate } from "react-router-dom";
import { LoadingScreen } from "../common/LoadingScreen";

function ProtectedRoute({
  isLoading,
  isAuthenticated,
  userRole,
  requiredRole,
  children,
}) {
  if (isLoading === null || isLoading) {
    // สถานะกำลังโหลดข้อมูลหรือยังไม่มีข้อมูล
    return (
      <div className="flex flex-col min-h-screen">
        <div className="min-h-screen md:p-8">
          <LoadingScreen />
        </div>
      </div>
    );
  }

  if (!isAuthenticated || userRole !== requiredRole) {
    // Redirect ไปหน้า login ตาม role ที่ต้องการ
    const redirectPath = requiredRole === "admin" ? "/admin/login" : "/login";
    return <Navigate to={redirectPath} replace />;
  }

  // ผู้ใช้มีการยืนยันตัวตนและมีบทบาทที่ถูกต้อง
  return children;
}

export default ProtectedRoute;
