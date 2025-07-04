import { Facebook, Twitter, Instagram, Youtube, Play } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-hero-gradient">
      <div className="w-full flex flex-col gap-9 pt-[70px] pb-10 px-[130px] max-lg:px-8 max-sm:px-4 rounded-tl-[40px] rounded-tr-[40px]">
        {/* Newsletter Section */}
        <div className="w-full border-b border-[#CCD1D2] pb-10">
          <div className="flex flex-col lg:flex-row items-start gap-5 p-8 bg-brand-navy rounded-2xl">
            <h2 className="text-white text-2xl font-gilroy font-bold leading-9 flex-shrink-0">
              Register now so you don't miss our programs
            </h2>
            <div className="flex flex-col sm:flex-row items-stretch gap-3 p-3 bg-white rounded-[14px] w-full lg:max-w-[707px]">
              <input
                type="email"
                placeholder="Enter your Email"
                className="flex-1 py-3.5 px-7 bg-white border border-[#99A2A5] rounded-lg text-sm font-gabarito font-bold placeholder:text-[#99A2A5] focus:outline-none focus:ring-2 focus:ring-brand-navy"
              />
              <button className="w-full sm:w-[163px] flex justify-center items-center gap-2.5 pt-3.5 pb-2.5 px-7 bg-brand-navy rounded-lg text-white font-gabarito font-bold hover:bg-brand-dark-navy transition-colors">
                Subscribe Now
              </button>
            </div>
          </div>

          {/* Social Media Icons */}
          <div className="flex justify-center items-center gap-10 mt-6">
            <Facebook className="w-6 h-6 text-brand-navy hover:text-brand-dark-navy cursor-pointer" />
            <Twitter className="w-6 h-6 text-brand-navy hover:text-brand-dark-navy cursor-pointer" />
            <Instagram className="w-6 h-6 text-brand-navy hover:text-brand-dark-navy cursor-pointer" />
            <Youtube className="w-6 h-6 text-brand-navy hover:text-brand-dark-navy cursor-pointer" />
          </div>
        </div>

        {/* Copyright Section */}
        <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <span className="text-[#667479] text-sm font-gabarito font-bold text-center">
              © 2025 IndiaVetMart. All rights reserved.
            </span>
            <div className="flex items-center gap-8">
              <span className="text-[#667479] text-sm font-gabarito font-bold cursor-pointer hover:text-brand-navy">
                Terms of Service
              </span>
              <span className="text-[#667479] text-sm font-gabarito font-bold cursor-pointer hover:text-brand-navy">
                Privacy Policy
              </span>
            </div>
          </div>
          <div className="w-[157px] h-[48px]">
            <img
              src="/placeholder.svg"
              alt="Logo"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
