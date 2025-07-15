import { useState, useEffect } from "react";
import { useNavigate, useLocation, Routes, Route } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Upload,
  User,
  Building,
  MapPin,
  Camera,
  X,
  Check,
  AlertCircle,
  Mail,
  Phone,
  Plus,
  Trash2,
  Edit,
  ChevronRight,
} from "lucide-react";
import AddressManagement from "./ShippingAddress";
import Accounts from "./Account";
// Define types for profile data
interface ProfileData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    position: string;
    bio: string;
  };
  clinicInfo: {
    logo: string | null;
  };
}

interface Address {
  id: number;
  name: string;
  address: string;
  phone: string;
  isDefault: boolean;
}

interface UserPermission {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
  lastActive: string;
}

interface Clinic {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  country: string;
  state: string;
  city: string;
  status: string;
}

const speciesOptions = [
  "DOG",
  "CAT",
  "BIRD",
  "COW",
  "HORSE",
  "RABBIT",
  "REPTILE",
  "FISH",
];

const practiceTypeOptions = [
  "General Practice",
  "Emergency",
  "Specialty",
  "Spay/Neuter",
  "Nonprofit",
  "University",
  "Zoo/Aquarium",
  "Mobile",
];

const countryStateCity = {
  "United States": {
    California: ["San Francisco", "Los Angeles", "San Diego", "Sacramento"],
    "New York": ["New York City", "Buffalo", "Albany", "Syracuse"],
    Texas: ["Houston", "Dallas", "Austin", "San Antonio"],
    Florida: ["Miami", "Jacksonville", "Tampa", "Orlando"],
  },
  Canada: {
    Ontario: ["Toronto", "Ottawa", "Hamilton", "London"],
    "British Columbia": ["Vancouver", "Victoria", "Surrey", "Burnaby"],
    Quebec: ["Montreal", "Quebec City", "Laval", "Gatineau"],
  },
  "United Kingdom": {
    England: ["London", "Manchester", "Birmingham", "Liverpool"],
    Scotland: ["Edinburgh", "Glasgow", "Aberdeen", "Dundee"],
    Wales: ["Cardiff", "Swansea", "Newport", "Wrexham"],
  },
  Australia: {
    "New South Wales": ["Sydney", "Newcastle", "Wollongong", "Albury"],
    Victoria: ["Melbourne", "Geelong", "Ballarat", "Bendigo"],
    Queensland: ["Brisbane", "Gold Coast", "Townsville", "Cairns"],
  },
  India: {
    Maharashtra: ["Mumbai", "Pune", "Nagpur", "Nashik"],
    Karnataka: ["Bangalore", "Mysore", "Hubli", "Mangalore"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Salem"],
    Delhi: ["New Delhi", "Delhi Cantonment"],
  },
};

export default function Profile() {
  const navigate = useNavigate();
  const location = useLocation();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showUserPermissionDialog, setShowUserPermissionDialog] =
    useState(false);
  const [showAddColleagueDialog, setShowAddColleagueDialog] = useState(false);
  const [showClinicForm, setShowClinicForm] = useState<
    "edit" | "create" | null
  >(null);
  const [selectedUser, setSelectedUser] = useState<UserPermission | null>(null);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  // Get current active tab from URL
  const getCurrentTab = () => {
    const path = location.pathname.split("/")[2] || "account";
    return path;
  };

  useEffect(() => {
    // Redirect to account if on base /profile
    if (location.pathname === "/profile" || location.pathname === "/profile/") {
      navigate("/profile/account", { replace: true });
    }
  }, [location.pathname, navigate]);

  const [profileData, setProfileData] = useState<ProfileData>({
    personalInfo: {
      firstName: "Sarah",
      lastName: "Reddy",
      email: "sarah.reddy@example.com",
      phone: "+1 (555) 123-4567",
      position: "Veterinary Manager",
      bio: "Experienced veterinary professional with over 10 years in pet healthcare management.",
    },
    clinicInfo: {
      logo: null,
    },
  });

  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: 1,
      name: "Seven Pet Hospital",
      address: "2609 NIGHT HAWK DR\nLUTZ, FL 33559\n813926700",
      phone: "813926700",
      isDefault: true,
    },
    {
      id: 2,
      name: "Jeaven Pet",
      address: "25037 STATE ROAD 56\nWESLEY CHAPEL, FL 33544\n813926700",
      phone: "813926700",
      isDefault: false,
    },
  ]);

  const [clinics, setClinics] = useState<Clinic[]>([
    {
      id: 1,
      name: "Seven Oaks Pet Hospital - Main Branch",
      address: "123 Oak Street, Suite 100, San Francisco, CA 12345",
      phone: "+1 (555) 987-6543",
      email: "info@sevenoakspet.com",
      country: "United States",
      state: "California",
      city: "San Francisco",
      status: "Active",
    },
    {
      id: 2,
      name: "Seven Oaks Pet Hospital - Downtown",
      address: "456 Market Street, Suite 200, San Francisco, CA 12346",
      phone: "+1 (555) 987-6544",
      email: "downtown@sevenoakspet.com",
      country: "United States",
      state: "California",
      city: "San Francisco",
      status: "Active",
    },
  ]);

  const [users, setUsers] = useState<UserPermission[]>([
    {
      id: "1",
      name: "Maran S",
      email: "maran@gmail.com",
      role: "Veterinarian",
      permissions: [
        "Add/Modify Carts",
        "Edit Shopping Lists",
        "Claim IVM Rewards",
        "Edit Budgets",
        "Manage Clinic Account",
        "Manage Vendors",
        "View Previous Purchases",
        "View Pricing & Stock",
      ],
      lastActive: "Last Seen a few seconds ago",
    },
  ]);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setTimeout(() => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setLogoPreview(result);
          setProfileData((prev) => ({
            ...prev,
            clinicInfo: { ...prev.clinicInfo, logo: result },
          }));
          setIsUploading(false);
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 3000);
        };
        reader.readAsDataURL(file);
      }, 1500);
    }
  };

  const handleSave = (section: string) => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const menuItems = [
    { id: "account", label: "Account & Settings", path: "/profile/account" },
    { id: "address", label: "Address", path: "/profile/address" },
    { id: "clinic", label: "Clinic Information", path: "/profile/clinic" },
    { id: "users", label: "Manage User", path: "/profile/users" },
    {
      id: "vendors",
      label: "Vendor Connections",
      path: "/vendors",
      external: true,
    },
    {
      id: "budget",
      label: "Budget Management",
      path: "/budget",
      external: true,
    },
    {
      id: "approvals",
      label: "Approval Management",
      path: "/approvals",
      external: true,
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {showSuccess && (
          <div className="fixed top-4 right-4 z-50 bg-state-green-light text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
            <Check className="w-5 h-5" />
            Changes saved successfully!
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Mobile Tab Selector */}
          <div className="lg:hidden mb-6">
            <select
              value={getCurrentTab()}
              onChange={(e) => navigate(`/profile/${e.target.value}`)}
              className="w-full p-3 border border-neutral-30 rounded-lg bg-white font-gabarito font-medium text-primary-dark-blue"
            >
              {menuItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sidebar Navigation - Hidden on mobile */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="w-[280px] flex justify-start items-start flex-col">
              <div className="flex justify-start items-start flex-col">
                <div className="w-[280px] flex justify-center items-start flex-col gap-5 p-2.5 bg-white border border-neutral-60 rounded-[5px]">
                  {/* Header */}
                  <div className="flex justify-center items-center flex-row gap-2.5">
                    <span className="text-black font-gilroy font-bold">
                      My Account
                    </span>
                  </div>

                  {/* Menu Items */}
                  <div className="flex self-stretch justify-center items-center flex-col">
                    {menuItems.map((item) => {
                      const isActive = getCurrentTab() === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            if (item.external) {
                              window.location.href = item.path;
                            } else {
                              navigate(item.path);
                            }
                          }}
                          className={`h-[40px] flex self-stretch justify-start items-center flex-row gap-2.5 px-[5px] transition-all duration-200 ${
                            isActive
                              ? "bg-primary-dark-blue border-l-[3px] border-[#0078CD]"
                              : "hover:bg-neutral-10"
                          } ${item.id === "account" ? "rounded-t-[5px]" : ""} ${item.id === "approvals" ? "rounded-b-[5px]" : ""}`}
                        >
                          <div className="flex justify-center items-center flex-row gap-2.5">
                            <span
                              className={`font-gilroy ${isActive ? "font-bold text-white" : "font-light text-black"}`}
                            >
                              {item.label}
                            </span>
                          </div>
                          <div className="flex flex-1 justify-end items-center flex-row gap-2.5 p-2.5">
                            <ChevronRight
                              className={`w-6 h-6 ${isActive ? "text-white" : "text-black"}`}
                            />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-1 lg:col-span-3 space-y-8">
            <Routes>
              <Route path="account" element={<Accounts />} />
              <Route path="address" element={<AddressManagement />} />
              {/* <Route path="clinic" element={<ClinicManagement />} /> */}
              <Route path="users" element={<UserManagement />} />
            </Routes>
          </div>
        </div>

        {/* All Dialogs */}
        {/* Address Form Dialog */}
        <Dialog open={showAddressForm} onOpenChange={setShowAddressForm}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create an Address</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div>
                <Label>Clinic Name*</Label>
                <Input className="mt-1" />
              </div>
              <div>
                <Label>Clinic Phone Number*</Label>
                <Input className="mt-1" />
              </div>
              <div className="md:col-span-2">
                <Label>Address Line One*</Label>
                <Input placeholder="Address Line" className="mt-1" />
              </div>
              <div>
                <Label>APT/Suite</Label>
                <Input placeholder="Enter the APT Suite" className="mt-1" />
              </div>
              <div>
                <Label>Postal Code*</Label>
                <Input className="mt-1" />
              </div>
              <div>
                <Label>City*</Label>
                <Input className="mt-1" />
              </div>
              <div>
                <Label>State*</Label>
                <Input className="mt-1" />
              </div>
            </div>
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => setShowAddressForm(false)}
                className="flex-1"
              >
                CANCEL
              </Button>
              <Button className="flex-1 bg-primary-dark-blue text-white">
                CREATE ADDRESS
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* User Permission Dialog */}
        <Dialog
          open={showUserPermissionDialog}
          onOpenChange={setShowUserPermissionDialog}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Maran S User Permission</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <h4 className="font-gabarito font-semibold mb-2">
                  STEP 1: CHOOSE THE INITIAL PERMISSION LEVEL FOR THIS USER.
                </h4>
                <p className="text-sm text-neutral-60 mb-4">
                  This will automatically select the default permissions for
                  this permission level.
                </p>
                <select className="w-full border border-neutral-30 rounded-lg px-3 py-2">
                  <option>
                    Basic – gives users access to item pricing, past purchases,
                    and modifying carts
                  </option>
                </select>
              </div>

              <div>
                <h4 className="font-gabarito font-semibold mb-2">
                  STEP 2: CUSTOMIZE EACH PERMISSION FOR THIS USER.
                </h4>
                <p className="text-sm text-neutral-60 mb-4">
                  This will override any default permissions from Step 1.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    "Add/Modify Carts",
                    "Edit Shopping Lists",
                    "Place Orders",
                    "User Management",
                    "View Previous Purchases",
                    "Claim IVM Rewards",
                    "Manage Clinic Account",
                    "Receive Invoices",
                    "View Analytics",
                    "View Pricing & Stock",
                    "Edit Budgets",
                    "Manage Vendors",
                    "Receive Orders",
                    "View Cashbook Rewards",
                  ].map((permission) => (
                    <div key={permission} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        defaultChecked={[
                          "Add/Modify Carts",
                          "Edit Shopping Lists",
                          "Claim IVM Rewards",
                          "Manage Clinic Account",
                          "Manage Vendors",
                          "View Previous Purchases",
                          "View Pricing & Stock",
                        ].includes(permission)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">{permission}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => setShowUserPermissionDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button className="flex-1 bg-primary-dark-blue text-white">
                Update Permission
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Colleague Dialog */}
        <Dialog
          open={showAddColleagueDialog}
          onOpenChange={setShowAddColleagueDialog}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Colleague</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label>Name*</Label>
                <Input placeholder="Enter colleague name" className="mt-1" />
              </div>
              <div>
                <Label>Email*</Label>
                <Input
                  placeholder="Enter colleague email"
                  type="email"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Role*</Label>
                <select className="w-full border border-neutral-30 rounded-lg px-3 py-2 mt-1">
                  <option value="">Select Role</option>
                  <option value="Veterinarian">Veterinarian</option>
                  <option value="Technician">Technician</option>
                  <option value="Manager">Manager</option>
                  <option value="Assistant">Assistant</option>
                </select>
              </div>
            </div>
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => setShowAddColleagueDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setShowAddColleagueDialog(false);
                  setShowSuccess(true);
                  setTimeout(() => setShowSuccess(false), 3000);
                }}
                className="flex-1 bg-primary-dark-blue text-white"
              >
                Add Colleague
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );


   <Accounts />;
  <AddressManagement />;

  // Clinic Management Component
  function ClinicManagement() {
    return (
      <div className="space-y-8">
        {!showClinicForm ? (
          <Card className="bg-white shadow-lg border border-neutral-20 rounded-2xl">
            <CardHeader className="p-6 border-b border-neutral-20">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-gabarito font-bold text-primary-dark-blue">
                  Clinic Management
                </CardTitle>
                <Button
                  onClick={() => {
                    setSelectedClinic(null);
                    setShowClinicForm("create");
                  }}
                  className="bg-primary-dark-blue hover:bg-primary-dark-blue80 text-white rounded-lg"
                >
                  Create New Clinic
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-gabarito font-semibold text-primary-dark-blue">
                  All Clinic Branches
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {clinics.map((clinic) => (
                    <Card
                      key={clinic.id}
                      className="border border-neutral-20 hover:border-primary-dark-blue/30 transition-colors"
                    >
                      <CardContent className="p-4">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="text-lg font-gabarito font-semibold text-primary-dark-blue">
                                {clinic.name}
                              </h4>
                              <span className="px-2 py-1 bg-state-green-light text-white text-xs rounded-full">
                                {clinic.status}
                              </span>
                            </div>
                            <div className="space-y-1 text-sm text-neutral-60">
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                <span>{clinic.address}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4" />
                                <span>{clinic.phone}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                <span>{clinic.email}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              onClick={() => {
                                setSelectedClinic(clinic);
                                setSelectedCountry(clinic.country);
                                setSelectedState(clinic.state);
                                setSelectedCity(clinic.city);
                                setShowClinicForm("edit");
                              }}
                              className="border-primary-dark-blue text-primary-dark-blue hover:bg-secondary-yellow40 rounded-lg"
                            >
                              Update
                            </Button>
                            <Button
                              variant="outline"
                              className="border-red-500 text-red-500 hover:bg-red-50 rounded-lg"
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-white shadow-lg border border-neutral-20 rounded-2xl">
            <CardHeader className="p-6 border-b border-neutral-20">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-gabarito font-bold text-primary-dark-blue">
                  {showClinicForm === "create"
                    ? "Create New Clinic"
                    : "Update Clinic"}
                </CardTitle>
                <Button
                  variant="outline"
                  onClick={() => setShowClinicForm(null)}
                  className="border-neutral-30 text-neutral-60"
                >
                  Back to List
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
              {/* Species Selection */}
              <div>
                <h3 className="text-lg font-gabarito font-semibold text-primary-dark-blue mb-4">
                  SELECT ALL SPECIES TREATED BY YOUR PRACTICE{" "}
                  <span className="text-red-500">*</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {speciesOptions.map((species) => (
                    <div
                      key={species}
                      className={`cursor-pointer border-2 rounded-lg p-4 text-center transition-all ${
                        species === "DOG"
                          ? "border-primary-dark-blue bg-secondary-yellow40"
                          : "border-neutral-30 hover:border-primary-dark-blue/50"
                      }`}
                    >
                      <div className="w-16 h-16 mx-auto mb-2 bg-neutral-10 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">📷</span>
                      </div>
                      <span className="font-gabarito font-medium text-primary-dark-blue">
                        {species}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Practice Type */}
              <div>
                <h3 className="text-lg font-gabarito font-semibold text-primary-dark-blue mb-4">
                  PRACTICE TYPE(SELECT ALL THAT APPLY){" "}
                  <span className="text-red-500">*</span>
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {practiceTypeOptions.map((type) => (
                    <label
                      key={type}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        defaultChecked={
                          type === "General Practice" || type === "Spay/Neuter"
                        }
                        className="w-5 h-5 text-primary-dark-blue rounded border-neutral-30 focus:ring-primary-dark-blue/20"
                      />
                      <span className="text-primary-dark-blue font-gabarito font-medium text-sm">
                        {type}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Clinic Information Form */}
              <div>
                <h3 className="text-lg font-gabarito font-semibold text-primary-dark-blue mb-4">
                  CLINIC INFORMATION <span className="text-red-500">*</span>
                </h3>
                <div className="bg-neutral-10 p-6 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-primary-dark-blue font-gabarito font-medium">
                        Clinic Name
                      </Label>
                      <Input
                        placeholder="Enter the Clinic Name"
                        defaultValue={selectedClinic?.name || ""}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label className="text-primary-dark-blue font-gabarito font-medium">
                        Clinic Email
                      </Label>
                      <Input
                        placeholder="Enter the Clinic Email"
                        defaultValue={selectedClinic?.email || ""}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label className="text-primary-dark-blue font-gabarito font-medium">
                        Clinic Phone
                      </Label>
                      <Input
                        placeholder="Enter the Clinic Phone"
                        defaultValue={selectedClinic?.phone || ""}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label className="text-primary-dark-blue font-gabarito font-medium">
                        Clinic Street Address
                      </Label>
                      <Input
                        placeholder="Enter the Clinic Street Address"
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label className="text-primary-dark-blue font-gabarito font-medium">
                        Suite/Building, etc.
                      </Label>
                      <Input
                        placeholder="Enter the Suite, Building, etc."
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label className="text-primary-dark-blue font-gabarito font-medium">
                        Zip Code
                      </Label>
                      <Input
                        placeholder="Enter the Zip Code"
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label className="text-primary-dark-blue font-gabarito font-medium">
                        Select Country
                      </Label>
                      <select
                        value={selectedCountry}
                        onChange={(e) => {
                          setSelectedCountry(e.target.value);
                          setSelectedState("");
                          setSelectedCity("");
                        }}
                        className="mt-2 w-full border border-neutral-30 rounded-lg px-3 py-2"
                      >
                        <option value="">Select Country</option>
                        {Object.keys(countryStateCity).map((country) => (
                          <option key={country} value={country}>
                            {country}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label className="text-primary-dark-blue font-gabarito font-medium">
                        Select State
                      </Label>
                      <select
                        value={selectedState}
                        onChange={(e) => {
                          setSelectedState(e.target.value);
                          setSelectedCity("");
                        }}
                        className="mt-2 w-full border border-neutral-30 rounded-lg px-3 py-2"
                        disabled={!selectedCountry}
                      >
                        <option value="">Select State</option>
                        {selectedCountry &&
                          Object.keys(countryStateCity[selectedCountry]).map(
                            (state) => (
                              <option key={state} value={state}>
                                {state}
                              </option>
                            ),
                          )}
                      </select>
                    </div>
                    <div>
                      <Label className="text-primary-dark-blue font-gabarito font-medium">
                        Select City
                      </Label>
                      <select
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                        className="mt-2 w-full border border-neutral-30 rounded-lg px-3 py-2"
                        disabled={!selectedState}
                      >
                        <option value="">Select City</option>
                        {selectedCountry &&
                          selectedState &&
                          countryStateCity[selectedCountry][selectedState].map(
                            (city) => (
                              <option key={city} value={city}>
                                {city}
                              </option>
                            ),
                          )}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Questions */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-gabarito font-semibold text-primary-dark-blue mb-2">
                    Do You Belong to a Buying Group / Group Purchasing
                    Organization (GPO)?
                  </h3>
                  <p className="text-neutral-60 text-sm mb-4">
                    Examples: PSI, VWG, PVO, Vetcove, etc.
                  </p>
                  <div className="flex gap-4">
                    <Button className="bg-primary-dark-blue text-white">
                      Yes
                    </Button>
                    <Button variant="outline">No</Button>
                    <Button variant="outline">Not Sure</Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-gabarito font-semibold text-primary-dark-blue mb-2">
                    Is Your Practice Owned by a Corporate Hospital Group?
                  </h3>
                  <p className="text-neutral-60 text-sm mb-4">
                    Examples: VCA, PVA, VetCare, etc.
                  </p>
                  <div className="flex gap-4">
                    <Button variant="outline">Yes</Button>
                    <Button className="bg-primary-dark-blue text-white">
                      No
                    </Button>
                    <Button variant="outline">Not Sure</Button>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-4 pt-6 border-t border-neutral-20">
                <Button
                  variant="outline"
                  onClick={() => setShowClinicForm(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    handleSave("clinic");
                    setShowClinicForm(null);
                  }}
                  className="flex-1 bg-primary-dark-blue text-white"
                >
                  {showClinicForm === "create"
                    ? "Create Clinic"
                    : "Update Clinic"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // User Management Component
  function UserManagement() {
    return (
      <Card className="bg-white shadow-lg border border-neutral-20 rounded-2xl">
        <CardHeader className="p-6 border-b border-neutral-20">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-gabarito font-bold text-primary-dark-blue">
              Manage User Accounts
            </CardTitle>
            <Button
              onClick={() => setShowAddColleagueDialog(true)}
              className="bg-primary-dark-blue hover:bg-primary-dark-blue80 text-white rounded-lg"
            >
              ADD COLLEAGUE
            </Button>
          </div>
          <p className="text-neutral-60 text-sm mt-2">
            Indian Vet Mart supports having several users under a single clinic.
            Each user will have their own login with set permissions and can
            independently participate in the Indian Vet Mart discussions. You
            have full control over setting the permissions of each user in your
            clinic.
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <h4 className="font-gabarito font-medium text-primary-dark-blue">
              Permission Groups Table
            </h4>

            {users.map((user) => (
              <div
                key={user.id}
                className="border border-neutral-20 rounded-lg p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-gabarito font-semibold text-primary-dark-blue">
                      {user.name} ({user.email}) ({user.role})
                    </h3>
                    <p className="text-state-green-light text-sm">
                      ✓ {user.lastActive}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  {user.permissions.map((permission) => (
                    <div key={permission} className="flex items-center gap-2">
                      <span className="text-state-green-light">✓</span>
                      <span className="text-sm text-primary-dark-blue">
                        {permission}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    className="border-red-500 text-red-500 hover:bg-red-50"
                  >
                    REVOKE ACCESS
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedUser(user);
                      setShowUserPermissionDialog(true);
                    }}
                    className="bg-primary-dark-blue text-white"
                  >
                    EDIT PERMISSION
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
}
