import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import BudgetCartInfo from "@/components/BudgetCartInfo";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowRight,
  Minus,
  Plus,
  Trash2,
  ShoppingCart,
  Store,
  Package,
  Heart,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";

interface CartItem {
  id: string;
  name: string;
  vendor: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
  inStock: boolean;
  maxQuantity: number;
}

interface VendorCart {
  vendorName: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  estimatedDelivery: string;
}

export default function ShoppingCart() {
  const [cartData, setCartData] = useState<VendorCart[]>([
    {
      vendorName: "Covetrus",
      items: [
        {
          id: "1",
          name: "Depo Medrol, 20ml (injectable)",
          vendor: "Covetrus",
          price: 79.7,
          quantity: 1,
          image:
            "https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=200&h=200&fit=crop",
          category: "Pet Health",
          inStock: true,
          maxQuantity: 10,
        },
      ],
      subtotal: 79.7,
      shipping: 0,
      estimatedDelivery: "2-3 business days",
    },
    {
      vendorName: "MWI Veterinary Supply",
      items: [
        {
          id: "2",
          name: "Nexgard Chew For Large Dogs",
          vendor: "MWI Veterinary Supply",
          price: 156.8,
          quantity: 2,
          image:
            "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=200&h=200&fit=crop",
          category: "Pet Care",
          inStock: true,
          maxQuantity: 5,
        },
        {
          id: "3",
          name: "Pet Vitamin Supplements",
          vendor: "MWI Veterinary Supply",
          price: 89.5,
          quantity: 1,
          image:
            "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=200&h=200&fit=crop",
          category: "Pet Health",
          inStock: true,
          maxQuantity: 8,
        },
      ],
      subtotal: 402.1,
      shipping: 0,
      estimatedDelivery: "3-5 business days",
    },
  ]);

  const [savedItems, setSavedItems] = useState([
    {
      id: "s1",
      name: "Hemp CBD Oil for Pets",
      vendor: "CureByDesign",
      price: 245.0,
      image:
        "https://images.unsplash.com/photo-1612277795421-9bc7706a4a34?w=200&h=200&fit=crop",
      category: "CBD for Pet",
    },
  ]);

  const updateQuantity = (
    vendorIndex: number,
    itemId: string,
    newQuantity: number,
  ) => {
    setCartData((prev) => {
      const updated = [...prev];
      const vendor = updated[vendorIndex];
      const itemIndex = vendor.items.findIndex((item) => item.id === itemId);

      if (
        itemIndex !== -1 &&
        newQuantity > 0 &&
        newQuantity <= vendor.items[itemIndex].maxQuantity
      ) {
        vendor.items[itemIndex].quantity = newQuantity;
        vendor.subtotal = vendor.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0,
        );
      }

      return updated;
    });
  };

  const removeItem = (vendorIndex: number, itemId: string) => {
    setCartData((prev) => {
      const updated = [...prev];
      const vendor = updated[vendorIndex];
      vendor.items = vendor.items.filter((item) => item.id !== itemId);
      vendor.subtotal = vendor.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );

      // Remove vendor if no items left
      return updated.filter((v) => v.items.length > 0);
    });
  };

  const moveToSaved = (vendorIndex: number, itemId: string) => {
    const vendor = cartData[vendorIndex];
    const item = vendor.items.find((item) => item.id === itemId);

    if (item) {
      setSavedItems((prev) => [
        ...prev,
        {
          id: item.id,
          name: item.name,
          vendor: item.vendor,
          price: item.price,
          image: item.image,
          category: item.category,
        },
      ]);
      removeItem(vendorIndex, itemId);
    }
  };

  const totalItems = cartData.reduce(
    (sum, vendor) =>
      sum + vendor.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
    0,
  );

  const grandTotal = cartData.reduce(
    (sum, vendor) => sum + vendor.subtotal + vendor.shipping,
    0,
  );

  if (cartData.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <ShoppingCart className="w-24 h-24 text-neutral-40 mx-auto mb-6" />
            <h2 className="text-2xl font-gabarito font-bold text-primary-dark-blue mb-4">
              Your cart is empty
            </h2>
            <p className="text-neutral-60 mb-8 font-gilroy">
              You can add items to your cart from your Items Saved For Later
              list below or use the search bar to add additional items to your
              shopping cart.
            </p>
            <Link to="/category">
              <Button className="bg-primary-dark-blue hover:bg-primary-dark-blue80 text-white rounded-lg font-gabarito font-bold">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-primary-dark-blue text-white p-4 rounded-lg mb-6">
            <h1 className="text-2xl font-gabarito font-bold">
              All Shopping Carts
            </h1>
            <p className="text-secondary-yellow40">
              Manage All Your Shopping Carts in One Place
            </p>
          </div>

          {/* Cart Actions */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <Button
              variant="outline"
              className="border-primary-dark-blue text-primary-dark-blue hover:bg-secondary-yellow40"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Refresh Carts
            </Button>
            <Button
              variant="outline"
              className="border-primary-dark-blue text-primary-dark-blue hover:bg-secondary-yellow40"
            >
              Print
            </Button>
            <Button
              variant="outline"
              className="border-primary-dark-blue text-primary-dark-blue hover:bg-secondary-yellow40"
            >
              Saved Carts
            </Button>
            <Button className="bg-primary-dark-blue hover:bg-primary-dark-blue80 text-white">
              Switch Accounts (344909-001)
            </Button>
            <Button variant="outline" className="border-gray-400 text-gray-600">
              Clear Cart
            </Button>
            <Button variant="outline" className="border-gray-400 text-gray-600">
              <RotateCcw className="w-4 h-4 mr-2" />
              Refresh Cart
            </Button>
            <Button variant="outline" className="border-gray-400 text-gray-600">
              Restore Cart
            </Button>
            <Button variant="outline" className="border-gray-400 text-gray-600">
              <RotateCcw className="w-4 h-4 mr-2" />
              Save Cart
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 md:gap-8">
          {/* Budget & Cart Info Sidebar - Mobile First */}
          <div className="xl:col-span-3 order-2 xl:order-1">
            <BudgetCartInfo
              totalItems={totalItems}
              subtotal={Math.round(grandTotal)}
              totalCarts={cartData.length}
              className="xl:sticky xl:top-6"
            />
          </div>

          {/* Cart Items - Vendor Separated */}
          <div className="xl:col-span-6 order-1 xl:order-2">
            {cartData.map((vendor, vendorIndex) => (
              <Card
                key={vendor.vendorName}
                className="bg-white border border-neutral-20 mb-6"
              >
                <CardContent className="p-0">
                  {/* Vendor Header */}
                  <div className="bg-secondary-yellow40 p-4 border-b border-secondary-yellow80">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Store className="w-5 h-5 text-primary-dark-blue" />
                        <div>
                          <h3 className="text-lg font-gabarito font-bold text-primary-dark-blue">
                            {vendor.vendorName}
                          </h3>
                          <p className="text-sm text-primary-dark-blue">
                            {vendor.items.length} item
                            {vendor.items.length !== 1 ? "s" : ""} • Delivery:{" "}
                            {vendor.estimatedDelivery}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-primary-dark-blue hover:bg-secondary-yellow80"
                        >
                          <Package className="w-4 h-4 mr-1" />
                          Set Shipping Info
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-primary-dark-blue hover:bg-secondary-yellow80"
                        >
                          Save All For Later
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Vendor Items */}
                  <div className="p-6">
                    {vendor.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-4 py-4 border-b border-neutral-20 last:border-b-0"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                        />

                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-gabarito font-bold text-primary-dark-blue mb-1">
                                {item.name}
                              </h4>
                              <p className="text-sm text-neutral-60">
                                Category: {item.category}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge className="bg-green-100 text-green-700 text-xs">
                                  <CheckCircle2 className="w-3 h-3 mr-1" />
                                  In Stock
                                </Badge>
                                <span className="text-xs text-neutral-60">
                                  Max: {item.maxQuantity}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-gabarito font-bold text-primary-dark-blue">
                                ₹{item.price.toFixed(2)}
                              </p>
                              <p className="text-sm text-neutral-60">
                                per unit
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              {/* Quantity Controls */}
                              <div className="flex items-center border border-neutral-20 rounded-lg">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() =>
                                    updateQuantity(
                                      vendorIndex,
                                      item.id,
                                      item.quantity - 1,
                                    )
                                  }
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="w-4 h-4" />
                                </Button>
                                <Input
                                  type="number"
                                  value={item.quantity}
                                  onChange={(e) =>
                                    updateQuantity(
                                      vendorIndex,
                                      item.id,
                                      parseInt(e.target.value) || 1,
                                    )
                                  }
                                  className="h-8 w-16 text-center border-0 focus:ring-0"
                                  min="1"
                                  max={item.maxQuantity}
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() =>
                                    updateQuantity(
                                      vendorIndex,
                                      item.id,
                                      item.quantity + 1,
                                    )
                                  }
                                  disabled={item.quantity >= item.maxQuantity}
                                >
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </div>

                              <div className="text-lg font-gabarito font-bold text-primary-dark-blue">
                                ₹{(item.price * item.quantity).toFixed(2)}
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-primary-dark-blue hover:bg-secondary-yellow40"
                                onClick={() =>
                                  moveToSaved(vendorIndex, item.id)
                                }
                              >
                                <Heart className="w-4 h-4 mr-1" />
                                Save for Later
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:bg-red-50"
                                onClick={() => removeItem(vendorIndex, item.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Vendor Subtotal */}
                    <div className="pt-4 mt-4 border-t border-neutral-20">
                      <div className="flex justify-between items-center">
                        <span className="font-gabarito font-bold text-neutral-80">
                          Subtotal (
                          {vendor.items.reduce(
                            (sum, item) => sum + item.quantity,
                            0,
                          )}{" "}
                          items):
                        </span>
                        <span className="text-xl font-gabarito font-bold text-primary-dark-blue">
                          ₹{vendor.subtotal.toFixed(2)}
                        </span>
                      </div>
                      {vendor.shipping > 0 && (
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-neutral-60">Shipping:</span>
                          <span className="text-neutral-80">
                            ₹{vendor.shipping.toFixed(2)}
                          </span>
                        </div>
                      )}

                      {/* Individual Vendor Checkout */}
                      <div className="mt-4">
                        <Link
                          to={`/checkout?vendor=${encodeURIComponent(vendor.vendorName)}`}
                        >
                          <Button className="w-full bg-secondary-yellow text-primary-dark-blue hover:bg-secondary-yellow80 font-gabarito font-bold rounded-lg py-2">
                            Checkout {vendor.vendorName} Only
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Saved Items */}
            {savedItems.length > 0 && (
              <Card className="bg-white border border-neutral-20">
                <CardContent className="p-6">
                  <h3 className="text-lg font-gabarito font-bold text-primary-dark-blue mb-4">
                    Items Saved For Later ({savedItems.length} items)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {savedItems.map((item) => (
                      <div
                        key={item.id}
                        className="border border-neutral-20 rounded-lg p-4"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-32 object-cover rounded-lg mb-3"
                        />
                        <h4 className="font-gabarito font-bold text-sm mb-2">
                          {item.name}
                        </h4>
                        <p className="text-xs text-neutral-60 mb-2">
                          {item.vendor}
                        </p>
                        <p className="font-gabarito font-bold text-primary-dark-blue mb-3">
                          ₹{item.price.toFixed(2)}
                        </p>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 flex-1"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div className="xl:col-span-3 order-3">
            <Card className="bg-white border border-neutral-20 sticky top-6">
              <CardContent className="p-6">
                <h3 className="text-lg font-gabarito font-bold text-primary-dark-blue mb-4">
                  Order Summary
                </h3>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-neutral-60">
                      Subtotal ({totalItems} items):
                    </span>
                    <span className="font-gabarito font-bold">
                      ₹{grandTotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-60">Shipping:</span>
                    <span className="text-green-600 font-medium">₹0.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-60">Tax:</span>
                    <span className="font-gabarito">₹0.00</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-gabarito font-bold">
                      Grand Total:
                    </span>
                    <span className="text-xl font-gabarito font-bold text-primary-dark-blue">
                      ₹{grandTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link
                    to={`/checkout?vendor=${encodeURIComponent(cartData[0]?.vendorName || "all")}`}
                  >
                    <Button className="w-full bg-primary-dark-blue hover:bg-primary-dark-blue80 text-white rounded-lg py-3">
                      PROCEED TO CHECKOUT ALL VENDORS
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>

                  <Button
                    variant="outline"
                    className="w-full border-primary-dark-blue text-primary-dark-blue hover:bg-secondary-yellow40"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    RETURN TO SHOPPING CART
                  </Button>
                </div>

                <div className="mt-6 p-4 bg-secondary-yellow40 rounded-lg">
                  <h4 className="font-gabarito font-bold text-primary-dark-blue mb-2">
                    Need Help?
                  </h4>
                  <p className="text-sm text-primary-dark-blue mb-2">
                    Ask a question and get an answer from one of our experts.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-primary-dark-blue text-primary-dark-blue hover:bg-secondary-yellow80"
                  >
                    Contact Support
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
