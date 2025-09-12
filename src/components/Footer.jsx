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
              <a href="#" aria-label="LinkedIn" className="w-9 h-9 rounded-full bg-[#43403B] text-white grid place-items-center hover:opacity-80 transition">
                <Linkedin />
              </a>
              <a href="#" aria-label="GitHub" className="w-9 h-9 rounded-full bg-[#43403B] text-white grid place-items-center hover:opacity-80 transition">
                <Github />
              </a>
              <a href="#" aria-label="Mail" className="w-9 h-9 rounded-full bg-[#43403B] text-white grid place-items-center hover:opacity-80 transition">
                <Mail />
              </a>
            </div>
          </div>

          <a href="/" className="text-gray-800 underline underline-offset-4 text-base">Home page</a>
        </div>
      </footer>
    );
}
