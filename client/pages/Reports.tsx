import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  Search,
  Filter,
  Download,
  Calendar,
  TrendingUp,
  Package,
  Users,
  Grid3X3,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { Rupee } from "@/components/constants/CurrencyConst";

// Sample data - in real app this would come from API
const chartData = [
  { month: 0, value: 0 },
  { month: 1, value: 4500 },
  { month: 2, value: 3000 },
  { month: 3, value: 2000 },
  { month: 4, value: 1500 },
  { month: 5, value: 3000 },
  { month: 6, value: 2500 },
  { month: 7, value: 4000 },
  { month: 8, value: 1500 },
  { month: 9, value: 3500 },
  { month: 10, value: 2800 },
  { month: 11, value: 3200 },
  { month: 12, value: 2000 },
];

const itemsData = [
  {
    id: 1,
    name: "VetScan HM5 Reagent Pack: Each",
    vendor: "Zoetis",
    lastPurchased: "June 05th, 2025",
    units: "24 test",
    quantity: 205,
    volume: 25255,
    percentage: 75.2,
  },
  {
    id: 2,
    name: "Vetscan Imagyst Ova Oocysts: 40 Tests",
    vendor: "Merck",
    lastPurchased: "June 11th, 2025",
    units: "60 tablet",
    quantity: 50,
    volume: 1502,
    percentage: 45.0,
  },
  {
    id: 3,
    name: "Nobivac Feline 2-FeIV: 25 Count",
    vendor: "Dechra",
    lastPurchased: "June 21th, 2025",
    units: "10 dose",
    quantity: 95,
    volume: 652,
    percentage: 38.6,
  },
  {
    id: 4,
    name: "Convenia Injectable: 10ml",
    vendor: "Ceva",
    lastPurchased: "June 05th, 2025",
    units: "1 ml",
    quantity: 120,
    volume: 5002,
    percentage: 75.2,
  },
  {
    id: 5,
    name: "Apoquel Tablets: 16mg, 250 Count",
    vendor: "Elanco",
    lastPurchased: "June 24th, 2025",
    units: "10 box",
    quantity: 4,
    volume: 5,
    percentage: 5,
  },
];

const categoriesData = [
  { name: "Pet Cares", volume: 25655, percentage: 56.0 },
  { name: "Cotton Quilted cares", volume: 265, percentage: 2.0 },
  { name: "New Pet Health and Wellness", volume: 452255, percentage: 35.0 },
  { name: "Frocks", volume: 652, percentage: 3.1 },
  { name: "Pet Accessories", volume: 4520, percentage: 23.7 },
  { name: "New CBD for Pets", volume: 125455, percentage: 88.0 },
];

const vendorsData = [
  {
    name: "Zoetis",
    numberOfOrders: 86,
    avgOrderSize: 25255,
    purchaseVolume: 5002,
    totalQuantity: 1205,
    percentTotal: 75.2,
    trend: "up",
  },
  {
    name: "Merck",
    numberOfOrders: 55,
    avgOrderSize: 2455,
    purchaseVolume: 1502,
    totalQuantity: 750,
    percentTotal: 45.0,
    trend: "down",
  },
  {
    name: "Dechra",
    numberOfOrders: 22,
    avgOrderSize: 852,
    purchaseVolume: 652,
    totalQuantity: 95,
    percentTotal: 38.6,
    trend: "up",
  },
  {
    name: "Ceva",
    numberOfOrders: 84,
    avgOrderSize: 25255,
    purchaseVolume: 5002,
    totalQuantity: 1205,
    percentTotal: 75.2,
    trend: "stable",
  },
  {
    name: "Elanco",
    numberOfOrders: 4,
    avgOrderSize: 78,
    purchaseVolume: 5,
    totalQuantity: 4,
    percentTotal: 5,
    trend: "down",
  },
];

interface FilterState {
  categories: string[];
  vendors: string[];
  dateRange: string;
  searchTerm: string;
}

export default function Reports() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") || "categories",
  );
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get("category"),
  );
  const [selectedVendor, setSelectedVendor] = useState<string | null>(
    searchParams.get("vendor"),
  );
  const [selectedItem, setSelectedItem] = useState<string | null>(
    searchParams.get("item"),
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState("Jan 15, 2024 - Jun 25, 2024");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    vendors: [],
    dateRange: "",
    searchTerm: "",
  });

  const itemsPerPage = 5;
  const totalPages = Math.ceil(itemsData.length / itemsPerPage);

  useEffect(() => {
    const params = new URLSearchParams();
    if (activeTab) params.set("tab", activeTab);
    if (selectedCategory) params.set("category", selectedCategory);
    if (selectedVendor) params.set("vendor", selectedVendor);
    if (selectedItem) params.set("item", selectedItem);
    setSearchParams(params);
  }, [activeTab, selectedCategory, selectedVendor, selectedItem]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSelectedCategory(null);
    setSelectedVendor(null);
    setSelectedItem(null);
  };

  const handleBreadcrumbClick = (level: string) => {
    if (level === "categories") {
      setSelectedCategory(null);
      setSelectedVendor(null);
      setSelectedItem(null);
    } else if (level === "vendor") {
      setSelectedVendor(null);
      setSelectedItem(null);
    } else if (level === "item") {
      setSelectedItem(null);
    }
  };

  const getPageTitle = () => {
    if (selectedItem) return selectedItem;
    if (selectedVendor) return selectedVendor;
    if (selectedCategory) return selectedCategory;
    if (activeTab === "categories") return "Categories";
    if (activeTab === "vendors") return "Vendors";
    return "Items";
  };

  const getBreadcrumbs = () => {
    const breadcrumbs = [{ label: "Home", href: "/home" }];

    if (activeTab === "categories") {
      breadcrumbs.push({ label: "Categories", href: null });
      if (selectedCategory) {
        breadcrumbs.push({ label: selectedCategory, href: null });
      }
    } else if (activeTab === "vendors") {
      breadcrumbs.push({ label: "Vendors", href: null });
      if (selectedVendor) {
        breadcrumbs.push({ label: selectedVendor, href: null });
      }
    } else if (activeTab === "items") {
      breadcrumbs.push({ label: "Items", href: null });
      if (selectedItem) {
        breadcrumbs.push({ label: selectedItem, href: null });
      }
    }

    return breadcrumbs;
  };

  const TrendIcon = ({ trend }: { trend: string }) => {
    const trendData = Array.from({ length: 20 }, (_, i) => ({
      x: i,
      y:
        Math.random() * 50 +
        (trend === "up" ? i * 2 : trend === "down" ? 50 - i * 2 : 25),
    }));

    return (
      <div className="w-16 h-8">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData}>
            <Line
              type="monotone"
              dataKey="y"
              stroke={
                trend === "up"
                  ? "#10b981"
                  : trend === "down"
                    ? "#ef4444"
                    : "#6b7280"
              }
              strokeWidth={1.5}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderTabContent = () => {
    if (activeTab === "categories") {
      if (selectedCategory) {
        return (
          <div className="space-y-6">
            {/* Chart */}
            <Card>
              <CardContent className="p-6">
                <div className="h-64 mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#f59e0b"
                        strokeWidth={2}
                        dot={{ fill: "#f59e0b", strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-orange-500 text-sm">
                      Total Purchase Volume
                    </p>
                    <p className="font-bold text-lg">
                      <Rupee />
                      293,335
                    </p>
                  </div>
                  <div>
                    <p className="text-blue-500 text-sm">Total Orders</p>
                    <p className="font-bold text-lg">
                      <Rupee />
                      293,335
                    </p>
                  </div>
                  <div>
                    <p className="text-green-500 text-sm">
                      Total Purchase Volume
                    </p>
                    <p className="font-bold text-lg">
                      <Rupee />
                      293,335
                    </p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  *Please note the purchase volumes listed on this page are
                  based on order history items which do not include tax.
                </p>
              </CardContent>
            </Card>

            {/* Items Table */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div className="flex gap-4">
                    <Button
                      variant={activeTab === "items" ? "default" : "outline"}
                      onClick={() => setActiveTab("items")}
                      className="text-sm"
                    >
                      Items
                    </Button>
                    <Button variant="outline" className="text-sm">
                      Categories
                    </Button>
                    <Button variant="outline" className="text-sm">
                      Vendor
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-gray-600">Showing 50 Items</p>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item Name</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>LastPurchased</TableHead>
                      <TableHead>Units</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Volume</TableHead>
                      <TableHead>% of Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {itemsData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {item.name}
                        </TableCell>
                        <TableCell>{item.vendor}</TableCell>
                        <TableCell>{item.lastPurchased}</TableCell>
                        <TableCell>{item.units}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>
                          <Rupee />
                          {item.volume.toLocaleString()}
                        </TableCell>
                        <TableCell>{item.percentage}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        );
      }

      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
            <div className="text-sm text-gray-600">{dateRange}</div>
          </div>

          <p className="text-sm text-gray-600">
            Showing 1 - 6 of 29 categories
          </p>
          <p className="text-xs text-gray-500">
            *Please note the purchase volumes listed on this page are based on
            order history items which do not include tax.
          </p>

          <div className="space-y-4">
            {categoriesData.map((category, index) => (
              <Card
                key={index}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedCategory(category.name)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {category.name}
                      </h3>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        <Rupee />
                        {category.volume.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        {category.percentage}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2 mt-6">
            <Button variant="outline" size="sm" disabled>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="default" size="sm">
              1
            </Button>
            <Button variant="outline" size="sm">
              2
            </Button>
            <Button variant="outline" size="sm">
              3
            </Button>
            <Button variant="outline" size="sm">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      );
    }

    if (activeTab === "vendors") {
      return (
        <div className="space-y-6">
          {/* Filters Sidebar */}
          {showFilters && (
            <Card className="mb-6">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex gap-4">
                  <Button variant="outline" size="sm">
                    SHOW COMBINED
                  </Button>
                  <Button variant="outline" size="sm">
                    CLEAR ALL
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilters(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Vendors</h4>
                    <div className="space-y-2">
                      {[
                        "Pet Cares",
                        "Frocks",
                        "Pet Accessories",
                        "New CBD for Pets",
                        "Cotton Quilted Cares",
                        "New Pet Health and Wellness",
                      ].map((item) => (
                        <label
                          key={item}
                          className="flex items-center space-x-2"
                        >
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm">{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Chart */}
          <Card>
            <CardContent className="p-6">
              <div className="h-64 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      dot={{ fill: "#f59e0b", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-orange-500 text-sm">
                    Total Purchase Volume
                  </p>
                  <p className="font-bold text-lg">
                    <Rupee />
                    293,335
                  </p>
                </div>
                <div>
                  <p className="text-blue-500 text-sm">Total Orders</p>
                  <p className="font-bold text-lg">
                    <Rupee />
                    293,335
                  </p>
                </div>
                <div>
                  <p className="text-green-500 text-sm">
                    Total Purchase Volume
                  </p>
                  <p className="font-bold text-lg">
                    <Rupee />
                    293,335
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                *Please note the purchase volumes listed on this page are based
                on order history items which do not include tax.
              </p>
            </CardContent>
          </Card>

          {/* Vendors Table */}
          <Card>
            <CardHeader>
              <p className="text-sm text-gray-600">Showing 5 Vendors</p>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Number of Orders</TableHead>
                    <TableHead>Avg Order Size</TableHead>
                    <TableHead>Purchase Volume</TableHead>
                    <TableHead>Total Quantity</TableHead>
                    <TableHead>Percent Total</TableHead>
                    <TableHead>Purchase Trends</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vendorsData.map((vendor, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {vendor.name}
                      </TableCell>
                      <TableCell>{vendor.numberOfOrders}</TableCell>
                      <TableCell>
                        <Rupee />
                        {vendor.avgOrderSize.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Rupee />
                        {vendor.purchaseVolume.toLocaleString()}
                      </TableCell>
                      <TableCell>{vendor.totalQuantity}</TableCell>
                      <TableCell>{vendor.percentTotal}%</TableCell>
                      <TableCell>
                        <TrendIcon trend={vendor.trend} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      );
    }

    // Items tab
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
          <div className="text-sm text-gray-600">{dateRange}</div>
        </div>

        <p className="text-sm text-gray-600">Showing 1 - 20 of 29 items</p>
        <p className="text-xs text-gray-500">
          *Please note the purchase volumes listed on this page are based on
          order history items which do not include tax.
        </p>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>LastPurchased</TableHead>
                  <TableHead>Units</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Volume</TableHead>
                  <TableHead>% of Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {itemsData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.vendor}</TableCell>
                    <TableCell>{item.lastPurchased}</TableCell>
                    <TableCell>{item.units}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>
                      <Rupee />
                      {item.volume.toLocaleString()}
                    </TableCell>
                    <TableCell>{item.percentage}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="default" size="sm">
            1
          </Button>
          <Button variant="outline" size="sm">
            2
          </Button>
          <Button variant="outline" size="sm">
            3
          </Button>
          <Button variant="outline" size="sm">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-neutral-10">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          {getBreadcrumbs().map((crumb, index) => (
            <React.Fragment key={index}>
              {index > 0 && <span className="text-gray-400">→</span>}
              <span
                className={
                  crumb.href
                    ? "text-blue-600 hover:underline cursor-pointer"
                    : ""
                }
                onClick={() => {
                  if (index === 1) handleBreadcrumbClick("categories");
                  if (index === 2) handleBreadcrumbClick("vendor");
                }}
              >
                {crumb.label}
              </span>
            </React.Fragment>
          ))}
        </nav>

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-gabarito font-bold text-primary-dark-blue">
            {getPageTitle()}
          </h1>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              Date Range
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === "vendors" ? "default" : "outline"}
            onClick={() => handleTabChange("vendors")}
            className="bg-secondary-yellow text-primary-dark-blue border-secondary-yellow"
          >
            <Users className="w-4 h-4 mr-2" />
            Vendor
          </Button>
          <Button
            variant={activeTab === "categories" ? "default" : "outline"}
            onClick={() => handleTabChange("categories")}
          >
            <Grid3X3 className="w-4 h-4 mr-2" />
            Categories
          </Button>
          <Button
            variant={activeTab === "items" ? "default" : "outline"}
            onClick={() => handleTabChange("items")}
          >
            <Package className="w-4 h-4 mr-2" />
            Items
          </Button>
        </div>

        {/* Show Filters Button for Vendors */}
        {activeTab === "vendors" && (
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
          </div>
        )}

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
}
