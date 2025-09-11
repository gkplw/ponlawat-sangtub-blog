import ArticlesFilter from "./components/ArticleSection"
import { NavBar } from "./components/PageComponent"
import { HeroSection } from "./components/PageComponent"
import { Footer } from "./components/PageComponent"

function App() {

  return (
    <>
      <NavBar />
      <HeroSection />
      <ArticlesFilter />
      <Footer />
    </>
  )
}

export default App
