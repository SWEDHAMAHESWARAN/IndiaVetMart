import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useContext, useState, useEffect } from "react";

// Define types for API responses
interface ProductVariant {
  _id: string;
  price: number;
  stock: number;
  // Add other variant properties as needed
}

interface ProductVendor {
  _id: string;
  name: string;
  vendorName?: string;
  price?: number;
  // Add other vendor properties as needed
}

interface ProductRating {
  average: number;
  count: number;
  // Add rating properties as needed
}

// Helper type to get rating value
type RatingValue = number | ProductRating;

// Helper function to get rating value
const getRatingValue = (rating: RatingValue): number => {
  return typeof rating === 'number' ? rating : rating.average;
};

interface Product {
  _id: string;
  id: string;
  name: string;
  price: number;
  images?: string[];
  variants: ProductVariant[];
  sellername: string;
  rating: RatingValue;
  reviews: any[]; // Update with proper review type if available
  vendors: ProductVendor[];
  updatedAt: string;
  // Add other product properties as needed
}

// Extend Product for FeaturedProduct to ensure it has an id
interface FeaturedProduct extends Omit<Product, 'id'> {
  id?: string; // Make id optional in FeaturedProduct
  _id: string; // Ensure _id is required
}

interface ProductsResponse {
  products?: Product[];
  // Add other response properties as needed
}

interface FeaturedProduct extends Omit<Product, 'id'> {
  // Add any additional featured product specific properties
}
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Play,
  ShoppingCart,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { MyContext } from "../App";
import { Rupee, RupeeName } from "@/components/constants/CurrencyConst";
import { fetchDataFromApi } from "@/lib/api";
import Discount from "./Discount";
import { Rating } from "@mui/material";

export default function HomeScreen() {
  const navigate = useNavigate();
  const context = useContext(MyContext);
  const { orders, cat, popularProducts, vendors, user } = context;
  const [recentOrder, setRecentOrder] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [popular, setPopular] = useState<any[]>([]);
  const [isPopularLoading, setIsPopularLoading] = useState(true);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [featureProducts, setFeatureProducts] = useState<FeaturedProduct[]>([]);
  const [vendorsData, setVendorsData] = useState<any[]>([]);
  const [randomCatProducts, setRandomProducts] = useState<Product[]>([]);
  const history = useNavigate();
  useEffect(() => {
    if (orders?.length) setRecentOrder(orders);
  }, [orders]);

  useEffect(() => {
    if (cat?.length) setCategories(cat);
  }, [cat]);

  useEffect(() => {
    if (vendors?.length) {
      setVendorsData(vendors);
    }
  }, [vendors]);

  useEffect(() => {
    if (popularProducts?.length > 0) {
      console.log(`------`);
      setPopular(popularProducts);
      fetchNewProducts();
      fetchFeaturedProducts();
      fetchRandomProducts();
      setIsPopularLoading(false);
    }
  }, [popularProducts]);

  const handleRedirect = (productId: any, variantId: any) => {
    console.log("Product ID:", productId);
    console.log("Variant ID:", variantId);
    history(`/product/${productId}/${variantId}`);
  };

  const fetchNewProducts = async () => {
    try {
      const userDetails = user ? JSON.parse(user) : null;
      console.log("User details:", userDetails);
      if (userDetails?.userId) {
        const response = await fetchDataFromApi(
          `/products?page=1&perPage=10&userid=${userDetails.userId}`
        ) as ProductsResponse;
        const products = response?.products || [];
        setNewProducts(products);
      }
    } catch (error) {
      console.error("Error fetching new products:", error);
      setNewProducts([]);
    }
  };

  const fetchFeaturedProducts = async () => {
    try {
      const userDetails = user ? JSON.parse(user) : null;
      if (userDetails?.userId) {
        const response = await fetchDataFromApi(
          `/products/featured?userid=${userDetails.userId}`
        ) as { data: FeaturedProduct[] } | FeaturedProduct[];
        
        // Handle both response formats: { data: [] } or []
        const products = Array.isArray(response) 
          ? response 
          : Array.isArray(response?.data) 
            ? response.data 
            : [];
            
        setFeatureProducts(products);
      }
    } catch (error) {
      console.error("Error fetching featured products:", error);
      setFeatureProducts([]);
    }
  };

  const fetchRandomProducts = async () => {
    try {
      if (categories?.length > 0) {
        const userDetails = user ? JSON.parse(user) : null;
        if (!userDetails?.userId) return;

        const randomIndex = Math.floor(Math.random() * categories.length);
        const catId = categories[randomIndex]?.id;
        if (!catId) return;

        const response = await fetchDataFromApi(
          `/products/catId?catIds=${catId}&userid=${userDetails.userId}`
        ) as ProductsResponse;
        
        const products = response?.products || [];
        console.log("Fetched random products:", products);
        setRandomProducts(products);
      }
    } catch (error) {
      console.error("Error fetching random products:", error);
      setRandomProducts([]);
    }
  };
  const handleAddToCart = (productName: string) => {
    alert(`Added ${productName} to cart!`);
    navigate("/shopping");
  };

  return (
    <div className="min-h-screen bg-neutral-10">
      {/* Hero Section */}
      <section className="bg-linear-gradient relative overflow-hidden rounded-b-[20px] md:rounded-b-[40px]">
        {/* Decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute w-[200px] h-[200px] md:w-[400px] md:h-[400px] bg-primary-dark-blue rounded-full transform rotate-12 -right-16 md:-right-32 top-16 md:top-32 opacity-80"></div>
          <div className="absolute w-[150px] h-[150px] md:w-[300px] md:h-[300px] bg-secondary-yellow rounded-full transform rotate-45 -right-8 md:-right-16 top-4 md:top-8 opacity-90"></div>
          <div className="absolute w-[100px] h-[100px] md:w-[200px] md:h-[200px] bg-secondary-yellow rounded-full transform -rotate-12 right-32 md:right-64 bottom-8 md:bottom-16 opacity-60"></div>
          <div className="absolute w-6 h-6 md:w-12 md:h-12 bg-secondary-yellow rounded-lg transform rotate-25 left-16 md:left-32 top-20 md:top-40"></div>
          <div className="absolute w-3 h-3 md:w-6 md:h-6 bg-secondary-yellow rounded transform rotate-20 right-36 md:right-72 top-16 md:top-32"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-4 md:space-y-6 text-center lg:text-left">
              <h1 className="text-3xl md:text-4xl lg:text-6xl font-gilroy font-light text-primary-dark-blue leading-tight">
                One more friend
              </h1>
              <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold text-primary-dark-blue leading-tight">
                Thousands more fun!
              </h2>
              <p className="text-base md:text-lg text-neutral-80 max-w-lg font-bold mx-auto lg:mx-0">
                Having a pet means you have more joy, a new friend, a happy
                person who will always be with you to have fun. We have 200+
                different pets that can meet your needs!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start">
                <Button className="bg-primary-dark-blue hover:bg-primary-dark-blue80 text-neutral-0 rounded-full px-6 md:px-8 py-3 font-bold">
                  Explore Now
                </Button>
                <Button
                  variant="outline"
                  className="border-primary-dark-blue text-primary-dark-blue hover:bg-secondary-yellow40 rounded-full px-6 md:px-8 py-3 font-bold"
                >
                  <Play className="w-4 h-4 mr-2" />
                  View Intro
                </Button>
              </div>
            </div>
            <div className="relative order-first lg:order-last">
              <img
                src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=600&fit=crop&crop=center"
                alt="Happy person with pet"
                className="w-full h-[300px] md:h-[400px] lg:h-[500px] object-cover rounded-xl md:rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Notification Banner */}
      {/* <div className="bg-linear-gradient border-l-4 border-primary-dark-blue mx-4 sm:mx-6 lg:mx-8 my-6 md:my-8 p-3 md:p-4 rounded-lg">
        <div className="flex items-center justify-between gap-4">
          <p className="text-primary-dark-blue text-xs sm:text-sm font-bold flex-1">
            New offers just dropped! Check them out before they're gone. Up to
            50% off on winter wear—new arrivals included!
          </p>
          <div className="w-5 h-5 md:w-6 md:h-6 bg-state-blue-sea rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-neutral-0 text-xs">!</span>
          </div>
        </div>
      </div> */}

      {/* Dashboard Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="w-full bg-white relative rounded-lg shadow-sm border border-neutral-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
            {/* Seven Pet Vet Hospital Orders Table */}
            <div className="lg:col-span-1 p-6 border-r border-neutral-20">
              <div className="flex flex-col gap-4">
                <div className="flex justify-center items-start flex-col gap-2">
                  <h3 className="text-black text-sm font-bold">
                    Seven Pet Vet Hospital
                  </h3>
                </div>
                <div className="flex flex-col gap-4">
                  {/* Header Row */}
                  <div className="flex justify-start items-center flex-row ">
                    <div className="w-20 text-xs text-black font-gabarito font-bold text-left">
                      DATE
                    </div>
                    <div className="w-32 text-xs text-black font-gabarito font-bold text-left">
                      SUPPLIER
                    </div>
                    <div className="w-24 text-xs text-black font-gabarito font-bold text-left">
                      TOTAL
                    </div>
                    <div className="w-24 text-xs text-black font-gabarito font-bold text-left">
                      STATUS
                    </div>
                  </div>

                  {/* Data Rows */}
                  {recentOrder.slice(0, 5).map((order) => (
                    <div
                      key={order._id}
                      className="flex items-center flex-row  py-2"
                    >
                      <div className="w-20 text-xs text-black  font-gilroy font-light text-left ">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                      <div className="w-32 text-xs text-black font-gilroy font-light text-left">
                        {order.products[0]?.sellerName}
                      </div>
                      <div className="w-24 text-xs text-black font-gilroy font-light text-left">
                        {Rupee}
                        {order.amount}
                      </div>
                      <div className="w-16 flex justify-center items-center flex-col gap-2 py-2">
                        <span className="text-red-500 text-xs font-gabarito font-bold">
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Featured Categories */}
            <div className="lg:col-span-2 p-6">
              <div className="flex flex-col gap-6">
                <div className="flex justify-center items-start flex-col gap-2">
                  <h3 className="text-black text-sm font-bold">
                    Featured Categories
                  </h3>
                </div>

                <div className="flex justify-center items-center flex-row gap-4 overflow-x-auto pb-4">
                  <button className="h-6 flex justify-center items-center flex-row gap-2 bg-primary-dark-blue/20 rounded-md px-2">
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="flex justify-start items-center flex-row gap-4">
                    {categories.slice(0, 5).map((category) => (
                      <Link to="/category" className="block group">
                        <div className="w-32 flex justify-start items-center flex-col bg-secondary-yellow40 border-primary-dark-blue border-[0.5px] rounded-2xl hover:shadow-md transition-shadow">
                          <div className="w-full min-h-[40px] flex items-center justify-center px-2 text-center">
                            <span className="text-primary-dark-blue text-sm font-bold leading-tight line-clamp-2">
                              {category.name}
                            </span>
                          </div>
                          <div className="w-[120px] h-[160px] flex justify-center items-center overflow-hidden rounded-b-2xl">
                            <img
                              src={
                                category?.images[0] ||
                                "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=600&fit=crop&crop=center"
                              }
                              alt="Pet Cares"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  <button className="h-6 flex justify-start items-center flex-row gap-2 bg-primary-dark-blue/20 rounded-md px-2">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Pet Care Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 md:mb-16">
        <Card className="bg-gradient-to-r from-secondary-yellow40 to-secondary-yellow60 rounded-2xl p-6 md:p-8 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-primary-dark-blue">
                🏆 Trending Pet Care Essentials
              </h3>
              <p className="text-primary-dark-blue/80 mt-1">
                Most loved products by pet parents this month
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="w-10 h-10 bg-primary-dark-blue/10 hover:bg-primary-dark-blue/20 text-primary-dark-blue rounded-full"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="w-10 h-10 bg-primary-dark-blue/10 hover:bg-primary-dark-blue/20 text-primary-dark-blue rounded-full"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {popular
              .sort(
                (a, b) =>
                  new Date(b.updatedAt).getTime() -
                  new Date(a.updatedAt).getTime(),
              )
              .map((product) => (
                <Card
                  key={product._id}
                  className="bg-neutral-0 border border-primary-dark-blue/20 min-w-[280px] md:min-w-[320px] cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex-shrink-0 relative"
                >
                  <div className="absolute top-3 left-3 z-10">
                    <Badge className="bg-state-green-light text-neutral-0 text-xs px-2 py-1 rounded-full">
                      Popular
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <div className="h-[200px] w-full bg-neutral-10 rounded-lg mb-4 overflow-hidden flex items-center justify-center">
                      <img
                        src={product.images?.[0]}
                        alt={product.name}
                        className="h-full w-full object-contain p-2"
                      />
                    </div>

                    <div className="space-y-2">
                      <h4
                        className="font-gabarito font-bold text-primary-dark-blue text-sm"
                        onClick={() =>
                          handleRedirect(
                            product?._id,
                            product?.variants?.[0]?._id,
                          )
                        }
                      >
                        {product.name.substr(0, 20) + "..."}
                      </h4>

                      {product?.variants?.some(
                        (v: any) =>
                          v.stock_status === "instock" ||
                          v.stock_status === "in_stock",
                      ) ? (
                        <span className="text-green-600 block">In Stock</span>
                      ) : (
                        <span className="text-red-600 block">Out of Stock</span>
                      )}

                      <div className="flex items-center gap-2">
                        <Rating
                          className="mt-2 mb-2"
                          name="read-only"
                          value={product?.rating || 0}
                          readOnly
                          size="small"
                          precision={0.5}
                        />
                        <span className="text-xs text-neutral-60">
                          {product.reviews}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary-dark-blue">
                          {(() => {
                            const vendorPrices =
                              product?.vendors
                                ?.map((vendor) => vendor.price)
                                .filter((price) => price !== undefined) || [];
                            const lowestVendorPrice =
                              vendorPrices.length > 0
                                ? Math.min(...vendorPrices)
                                : null;

                            const basePrice =
                              product?.variants[0]?.price ??
                              product?.variants?.[0]?.price;

                            const priceDisplay = basePrice
                              ? `From ${RupeeName} ${basePrice}`
                              : lowestVendorPrice
                                ? `From ${RupeeName} ${lowestVendorPrice}`
                                : ``;

                            return priceDisplay;
                          })()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </Card>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 md:mb-8 gap-4">
          <div>
            <p className="text-neutral-100 font-bold mb-1 text-sm md:text-base">
              Featured Products from your search
            </p>
            <h2 className="text-xl md:text-2xl font-bold text-primary-dark-blue">
              Our Products
            </h2>
          </div>
          <Button
            variant="outline"
            className="border-primary-dark-blue text-primary-dark-blue hover:bg-secondary-yellow40 rounded-full self-start sm:self-auto"
          >
            View more
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {newProducts
            .slice(0, 8)
            .sort(
              (a, b) =>
                new Date(b.updatedAt).getTime() -
                new Date(a.updatedAt).getTime(),
            )
            .map((product) => (
              <Card
                key={product.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
              >
                <CardContent className="p-3 md:p-4">
                  <div className="aspect-square bg-neutral-10 rounded-lg mb-3 md:mb-4 overflow-hidden">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-1 md:space-y-2">
                    <h3
                      className="font-gilroy font-light text-neutral-100 line-clamp-2 text-sm md:text-base"
                      onClick={() =>
                        handleRedirect(
                          product?._id,
                          product?.variants?.[0]?._id,
                        )
                      }
                    >
                      {product.name}
                    </h3>

                    {product?.variants?.some(
                      (v: any) =>
                        v.stock_status === "instock" ||
                        v.stock_status === "in_stock",
                    ) ? (
                      <span className="text-green-600 block">In Stock</span>
                    ) : (
                      <span className="text-red-600 block">Out of Stock</span>
                    )}
                    <div className="flex items-center gap-2 text-xs text-neutral-60">
                      <span className="font-medium">Vendor:</span>
                      <span className="font-medium">{product.sellername}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Rating
                        className="mt-2 mb-2"
                        name="read-only"
                        value={getRatingValue(product.rating)}
                        readOnly
                        size="small"
                        precision={0.5}
                      />
                      <span className="text-xs text-neutral-60">
                        {product.reviews}
                      </span>
                    </div>
                    <p className="text-sm font-gilroy font-light text-neutral-100 font-semibold">
                      {(() => {
                        const vendorPrices =
                          product?.vendors
                            ?.map((vendor) => vendor.price)
                            .filter((price) => price !== undefined) || [];
                        const lowestVendorPrice =
                          vendorPrices.length > 0
                            ? Math.min(...vendorPrices)
                            : null;

                        const basePrice =
                          product?.variants[0]?.price ??
                          product?.variants?.[0]?.price;

                        const priceDisplay = basePrice
                          ? `From ${RupeeName} ${basePrice}`
                          : lowestVendorPrice
                            ? `From ${RupeeName} ${lowestVendorPrice}`
                            : ``;

                        return priceDisplay;
                      })()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>

        {/* Additional Products Row for larger screens */}
      </section>

      {/* Full-Width Auto-Scrollable Banner */}
      <section className="w-full mb-8 md:mb-16 overflow-hidden px-4">
        <div className="flex animate-scroll-left-to-right gap-4">
          <div className="flex-shrink-0 w-full">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2Fa5840e9b6f06467fa264b75489f10060%2F019dc29902f34a30ae519bd975578458?format=webp&width=800"
              alt="Pet Care Banner"
              className="w-full h-[200px] md:h-[300px] object-cover rounded-lg"
            />
          </div>
          <div className="flex-shrink-0 w-full">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2Fa5840e9b6f06467fa264b75489f10060%2Fe9f5a07c63ad42ee9da7350378cc22dc?format=webp&width=800"
              alt="CBD Wellness Banner"
              className="w-full h-[200px] md:h-[300px] object-cover rounded-lg"
            />
          </div>
          <div className="flex-shrink-0 w-full">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2Fa5840e9b6f06467fa264b75489f10060%2F019dc29902f34a30ae519bd975578458?format=webp&width=800"
              alt="Pet Care Banner"
              className="w-full h-[200px] md:h-[300px] object-cover rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* CBD Mental Health Scrollable Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 md:mb-16">
        <div className="bg-primary-dark-blue rounded-2xl p-6 md:p-8 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute w-[200px] h-[200px] md:w-[300px] md:h-[300px] bg-secondary-yellow40 rounded-full transform rotate-25 -right-12 md:-right-24 -top-12 md:-top-24 opacity-80"></div>
            <div className="absolute w-[150px] h-[150px] md:w-[200px] md:h-[200px] bg-primary-dark-blue80 rounded-full transform rotate-28 -left-8 md:-left-16 -bottom-8 md:-bottom-16"></div>
          </div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg md:text-xl font-bold text-secondary-yellow40">
                  Balance your mind naturally
                </h3>
                <h2 className="text-2xl md:text-3xl font-gilroy font-light text-neutral-0 leading-tight">
                  CBD for Mental Health, Sleep & Mood
                </h2>
                <p className="text-sm md:text-base text-neutral-80 font-bold mt-2">
                  Explore CBD products for mental wellness and relaxation
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-10 h-10 bg-secondary-yellow40/20 hover:bg-secondary-yellow40/30 text-secondary-yellow40 rounded-full"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-10 h-10 bg-secondary-yellow40/20 hover:bg-secondary-yellow40/30 text-secondary-yellow40 rounded-full"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 scrollbar-hide">
              {featureProducts.map((product) => (
                <Card
                  key={product.id}
                  className="bg-neutral-0/95 border border-secondary-yellow40/30 min-w-[280px] md:min-w-[320px] cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex-shrink-0"
                >
                  <CardContent className="p-4">
                    <div className="h-[300px] w-full bg-neutral-10 rounded-lg mb-4 overflow-hidden flex items-center justify-center">
                      <img
                        src={product.images?.[0]}
                        alt={product.name}
                        className="h-full w-full object-contain p-2"
                      />
                    </div>
                    <div className="space-y-2">
                      <h4
                        className="font-gabarito font-bold text-primary-dark-blue text-sm"
                        onClick={() =>
                          handleRedirect(
                            product?._id,
                            product?.variants?.[0]?._id,
                          )
                        }
                      >
                        {product.name}
                      </h4>
                      <p className="text-xs text-neutral-60">
                        {product?.variants?.some(
                          (v: any) =>
                            v.stock_status === "instock" ||
                            v.stock_status === "in_stock",
                        ) ? (
                          <span className="text-green-600 block">In Stock</span>
                        ) : (
                          <span className="text-red-600 block">
                            Out of Stock
                          </span>
                        )}
                      </p>
                      <div className="flex items-center gap-2">
                        <Rating
                          className="mt-2 mb-2"
                          name="read-only"
                          value={getRatingValue(product.rating) || 0}
                          readOnly
                          size="small"
                          precision={0.5}
                        />
                        <span className="text-xs text-neutral-60">
                          {product.reviews}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary-dark-blue">
                          {(() => {
                            const vendorPrices =
                              product?.vendors
                                ?.map((vendor) => vendor.price)
                                .filter((price) => price !== undefined) || [];
                            const lowestVendorPrice =
                              vendorPrices.length > 0
                                ? Math.min(...vendorPrices)
                                : null;

                            const basePrice =
                              product?.variants[0]?.price ??
                              product?.variants?.[0]?.price;

                            const priceDisplay = basePrice
                              ? `From ${RupeeName} ${basePrice}`
                              : lowestVendorPrice
                                ? `From ${RupeeName} ${lowestVendorPrice}`
                                : ``;

                            return priceDisplay;
                          })()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-center mt-6">
              <Button className="bg-secondary-yellow40 text-primary-dark-blue hover:bg-secondary-yellow rounded-full font-bold px-8">
                Explore All CBD Products
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Vendors Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 md:mb-8 gap-4">
          <div className="flex items-end gap-2">
            <span className="text-neutral-100 font-gilroy font-light text-lg md:text-xl">
              Proud to be part of
            </span>
            <span className="text-primary-dark-blue text-xl md:text-2xl font-bold">
              Vendors
            </span>
          </div>
          <Button
            variant="outline"
            className="border-primary-dark-blue text-primary-dark-blue hover:bg-secondary-yellow40 rounded-full self-start sm:self-auto"
          >
            View all Our Vendors
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 scrollbar-hide">
          {vendorsData.map((vendor) => (
            <div
              key={vendor?._id}
              className="bg-neutral-0 rounded-lg p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex items-center justify-center min-w-[140px] md:min-w-[160px] aspect-square flex-shrink-0"
            >
              <div className="flex flex-col items-center justify-center gap-2">
                <span className="text-neutral-60 font-bold text-xs md:text-sm text-center">
                  {vendor.sellername}
                </span>

                <div className="w-16 h-16 md:w-20 md:h-20 bg-neutral-10 rounded-lg overflow-hidden flex items-center justify-center">
                  <img
                    src={vendor.logo}
                    alt={vendor.sellername}
                    className="object-contain w-full h-full"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pet Accessories Current Offers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 md:mb-8 gap-4">
          <div>
            <p className="text-neutral-100 font-bold mb-1 text-sm md:text-base">
              Pet Accessories
            </p>
            <h2 className="text-xl md:text-2xl font-bold text-primary-dark-blue">
              Do not miss the current offers until the end of June
            </h2>
          </div>
          <Button
            variant="outline"
            className="border-primary-dark-blue text-primary-dark-blue hover:bg-secondary-yellow40 rounded-full self-start sm:self-auto"
          >
            View more
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {randomCatProducts.slice(0, 8).map((product, index) => (
            <Card
              key={index}
              className="hover:shadow-lg transition-shadow cursor-pointer"
            >
              <CardContent className="p-3 md:p-4">
                <div className="aspect-square bg-neutral-10 rounded-lg mb-3 md:mb-4 overflow-hidden">
                  <img
                    src={product?.images[0]}
                    alt="Pet bandana"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1 md:space-y-2">
                  <h3 className="font-gilroy font-light text-neutral-100 line-clamp-2 text-sm md:text-base">
                    {product?.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-neutral-60">
                    <span className="font-medium">Vendor:</span>
                    <span className="font-medium">
                      {product?.vendors[0]?.vendorName}
                    </span>
                  </div>
                  <p className="text-sm font-gilroy font-light text-neutral-100 font-semibold">
                    {(() => {
                      const vendorPrices =
                        product?.vendors
                          ?.map((vendor) => vendor.price)
                          .filter((price) => price !== undefined) || [];
                      const lowestVendorPrice =
                        vendorPrices.length > 0
                          ? Math.min(...vendorPrices)
                          : null;

                      const basePrice =
                        product?.variants[0]?.price ??
                        product?.variants?.[0]?.price;

                      const priceDisplay = basePrice
                        ? `From ${RupeeName} ${basePrice}`
                        : lowestVendorPrice
                          ? `From ${RupeeName} ${lowestVendorPrice}`
                          : ``;

                      return priceDisplay;
                    })()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
