import { Linkedin } from 'lucide-react';
import { Github } from 'lucide-react';
import { Facebook } from 'lucide-react';

export function NavBar() {
    return (
      <nav className="flex items-center justify-between px-20 py-4 border-b bg-[#F9F8F6]">
        <a href="/" className="text-2xl font-bold">
          hh<span className="text-green-500">.</span>
        </a>
        <div className="hidden md:flex space-x-4">
          <a href="/login" className="px-9 py-2  rounded-full border">
            Log in
          </a>
          <a
            href="/signup"
            className="px-8 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-700 transition-colors"
          >
            Sign up
          </a>
        </div>
        <button className="md:hidden">Menu</button>
      </nav>
    );
  }
  
export function HeroSection() {
    return (
      <div className="bg-[#F9F8F6]">
      <main className="container px-4 py-8 lg:py-16 mx-auto">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/3 mb-8 lg:mb-0 lg:pr-8">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Stay <br className="hidden lg:block" />
              Informed, <br />
              Stay Inspired,
            </h1>
            <p className="text-lg text-gray-500">
              Discover a World of Knowledge at Your Fingertips. Your Daily Dose of
              Inspiration and Information.
            </p>
          </div>
          <img
            src="https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449784/my-blog-post/xgfy0xnvyemkklcqodkg.jpg"
            alt="Person with a cat"
            className="h-[530px] object-cover rounded-lg shadow-lg lg:w-1/3 mx-4 mb-8 lg:mb-0"
          />
          <div className="lg:w-1/3 lg:pl-8">
            <h2 className="text-xl font-semibold mb-2">-Author</h2>
            <h3 className="text-2xl font-bold mb-4">Thompson P.</h3>
            <p className="text-gray-500 mb-4">
              I am a pet enthusiast and freelance writer who specializes in animal
              behavior and care. With a deep love for cats, I enjoy sharing
              insights on feline companionship and wellness.
            </p>
            <p className="text-gray-500">
              When I&apos;m not writing, I spend time volunteering at my local
              animal shelter, helping cats find loving homes.
            </p>
          </div>
        </div>
      </main>
      </div>
    );
  }

export function Footer() {
    return (
      <footer className="bg-[#EFEEEB] border-t">
        <div className="container px-4 py-8 lg:py-16 mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6 text-gray-700">
            <span className="text-base font-medium">Get in touch</span>
            <div className="flex items-center gap-4">
              <a href="#" aria-label="LinkedIn" className="w-9 h-9 rounded-full bg-gray-700 text-white grid place-items-center hover:opacity-80 transition">
                <Linkedin />
              </a>
              <a href="#" aria-label="GitHub" className="w-9 h-9 rounded-full bg-gray-700 text-white grid place-items-center hover:opacity-80 transition">
                <Github />
              </a>
              <a href="#" aria-label="Facebook" className="w-9 h-9 rounded-full bg-gray-700 text-white grid place-items-center hover:opacity-80 transition">
                <Facebook />
              </a>
            </div>
          </div>

          <a href="/" className="text-gray-800 underline underline-offset-4 text-base">Home page</a>
        </div>
      </footer>
    );
}

