import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <>
      <footer className="relative w-full mt-28 bg-gradient-to-b from-black via-[#0c0a05] to-black text-gray-400 pt-12 pb-6">
        <div className="absolute top-0 left-0 w-full h-10 bg-gradient-to-t from-transparent to-[#d4af37]/10 pointer-events-none"></div>

        <div className="relative max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <img
                src={assets.logo}
                alt="Madras Matinee Logo"
                className="h-16 w-auto"
              />
              <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
                Experience cinema like never before.
              </p>
            </div>

            <div className="flex flex-wrap gap-6 text-sm">
              <a href="#" className="hover:text-[#d4af37] transition">
                Home
              </a>
              <a href="#" className="hover:text-[#d4af37] transition">
                About Us
              </a>
              <a href="#" className="hover:text-[#d4af37] transition">
                Privacy Policy
              </a>
            </div>
          </div>

          <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-[#d4af37]/25 to-transparent"></div>

          <div className="mt-3 flex flex-col md:flex-row justify-between text-xs text-gray-500">
            <span>© 2025 Madras Matinee. All rights reserved.</span>
            <span>Made with ❤️ for cinema lovers</span>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
