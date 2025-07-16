import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  Package,
  MapPin,
  CreditCard,
  Calendar,
  Mail,
  Phone,
  Download,
  ArrowLeft,
  Truck,
  Clock,
  HelpCircle,
  Home,
  Receipt,
} from "lucide-react";
import { Rupee } from "@/components/constants/CurrencyConst";

interface OrderItem {
  id: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
  seller: string;
  unit?: string;
}

interface OrderDetails {
  orderId: string;
  orderDate: string;
  status: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  clinicEmail: string;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  estimatedDelivery: string;
}

export default function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get order details from location state or use sample data for demo
    const order = location.state?.orderDetails || {
      orderId: "2024-003847",
      orderDate: "March 15, 2024",
      status: "confirmed",
      paymentStatus: "completed",
      paymentMethod: "Credit Card",
      clinicEmail: "clinic@example.com",
      items: [
        {
          id: "1",
          name: "Doxepin (butorphanol tartrate) - 50mL Vial 100mg/ml",
          image:
            "https://cdn.builder.io/api/v1/image/assets%2Fe33c04ad181d47968df9f3990555750a%2F924a83d90d1e4c3caaf7fc7270bdb79c?format=webp&width=800",
          quantity: 1,
          price: 6000,
          seller: "Cure by Design",
          unit: "QTY",
        },
        {
          id: "2",
          name: "Hemp Oil For Equine 300mg CBD",
          image:
            "https://cdn.builder.io/api/v1/image/assets%2Fe33c04ad181d47968df9f3990555750a%2F924a83d90d1e4c3caaf7fc7270bdb79c?format=webp&width=800",
          quantity: 1,
          price: 255,
          seller: "Cure by Design",
          unit: "300 mg",
        },
      ],
      subtotal: 6255,
      discount: 0,
      shipping: 0,
      tax: 0,
      total: 6255,
      shippingAddress: {
        name: "Lovelyn",
        street: "123 Main Street, Apt 4B",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "United States",
      },
      estimatedDelivery: "3-5 business days",
    };

    setOrderDetails(order);
    setLoading(false);
  }, [location]);

  const handleContinueShopping = () => {
    navigate("/home");
  };

  const handleViewOrderHistory = () => {
    navigate("/orders");
  };

  const handleDownloadInvoice = () => {
    // Implement invoice download functionality
    console.log("Downloading invoice...");
  };

  const handleContactSupport = () => {
    // Implement contact support functionality
    console.log("Contacting support...");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-dark-blue"></div>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-10">
        <div className="text-center">
          <h1 className="text-2xl font-gabarito font-bold text-primary-dark-blue mb-4">
            Order Not Found
          </h1>
          <Button onClick={handleContinueShopping}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-10">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header Section - Blue Background */}
        <div className="bg-primary-dark-blue rounded-lg p-8 mb-8 text-center text-white">
          <h1 className="text-4xl font-gabarito font-bold mb-2">
            Order Confirmed!
          </h1>
          <p className="text-neutral-20 text-lg">
            Thank you for your purchase. Your order has been confirmed and will
            be shipped soon.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Order Details and Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Details Card */}
            <Card className="rounded-lg shadow-sm border border-neutral-20">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-gabarito font-bold text-primary-dark-blue">
                      Order Details
                    </h2>
                    <p className="text-neutral-60 text-sm">
                      Order #{orderDetails.orderId}
                    </p>
                  </div>
                  <div className="text-right">
                    <h3 className="text-lg font-gabarito font-bold text-primary-dark-blue">
                      Order Date
                    </h3>
                    <p className="text-neutral-60 text-sm">
                      {orderDetails.orderDate}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="border border-neutral-20 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-primary-dark-blue">
                        Clinic Email
                      </h4>
                      <p className="text-neutral-60 text-sm">
                        {orderDetails.clinicEmail}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-green-600 font-medium text-sm">
                        Completed
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Items Ordered Card */}
            <Card className="rounded-lg shadow-sm border border-neutral-20">
              <CardHeader className="pb-3">
                <h2 className="text-lg font-gabarito font-bold text-primary-dark-blue flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Items Ordered
                </h2>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  {orderDetails.items.map((item, index) => (
                    <div
                      key={item.id}
                      className="border border-neutral-20 rounded-lg p-4"
                    >
                      <div className="flex gap-4">
                        <div className="w-16 h-16 bg-neutral-10 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-primary-dark-blue text-sm line-clamp-2 mb-1">
                            {item.name}
                          </h3>
                          <p className="text-neutral-60 text-sm mb-2">
                            <span className="font-medium">Seller Name:</span>{" "}
                            {item.seller}
                          </p>
                          <div className="flex justify-between items-center">
                            <span className="text-neutral-60 text-sm">
                              {item.quantity} {item.unit || "QTY"}
                            </span>
                            <span className="font-bold text-primary-dark-blue">
                              <Rupee />
                              {item.price.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Shipping Information Card */}
            <Card className="rounded-lg shadow-sm border border-neutral-20">
              <CardHeader className="pb-3">
                <h2 className="text-lg font-gabarito font-bold text-primary-dark-blue flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Shipping Information
                </h2>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-primary-dark-blue mb-2">
                      Shipping To
                    </h4>
                    <p className="text-neutral-60 text-sm">
                      {orderDetails.shippingAddress.name}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-primary-dark-blue mb-2">
                      Delivery Address
                    </h4>
                    <div className="text-neutral-60 text-sm">
                      <p>{orderDetails.shippingAddress.street}</p>
                      <p>
                        {orderDetails.shippingAddress.city},{" "}
                        {orderDetails.shippingAddress.state}{" "}
                        {orderDetails.shippingAddress.zipCode},{" "}
                        {orderDetails.shippingAddress.country}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Payment and Support */}
          <div className="space-y-6">
            {/* Payment Card */}
            <Card className="rounded-lg shadow-sm border border-neutral-20">
              <CardHeader className="pb-3">
                <h2 className="text-lg font-gabarito font-bold text-primary-dark-blue flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment
                </h2>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="border border-neutral-20 rounded-lg p-4">
                  <div className="text-center mb-4">
                    <h4 className="font-medium text-primary-dark-blue">
                      Invoice
                    </h4>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>No. of Product</span>
                      <span>{orderDetails.items.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Amount</span>
                      <span>
                        <Rupee />
                        {orderDetails.subtotal.toLocaleString()}
                      </span>
                    </div>
                    {orderDetails.discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>
                          <Rupee />
                          {orderDetails.discount.toLocaleString()}
                        </span>
                      </div>
                    )}
                    <Separator className="my-2" />
                    <div className="flex justify-between font-bold text-primary-dark-blue">
                      <span>Final Amount</span>
                      <span>
                        <Rupee />
                        {orderDetails.total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Need Help Card */}
            <Card className="rounded-lg shadow-sm border border-neutral-20">
              <CardContent className="text-center p-6">
                <h3 className="font-gabarito font-bold text-primary-dark-blue mb-2">
                  Need Help?
                </h3>
                <p className="text-neutral-60 text-sm mb-4">
                  Contact our customer support team for any questions about your
                  order.
                </p>
                <Button
                  onClick={handleContactSupport}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Contact Support
                </Button>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleContinueShopping}
                className="w-full bg-primary-dark-blue hover:bg-primary-dark-blue/90 text-white"
              >
                <Home className="w-4 h-4 mr-2" />
                Continue Shopping
              </Button>

              <Button
                onClick={handleViewOrderHistory}
                variant="outline"
                className="w-full border-primary-dark-blue text-primary-dark-blue hover:bg-primary-dark-blue hover:text-white"
              >
                <Receipt className="w-4 h-4 mr-2" />
                View Order History
              </Button>

              <Button
                onClick={handleDownloadInvoice}
                variant="outline"
                className="w-full border-neutral-40 text-neutral-60 hover:bg-neutral-10"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Invoice
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
