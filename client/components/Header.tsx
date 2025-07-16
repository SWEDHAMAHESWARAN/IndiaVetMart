import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  User,
  ChevronDown,
  Menu,
  Package,
  ClipboardList,
  Store,
  BarChart3,
  TrendingUp,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MyContext } from "../App";
import MyClinics from "@/pages/MyClinics";
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const context = useContext(MyContext);
  const { cat, cartData } = context;
  const [selectedClinic, setSelectedClinic] = useState("");
  const [card, setCard] = useState(false);
  const [cartCount, setCardCount] = useState(0);
  const history = useNavigate();
  useEffect(() => {
    const userRaw = localStorage.getItem("user");
    const userDetails = JSON.parse(userRaw);
    const clinicName = localStorage.getItem("clinicName");
    setSelectedClinic(clinicName);

    const clinicrelatedCart = Object.values(cartData || {})
      .flatMap((seller) => seller.items || [])
      .map((item) => item.clinicId);

    const clinicRelatedCartLength = clinicrelatedCart.filter(
      (clinicId) => clinicId === userDetails.clinicId,
    ).length;

    console.log("Clinic-related cart length:", clinicRelatedCartLength);
    setCardCount(clinicRelatedCartLength);

    setCard(clinicrelatedCart.includes(userDetails.clinicId));
  }, [cartData]);

  const orderItems = [
    { label: "Current Orders", icon: ClipboardList },
    { label: "Order History", icon: ClipboardList },
    { label: "Track Order", icon: ClipboardList },
    { label: "Return/Exchange", icon: ClipboardList },
  ];

  const shoppingItems = [
    { label: "Shopping Cart", icon: ShoppingCart },
    { label: "Wishlist", icon: Store },
    { label: "Recently Viewed", icon: Store },
    { label: "Recommendations", icon: Store },
    { label: "Vendor Connections", icon: Store },
    { label: "Budget Management", icon: Store },
  ];

  const clinicItems = [
    { label: "Seven Pet Vet Hospital", location: "Mumbai, Maharashtra" },
    { label: "Blue Cross Animal Hospital", location: "Delhi, NCR" },
    { label: "City Pet Clinic", location: "Bangalore, Karnataka" },
    { label: "Paws & Claws Veterinary", location: "Chennai, Tamil Nadu" },
  ];

  const handleRedirect = (catId: any) => {
    console.log("catId", catId);
    history(`/products/category/${catId}`);
  };
  return (
    <header className="bg-linear-gradient sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 lg:py-4">
        {/* Desktop Header */}
        <div className="hidden lg:flex items-center gap-8">
          {/* Logo */}
          <Link to="/home" className="flex items-center flex-shrink-0">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2Fa5840e9b6f06467fa264b75489f10060%2F5a1e553cf1e64cb19a18a87badeb7713?format=webp&width=800"
              alt="IndiaVetMart"
              className="h-10 w-auto"
            />
          </Link>

          {/* Center Search Bar - Even Bigger and More Prominent */}
          <div className="flex-1 max-w-3xl mx-4">
            <div className="relative">
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-neutral-40 w-6 h-6" />
              <Input
                placeholder="Search by products, category, clinic..."
                className="pl-16 pr-8 py-6 text-lg rounded-full border-2 border-neutral-40 focus:border-primary-dark-blue bg-neutral-0 shadow-md"
              />
            </div>
          </div>

          {/* Navigation Dropdowns */}
          <nav className="flex items-center gap-2">
            {/* Category Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 text-primary-dark-blue hover:bg-secondary-yellow40 font-gabarito font-bold px-4 py-2"
                >
                  Category
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-neutral-0 border border-neutral-20 rounded-lg shadow-lg">
                {cat?.map((item, index) => (
                  <DropdownMenuItem
                    key={index}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-secondary-yellow40 cursor-pointer"
                  >
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-4 h-4 object-contain"
                    />
                    <span
                      className="font-gabarito text-primary-dark-blue"
                      onClick={() => handleRedirect(item?._id)}
                    >
                      {item.name}
                    </span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Orders Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 text-primary-dark-blue hover:bg-secondary-yellow40 font-gabarito font-bold px-4 py-2"
                >
                  Orders
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-neutral-0 border border-neutral-20 rounded-lg shadow-lg">
                {orderItems.map((item, index) => {
                  const getOrderRoute = (label: string) => {
                    switch (label) {
                      case "Order History":
                        return "/orders";
                      case "Current Orders":
                        return "/orders";
                      case "Track Order":
                        return "/orders";
                      case "Return/Exchange":
                        return "/orders";
                      default:
                        return "/orders";
                    }
                  };

                  return (
                    <DropdownMenuItem
                      key={index}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-secondary-yellow40 cursor-pointer"
                      asChild
                    >
                      <Link to={getOrderRoute(item.label)}>
                        <item.icon className="w-4 h-4 text-primary-dark-blue" />
                        <span className="font-gabarito text-primary-dark-blue">
                          {item.label}
                        </span>
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Shopping Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 text-primary-dark-blue hover:bg-secondary-yellow40 font-gabarito font-bold px-4 py-2"
                >
                  Shopping
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-neutral-0 border border-neutral-20 rounded-lg shadow-lg">
                {shoppingItems.map((item, index) => {
                  const getShoppingRoute = (label: string) => {
                    switch (label) {
                      case "Shopping Cart":
                        return "/shopping";
                      case "Wishlist":
                        return "/shopping";
                      case "Recently Viewed":
                        return "/shopping";
                      case "Recommendations":
                        return "/shopping";
                      case "Vendor Connections":
                        return "/vendors";
                      case "Budget Management":
                        return "/budget";
                      default:
                        return "/shopping";
                    }
                  };

                  return (
                    <DropdownMenuItem
                      key={index}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-secondary-yellow40 cursor-pointer"
                      asChild
                    >
                      <Link to={getShoppingRoute(item.label)}>
                        <item.icon className="w-4 h-4 text-primary-dark-blue" />
                        <span className="font-gabarito text-primary-dark-blue">
                          {item.label}
                        </span>
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Reports Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 text-primary-dark-blue hover:bg-secondary-yellow40 font-gabarito font-bold px-4 py-2"
                >
                  Reports
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-neutral-0 border border-neutral-20 rounded-lg shadow-lg">
                <DropdownMenuItem
                  className="flex items-center gap-3 px-4 py-3 hover:bg-secondary-yellow40 cursor-pointer"
                  asChild
                >
                  <Link to="/reports?tab=categories">
                    <BarChart3 className="w-4 h-4 text-primary-dark-blue" />
                    <span className="font-gabarito text-primary-dark-blue">
                      Categories Report
                    </span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center gap-3 px-4 py-3 hover:bg-secondary-yellow40 cursor-pointer"
                  asChild
                >
                  <Link to="/reports?tab=vendors">
                    <TrendingUp className="w-4 h-4 text-primary-dark-blue" />
                    <span className="font-gabarito text-primary-dark-blue">
                      Vendors Report
                    </span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center gap-3 px-4 py-3 hover:bg-secondary-yellow40 cursor-pointer"
                  asChild
                >
                  <Link to="/reports?tab=items">
                    <Package className="w-4 h-4 text-primary-dark-blue" />
                    <span className="font-gabarito text-primary-dark-blue">
                      Items Report
                    </span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center gap-3 px-4 py-3 hover:bg-secondary-yellow40 cursor-pointer"
                  asChild
                >
                  <Link to="/reports">
                    <FileText className="w-4 h-4 text-primary-dark-blue" />
                    <span className="font-gabarito text-primary-dark-blue">
                      All Reports
                    </span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Dynamic Clinic Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 text-primary-dark-blue hover:bg-secondary-yellow40 font-gabarito font-bold px-4 py-2 max-w-[200px]"
                >
                  <User className="w-4 h-4" />
                  <span className="truncate">{selectedClinic}</span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80 bg-neutral-0 border border-neutral-20 rounded-lg shadow-lg">
                <MyClinics />
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Profile Icon */}
            <Link to="/profile">
              <Button
                variant="ghost"
                size="icon"
                className="text-primary-dark-blue hover:bg-secondary-yellow40"
              >
                <User className="w-5 h-5" />
              </Button>
            </Link>

            {/* Shopping Cart */}
            <Link to="/shopping">
              <Button
                variant="ghost"
                size="icon"
                className="text-primary-dark-blue hover:bg-secondary-yellow40 relative"
              >
                <ShoppingCart className="w-5 h-5" />
                {card && (
                  <span className="absolute -top-1 -right-1 bg-state-pink-red text-neutral-0 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>
          </nav>
        </div>

        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between">
          {/* Logo */}
          <Link to="/home" className="flex items-center">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2Fa5840e9b6f06467fa264b75489f10060%2F5a1e553cf1e64cb19a18a87badeb7713?format=webp&width=800"
              alt="IndiaVetMart"
              className="h-8 w-auto"
            />
          </Link>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2">
            {/* Shopping Cart */}
            <Link to="/shopping">
              <Button
                variant="ghost"
                size="icon"
                className="text-primary-dark-blue hover:bg-secondary-yellow40 relative"
              >
                <ShoppingCart className="w-5 h-5" />
                {card && (
                  <span className="absolute -top-1 -right-1 bg-state-pink-red text-neutral-0 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Mobile Menu */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-primary-dark-blue hover:bg-secondary-yellow40"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-neutral-0">
                <SheetHeader>
                  <SheetTitle className="text-primary-dark-blue font-gabarito font-bold">
                    Menu
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col space-y-6 pt-6">
                  {/* Search Bar Mobile */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-40 w-4 h-4" />
                    <Input
                      placeholder="Search products..."
                      className="pl-10 pr-4 py-3 rounded-full border-neutral-40 focus:border-primary-dark-blue bg-neutral-0"
                    />
                  </div>

                  {/* Navigation Links */}
                  <nav className="flex flex-col space-y-4">
                    <Link
                      to="/category"
                      className="text-primary-dark-blue font-gabarito font-bold hover:text-primary-dark-blue80 transition-colors py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Category
                    </Link>
                    <Link
                      to="/orders"
                      className="text-primary-dark-blue font-gabarito font-bold hover:text-primary-dark-blue80 transition-colors py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Orders
                    </Link>
                    <Link
                      to="/shopping"
                      className="text-primary-dark-blue font-gabarito font-bold hover:text-primary-dark-blue80 transition-colors py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Shopping
                    </Link>
                  </nav>

                  {/* User Controls Mobile */}
                  <div className="border-t border-neutral-20 pt-4">
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-3 text-primary-dark-blue hover:bg-secondary-yellow40 p-3"
                    >
                      <User className="w-5 h-5" />
                      <span className="font-gilroy font-light">
                        Select Clinic
                      </span>
                      <ChevronDown className="w-4 h-4 ml-auto" />
                    </Button>
                    <Link to="/profile">
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 text-primary-dark-blue hover:bg-secondary-yellow40 p-3 mt-2"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <User className="w-5 h-5" />
                        <span className="font-gilroy font-light">
                          My Profile
                        </span>
                      </Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mobile Search Bar (below header) */}
        <div className="lg:hidden mt-4">
          <div className="relative">
            <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-neutral-40 w-6 h-6" />
            <Input
              placeholder="Search by products, category, clinic..."
              className="pl-16 pr-8 py-6 text-lg rounded-full border-2 border-neutral-40 focus:border-primary-dark-blue bg-neutral-0 w-full shadow-md"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
