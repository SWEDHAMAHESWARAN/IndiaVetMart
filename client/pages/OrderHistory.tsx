import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowRight,
  Search,
  Filter,
  Download,
  Eye,
  MoreVertical,
  Package,
  Truck,
  CheckCircle,
  AlertCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  vendor: string;
  total: number;
  status: "pending" | "processing" | "cancelled";
  items: number;
  paymentMethod: string;
}

export default function OrderHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  // Sample order data
  const orders: Order[] = [
    {
      id: "1",
      orderNumber: "ORD-2024-001",
      date: "2024-01-15",
      vendor: "Zootice",
      total: 13228.01,
      status: "processing",
      items: 12,
      paymentMethod: "Credit Card",
    },
    {
      id: "2",
      orderNumber: "ORD-2024-002",
      date: "2024-01-14",
      vendor: "Covetrus",
      total: 8945.5,
      status: "processing",
      items: 8,
      paymentMethod: "Bank Transfer",
    },
    {
      id: "3",
      orderNumber: "ORD-2024-003",
      date: "2024-01-13",
      supplier: "Vetcove",
      total: 7731.45,
      status: "processing",
      items: 15,
      paymentMethod: "Credit Card",
    },
    {
      id: "4",
      orderNumber: "ORD-2024-004",
      date: "2024-01-12",
      supplier: "Amatheon",
      total: 2414.52,
      status: "pending",
      items: 5,
      paymentMethod: "Cash on Delivery",
    },
    {
      id: "5",
      orderNumber: "ORD-2024-005",
      date: "2024-01-11",
      supplier: "PetSupply Co",
      total: 5678.9,
      status: "cancelled",
      items: 7,
      paymentMethod: "Credit Card",
    },
  ];

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "processing":
        return "bg-orange-500 text-white";
      case "pending":
        return "bg-yellow-500 text-white";
      case "cancelled":
        return "bg-red-500 text-white";
      default:
        return "bg-neutral-60 text-white";
    }
  };

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "processing":
        return <Package className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "cancelled":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.vendor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  return (
    <div className="min-h-screen bg-neutral-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-gabarito font-bold text-primary-dark-blue">
                Order History
              </h1>
              <p className="text-neutral-60 mt-1">
                Track and manage all your orders in one place
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[
              {
                label: "Total Orders",
                value: "156",
                icon: Package,
                color: "bg-blue-50 text-blue-600",
              },
              {
                label: "Processing",
                value: "8",
                icon: Package,
                color: "bg-orange-50 text-orange-600",
              },
              {
                label: "Pending",
                value: "6",
                icon: Clock,
                color: "bg-yellow-50 text-yellow-600",
              },
            ].map((stat, index) => (
              <Card key={index} className="bg-white border border-neutral-20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}
                    >
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-gabarito font-bold text-primary-dark-blue">
                        {stat.value}
                      </p>
                      <p className="text-sm text-neutral-60">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Filters and Search */}
        <Card className="bg-white border border-neutral-20 mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-40 w-4 h-4" />
                  <Input
                    placeholder="Search orders by number or vendor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 rounded-lg border-neutral-40 focus:border-primary-dark-blue"
                  />
                </div>

                {/* Status Filter */}
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>

                {/* Date Filter */}
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="quarter">Last 3 Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className="border-primary-dark-blue text-primary-dark-blue hover:bg-secondary-yellow40"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  More Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card className="bg-white border border-neutral-20">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-10">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-gabarito font-bold text-neutral-100 uppercase tracking-wider">
                      Order Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-gabarito font-bold text-neutral-100 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-gabarito font-bold text-neutral-100 uppercase tracking-wider">
                      Vendor
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-gabarito font-bold text-neutral-100 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-gabarito font-bold text-neutral-100 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-gabarito font-bold text-neutral-100 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-gabarito font-bold text-neutral-100 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-20">
                  {paginatedOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-neutral-10/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-gabarito font-bold text-primary-dark-blue">
                            {order.orderNumber}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-80 font-gilroy">
                        {new Date(order.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-100 font-gabarito font-medium">
                        {order.vendor}
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-100 font-gabarito">
                        {order.items} items
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-100 font-gabarito font-bold">
                        ₹{order.total.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          className={`${getStatusColor(order.status)} text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1 w-fit`}
                        >
                          {getStatusIcon(order.status)}
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-primary-dark-blue hover:bg-secondary-yellow40"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-neutral-60 hover:bg-neutral-10"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>
                                Download Invoice
                              </DropdownMenuItem>
                              <DropdownMenuItem>Reorder Items</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-neutral-20 bg-neutral-10/30">
              <div className="flex items-center justify-between text-sm text-neutral-60">
                <span>
                  Showing {startIndex + 1} to{" "}
                  {Math.min(startIndex + itemsPerPage, filteredOrders.length)}{" "}
                  of {filteredOrders.length} orders
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-neutral-60"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="px-3 py-1 bg-primary-dark-blue text-white rounded text-sm">
                    {currentPage}
                  </span>
                  <span className="text-neutral-60">of {totalPages}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-neutral-60"
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
