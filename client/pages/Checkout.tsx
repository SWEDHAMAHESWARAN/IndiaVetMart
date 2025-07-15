import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Store,
  Package,
  CreditCard,
  MapPin,
  User,
} from "lucide-react";

interface CheckoutItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  vendor: string;
  image: string;
}

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const selectedVendor = searchParams.get("vendor");

  const [orderData, setOrderData] = useState({
    account: {
      id: "439009-001",
      name: "SEVEN OAKS PET HOSPITAL",
      user: "RAMUGANTI SREENIVAS K DVN",
      address: "27027 SR 56\nWESLEY CHAPEL, Florida 33544",
    },
    shippingMethod: "Standard Delivery",
    paymentMethod: "Standard Payment",
    promoCode: "",
    orderNotes: "",
  });

  // Sample checkout items by vendor
  const allCheckoutItems: CheckoutItem[] = [
    {
      id: "1",
      name: "Depo Medrol, Injection, 20ml",
      quantity: 1,
      price: 79.7,
      vendor: "Covetrus",
      image:
        "https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=100&h=100&fit=crop",
    },
    {
      id: "2",
      name: "Hemp Seed Oil For Pet",
      quantity: 2,
      price: 245.0,
      vendor: "MWI Veterinary Supply",
      image:
        "https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=100&h=100&fit=crop",
    },
  ];

  // Filter items based on selected vendor
  const checkoutItems =
    selectedVendor && selectedVendor !== "all"
      ? allCheckoutItems.filter((item) => item.vendor === selectedVendor)
      : allCheckoutItems;

  const subtotal = checkoutItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shipping = 0.0;
  const tax = 0.0;
  const grandTotal = subtotal + shipping + tax;

  const handlePlaceOrder = () => {
    // In real app, this would process the order
    alert("Order placed successfully!");
    // Redirect to order history
    window.location.href = "/orders";
  };

  return (
    <div className="min-h-screen bg-neutral-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-primary-dark-blue text-white p-4 rounded-lg mb-6">
          <h1 className="text-2xl font-gabarito font-bold">
            {selectedVendor && selectedVendor !== "all"
              ? `${selectedVendor} Checkout`
              : "Checkout"}
          </h1>
          <p className="text-secondary-yellow40">
            {selectedVendor && selectedVendor !== "all"
              ? `Complete your order from ${selectedVendor}`
              : "Review and complete your order"}
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 md:gap-8">
          {/* Budget & Cart Info Sidebar - Mobile First */}
          <div className="xl:col-span-3 order-2 xl:order-1">
            <BudgetCartInfo
              totalItems={checkoutItems.reduce(
                (sum, item) => sum + item.quantity,
                0,
              )}
              subtotal={Math.round(grandTotal)}
              totalCarts={1}
              className="xl:sticky xl:top-6"
            />
          </div>

          {/* Main Content */}
          <div className="xl:col-span-6 order-1 xl:order-2">
            <div className="space-y-6">
              {/* Account Information */}
              <Card className="bg-white border border-neutral-20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <User className="w-5 h-5 text-primary-dark-blue" />
                    <h3 className="text-lg font-gabarito font-bold text-primary-dark-blue">
                      COVETRUS ACCOUNT
                    </h3>
                  </div>

                  <div className="bg-neutral-10 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-gabarito font-bold text-neutral-80">
                          Account ID
                        </Label>
                        <p className="text-primary-dark-blue font-gabarito font-bold">
                          {orderData.account.id}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-gabarito font-bold text-neutral-80">
                          Name
                        </Label>
                        <p className="text-primary-dark-blue font-gabarito font-bold">
                          {orderData.account.name}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-gabarito font-bold text-neutral-80">
                          User
                        </Label>
                        <p className="text-primary-dark-blue">
                          {orderData.account.user}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-gabarito font-bold text-neutral-80">
                          Address
                        </Label>
                        <p className="text-primary-dark-blue whitespace-pre-line">
                          {orderData.account.address}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* PO Number */}
              <Card className="bg-white border border-neutral-20">
                <CardContent className="p-6">
                  <h3 className="text-lg font-gabarito font-bold text-primary-dark-blue mb-4">
                    P.O NUMBER
                  </h3>
                  <p className="text-sm text-neutral-60 mb-4">
                    Maximum of 15 characters, including prefix.
                  </p>
                  <Input placeholder="VOLARIS-PO" className="max-w-md" />
                </CardContent>
              </Card>

              {/* Promo Code */}
              <Card className="bg-white border border-neutral-20">
                <CardContent className="p-6">
                  <h3 className="text-lg font-gabarito font-bold text-primary-dark-blue mb-4">
                    PROMO CODE
                  </h3>
                  <p className="text-sm text-neutral-60 mb-4">
                    Multiple codes may be submitted as a space-separated list
                    (ex: PROMO1 PROMO2 PROMO3)
                  </p>
                  <Input
                    placeholder="Promo Code"
                    value={orderData.promoCode}
                    onChange={(e) =>
                      setOrderData((prev) => ({
                        ...prev,
                        promoCode: e.target.value,
                      }))
                    }
                    className="max-w-md"
                  />
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card className="bg-white border border-neutral-20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <CreditCard className="w-5 h-5 text-primary-dark-blue" />
                    <h3 className="text-lg font-gabarito font-bold text-primary-dark-blue">
                      PAYMENT METHOD*
                    </h3>
                  </div>
                  <Select defaultValue="standard">
                    <SelectTrigger className="max-w-md">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard Payment</SelectItem>
                      <SelectItem value="credit">Credit Card</SelectItem>
                      <SelectItem value="bank">Bank Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-blue-600 mt-2">More Options →</p>
                </CardContent>
              </Card>

              {/* Shipping Method */}
              <Card className="bg-white border border-neutral-20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Package className="w-5 h-5 text-primary-dark-blue" />
                    <h3 className="text-lg font-gabarito font-bold text-primary-dark-blue">
                      SHIPPING METHOD*
                    </h3>
                  </div>
                  <Select defaultValue="standard">
                    <SelectTrigger className="max-w-md">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">
                        Standard Delivery
                      </SelectItem>
                      <SelectItem value="express">Express Delivery</SelectItem>
                      <SelectItem value="overnight">
                        Overnight Delivery
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-blue-600 mt-2">More Options →</p>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card className="bg-white border border-neutral-20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <MapPin className="w-5 h-5 text-primary-dark-blue" />
                    <h3 className="text-lg font-gabarito font-bold text-primary-dark-blue">
                      SHIPPING ADDRESS*
                    </h3>
                  </div>
                  <div className="bg-secondary-yellow40 p-4 rounded-lg border border-secondary-yellow80">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-4 h-4 bg-primary-dark-blue rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      </div>
                      <span className="font-gabarito font-bold text-primary-dark-blue">
                        27027 SR 56
                      </span>
                    </div>
                    <p className="text-primary-dark-blue ml-6">
                      WESLEY CHAPEL, Florida 33544
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Navigation Buttons */}
              <div className="flex justify-between">
                <Link to="/shopping">
                  <Button
                    variant="outline"
                    className="border-primary-dark-blue text-primary-dark-blue hover:bg-secondary-yellow40"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    RETURN TO SHOPPING CART
                  </Button>
                </Link>
                <Button
                  className="bg-primary-dark-blue hover:bg-primary-dark-blue80 text-white"
                  onClick={handlePlaceOrder}
                >
                  PLACE ORDER
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="xl:col-span-3 order-3">
            <Card className="bg-white border border-neutral-20 sticky top-6">
              <CardContent className="p-6">
                <h3 className="text-lg font-gabarito font-bold text-primary-dark-blue mb-4">
                  ORDER SUMMARY
                </h3>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-neutral-60">Subtotal:</span>
                    <span className="font-gabarito font-bold">
                      ₹{subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-60">Shipping:</span>
                    <span className="text-green-600">
                      ₹{shipping.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-60">Tax:</span>
                    <span className="font-gabarito">₹{tax.toFixed(2)}</span>
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

                {/* Items Summary */}
                <div className="border-t border-neutral-20 pt-4">
                  <h4 className="font-gabarito font-bold text-primary-dark-blue mb-3">
                    ITEMS
                  </h4>
                  {checkoutItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 mb-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-gabarito font-bold text-primary-dark-blue">
                          {item.name}
                        </p>
                        <p className="text-xs text-neutral-60">SKU: 202397</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">Qty: {item.quantity}</p>
                        <p className="text-sm font-gabarito font-bold">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
