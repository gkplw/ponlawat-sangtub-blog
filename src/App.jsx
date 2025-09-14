import { NavBar } from "./components/Navbar"
import { HeroSection } from "./components/HeroSection"
import { ArticlesFilter } from "./components/ArticleSection"
import { ViewPostPage } from "./components/ViewPostPage"
import { Footer } from "./components/Footer"
import { NotFoundPage } from "./components/NotFoundPage"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Toaster } from "sonner"

function App() {

  return (
    <>
      <NavBar />
      <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <HeroSection />
              <ArticlesFilter />
            </>
          }
        />
        <Route path="/posts/:postId" element={<ViewPostPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      </BrowserRouter>
      <Footer />
      <Toaster position="bottom-right" />
    </>
  )
}

export default App
