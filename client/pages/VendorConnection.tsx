import { useState,useEffect} from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { fetchDataFromApi } from "@/lib/api";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  User,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Vendor {
  _id: string;
  sellername: string;
  logo: string;
  isConnected: boolean;
  addressLine1?: string;
  phone?: string;
  email?: string;
  description?: string;
  requiresAuth?: boolean;
  platform?: string;
  dateCreated: string;
}

export default function VendorConnection() {
  const [vendors, setVendors] = useState<Vendor[]>([
   
  ]);
   useEffect(() => {  
    const fetchVendors = async () => {
      try {
        const data = await fetchDataFromApi("/vendor/getall");
        console.log("Fetched vendor data:", data.Response);
        setVendors(data.Response || []);
      } catch (error) {
        console.error("Vendor fetch error", error);
      }
    };

    fetchVendors();
  }, []);

  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [authForm, setAuthForm] = useState({
    username: "",
    password: "",
  });

 const handleConnect = async (vendorId: string) => {
  setIsConnecting(true);

  await new Promise((resolve) => setTimeout(resolve, 1500));

  setVendors((prev) => {
    console.log("Before connect:", prev);

    const updated = prev.map((vendor) =>
      vendor._id === vendorId
        ? { ...vendor, isConnected: true }
        : { ...vendor, isConnected: false }
    );

    console.log("After connect:", updated);
    return updated;
  });

  setIsConnecting(false);
  setSelectedVendor(null);
  setAuthForm({ username: "", password: "" });
};


  const handleDisconnect = async (vendorId: string) => {
    setVendors((prev) =>
      prev.map((vendor) =>
        vendor._id === vendorId ? { ...vendor, isConnected: false } : vendor,
      ),
    );
  };

  const connectedVendors = vendors.filter((v) => v.isConnected);
  const availableVendors = vendors.filter((v) => !v.isConnected);

  return (
    <div className="min-h-screen bg-neutral-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link to="/profile">
              <Button
                variant="ghost"
                size="icon"
                className="text-primary-dark-blue"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-primary-dark-blue">
                Vendor Connections
              </h1>
              <p className="text-neutral-60 mt-1">
                Connect with vendors to access their products and add them to
                your cart
              </p>
            </div>
          </div>
        </div>

        {/* Connected Vendors */}
        {connectedVendors.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-primary-dark-blue mb-4">
              Connected Vendors ({connectedVendors.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {connectedVendors.map((vendor) => (
                <Card
                  key={vendor._id}
                  className="border-2 border-green-200 bg-green-50"
                >
                  <CardHeader className="text-center pb-4">
                    <div className="flex justify-center mb-3">
                      <img
                        src={vendor.logo}
                        alt={vendor.sellername}
                        className="w-16 h-16 object-contain rounded-lg"
                      />
                    </div>
                    <CardTitle className="text-primary-dark-blue">
                      {vendor.sellername}
                    </CardTitle>
                    <div className="flex items-center justify-center gap-2 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Connected</span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2 text-sm text-neutral-60 mb-4">
                      {vendor.addressLine1 && (
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>{vendor.addressLine1}</span>
                        </div>
                      )}
                      {vendor.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <span>{vendor.phone}</span>
                        </div>
                      )}
                      {vendor.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          <span>{vendor.email}</span>
                        </div>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-red-300 text-red-600 hover:bg-red-50"
                      onClick={() => handleDisconnect(vendor._id)}
                    >
                      Disconnect
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Available Vendors */}
        <div>
          <h2 className="text-xl font-bold text-primary-dark-blue mb-4">
            Available Vendors ({availableVendors.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableVendors.map((vendor) => (
              <Card key={vendor._id} className="border border-neutral-20">
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-3">
                    <img
                      src={vendor.logo}
                      alt={vendor.sellername}
                      className="w-16 h-16 object-contain rounded-lg"
                    />
                  </div>
                  <CardTitle className="text-primary-dark-blue">
                    {vendor.sellername}
                  </CardTitle>
                  <div className="flex items-center justify-center gap-2 text-neutral-40">
                    <XCircle className="w-4 h-4" />
                    <span className="text-sm">Not Connected</span>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2 text-sm text-neutral-60 mb-4">
                    {vendor.description && (
                      <p className="text-center">{vendor.description}</p>
                    )}
                    <div className="grid [grid-template-columns:auto_1fr] gap-y-1 w-full max-w-sm mx-auto text-sm text-gray-700">
                     <span className="font-semibold">Email:</span>
                     <span className="text-right">{vendor.email}</span>

                     <span className="font-semibold">Phone:</span>
                     <span className="text-right">{vendor.phone}</span>

                     <span className="font-semibold">Platform:</span>
                     <span className="text-right">{vendor.platform}</span>

                     <span className="font-semibold">Joined:</span>
                     <span className="text-right">
                      {new Date(vendor.dateCreated).toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric'
                     })}
                    </span>
                   </div>


                  </div>

                  {vendor.requiresAuth ? (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          className="w-full bg-primary-dark-blue text-white hover:bg-primary-dark-blue/90"
                          onClick={() => setSelectedVendor(vendor)}
                        >
                          Connect Vendor
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle className="text-primary-dark-blue ">
                            Connect to {vendor.sellername}
                          </DialogTitle>
                          <DialogDescription>
                            By authorizing access, your negotiated pricing &
                            purchase data will be available when shopping on
                            IndiaVetMart. Use the credentials that you would use
                            to log in to the {vendor.sellername} website.
                          </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 pt-4">
                          <div className="space-y-2">
                            <Label
                              htmlFor="username"
                              className="text-primary-dark-blue"
                            >
                              {vendor.sellername} Username
                            </Label>
                            <Input
                              id="username"
                              type="text"
                              placeholder="Enter your username"
                              value={authForm.username}
                              onChange={(e) =>
                                setAuthForm((prev) => ({
                                  ...prev,
                                  username: e.target.value,
                                }))
                              }
                              className="border-neutral-40 focus:border-primary-dark-blue"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label
                              htmlFor="password"
                              className="text-primary-dark-blue"
                            >
                              {vendor.sellername} Password
                            </Label>
                            <Input
                              id="password"
                              type="password"
                              placeholder="Enter your password"
                              value={authForm.password}
                              onChange={(e) =>
                                setAuthForm((prev) => ({
                                  ...prev,
                                  password: e.target.value,
                                }))
                              }
                              className="border-neutral-40 focus:border-primary-dark-blue"
                            />
                          </div>

                          <Button
                            className="w-full bg-primary-dark-blue text-white hover:bg-primary-dark-blue/90"
                            onClick={() => handleConnect(vendor._id)}
                            disabled={
                              isConnecting ||
                              !authForm.username ||
                              !authForm.password
                            }
                          >
                            {isConnecting ? "Connecting..." : "Connect Vendor"}
                          </Button>

                          <div className="text-xs text-neutral-60 text-center">
                            Don't have online access with {vendor.sellername}?<br />
                            <a
                              href="#"
                              className="text-primary-dark-blue underline"
                            >
                              You can request online access by filling out the
                              request form.
                            </a>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <Button
                      className="w-full bg-primary-dark-blue text-white hover:bg-primary-dark-blue/90"
                      onClick={() => handleConnect(vendor._id)}
                      disabled={isConnecting}
                    >
                      {isConnecting ? "Connecting..." : "Connect Vendor"}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Info Card */}
        <Card className="mt-8 bg-secondary-yellow40 border-secondary-yellow60">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-primary-dark-blue rounded-lg">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-primary-dark-blue mb-2">
                  Why Connect with Vendors?
                </h3>
                <ul className="text-sm text-neutral-60 space-y-1">
                  <li>• Access vendor-specific pricing and discounts</li>
                  <li>• View real-time product availability</li>
                  <li>• Enable direct ordering and faster checkout</li>
                  <li>• Get personalized product recommendations</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
