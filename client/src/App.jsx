import { HomePage, ViewPostPage, SignUpPage, SignUpSuccessPage, LoginPage, ProfilePage, ResetPasswordPage, AdminLoginPage, AdminDashboard, NotFoundPage } from "./pages"
import { Routes, Route } from "react-router-dom"
import { useAuth } from "./context/authentication"
import ProtectedRoute from "./components/auth/ProtectedRoute"
import AuthenticationRoute from "./components/auth/AuthenticationRoute"
import { Toaster } from "sonner"

function App() {
  const { isAuthenticated, state } = useAuth()

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/posts/:postId" element={<ViewPostPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signup-success" element={<SignUpSuccessPage />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/login" element={
          <AuthenticationRoute
            isLoading={state.getUserLoading}
            isAuthenticated={isAuthenticated}
          >
            <LoginPage />
          </AuthenticationRoute>
          }
        />
        <Route path="/profile" element={
          <ProtectedRoute
            isLoading={state.getUserLoading}
            isAuthenticated={isAuthenticated}
            userRole={state.user?.role}
            requiredRole="user"
          >
            <ProfilePage />
          </ProtectedRoute>
          }
        />
        <Route path="/reset-password" element={
          <ProtectedRoute
            isLoading={state.getUserLoading}
            isAuthenticated={isAuthenticated}
            userRole={state.user?.role}
            requiredRole="user"
          >
            <ResetPasswordPage />
          </ProtectedRoute>
          }
        />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/*" element={
          <ProtectedRoute
            isLoading={state.getUserLoading}
            isAuthenticated={isAuthenticated}
            userRole={state.user?.role}
            requiredRole="admin"
          >
            <AdminDashboard />
          </ProtectedRoute>
          }
        />
      </Routes>
      <Toaster position="bottom-right" />
    </>
  )
}

export default App
