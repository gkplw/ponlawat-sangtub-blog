import { NavBar, Footer, HeroSection, ArticlesFilter } from "./components"
import { 
  ViewPostPage,
  NotFoundPage,
  SignUpPage,
  SignUpSuccessPage,
  LoginPage,
  ProfilePage,
  ResetPasswordPage,
  AdminLoginPage,
  AdminDashboard
} from "./pages"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Toaster } from "sonner"

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <NavBar />
                <HeroSection />
                <ArticlesFilter />
                <Footer />
              </>
            }
          />
          <Route 
            path="/posts/:postId" 
            element={
              <>
                <NavBar />
                <ViewPostPage />
                <Footer />
              </>
            } 
          />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/signup-success" element={<SignUpSuccessPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Toaster position="bottom-right" />
      </BrowserRouter>
    </>
  )
}

export default App
