import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-hero-gradient">
      <div className="w-full flex flex-col gap-9 pt-[70px] pb-10 px-[130px] max-lg:px-8 max-sm:px-4 rounded-tl-[40px] rounded-tr-[40px]">
        {/* Newsletter Section */}
        <div className="w-full border-b border-brand-neutral-20 pb-10">
          <div className="flex flex-col lg:flex-row items-start gap-5 p-8 bg-brand-navy rounded-2xl">
            <h2
              className="text-white text-2xl font-bold leading-9 flex-shrink-0"
              style={{ fontFamily: "SVN-Gilroy, Inter, sans-serif" }}
            >
              Register now so you don't miss our programs
            </h2>
            <div className="flex flex-col sm:flex-row items-stretch gap-3 p-3 bg-white rounded-[14px] w-full lg:max-w-[707px]">
              <input
                type="email"
                placeholder="Enter your Email"
                className="flex-1 py-3.5 px-7 bg-white border border-brand-neutral-40 rounded-lg text-sm font-bold placeholder:text-brand-neutral-40 focus:outline-none focus:ring-2 focus:ring-brand-navy"
                style={{ fontFamily: "Gabarito, Inter, sans-serif" }}
              />
              <button
                className="w-full sm:w-[163px] flex justify-center items-center gap-2.5 pt-3.5 pb-2.5 px-7 bg-brand-navy rounded-lg text-white font-bold hover:bg-brand-dark-navy transition-colors"
                style={{ fontFamily: "Gabarito, Inter, sans-serif" }}
              >
                Subscribe Now
              </button>
            </div>
          </div>

          {/* Social Media Icons */}
          <div className="flex justify-center items-center gap-10 mt-6">
            <Facebook className="w-6 h-6 text-brand-navy hover:text-brand-dark-navy cursor-pointer transition-colors" />
            <Twitter className="w-6 h-6 text-brand-navy hover:text-brand-dark-navy cursor-pointer transition-colors" />
            <Instagram className="w-6 h-6 text-brand-navy hover:text-brand-dark-navy cursor-pointer transition-colors" />
            <Youtube className="w-6 h-6 text-brand-navy hover:text-brand-dark-navy cursor-pointer transition-colors" />
          </div>
        </div>

        {/* Copyright Section */}
        <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <span
              className="text-brand-neutral-60 text-sm font-bold text-center"
              style={{ fontFamily: "Gabarito, Inter, sans-serif" }}
            >
              © 2025 IndiaVetMart. All rights reserved.
            </span>
            <div className="flex items-center gap-8">
              <span
                className="text-brand-neutral-60 text-sm font-bold cursor-pointer hover:text-brand-navy transition-colors"
                style={{ fontFamily: "Gabarito, Inter, sans-serif" }}
              >
                Terms of Service
              </span>
              <span
                className="text-brand-neutral-60 text-sm font-bold cursor-pointer hover:text-brand-navy transition-colors"
                style={{ fontFamily: "Gabarito, Inter, sans-serif" }}
              >
                Privacy Policy
              </span>
            </div>
          </div>
          <div className="w-[157px] h-[48px]">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2Fe33c04ad181d47968df9f3990555750a%2F9cc201b9ffd546c487ca47797b751f54?format=webp&width=800"
              alt="IndiaVetMart Logo"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
