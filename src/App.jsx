import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import heroImage from './assets/img/HeroSection/picture1.jpg'

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="w-full bg-[#fcfbf8] border-b border-gray-100">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="flex items-center">
          <span className="text-2xl font-bold text-gray-800">hh<span className="text-[#2ec4b6]">.</span></span>
        </div>
        
        {/* Desktop menu */}
        <div className="hidden sm:flex gap-3">
          <button className="px-6 py-2.5 rounded-full border border-gray-700 text-gray-800 bg-white hover:bg-gray-50 transition-colors text-sm font-medium">
            Log in
          </button>
          <button className="px-6 py-2.5 rounded-full bg-[#292721] text-white hover:bg-[#1a1916] transition-colors text-sm font-medium">
            Sign up
          </button>
        </div>
        
        {/* Mobile menu button */}
        <div className="sm:hidden">
          <button 
            onClick={() => setMenuOpen(!menuOpen)} 
            className="p-2 rounded focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
              )}
            </svg>
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden px-6 pb-4 flex flex-col gap-2 border-t border-gray-100">
          <button className="w-full px-6 py-2.5 rounded-full border border-gray-700 text-gray-800 bg-white hover:bg-gray-50 transition-colors text-sm font-medium">
            Log in
          </button>
          <button className="w-full px-6 py-2.5 rounded-full bg-[#292721] text-white hover:bg-[#1a1916] transition-colors text-sm font-medium">
            Sign up
          </button>
        </div>
      )}
    </nav>
  );
}

function HeroSection() {
  return (
    <section className="bg-[#fcfbf8] text-gray-800 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          {/* Left Section - Main Heading */}
          <div className="lg:col-span-1">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight mb-8">
              Stay<br />
              Informed,<br />
              Stay Inspired
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-md">
              Discover a World of Knowledge at Your Fingertips. Your Daily Dose of Inspiration and Information.
            </p>
          </div>

          {/* Center Section - Image */}
          <div className="lg:col-span-1 flex justify-center">
            <div className="relative">
              <img 
                src={heroImage} 
                alt="Person with cat in forest setting" 
                className="w-full max-w-sm h-auto rounded-xl shadow-lg"
              />
            </div>
          </div>

          {/* Right Section - Author Bio */}
          <div className="lg:col-span-1">
            <div className="text-sm text-gray-500 mb-3 font-medium">-Author</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Thompson P.</h2>
            <div className="space-y-4 text-base sm:text-lg text-gray-600 leading-relaxed max-w-md">
              <p>
                I am a pet enthusiast and freelance writer who specializes in animal behavior and care. 
                With a deep love for cats, I enjoy sharing insights on feline companionship and wellness.
              </p>
              <p>
                When I'm not writing, I spend time volunteering at my local animal shelter, helping cats 
                find loving homes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function App() {
  return (
    <>
      <NavBar />
      <HeroSection />
    </>
  );
}

export default App

