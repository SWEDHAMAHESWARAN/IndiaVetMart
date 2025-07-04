import { Search, User, ShoppingCart, ChevronDown } from "lucide-react";

export function Header() {
  return (
    <header className="w-full h-[123px] flex items-center px-[130px] max-lg:px-8 max-sm:px-4">
      <div className="w-full flex items-center gap-3">
        {/* Logo */}
        <div className="flex-shrink-0">
          <img
            src="/placeholder.svg"
            alt="IndiaVetMart Logo"
            className="w-[150px] h-[40px] object-contain"
          />
        </div>

        {/* Navigation */}
        <div className="flex-1 flex items-center justify-between gap-5 max-lg:gap-3">
          {/* Search Bar */}
          <div className="flex items-center gap-3 py-3 px-4 border border-[#99A2A5] rounded-[46px] min-w-[300px] max-lg:min-w-[200px] max-sm:min-w-[150px]">
            <Search className="w-5 h-5 text-[#99A2A5]" />
            <span className="text-[#99A2A5] text-sm font-gabarito font-bold">
              Search by products, category...
            </span>
          </div>

          {/* Menu Items */}
          <div className="hidden lg:flex items-center gap-5">
            <span className="text-brand-navy font-gabarito font-bold cursor-pointer hover:text-brand-dark-navy">
              Category
            </span>
            <span className="text-brand-navy font-gabarito font-bold cursor-pointer hover:text-brand-dark-navy">
              Orders
            </span>
            <span className="text-brand-navy font-gabarito font-bold cursor-pointer hover:text-brand-dark-navy">
              Shopping
            </span>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Clinic Dropdown */}
            <div className="hidden lg:flex items-center gap-1 px-2 py-2">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 flex items-center justify-center">
                  <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                </div>
                <span className="text-brand-dark-navy font-gilroy font-light">
                  Clinic
                </span>
              </div>
              <ChevronDown className="w-6 h-6 text-gray-600" />
            </div>

            {/* User and Cart Icons */}
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <User className="w-6 h-6 text-brand-navy" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <ShoppingCart className="w-6 h-6 text-brand-navy" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
