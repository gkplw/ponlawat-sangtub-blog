import { NavBar } from "../../components/layout/NavBar";
import { HeroSection } from "../../components/common/HeroSection";
import { ArticleSection } from "../../components/common/ArticleSection";
import { Footer } from "../../components/layout/Footer";

export function HomePage() {
    return (
        <>
            <NavBar />
            <HeroSection />
            <ArticleSection />
            <Footer />
        </>
    )
}

