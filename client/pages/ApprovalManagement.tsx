import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  User,
  Mail,
  Phone,
  MapPin,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface ApprovalUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: "approved" | "pending" | "rejected";
  dateOfRequest: string;
  lastActivity: string;
  clinic?: string;
  branch?: string;
}

interface Clinic {
  id: string;
  name: string;
  status: "approved" | "pending";
  users: ApprovalUser[];
  isExpanded: boolean;
}

export default function ApprovalManagement() {
  const [selectedClinic, setSelectedClinic] = useState("all");
  const [clinics, setClinics] = useState<Clinic[]>([
    {
      id: "dass-clinic",
      name: "Dass Clinic",
      status: "approved",
      isExpanded: true,
      users: [
        {
          id: "elica",
          name: "Elica",
          email: "elica28@gmail.com",
          phone: "+91 9403346523",
          role: "Lab Assistant",
          status: "approved",
          dateOfRequest: "10 Jan 2025, 09:41 pm",
          lastActivity: "Lab Reports",
          clinic: "Dass Clinic",
        },
        {
          id: "harleydass",
          name: "Harleydass",
          email: "harleydass2@gmail.com",
          phone: "+91 9403346542",
          role: "User Admin",
          status: "approved",
          dateOfRequest: "09 Jan 2025, 03:01 pm",
          lastActivity: "Admin",
          clinic: "Dass Clinic",
        },
        {
          id: "leonidas",
          name: "Leonidas",
          email: "leonidas5@gmail.com",
          phone: "+91 9403346542",
          role: "User Admin",
          status: "approved",
          dateOfRequest: "10 Jan 2025, 06:41 pm",
          lastActivity: "Admin",
          clinic: "Dass Clinic",
        },
      ],
    },
    {
      id: "scienz",
      name: "Scienz",
      status: "pending",
      isExpanded: true,
      users: [
        {
          id: "elica-2",
          name: "Elica",
          email: "elica28@gmail.com",
          phone: "+91 9403346523",
          role: "User Admin",
          status: "approved",
          dateOfRequest: "10 Jan 2025, 09:41 pm",
          lastActivity: "User Admin",
          clinic: "Scienz",
        },
        {
          id: "harleydass-2",
          name: "Harleydass",
          email: "harleydass2@gmail.com",
          phone: "+91 9403346542",
          role: "User Admin",
          status: "approved",
          dateOfRequest: "09 Jan 2025, 03:01 pm",
          lastActivity: "Admin",
          clinic: "Scienz",
        },
      ],
    },
    {
      id: "liva-clinic",
      name: "The liva clinic",
      status: "pending",
      isExpanded: true,
      users: [
        {
          id: "elica-3",
          name: "Elica",
          email: "elica28@gmail.com",
          phone: "+91 9403346523",
          role: "User Admin",
          status: "approved",
          dateOfRequest: "10 Jan 2025, 11:15 pm",
          lastActivity: "Admin",
          clinic: "The liva clinic",
        },
        {
          id: "leonidas-3",
          name: "Leonidas",
          email: "leonidas5@gmail.com",
          phone: "+91 9403346542",
          role: "User Admin",
          status: "approved",
          dateOfRequest: "10 Jan 2025, 06:41 pm",
          lastActivity: "Admin",
          clinic: "The liva clinic",
        },
      ],
    },
  ]);

  const handleApprove = (clinicId: string, userId?: string) => {
    setClinics((prev) =>
      prev.map((clinic) => {
        if (clinic.id === clinicId) {
          if (userId) {
            // Approve specific user
            return {
              ...clinic,
              users: clinic.users.map((user) =>
                user.id === userId
                  ? { ...user, status: "approved" as const }
                  : user,
              ),
            };
          } else {
            // Approve entire clinic
            return {
              ...clinic,
              status: "approved" as const,
              users: clinic.users.map((user) => ({
                ...user,
                status: "approved" as const,
              })),
            };
          }
        }
        return clinic;
      }),
    );
  };

  const handleReject = (clinicId: string, userId?: string) => {
    setClinics((prev) =>
      prev.map((clinic) => {
        if (clinic.id === clinicId) {
          if (userId) {
            // Reject specific user
            return {
              ...clinic,
              users: clinic.users.map((user) =>
                user.id === userId
                  ? { ...user, status: "rejected" as const }
                  : user,
              ),
            };
          } else {
            // Reject entire clinic
            return {
              ...clinic,
              status: "rejected" as const,
              users: clinic.users.map((user) => ({
                ...user,
                status: "rejected" as const,
              })),
            };
          }
        }
        return clinic;
      }),
    );
  };

  const toggleClinic = (clinicId: string) => {
    setClinics((prev) =>
      prev.map((clinic) =>
        clinic.id === clinicId
          ? { ...clinic, isExpanded: !clinic.isExpanded }
          : clinic,
      ),
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Approved
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Pending
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const filteredClinics =
    selectedClinic === "all"
      ? clinics
      : clinics.filter((clinic) => clinic.id === selectedClinic);

  return (
    <div className="min-h-screen bg-neutral-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link to="/profile">
              <Button
                variant="ghost"
                size="icon"
                className="text-primary-dark-blue"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-3xl font-gabarito font-bold text-primary-dark-blue">
                Approval Management
              </h1>
              <p className="text-neutral-60 mt-1">
                Manage clinic and branch user approvals
              </p>
            </div>

            {/* Clinic Filter */}
            <div className="w-64">
              <Select value={selectedClinic} onValueChange={setSelectedClinic}>
                <SelectTrigger className="border-neutral-40">
                  <SelectValue placeholder="Select Clinic" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Clinics</SelectItem>
                  {clinics.map((clinic) => (
                    <SelectItem key={clinic.id} value={clinic.id}>
                      {clinic.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Clinics List */}
        <div className="space-y-6">
          {filteredClinics.map((clinic) => (
            <Card key={clinic.id} className="border border-neutral-20">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary-dark-blue rounded-lg">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-primary-dark-blue font-gabarito flex items-center gap-3">
                        {clinic.name}
                        {getStatusBadge(clinic.status)}
                      </CardTitle>
                      <CardDescription>
                        {clinic.users.length} users • Last activity:{" "}
                        {clinic.users[0]?.lastActivity}
                      </CardDescription>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {clinic.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          className="bg-green-600 text-white hover:bg-green-700"
                          onClick={() => handleApprove(clinic.id)}
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-300 text-red-600 hover:bg-red-50"
                          onClick={() => handleReject(clinic.id)}
                        >
                          <X className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleClinic(clinic.id)}
                      className="text-neutral-40 hover:text-primary-dark-blue"
                    >
                      {clinic.isExpanded ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {clinic.isExpanded && (
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    {clinic.users.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-4 bg-neutral-5 rounded-lg border border-neutral-10"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-secondary-yellow40 rounded-lg">
                            <User className="w-5 h-5 text-primary-dark-blue" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-gabarito font-bold text-primary-dark-blue">
                                {user.name}
                              </h4>
                              {getStatusBadge(user.status)}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-neutral-60">
                              <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                <span>{user.email}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4" />
                                <span>{user.phone}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>
                                  Date of Request: {user.dateOfRequest}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                <span>Role: {user.role}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {user.status === "pending" && (
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              className="bg-green-600 text-white hover:bg-green-700"
                              onClick={() => handleApprove(clinic.id, user.id)}
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-300 text-red-600 hover:bg-red-50"
                              onClick={() => handleReject(clinic.id, user.id)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-700">
                  {clinics.length}
                </div>
                <div className="text-sm text-blue-600">Total Clinics</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-700">
                  {clinics.filter((c) => c.status === "approved").length}
                </div>
                <div className="text-sm text-green-600">Approved Clinics</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-700">
                  {clinics.filter((c) => c.status === "pending").length}
                </div>
                <div className="text-sm text-yellow-600">Pending Clinics</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-700">
                  {clinics.reduce(
                    (sum, clinic) => sum + clinic.users.length,
                    0,
                  )}
                </div>
                <div className="text-sm text-purple-600">Total Users</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
