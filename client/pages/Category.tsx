import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Star,
  Lock,
  Truck,
  Info,
  ShoppingCart,
} from "lucide-react";
import  DOMPurify  from "dompurify";
import { fetchDataFromApi } from "@/lib/api";
import { MyContext } from "@/App";
import { Tab } from "../components/ui/tab";
import { Rupee } from "@/components/constants/CurrencyConst";

// Define types for API integration
interface VendorPrice {
  vendor: string;
  price: string;
  inStock: boolean;
  shipping?: string;
}

interface Product {
  id: number;
  name: string;
  gene: string;
  price: string;
  image: string;
  category: string;
  vendor: string;
  rating?: number;
  reviewCount?: number;
  inStock: boolean;
  vendors?: VendorPrice[];
}

interface CategoryData {
  id: string;
  name: string;
  productCount: number;
  description?: string;
}

export default function Category() {
  //get the Params id
  const { id } = useParams();
  //context
  const context = useContext(MyContext);
  const { frequencyProducts, recentOrders, cat, vendors, user, Permission } =
    context;
  //variable set useState
  const [products, setProducts] = useState<any>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(id);
  const [selectedVendorId, setSelectedVendorId] = useState(null);
  const [availability, setSelectedAvailability] = useState(null);
  const [range, setRange] = useState({ min: "", max: "" });
  const [price, setPrice] = useState(null);
  const [verified, setVerified] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const totalItems = products.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const [minValue, setMinValue] = useState<number | undefined>(undefined);
  const [maxValue, setMaxValue] = useState<number | undefined>(undefined);

  const [selectedFilters, setSelectedFilters] = useState({
    recentlyPurchased: ["Flury pert Bow| Add a T..."],
    frequentlyOrdered: ["Flury pert Bow| Add a Touch...."],
    categories: ["Pet Care"],
    vendors: [],
    availability: [],
    price: { min: "", max: "" },
    rating: [],
    favorites: false,
  });

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [connectedVendors, setConnectedVendors] = useState<string[]>([
    "Flury", // Example connected vendor
  ]);
  const [showConnectionDialog, setShowConnectionDialog] = useState(false);
  const [selectedVendorForConnection, setSelectedVendorForConnection] =
    useState<string>("");
  const [showFilters, setShowFilters] = useState(false);

  // Filter handler functions
  const handleFilterChange = (filterType: string, value: any) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(range.max, range.min);
    const { name, value } = e.target;
    setRange((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleCheckboxFilter = (
    filterType: string,
    item: string,
    checked: boolean,
  ) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterType]: checked
        ? [...(prev[filterType as keyof typeof prev] as string[]), item]
        : (prev[filterType as keyof typeof prev] as string[]).filter(
            (i) => i !== item,
          ),
    }));
  };

  const isVendorConnected = (vendorName: string) => {
    return connectedVendors.includes(vendorName);
  };

  const handleAddToCart = (vendor: string, productId: number) => {
    if (!isVendorConnected(vendor)) {
      setSelectedVendorForConnection(vendor);
      setShowConnectionDialog(true);
      return;
    }

    // Add to cart logic here
    console.log(`Adding product ${productId} from ${vendor} to cart`);
  };

  // Sample data - in real app, this would come from API added useEffect
  useEffect(() => {
    const isVerified = localStorage.getItem("isVerified");
    setVerified(isVerified);
    let userDetails: any;
    try {
      const users = user;
      userDetails = JSON.parse(users);
      console.log(userDetails.userId);
    } catch {
      console.error("Failed to Parse user from context");
    }
    let apiEndPoint = `/api/products/fiterByPrice?catId=${selectedCategoryId}&userid=${userDetails?.userId}&clinicid=${userDetails.clinicId}`;
    if (selectedVendorId) {
      apiEndPoint += `&sellerid=${selectedVendorId}`;
    }
    if (availability) {
      apiEndPoint += `&availability=${availability}`;
    }
    if (range.max && range.min) {
     
      apiEndPoint += `&minPrice=${range.min ? range.min : ""}&maxPrice=${range.max ? range.max : ""}`;
      console.log("apiend", apiEndPoint);
    }
    fetchDataFromApi(apiEndPoint).then((res) => {
      console.log("res", res.products);
      setProducts(Array.isArray(res?.products) ? res.products : []);
    });
  }, [selectedCategoryId, selectedVendorId, availability, range]);
  // Filter products based on selected filters
  const filteredProducts = products.filter((product: any) => {
    // Category filter
    if (
      selectedFilters.categories.length > 0 &&
      !selectedFilters.categories.includes(product.category)
    ) {
      return false;
    }

    // Vendor filter
    if (
      selectedFilters.vendors.length > 0 &&
      !selectedFilters.vendors.includes(product.vendor)
    ) {
      return false;
    }

    // Availability filter
    if (selectedFilters.availability.length > 0) {
      if (
        selectedFilters.availability.includes("In Stock") &&
        !product.inStock
      ) {
        return false;
      }
      if (
        selectedFilters.availability.includes("Out of Stock") &&
        product.inStock
      ) {
        return false;
      }
    }

    // Price filter
    if (selectedFilters.price.min || selectedFilters.price.max) {
      const price = parseFloat(product.price.replace(/[^\d.]/g, ""));
      const minPrice = selectedFilters.price.min
        ? parseFloat(selectedFilters.price.min)
        : 0;
      const maxPrice = selectedFilters.price.max
        ? parseFloat(selectedFilters.price.max)
        : Infinity;
      if (price < minPrice || price > maxPrice) {
        return false;
      }
    }

    // Rating filter
    if (selectedFilters.rating.length > 0 && product.rating) {
      const hasMatchingRating = selectedFilters.rating.some((rating) => {
        const ratingValue = parseInt(rating);
        return product.rating! >= ratingValue;
      });
      if (!hasMatchingRating) {
        return false;
      }
    }

    return true;
  });
  const [filterSections, setFilterSections] = useState([
    {
      title: "Recently Purchased Products",
      items: frequencyProducts.map((item) => item.name),
      selected: frequencyProducts
        .filter((item) => String(item._id) === String(id))
        .map((item) => item.name),
    },
    {
      title: "Frequently Ordered Products",
      items: recentOrders.map((item) => item.name),
      selected: selectedFilters.frequentlyOrdered,
    },
    {
      title: "Product Categories",
      items: cat.map((item) => item.name),

      selected: cat
        .filter((item) => id.includes(item._id))
        .map((item) => item.name),
    },
    {
      title: "Vendors",
      items: vendors.map((item) => item.businessname),
      selected: [],
    },
    {
      title: "Availability",
      items: ["In Stock", "Out Of Stock"],
      selected: [],
    },
  ]);
  const toggleSelection = (sectionIndex: any, item: any) => {
    setFilterSections((prev) =>
      prev.map((section, idx) => {
        if (idx !== sectionIndex) return section;

        const isSingleSelect = [
          "Product Categories",
          "Vendors",
          "Availability",
        ].includes(section.title);

        const alreadySelected = section.selected.includes(item);

        const newSelected = isSingleSelect
          ? alreadySelected
            ? []
            : [item]
          : alreadySelected
            ? section.selected.filter((i) => i !== item)
            : [...section.selected, item];

        if (section.title === "Product Categories") {
          const selectedCat = cat.find((c) => c.name === item);
          setSelectedCategoryId(
            !alreadySelected && selectedCat?._id ? selectedCat._id : null,
          );
        }

        if (section.title === "Vendors") {
          const selectedVendor = vendors.find((v) => v.businessname === item);
          if (alreadySelected) {
            setSelectedVendorId(null);
          } else if (selectedVendor?._id) {
            setSelectedVendorId(selectedVendor._id);
          }
        }

        if (section.title === "Availability") {
          if (alreadySelected) {
            setSelectedAvailability(null);
          } else {
            const value = item.toLowerCase().includes("in")
              ? "instock"
              : "outofstock";
            setSelectedAvailability(value);
          }
        }

        return { ...section, selected: newSelected };
      }),
    );
  };
  const selectedCategory = cat.find((c) => c._id === selectedCategoryId);
  const displayProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, "....", totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(
          1,
          "...",
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages,
        );
      }
    }
    return pages;
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-linear-gradient relative overflow-hidden rounded-b-[20px]">
        <div className="absolute inset-0">
          <div className="absolute w-[816px] h-[799px] bg-primary-dark-blue rounded-[99px] transform rotate-[160.22deg] -right-[200px] -top-[164px] opacity-80"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="relative order-first lg:order-first">
              <img
                src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=650&h=301&fit=crop&crop=center"
                alt="Happy pets"
                className="w-full h-[301px] object-cover rounded-xl"
              />
            </div>
            <div className="space-y-6 text-right">
              <h1 className="text-4xl lg:text-5xl  font-light text-white leading-tight">
                One more friend
              </h1>
              <h2 className="text-3xl lg:text-4xl  font-bold text-white leading-tight">
                Thousands more fun!
              </h2>
              <p className="text-neutral-200 text-sm font-gabarito font-bold max-w-lg ml-auto">
                Having a pet means you have more joy, a new friend, a happy
                person who will always be with you to have fun. We have 200+
                different pets that can meet your needs!
              </p>
              <Button className="bg-white text-primary-dark-blue hover:bg-neutral-100 rounded-full px-8 py-3 font-gabarito font-bold">
                Explore Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-6">
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            className="w-full border-primary-dark-blue text-primary-dark-blue hover:bg-secondary-yellow40 rounded-lg"
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
            <ChevronDown
              className={`w-4 h-4 ml-2 transition-transform ${showFilters ? "rotate-180" : ""}`}
            />
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 ">
          {/* Filter Sidebar */}
          <div
            className={` lg:w-[280px] flex-shrink-0 ${showFilters ? "block " : "hidden lg:block"} `}
          >
            <h3 className="text-2xl font-gabarito font-medium text-primary-dark-blue mb-6">
              Filter
            </h3>

            <div className="space-y-6">
              {filterSections.map((section, sectionIndex) => (
                <div
                  key={sectionIndex}
                  className="border-b border-neutral-30 pb-4"
                >
                  <h4 className=" font-bold text-neutral-100 mb-4 text-base">
                    {section.title}
                  </h4>
                  <div className="space-y-2">
                    {section.items.map((item, itemIndex) => (
                      <label
                        key={itemIndex}
                        className="flex items-center gap-2.5 cursor-pointer"
                        onClick={() => toggleSelection(sectionIndex, item)}
                      >
                        <div
                          className={`w-4 h-4 border border-neutral-60 rounded flex items-center justify-center ${
                            section.selected.includes(item)
                              ? "bg-primary-dark-blue"
                              : "bg-white"
                          }`}
                        >
                          {section.selected.includes(item) && (
                            <svg
                              className="w-3 h-3 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                        <span className="text-sm  font-light text-neutral-100">
                          {item}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              {/* Price Range */}
              <div className="border-b border-neutral-30 pb-4">
                <h4 className="font-gabarito font-medium text-neutral-100 mb-4">
                  Price
                </h4>
                <div className="flex gap-2.5">
                  <div className="flex-1 border-b border-neutral-30 pb-2.5">
                    <div className="flex items-center justify-between">
                      <input
                        type="number"
                        value={range.min ?? ""}
                        min={0}
                        name="min"
                        placeholder="Min"
                        onChange={handleRangeChange}
                        className="text-sm  font-light text-neutral-100 border border-gray-300 rounded-md px-2 py-1  focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                      />
                    </div>
                  </div>
                  <div className="flex-1 border-b border-neutral-30 pb-2.5">
                    <div className="flex items-center justify-between">
                      <input
                        type="number"
                        value={range.max ?? ""}
                        name="max"
                        min={0}
                        placeholder="Min"
                        onChange={handleRangeChange}
                        className="text-sm  font-light text-neutral-100 border border-gray-300 rounded-md px-2 py-1  focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="border-b border-neutral-30 pb-4">
                <h4 className="font-gabarito font-medium text-neutral-100 mb-4">
                  Rating
                </h4>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <label
                      key={rating}
                      className="flex items-center gap-2.5 cursor-pointer"
                      onClick={() => {
                        const isChecked = selectedFilters.rating.includes(
                          rating.toString(),
                        );
                        handleCheckboxFilter(
                          "rating",
                          rating.toString(),
                          !isChecked,
                        );
                      }}
                    >
                      <div
                        className={`w-4 h-4 border border-neutral-60 rounded bg-white flex items-center justify-center ${
                          selectedFilters.rating.includes(rating.toString())
                            ? "bg-primary-dark-blue border-primary-dark-blue"
                            : ""
                        }`}
                      >
                        {selectedFilters.rating.includes(rating.toString()) && (
                          <div className="w-2 h-2 bg-white rounded-sm"></div>
                        )}
                      </div>
                      <div className="flex">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < rating
                                ? "text-secondary-yellow fill-secondary-yellow"
                                : "text-neutral-40"
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-sm text-neutral-60">
                          & up
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="flex-1">
            <div className="sticky top-24">
              {/* Header with filters and view options */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-gabarito font-black text-primary-dark-blue">
                    {selectedCategory?.vendorCategoryName ||
                      selectedCategory?.name ||
                      "Category"}{" "}
                  </h2>
                  <span className="text-sm font-medium text-neutral-60 px-3 py-1 rounded-full">
                    {products.length} Products
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {/* View Mode Toggle */}
                  <div className="flex items-center  rounded-lg p-1">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded ${viewMode === "grid" ? "bg-primary-dark-blue text-white" : "text-neutral-60"}`}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded ${viewMode === "list" ? "bg-primary-dark-blue text-white" : "text-neutral-60"}`}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 8a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 12a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 16a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
                      </svg>
                    </button>
                  </div>

                  {/* Sort Dropdown */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-neutral-30 rounded-lg px-4 py-2 text-sm font-gabarito font-medium text-neutral-60 bg-white focus:outline-none focus:ring-2 focus:ring-primary-dark-blue/20"
                  >
                    <option value="newest">Newest</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="popular">Most Popular</option>
                  </select>
                </div>
              </div>

              {/* Products Grid/List */}
              <div
                className={`gap-6 ${
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3"
                    : "flex flex-col space-y-4"
                }`}
              >
                {displayProducts.map((product: any) => (
                  <>
                    {viewMode === "grid" ? (
                      <Card className="bg-white shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer rounded-xl overflow-hidden border border-neutral-20 group-hover:border-primary-dark-blue/30">
                        <CardContent className="p-4">
                          <Link to={`/product/${product._id}`}>
                          <div className="relative">
                            <div className="aspect-square bg-neutral-10 rounded-lg mb-4 overflow-hidden">
                              <img
                                src={product.images}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                            {product.vendors?.some((vendor) =>
                              vendor.variants?.some((variant) =>
                                ["instock", "in_stock"].includes(
                                  variant.stock_status?.toLowerCase(),
                                ),
                              ),
                            ) ? (
                              <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                                In Stock
                              </div>
                            ) : (
                              <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                Out of Stock
                              </div>
                            )}

                            {product.rating && (
                              <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
                                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                <span className="text-xs font-medium">
                                  {product.rating}
                                </span>
                              </div>
                            )}
                          </div>
                          </Link>
                          

                          <div className="space-y-2">
                            <h3 className=" font-medium text-neutral-100 leading-5 line-clamp-2 group-hover:text-primary-dark-blue transition-colors">
                              {product.name}
                            </h3>
                            <div className="flex items-center gap-4 text-xs text-neutral-60">
                              <span>
                                By{" "}
                                {product.vendors.map(
                                  (item: any) => item?.vendorName,
                                )}
                              </span>
                              {product.reviewCount && (
                                <span>({product.reviewCount} reviews)</span>
                              )}
                            </div>

                            <div className="flex items-center justify-between">
                              <p className="text-lg font-gabarito font-bold text-primary-dark-blue">
                                {Rupee}
                                {product.vendors.map((item: any) => item.price)}
                              </p>
                              {verified === "approved" &&
                                Permission?.some(
                                  (perm) =>
                                    typeof perm === "string" &&
                                    perm.trim().toLowerCase() === "add to cart",
                                ) &&
                                product.vendors?.some(
                                  (vendor) =>
                                    vendor.isAssociated &&
                                    vendor.variants?.some((variant) =>
                                      ["instock", "in_stock"].includes(
                                        variant.stock_status?.toLowerCase(),
                                      ),
                                    ),
                                ) && (
                                  <Button
                                    size="sm"
                                    className="bg-primary-dark-blue hover:bg-primary-dark-blue80 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      // Your add-to-cart logic here
                                    }}
                                  >
                                    Add to Cart
                                  </Button>
                                )}

                              {verified === "approved" &&
                                Permission?.some(
                                  (perm) =>
                                    typeof perm === "string" &&
                                    perm.trim().toLowerCase() ===
                                      "vendor management",
                                ) &&
                                product.vendors?.some(
                                  (vendor:any) =>
                                    !vendor?.isAssociated &&
                                    vendor.variants?.some((variant:any) =>
                                      ["instock", "in_stock"].includes(
                                        variant.stock_status?.toLowerCase(),
                                      ),
                                    ),
                                ) && (
                                  <Button
                                    size="sm"
                                    className="bg-primary-dark-blue hover:bg-primary-dark-blue80 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      // Your add-to-cart logic here
                                    }}
                                  >
                                    Connect
                                  </Button>
                                )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      <Card className="bg-white shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer rounded-xl overflow-hidden border border-neutral-20 group-hover:border-primary-dark-blue/30">
                        <CardContent className="p-4">
                          <div className="flex flex-col md:flex-row gap-4">
                            {/* Product Image */}
                            <div className="w-full md:w-24 h-40 md:h-24 bg-neutral-10 rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src={product.images}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>

                            {/* Product Content */}
                            <CardContent className="p-4">
                              <div className="flex flex-col md:flex-row md:items-start md:gap-6">
                                <div className="flex-1 space-y-3">
                                  <div>
                                    <h3 className="font-medium text-neutral-100 leading-5 group-hover:text-primary-dark-blue transition-colors">
                                      {product.name}
                                    </h3>

                                    <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-60 mt-1">
                                      <span>
                                        Category:&nbsp;
                                        {product.vendors
                                          .map((v: any) => v?.vendorName)
                                          .join(", ")}
                                      </span>

                                      {product.reviewCount && (
                                        <div className="flex items-center gap-1">
                                          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                          <span>
                                            {product.rating} (
                                            {product.reviewCount})
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="mt-4 md:mt-0 md:w-72 xl:w-80 space-y-2">
                                  {product.vendors &&
                                  product.vendors.length > 0 ? (
                                    <>
                                      <p className="text-xs font-bold text-neutral-80">
                                        Available from {product.vendors.length}{" "}
                                        vendor
                                        {product.vendors.length > 1 && "s"}:
                                      </p>

                                      {product.vendors.map(
                                        (v: any, i: number) => (
                                          <div
                                            key={i}
                                            className="flex justify-between items-center bg-neutral-10 p-2 rounded-lg gap-2"
                                          >
                                            {/* vendor name / stock / shipping */}
                                            <div className="flex items-center gap-2">
                                              <span className="text-sm font-gabarito font-medium text-primary-dark-blue">
                                                {v.vendorName}
                                              </span>

                                              <span
                                                className={`text-xs px-2 py-1 rounded-full ${
                                                  v.inStock
                                                    ? "bg-green-50 text-green-800"
                                                    : "bg-red-50 text-red-800"
                                                }`}
                                              >
                                                <Truck className="inline-block w-4 h-4" />
                                              </span>

                                              {v.shipping && (
                                                <span className="text-xs text-neutral-60">
                                                  Shipping: {v.shipping}
                                                </span>
                                              )}
                                            </div>

                                            <div className="flex items-center gap-2">
                                              <span className="text-lg font-gabarito font-bold text-primary-dark-blue">
                                                {Rupee} {v.price}
                                              </span>

                                              <Button
                                                size="sm"
                                                disabled={
                                                  !v.inStock ||
                                                  !isVendorConnected(v.vendor)
                                                }
                                                className={`rounded-lg ${
                                                  v.inStock &&
                                                  isVendorConnected(v.vendor)
                                                    ? "bg-primary-dark-blue hover:bg-primary-dark-blue80 text-white"
                                                    : "bg-neutral-40 text-neutral-60 cursor-not-allowed"
                                                }`}
                                                onClick={(e) => {
                                                  e.preventDefault();
                                                  handleAddToCart(
                                                    v.vendor,
                                                    product.id,
                                                  );
                                                }}
                                              >
                                                {isVendorConnected(v.vendor) ? (
                                                  v.inStock ? (
                                                    "Add to Cart"
                                                  ) : (
                                                    "Out of Stock"
                                                  )
                                                ) : (
                                                  <>
                                                    <Lock className="w-3 h-3 mr-1" />
                                                    Connect
                                                  </>
                                                )}
                                              </Button>
                                            </div>
                                          </div>
                                        ),
                                      )}
                                    </>
                                  ) : (
                                    /* single‑vendor fallback */
                                    <div className="flex justify-between items-center bg-neutral-10 p-2 rounded-lg">
                                      <div className="space-y-1">
                                        <span className="text-sm font-gabarito font-medium text-primary-dark-blue">
                                          By {product.vendor}
                                        </span>
                                        <span
                                          className={`text-xs px-2 py-1 rounded-full ${
                                            product.inStock
                                              ? "bg-green-100 text-green-800"
                                              : "bg-red-100 text-red-800"
                                          }`}
                                        >
                                          {product.inStock
                                            ? "In Stock"
                                            : "Out of Stock"}
                                        </span>
                                      </div>

                                      <div className="text-right space-y-1">
                                        <p className="text-lg font-gabarito font-bold text-primary-dark-blue">
                                          {product.price}
                                        </p>
                                        <Button
                                          size="sm"
                                          disabled={
                                            !isVendorConnected(product.vendor)
                                          }
                                          className={`rounded-lg ${
                                            isVendorConnected(product.vendor)
                                              ? "bg-primary-dark-blue hover:bg-primary-dark-blue80 text-white"
                                              : "bg-neutral-40 text-neutral-60 cursor-not-allowed"
                                          }`}
                                          onClick={(e) => {
                                            e.preventDefault();
                                            handleAddToCart(
                                              product.vendor,
                                              product.id,
                                            );
                                          }}
                                        >
                                          {isVendorConnected(product.vendor) ? (
                                            "Add to Cart"
                                          ) : (
                                            <>
                                              <Lock className="w-3 h-3 mr-1" />
                                              Connect
                                            </>
                                          )}
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </div>
                        </CardContent>
                        <Tab
                          defaultTabId="details"
                          tabs={[
                            {
                              id: "details",
                              label: "Details",
                              icon: <Info size={18} />,
                              content: <p>{product.description}</p>,
                            },
                            {
                              id: "orders",
                              label: "Orders",
                              icon: <ShoppingCart size={18} />,
                              content: (
                                <p>Order history, delivery info, etc.</p>
                              ),
                            },
                            {
                              id: "reviews",
                              label: "Reviews",
                              icon: <Star size={18} />,
                              content: (
                                <p>⭐️⭐️⭐️⭐️☆ 4.2 / 5 · 166 reviews</p>
                              ),
                            },
                          ]}
                        />
                      </Card>
                    )}
                  </>
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-8 flex items-center justify-between">
                <p className="text-sm text-neutral-60">
                  Showing {(currentPage - 1) * itemsPerPage + 1}–
                  {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
                  {totalItems} products
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-neutral-60"
                    onClick={() =>
                      currentPage > 1 && setCurrentPage(currentPage - 1)
                    }
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <div className="flex items-center gap-1">
                    {getPageNumbers().map((page, index) => (
                      <Button
                        key={index}
                        variant={page === currentPage ? "default" : "ghost"}
                        size="sm"
                        disabled={page === "..."}
                        onClick={() =>
                          typeof page === "number" && setCurrentPage(page)
                        }
                        className={
                          page === currentPage
                            ? "bg-primary-dark-blue text-white"
                            : "text-neutral-60"
                        }
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-neutral-60"
                    onClick={() =>
                      currentPage < totalPages &&
                      setCurrentPage(currentPage + 1)
                    }
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vendor Connection Dialog */}
      <Dialog
        open={showConnectionDialog}
        onOpenChange={setShowConnectionDialog}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-primary-dark-blue font-gabarito">
              Vendor Connection Required
            </DialogTitle>
            <DialogDescription>
              You need to connect with {selectedVendorForConnection} before you
              can add their products to your cart. Connect now to access their
              full catalog and pricing.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 pt-4">
            <div className="flex items-center gap-3 p-4 bg-secondary-yellow40 rounded-lg">
              <Lock className="w-5 h-5 text-primary-dark-blue" />
              <div>
                <h4 className="font-gabarito font-bold text-primary-dark-blue">
                  Why Connect?
                </h4>
                <p className="text-sm text-neutral-60">
                  Access vendor-specific pricing, stock levels, and exclusive
                  products.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowConnectionDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Link to="/vendors" className="flex-1">
                <Button className="w-full bg-primary-dark-blue text-white hover:bg-primary-dark-blue/90">
                  Connect Now
                </Button>
              </Link>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
