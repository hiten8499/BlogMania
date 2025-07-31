import React from 'react';
import { assets, footer_data } from '../assets/assets';

const Footer = () => {
  return (
    <footer className="bg-[#0d0d0d] text-gray-300 px-6 md:px-16 lg:px-24 xl:px-32 border-t border-gray-800">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row justify-between gap-10 py-14 border-b border-gray-800">
        {/* Logo & Description */}
        <div className="max-w-lg">
          <img src={assets.logo} alt="logo" className="w-36 mb-6" />
          <p className="text-sm leading-relaxed text-gray-400">
            <strong className="text-white">BlogMania-HOH</strong> is your go-to destination for insightful articles,
            tutorials, and industry updates across tech, lifestyle, and more.
            We’re passionate about delivering valuable content to curious minds around the world.
            Stay connected. Stay inspired.
          </p>
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 w-full md:w-[50%] text-sm">
          {footer_data.map((section, index) => (
            <div key={index}>
              <h3 className="text-base font-semibold text-white uppercase mb-3 tracking-wide">
                {section.title}
              </h3>
              <ul className="space-y-1 text-gray-400">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <a href="#" className="hover:text-red-500 transition">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="py-6 text-center text-xs text-gray-500 tracking-wide">
        &copy; 2025 Hardik,Om & Hiten. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
