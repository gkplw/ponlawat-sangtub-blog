import { NavBar } from "./components/Navbar"
import { HeroSection } from "./components/HeroSection"
import { ArticlesFilter } from "./components/ArticleSection"
import { ViewPostPage } from "./components/ViewPostPage"
import { Footer } from "./components/Footer"
import { NotFoundPage } from "./components/NotFoundPage"
import { SignUpPage } from "./components/SignUpPage"
import { SignUpSuccessPage } from "./components/SignUpSuccessPage"
import { LoginPage } from "./components/LoginPage"
import { ProfilePage } from "./components/ProfilePage"
import { ResetPasswordPage } from "./components/ResetPasswordPage"
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
