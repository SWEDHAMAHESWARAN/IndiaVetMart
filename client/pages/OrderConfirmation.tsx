import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
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
    // Get order details from location state or API
    const order = location.state?.orderDetails || {
      orderId: "IVM-" + Date.now().toString().slice(-6),
      orderDate: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      status: "confirmed",
      paymentStatus: "completed",
      paymentMethod: "Credit Card",
      clinicEmail: "clinic@example.com",
      items: [
        {
          id: "1",
          name: "Doxepin (butorphanol tartrate) - 50mL Vial 100mg/ml",
          image: "/api/placeholder/80/80",
          quantity: 1,
          price: 6000,
          seller: "Cure by Design",
          unit: "QTY",
        },
        {
          id: "2",
          name: "Hemp Oil For Equine 300mg CBD",
          image: "/api/placeholder/80/80",
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
        name: "Dr. Sarah Johnson",
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-dark-blue"></div>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
    <div className="min-h-screen bg-gradient-to-br from-neutral-10 to-secondary-yellow20 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="bg-primary-dark-blue rounded-2xl p-8 mb-8 text-center text-white">
          <div className="flex justify-center mb-4">
            <div className="bg-green-500 rounded-full p-3">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-gabarito font-bold mb-2">
            Order Confirmed!
          </h1>
          <p className="text-neutral-20 text-lg">
            Thank you for your purchase. Your order has been confirmed and will
            be shipped soon.
          </p>
          <div className="flex justify-center gap-4 mt-6">
            <Button
              variant="secondary"
              onClick={handleContinueShopping}
              className="bg-white text-primary-dark-blue hover:bg-neutral-10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
            <Button
              variant="outline"
              onClick={handleViewOrderHistory}
              className="border-white text-white hover:bg-white hover:text-primary-dark-blue"
            >
              View Orders
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Order Details and Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Information */}
            <Card className="rounded-2xl shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-gabarito font-bold text-primary-dark-blue flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      Order Details
                    </h2>
                    <p className="text-neutral-60 mt-1">
                      Order #{orderDetails.orderId}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-neutral-60 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {orderDetails.orderDate}
                    </p>
                    <Badge className="bg-green-100 text-green-800 mt-2">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Completed
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-neutral-10 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-primary-dark-blue" />
                    <div>
                      <p className="font-medium text-primary-dark-blue">
                        Clinic Email
                      </p>
                      <p className="text-neutral-60">
                        {orderDetails.clinicEmail}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Items Ordered */}
            <Card className="rounded-2xl shadow-lg">
              <CardHeader>
                <h2 className="text-xl font-gabarito font-bold text-primary-dark-blue flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Items Ordered
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orderDetails.items.map((item, index) => (
                    <div key={item.id}>
                      <div className="flex gap-4">
                        <div className="w-20 h-20 bg-neutral-10 rounded-xl overflow-hidden flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-primary-dark-blue line-clamp-2">
                            {item.name}
                          </h3>
                          <p className="text-sm text-neutral-60 mt-1">
                            Seller: {item.seller}
                          </p>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-sm text-neutral-60">
                              {item.quantity} {item.unit || "QTY"}
                            </span>
                            <span className="font-bold text-primary-dark-blue">
                              <Rupee />
                              {item.price.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      {index < orderDetails.items.length - 1 && (
                        <Separator className="mt-4" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Shipping Information */}
            <Card className="rounded-2xl shadow-lg">
              <CardHeader>
                <h2 className="text-xl font-gabarito font-bold text-primary-dark-blue flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Shipping Information
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="font-medium text-primary-dark-blue mb-2">
                      Shipping To:
                    </p>
                    <div className="bg-neutral-10 rounded-xl p-4">
                      <p className="font-medium">
                        {orderDetails.shippingAddress.name}
                      </p>
                      <p className="text-neutral-60">
                        {orderDetails.shippingAddress.street}
                      </p>
                      <p className="text-neutral-60">
                        {orderDetails.shippingAddress.city},{" "}
                        {orderDetails.shippingAddress.state}{" "}
                        {orderDetails.shippingAddress.zipCode}
                      </p>
                      <p className="text-neutral-60">
                        {orderDetails.shippingAddress.country}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                    <Truck className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-900">
                        Estimated Delivery
                      </p>
                      <p className="text-blue-700">
                        {orderDetails.estimatedDelivery}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Payment Summary and Support */}
          <div className="space-y-6">
            {/* Payment Summary */}
            <Card className="rounded-2xl shadow-lg">
              <CardHeader>
                <h2 className="text-xl font-gabarito font-bold text-primary-dark-blue flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-neutral-10 rounded-xl p-4">
                    <p className="text-sm text-neutral-60">Invoice</p>
                    <div className="flex justify-between items-center mt-2">
                      <span>No. of Products</span>
                      <span>{orderDetails.items.length}</span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span>Total Amount</span>
                      <span>
                        <Rupee />
                        {orderDetails.subtotal.toLocaleString()}
                      </span>
                    </div>
                    {orderDetails.discount > 0 && (
                      <div className="flex justify-between items-center mt-2 text-green-600">
                        <span>Discount</span>
                        <span>
                          -<Rupee />
                          {orderDetails.discount.toLocaleString()}
                        </span>
                      </div>
                    )}
                    <Separator className="my-3" />
                    <div className="flex justify-between items-center font-bold text-primary-dark-blue">
                      <span>Final Amount</span>
                      <span>
                        <Rupee />
                        {orderDetails.total.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    onClick={handleDownloadInvoice}
                    className="w-full"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Invoice
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Customer Support */}
            <Card className="rounded-2xl shadow-lg">
              <CardContent className="text-center p-6">
                <div className="flex justify-center mb-4">
                  <div className="bg-blue-100 rounded-full p-3">
                    <HelpCircle className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <h3 className="font-gabarito font-bold text-primary-dark-blue mb-2">
                  Need Help?
                </h3>
                <p className="text-neutral-60 text-sm mb-4">
                  Contact our customer support team for any questions about your
                  order.
                </p>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Phone className="w-4 h-4 mr-2" />
                  Contact Support
                </Button>
              </CardContent>
            </Card>

            {/* Order Tracking */}
            <Card className="rounded-2xl shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-5 h-5 text-orange-500" />
                  <div>
                    <h3 className="font-medium text-primary-dark-blue">
                      Order Status
                    </h3>
                    <p className="text-sm text-neutral-60">
                      We'll keep you updated
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Order Confirmed</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                    <span className="text-sm text-gray-500">Processing</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                    <span className="text-sm text-gray-500">Shipped</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                    <span className="text-sm text-gray-500">Delivered</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
