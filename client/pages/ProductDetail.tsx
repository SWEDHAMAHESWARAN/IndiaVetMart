import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Info,
  Heart,
  Share2,
  ShoppingCart,
  Truck,
  Clock,
  Tag,
  Package,
} from "lucide-react";

// Define types for API integration
interface Vendor {
  id: string;
  name: string;
  price: string;
  buttonText: string;
  buttonStyle: string;
  shipping: boolean;
  availability: string;
  deliveryTime: string;
}

interface ProductData {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviewCount: number;
  images: string[];
  vendors: Vendor[];
  description: string;
  composition: string;
  benefits: string[];
  specifications: Record<string, string>;
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("description");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedVendor, setSelectedVendor] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewText, setReviewText] = useState("");

  const handleAddToCart = () => {
    // In a real app, this would add the item to cart state/context
    alert(
      `Added ${quantity} ${productData.name} to cart from ${productData.vendors[selectedVendor].name}`,
    );
    navigate("/shopping");
  };

  const handleSubmitReview = () => {
    if (reviewRating === 0 || !reviewTitle.trim() || !reviewText.trim()) {
      alert("Please fill in all fields and provide a rating.");
      return;
    }

    // In a real app, this would submit to API
    console.log("Submitting review:", {
      productId: productData.id,
      rating: reviewRating,
      title: reviewTitle,
      text: reviewText,
    });

    alert("Thank you! Your review has been submitted.");

    // Reset form
    setReviewRating(0);
    setReviewTitle("");
    setReviewText("");
    setShowReviewModal(false);
  };

  // Sample product data - in real app, this would come from API based on id
  const productData: ProductData = {
    id: id || "1",
    name: "Hemp Seed Oil for Pets",
    category: "Pet Health & Wellness",
    rating: 4.8,
    reviewCount: 256,
    images: [
      "https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=560&h=476&fit=crop",
      "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=560&h=476&fit=crop",
      "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=560&h=476&fit=crop",
      "https://images.unsplash.com/photo-1612277795421-9bc7706a4a34?w=560&h=476&fit=crop",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=560&h=476&fit=crop",
    ],
    vendors: [
      {
        id: "1",
        name: "Cure By Design",
        price: "Rs. 499",
        buttonText: "Add To Cart",
        buttonStyle: "bg-primary-dark-blue text-white",
        shipping: true,
        availability: "In Stock",
        deliveryTime: "2-3 days",
      },
      {
        id: "2",
        name: "Pets & Pawlsco",
        price: "Rs. 459",
        buttonText: "Connect",
        buttonStyle: "bg-state-blue-sea text-white",
        shipping: true,
        availability: "In Stock",
        deliveryTime: "3-5 days",
      },
      {
        id: "3",
        name: "HealthyPaws",
        price: "Rs. 399",
        buttonText: "Add To Cart",
        buttonStyle: "bg-primary-dark-blue text-white",
        shipping: true,
        availability: "Limited Stock",
        deliveryTime: "1-2 days",
      },
      {
        id: "4",
        name: "NaturalTreats",
        price: "Rs. 549",
        buttonText: "Add To Cart",
        buttonStyle: "bg-primary-dark-blue text-white",
        shipping: true,
        availability: "In Stock",
        deliveryTime: "2-4 days",
      },
    ],
    description:
      "Hemp Seed Oil for Pets is a broad-spectrum supplement used for promoting overall health and wellness in pets. This natural oil is particularly effective for supporting immune system function, skin health, and joint mobility.",
    composition: "Hemp Seed Oil (100% Pure)",
    benefits: [
      "Supports immune system health",
      "Promotes healthy skin and coat",
      "Aids in joint mobility and comfort",
      "Natural stress relief",
      "Improves overall wellness",
    ],
    specifications: {
      Volume: "30ml",
      Concentration: "500mg",
      "Suitable for": "Dogs, Cats",
      "Age Range": "All ages",
      Storage: "Cool, dry place",
    },
  };

  const thumbnails = productData.images.map((img, index) =>
    img.replace("560/476", "94/94"),
  );

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % productData.images.length);
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? productData.images.length - 1 : prev - 1,
    );
  };

  return (
    <div className="bg-neutral-10 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-neutral-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-neutral-60">
            <span>Home</span>
            <ChevronRight className="w-4 h-4" />
            <span>Category</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-primary-dark-blue font-medium">
              {productData.name}
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Main Product Card */}
          <Card className="bg-white shadow-lg border border-neutral-20 rounded-2xl overflow-hidden">
            <CardContent className="p-0">
              <div className="grid lg:grid-cols-2 gap-8 p-6 lg:p-8">
                {/* Product Images */}
                <div className="space-y-4">
                  <div className="relative group">
                    <img
                      src={productData.images[currentImageIndex]}
                      alt={productData.name}
                      className="w-full h-[400px] lg:h-[500px] object-cover rounded-xl"
                    />

                    {/* Image Navigation */}
                    <button
                      onClick={previousImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg opacity-0 group-hover:opacity-100"
                    >
                      <ChevronLeft className="w-6 h-6 text-primary-dark-blue" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg opacity-0 group-hover:opacity-100"
                    >
                      <ChevronRight className="w-6 h-6 text-primary-dark-blue" />
                    </button>

                    {/* Quick Actions */}
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg">
                        <Heart className="w-5 h-5 text-neutral-60 hover:text-red-500" />
                      </button>
                      <button className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg">
                        <Share2 className="w-5 h-5 text-neutral-60" />
                      </button>
                    </div>
                  </div>

                  {/* Thumbnails */}
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {thumbnails.map((thumbnail, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                          index === currentImageIndex
                            ? "border-primary-dark-blue scale-105"
                            : "border-neutral-30 hover:border-primary-dark-blue/50"
                        }`}
                      >
                        <img
                          src={thumbnail}
                          alt={`View ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Product Info */}
                <div className="space-y-6">
                  {/* Header */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className="bg-secondary-yellow40 text-primary-dark-blue"
                      >
                        {productData.category}
                      </Badge>
                    </div>
                    <h1 className="text-2xl lg:text-3xl font-gabarito font-bold text-primary-dark-blue leading-tight">
                      {productData.name}
                    </h1>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < Math.floor(productData.rating)
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-neutral-30"
                            }`}
                          />
                        ))}
                        <span className="text-lg font-semibold text-primary-dark-blue ml-2">
                          {productData.rating}
                        </span>
                      </div>
                      <span className="text-neutral-60">
                        ({productData.reviewCount} reviews)
                      </span>
                    </div>
                  </div>

                  {/* Vendor Selection */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-gabarito font-semibold text-primary-dark-blue">
                      Choose Vendor
                    </h3>
                    <div className="space-y-3">
                      {productData.vendors.map((vendor, index) => (
                        <div
                          key={vendor.id}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            selectedVendor === index
                              ? "border-primary-dark-blue bg-primary-dark-blue/5"
                              : "border-neutral-30 hover:border-primary-dark-blue/50"
                          }`}
                          onClick={() => setSelectedVendor(index)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                <span className="font-gabarito font-semibold text-primary-dark-blue">
                                  {vendor.name}
                                </span>
                                {vendor.shipping && (
                                  <Truck className="w-4 h-4 text-state-green-light" />
                                )}
                              </div>
                              <Badge
                                variant={
                                  vendor.availability === "In Stock"
                                    ? "default"
                                    : "secondary"
                                }
                                className={
                                  vendor.availability === "In Stock"
                                    ? "bg-state-green-light text-white"
                                    : "bg-yellow-100 text-yellow-800"
                                }
                              >
                                {vendor.availability}
                              </Badge>
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-gabarito font-bold text-primary-dark-blue">
                                {vendor.price}
                              </div>
                              <div className="text-xs text-neutral-60">
                                Delivery: {vendor.deliveryTime}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quantity and Actions */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <span className="font-gabarito font-medium text-primary-dark-blue">
                        Quantity:
                      </span>
                      <div className="flex items-center border border-neutral-30 rounded-lg">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="p-2 hover:bg-neutral-10 rounded-l-lg"
                        >
                          <span className="text-lg">−</span>
                        </button>
                        <span className="px-4 py-2 border-x border-neutral-30 min-w-[60px] text-center">
                          {quantity}
                        </span>
                        <button
                          onClick={() => setQuantity(quantity + 1)}
                          className="p-2 hover:bg-neutral-10 rounded-r-lg"
                        >
                          <span className="text-lg">+</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        className="flex-1 bg-primary-dark-blue hover:bg-primary-dark-blue80 text-white rounded-xl py-3 font-gabarito font-bold text-lg"
                        size="lg"
                        onClick={handleAddToCart}
                      >
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        Add to Cart
                      </Button>
                      <Button
                        variant="outline"
                        className="px-6 border-primary-dark-blue text-primary-dark-blue hover:bg-secondary-yellow40 rounded-xl"
                        size="lg"
                      >
                        Buy Now
                      </Button>
                    </div>
                  </div>

                  {/* Key Benefits */}
                  <div className="p-4 bg-secondary-yellow40/30 rounded-xl">
                    <h4 className="font-gabarito font-semibold text-primary-dark-blue mb-3">
                      Key Benefits
                    </h4>
                    <ul className="space-y-2">
                      {productData.benefits
                        .slice(0, 3)
                        .map((benefit, index) => (
                          <li
                            key={index}
                            className="flex items-center gap-2 text-sm text-primary-dark-blue"
                          >
                            <div className="w-2 h-2 bg-state-green-light rounded-full"></div>
                            {benefit}
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Information Tabs */}
          <Card className="bg-white shadow-lg border border-neutral-20 rounded-2xl">
            <CardContent className="p-0">
              {/* Tab Navigation */}
              <div className="border-b border-neutral-20">
                <div className="flex px-6 py-4 overflow-x-auto">
                  {[
                    { id: "description", label: "Description", icon: Info },
                    {
                      id: "specifications",
                      label: "Specifications",
                      icon: Package,
                    },
                    { id: "reviews", label: "Reviews", icon: Star },
                    {
                      id: "previous-orders",
                      label: "Previous Orders",
                      icon: Clock,
                    },
                    { id: "discount", label: "Discounts", icon: Tag },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2 text-sm font-gabarito font-medium rounded-lg transition-all ${
                        selectedTab === tab.id
                          ? "bg-primary-dark-blue text-white"
                          : "text-neutral-60 hover:text-primary-dark-blue hover:bg-neutral-10"
                      }`}
                    >
                      {tab.icon && <tab.icon className="w-4 h-4" />}
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {selectedTab === "description" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-gabarito font-semibold text-primary-dark-blue mb-4">
                        Product Description
                      </h3>
                      <p className="text-neutral-80 leading-relaxed mb-6">
                        {productData.description}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-gabarito font-semibold text-primary-dark-blue mb-3 flex items-center gap-2">
                        <Info className="w-5 h-5" />
                        Composition
                      </h4>
                      <p className="text-neutral-80">
                        <span className="font-semibold">
                          Active Ingredient:
                        </span>{" "}
                        {productData.composition}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-gabarito font-semibold text-primary-dark-blue mb-3">
                        Key Benefits
                      </h4>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {productData.benefits.map((benefit, index) => (
                          <li
                            key={index}
                            className="flex items-center gap-3 text-neutral-80"
                          >
                            <div className="w-2 h-2 bg-state-green-light rounded-full"></div>
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {selectedTab === "specifications" && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-gabarito font-semibold text-primary-dark-blue">
                      Product Specifications
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(productData.specifications).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="flex justify-between items-center p-4 bg-neutral-10 rounded-lg"
                          >
                            <span className="font-gabarito font-medium text-neutral-80">
                              {key}:
                            </span>
                            <span className="text-primary-dark-blue font-semibold">
                              {value}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}

                {selectedTab === "reviews" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-gabarito font-semibold text-primary-dark-blue">
                        Customer Reviews
                      </h3>
                      <Dialog
                        open={showReviewModal}
                        onOpenChange={setShowReviewModal}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="border-primary-dark-blue text-primary-dark-blue hover:bg-secondary-yellow40"
                          >
                            Write a Review
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                          <DialogHeader>
                            <DialogTitle className="text-xl font-gabarito font-bold text-primary-dark-blue">
                              Write a Review
                            </DialogTitle>
                            <DialogDescription className="text-neutral-60">
                              Share your experience with {productData.name}
                            </DialogDescription>
                          </DialogHeader>

                          <div className="space-y-6 py-4">
                            {/* Rating Section */}
                            <div className="space-y-3">
                              <Label className="text-neutral-80 font-gabarito font-bold">
                                Your Rating *
                              </Label>
                              <div className="flex items-center gap-2">
                                {Array.from({ length: 5 }, (_, i) => (
                                  <button
                                    key={i}
                                    type="button"
                                    onClick={() => setReviewRating(i + 1)}
                                    className="transition-colors"
                                  >
                                    <Star
                                      className={`w-8 h-8 ${
                                        i < reviewRating
                                          ? "text-yellow-400 fill-yellow-400"
                                          : "text-neutral-30 hover:text-yellow-300"
                                      }`}
                                    />
                                  </button>
                                ))}
                                <span className="ml-2 text-neutral-60">
                                  {reviewRating > 0 &&
                                    `${reviewRating} out of 5 stars`}
                                </span>
                              </div>
                            </div>

                            {/* Review Title */}
                            <div className="space-y-2">
                              <Label
                                htmlFor="review-title"
                                className="text-neutral-80 font-gabarito font-bold"
                              >
                                Review Title *
                              </Label>
                              <Input
                                id="review-title"
                                value={reviewTitle}
                                onChange={(e) => setReviewTitle(e.target.value)}
                                placeholder="Give your review a title"
                                className="rounded-lg border-neutral-40 focus:border-primary-dark-blue"
                                maxLength={100}
                              />
                              <div className="text-xs text-neutral-60 text-right">
                                {reviewTitle.length}/100 characters
                              </div>
                            </div>

                            {/* Review Text */}
                            <div className="space-y-2">
                              <Label
                                htmlFor="review-text"
                                className="text-neutral-80 font-gabarito font-bold"
                              >
                                Your Review *
                              </Label>
                              <Textarea
                                id="review-text"
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                placeholder="Tell others about your experience with this product..."
                                className="rounded-lg border-neutral-40 focus:border-primary-dark-blue min-h-[120px]"
                                maxLength={500}
                              />
                              <div className="text-xs text-neutral-60 text-right">
                                {reviewText.length}/500 characters
                              </div>
                            </div>

                            {/* Guidelines */}
                            <div className="bg-secondary-yellow40/30 rounded-lg p-4">
                              <h4 className="font-gabarito font-semibold text-primary-dark-blue mb-2">
                                Review Guidelines
                              </h4>
                              <ul className="text-sm text-neutral-80 space-y-1">
                                <li>
                                  • Be honest and helpful to other pet owners
                                </li>
                                <li>
                                  • Focus on your experience with the product
                                </li>
                                <li>
                                  • Avoid profanity and inappropriate content
                                </li>
                                <li>
                                  • Reviews are moderated before publication
                                </li>
                              </ul>
                            </div>
                          </div>

                          <DialogFooter className="gap-3">
                            <Button
                              variant="outline"
                              onClick={() => setShowReviewModal(false)}
                              className="border-neutral-40"
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={handleSubmitReview}
                              className="bg-primary-dark-blue hover:bg-primary-dark-blue80 text-white"
                              disabled={
                                reviewRating === 0 ||
                                !reviewTitle.trim() ||
                                !reviewText.trim()
                              }
                            >
                              Submit Review
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-neutral-10 rounded-xl">
                      <div className="text-center">
                        <div className="text-3xl font-gabarito font-bold text-primary-dark-blue mb-2">
                          {productData.rating}
                        </div>
                        <div className="flex justify-center mb-2">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={i}
                              className={`w-5 h-5 ${
                                i < Math.floor(productData.rating)
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-neutral-30"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-neutral-60">
                          Based on {productData.reviewCount} reviews
                        </p>
                      </div>

                      <div className="md:col-span-2 space-y-3">
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <div key={rating} className="flex items-center gap-2">
                            <span className="text-sm w-8">{rating}★</span>
                            <div className="flex-1 bg-neutral-30 rounded-full h-2">
                              <div
                                className="bg-yellow-400 h-2 rounded-full"
                                style={{ width: `${Math.random() * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-neutral-60 w-12">
                              {Math.floor(Math.random() * 50)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      {[
                        {
                          name: "Sarah M.",
                          rating: 5,
                          date: "2 weeks ago",
                          comment:
                            "Excellent product! My pet loves it and I can see the difference in their health.",
                        },
                        {
                          name: "Mike R.",
                          rating: 4,
                          date: "1 month ago",
                          comment:
                            "Good quality hemp oil. Fast delivery and great customer service.",
                        },
                        {
                          name: "Jessica L.",
                          rating: 5,
                          date: "3 weeks ago",
                          comment:
                            "Highly recommend! My dog's anxiety has improved significantly.",
                        },
                      ].map((review, index) => (
                        <div
                          key={index}
                          className="border border-neutral-20 rounded-xl p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-primary-dark-blue rounded-full flex items-center justify-center text-white font-semibold">
                                {review.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-gabarito font-medium text-primary-dark-blue">
                                  {review.name}
                                </p>
                                <div className="flex items-center gap-2">
                                  <div className="flex">
                                    {Array.from({ length: 5 }, (_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-4 h-4 ${
                                          i < review.rating
                                            ? "text-yellow-400 fill-yellow-400"
                                            : "text-neutral-30"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-xs text-neutral-60">
                                    {review.date}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <p className="text-neutral-80">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedTab === "previous-orders" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-gabarito font-semibold text-primary-dark-blue">
                        Your Previous Orders
                      </h3>
                      <Button
                        variant="outline"
                        className="border-primary-dark-blue text-primary-dark-blue hover:bg-secondary-yellow40"
                        onClick={() => navigate("/orders")}
                      >
                        View All Orders
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {[
                        {
                          orderId: "#ORD-2024-001",
                          date: "March 15, 2024",
                          quantity: 2,
                          price: "Rs. 998",
                          status: "Delivered",
                          vendor: "Cure By Design",
                        },
                        {
                          orderId: "#ORD-2024-015",
                          date: "February 28, 2024",
                          quantity: 1,
                          price: "Rs. 499",
                          status: "Delivered",
                          vendor: "HealthyPaws",
                        },
                        {
                          orderId: "#ORD-2023-287",
                          date: "December 10, 2023",
                          quantity: 3,
                          price: "Rs. 1,497",
                          status: "Delivered",
                          vendor: "Cure By Design",
                        },
                      ].map((order, index) => (
                        <div
                          key={index}
                          className="border border-neutral-20 rounded-xl p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-secondary-yellow40 rounded-lg flex items-center justify-center">
                                <Package className="w-6 h-6 text-primary-dark-blue" />
                              </div>
                              <div>
                                <p className="font-gabarito font-semibold text-primary-dark-blue">
                                  {order.orderId}
                                </p>
                                <p className="text-sm text-neutral-60">
                                  Ordered on {order.date}
                                </p>
                                <p className="text-sm text-neutral-60">
                                  From {order.vendor}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge
                                variant="default"
                                className="bg-state-green-light text-white mb-2"
                              >
                                {order.status}
                              </Badge>
                              <div className="text-lg font-gabarito font-bold text-primary-dark-blue">
                                {order.price}
                              </div>
                              <div className="text-sm text-neutral-60">
                                Qty: {order.quantity}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2 pt-3 border-t border-neutral-20">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 border-primary-dark-blue text-primary-dark-blue hover:bg-secondary-yellow40"
                              onClick={handleAddToCart}
                            >
                              Reorder
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Empty State */}
                    <div className="text-center py-8 text-neutral-60">
                      <Clock className="w-12 h-12 mx-auto mb-4 text-neutral-40" />
                      <p className="text-lg font-gabarito font-medium mb-2">
                        No previous orders found
                      </p>
                      <p className="text-sm">
                        When you purchase this product, your order history will
                        appear here.
                      </p>
                    </div>
                  </div>
                )}

                {selectedTab === "discount" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-gabarito font-semibold text-primary-dark-blue">
                        Available Discounts & Offers
                      </h3>
                      <Button
                        variant="outline"
                        className="border-primary-dark-blue text-primary-dark-blue hover:bg-secondary-yellow40"
                      >
                        View All Offers
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        {
                          type: "Bulk Discount",
                          title: "Buy 3 Get 1 Free",
                          description:
                            "Purchase 3 units and get 1 additional unit absolutely free",
                          code: "BULK3GET1",
                          savings: "25% Off",
                          validUntil: "March 31, 2024",
                          minOrder: "3 units",
                          color:
                            "bg-gradient-to-br from-green-500 to-green-600",
                        },
                        {
                          type: "First Time Buyer",
                          title: "New Customer Discount",
                          description:
                            "Special discount for first-time customers",
                          code: "WELCOME15",
                          savings: "15% Off",
                          validUntil: "Valid for 30 days",
                          minOrder: "Rs. 499",
                          color: "bg-gradient-to-br from-blue-500 to-blue-600",
                        },
                        {
                          type: "Loyalty Program",
                          title: "Recurring Order Discount",
                          description:
                            "Subscribe and save on monthly deliveries",
                          code: "SUBSCRIBE10",
                          savings: "10% Off",
                          validUntil: "Ongoing",
                          minOrder: "Monthly subscription",
                          color:
                            "bg-gradient-to-br from-purple-500 to-purple-600",
                        },
                        {
                          type: "Clinic Partner",
                          title: "Veterinary Clinic Discount",
                          description:
                            "Special pricing for registered veterinary clinics",
                          code: "VETCLINIC20",
                          savings: "20% Off",
                          validUntil: "Ongoing",
                          minOrder: "Clinic verification required",
                          color:
                            "bg-gradient-to-br from-orange-500 to-orange-600",
                        },
                      ].map((discount, index) => (
                        <div
                          key={index}
                          className="relative border border-neutral-20 rounded-xl p-6 hover:shadow-lg transition-shadow overflow-hidden"
                        >
                          <div
                            className={`absolute top-0 right-0 w-24 h-24 ${discount.color} rounded-bl-full flex items-center justify-center`}
                          >
                            <Tag className="w-6 h-6 text-white transform rotate-12" />
                          </div>

                          <div className="space-y-3">
                            <div>
                              <Badge
                                variant="secondary"
                                className="bg-secondary-yellow40 text-primary-dark-blue mb-2"
                              >
                                {discount.type}
                              </Badge>
                              <h4 className="text-lg font-gabarito font-bold text-primary-dark-blue">
                                {discount.title}
                              </h4>
                              <p className="text-sm text-neutral-60">
                                {discount.description}
                              </p>
                            </div>

                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-2xl font-gabarito font-bold text-state-green-light">
                                  {discount.savings}
                                </p>
                                <p className="text-xs text-neutral-60">
                                  Min order: {discount.minOrder}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-mono text-sm font-bold text-primary-dark-blue bg-neutral-10 px-3 py-1 rounded">
                                  {discount.code}
                                </p>
                                <p className="text-xs text-neutral-60 mt-1">
                                  Valid until: {discount.validUntil}
                                </p>
                              </div>
                            </div>

                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full border-primary-dark-blue text-primary-dark-blue hover:bg-secondary-yellow40"
                              onClick={() => {
                                navigator.clipboard.writeText(discount.code);
                                alert(
                                  `Code ${discount.code} copied to clipboard!`,
                                );
                              }}
                            >
                              Copy Code
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Terms and Conditions */}
                    <div className="bg-neutral-10 rounded-xl p-6">
                      <h4 className="font-gabarito font-semibold text-primary-dark-blue mb-3 flex items-center gap-2">
                        <Info className="w-5 h-5" />
                        Terms & Conditions
                      </h4>
                      <ul className="space-y-2 text-sm text-neutral-80">
                        <li>
                          • Discounts cannot be combined with other offers
                          unless specified
                        </li>
                        <li>
                          • Bulk discounts apply automatically when minimum
                          quantity is reached
                        </li>
                        <li>
                          • Clinic verification required for veterinary
                          discounts
                        </li>
                        <li>
                          • Subscription discounts require active monthly
                          auto-delivery
                        </li>
                        <li>
                          • All offers subject to product availability and
                          vendor terms
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Related Products */}
          <Card className="bg-white shadow-lg border border-neutral-20 rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-gabarito font-bold text-primary-dark-blue">
                  Related Products
                </h3>
                <Button
                  variant="outline"
                  className="border-primary-dark-blue text-primary-dark-blue"
                >
                  View All
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    name: "Hemp Relief Balm",
                    price: "Rs. 399",
                    image:
                      "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=200&h=200&fit=crop",
                  },
                  {
                    name: "CBD Pet Treats",
                    price: "Rs. 599",
                    image:
                      "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=200&h=200&fit=crop",
                  },
                  {
                    name: "Natural Pet Supplement",
                    price: "Rs. 799",
                    image:
                      "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=200&h=200&fit=crop",
                  },
                  {
                    name: "Organic Pet Food",
                    price: "Rs. 1299",
                    image:
                      "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=200&h=200&fit=crop",
                  },
                ].map((product, index) => (
                  <Card
                    key={index}
                    className="group cursor-pointer hover:shadow-lg transition-all duration-300 border border-neutral-20"
                  >
                    <CardContent className="p-4">
                      <div className="aspect-square bg-neutral-10 rounded-lg mb-3 overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <h4 className="font-gabarito font-medium text-primary-dark-blue mb-2 line-clamp-2">
                        {product.name}
                      </h4>
                      <p className="text-lg font-gabarito font-bold text-primary-dark-blue">
                        {product.price}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
