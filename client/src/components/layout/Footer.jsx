import { Linkedin } from 'lucide-react';
import { Github } from 'lucide-react';
import { Mail } from 'lucide-react';

export function Footer() {
    return (
      <footer className="bg-[#EFEEEB] border-t">
        <div className="container px-4 py-8 lg:py-16 mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6 text-gray-700">
            <span className="text-base font-medium">Get in touch</span>
            <div className="flex items-center gap-4">
              <a href="https://www.linkedin.com/in/ponlawat-sangtub-970433286" aria-label="LinkedIn" className="w-9 h-9 rounded-full bg-[#43403B] text-white grid place-items-center hover:opacity-80 transition">
                <Linkedin />
              </a>
              <a href="https://github.com/gkplw" aria-label="GitHub" className="w-9 h-9 rounded-full bg-[#43403B] text-white grid place-items-center hover:opacity-80 transition">
                <Github />
              </a>
              <a href="mailto:p.sangtub@gmail.com" aria-label="Mail" className="w-9 h-9 rounded-full bg-[#43403B] text-white grid place-items-center hover:opacity-80 transition">
                <Mail />
              </a>
            </div>
          </div>

          <a href="/" className="text-[#26231E] hover:text-gray-600 underline underline-offset-4 text-base">Home page</a>
        </div>
      </footer>
    );
}
