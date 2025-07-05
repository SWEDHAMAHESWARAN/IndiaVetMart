import React from "react";

export const Loading: React.FC = () => {
  return (
    <div className="min-h-screen bg-hero-gradient flex items-center justify-center">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="w-[300px] h-[300px] bg-brand-yellow opacity-20 rounded-full absolute -top-20 -left-20"></div>
        <div className="w-[200px] h-[200px] bg-brand-navy opacity-10 rounded-full absolute top-1/4 right-0"></div>
        <div className="w-[150px] h-[150px] bg-brand-yellow-80 opacity-15 rounded-full absolute bottom-20 left-1/4"></div>
      </div>

      <div className="text-center relative z-10">
        <img
          src="https://cdn.builder.io/api/v1/image/assets%2Fe33c04ad181d47968df9f3990555750a%2F9cc201b9ffd546c487ca47797b751f54?format=webp&width=800"
          alt="IndiaVetMart"
          className="w-48 h-12 mx-auto object-contain mb-8"
        />

        <div className="relative">
          <div className="animate-spin w-12 h-12 border-4 border-brand-navy border-t-transparent rounded-full mx-auto mb-6"></div>
          <div className="animate-pulse w-8 h-8 bg-brand-yellow rounded-full absolute top-2 left-1/2 transform -translate-x-1/2"></div>
        </div>

        <h1
          className="text-brand-navy text-2xl font-bold mb-2"
          style={{ fontFamily: "SVN-Gilroy, Inter, sans-serif" }}
        >
          Welcome to IndiaVetMart
        </h1>

        <p
          className="text-brand-neutral-60 font-medium"
          style={{ fontFamily: "Gabarito, Inter, sans-serif" }}
        >
          Loading your veterinary marketplace...
        </p>
      </div>
    </div>
  );
};
