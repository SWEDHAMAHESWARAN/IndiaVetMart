import { Search, User, ShoppingCart, ChevronDown, LogOut } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";

export function Header() {
  const { user, logout } = useAuth();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  return (
    <header className="w-full h-[123px] flex items-center px-[130px] max-lg:px-8 max-sm:px-4">
      <div className="w-full flex items-center gap-3">
        {/* Logo */}
        <div className="flex-shrink-0">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2Fe33c04ad181d47968df9f3990555750a%2F9cc201b9ffd546c487ca47797b751f54?format=webp&width=800"
            alt="IndiaVetMart Logo"
            className="w-[150px] h-[40px] object-contain"
          />
        </div>

        {/* Navigation */}
        <div className="flex-1 flex items-center justify-between gap-5 max-lg:gap-3">
          {/* Search Bar */}
          <div className="flex items-center gap-3 py-3 px-4 border border-brand-neutral-40 rounded-[46px] min-w-[300px] max-lg:min-w-[200px] max-sm:min-w-[150px]">
            <Search className="w-5 h-5 text-brand-neutral-40" />
            <span
              className="text-brand-neutral-40 text-sm font-bold"
              style={{ fontFamily: "Gabarito, Inter, sans-serif" }}
            >
              Search by products, category...
            </span>
          </div>

          {/* Menu Items */}
          <div className="hidden lg:flex items-center gap-5">
            <span
              className="text-brand-navy font-bold cursor-pointer hover:text-brand-dark-navy transition-colors"
              style={{ fontFamily: "Gabarito, Inter, sans-serif" }}
            >
              Category
            </span>
            <span
              className="text-brand-navy font-bold cursor-pointer hover:text-brand-dark-navy transition-colors"
              style={{ fontFamily: "Gabarito, Inter, sans-serif" }}
            >
              Orders
            </span>
            <span
              className="text-brand-navy font-bold cursor-pointer hover:text-brand-dark-navy transition-colors"
              style={{ fontFamily: "Gabarito, Inter, sans-serif" }}
            >
              Shopping
            </span>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Clinic Dropdown */}
            <div className="hidden lg:flex items-center gap-1 px-2 py-2">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 flex items-center justify-center">
                  <div className="w-4 h-4 bg-brand-neutral-40 rounded-full"></div>
                </div>
                <span
                  className="text-brand-dark-navy font-light"
                  style={{ fontFamily: "SVN-Gilroy, Inter, sans-serif" }}
                >
                  Clinic
                </span>
              </div>
              <ChevronDown className="w-6 h-6 text-brand-neutral-60" />
            </div>

            {/* User and Cart Icons */}
            <div className="flex items-center gap-4">
              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-2 p-2 hover:bg-brand-neutral-10 rounded-full transition-colors"
                >
                  <User className="w-6 h-6 text-brand-navy" />
                  {user && (
                    <span
                      className="hidden md:block text-brand-navy font-medium text-sm"
                      style={{ fontFamily: "Gabarito, Inter, sans-serif" }}
                    >
                      {user.name}
                    </span>
                  )}
                  <ChevronDown className="w-4 h-4 text-brand-navy" />
                </button>

                {/* Dropdown Menu */}
                {showUserDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-brand-neutral-20 py-2 z-50">
                    <div className="px-4 py-2 border-b border-brand-neutral-20">
                      <p
                        className="text-brand-navy font-bold text-sm"
                        style={{ fontFamily: "Gabarito, Inter, sans-serif" }}
                      >
                        {user?.name}
                      </p>
                      <p
                        className="text-brand-neutral-60 text-xs"
                        style={{ fontFamily: "Gabarito, Inter, sans-serif" }}
                      >
                        {user?.email}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setShowUserDropdown(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-left text-brand-navy hover:bg-brand-neutral-10 transition-colors"
                      style={{ fontFamily: "Gabarito, Inter, sans-serif" }}
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>

              <button className="p-2 hover:bg-brand-neutral-10 rounded-full transition-colors">
                <ShoppingCart className="w-6 h-6 text-brand-navy" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
