import { useState, useEffect, useContext } from "react";
import React, { FormEvent } from "react";
// Navigation will be handled with window.location

// Define the context type
interface MyContextType {
  // Add your context properties here
  someValue: any;
}

// Create a default context value
const defaultContextValue: MyContextType = {
  someValue: null
};

const MyContext = React.createContext<MyContextType>(defaultContextValue);
import axios from "axios";

// Define types for API responses
interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  response?: T[];
}

interface UserData {
  _id: string;
  name: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  images?: string[];
  profilePicture?: string;
}
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { deleteImages, fetchDataFromApi, uploadImage } from "@/lib/api";
import { ChevronRight } from "lucide-react";
import { editData,deleteData } from "@/lib/api";
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
  Plus 
} from 'lucide-react';

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

const Accounts = () => {
  const context = React.useContext(MyContext);
  // Get current path from window.location
  const [currentPath, setCurrentPath] = useState('');
  
  // Set initial path on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentPath(window.location.pathname);
    }
  }, []);
  
  // Helper function to handle navigation
  const handleNavigation = (path: string, isExternal: boolean = false) => {
    if (isExternal) {
      window.location.href = path;
    } else {
      window.location.href = path;
    }
  };
  const [formField, setFormfields] = useState({
    currentpassword: "",
    newpassword: "",
    confirmnewpassword: "",
  });
  interface FormValues {
    name: string;
    lastName: string;
    email: string;
    phone: string;
    position: string;
    profilePicture?: string;
  }

  const [formValues, setFormValues] = useState<FormValues>({
    name: "",
    lastName: "",
    email: "",
    phone: "",
    position: "",
    profilePicture: ""
  });
  
  const [uploading, setUploading] = useState(false);
  // Store File objects for upload
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  // Store URLs for preview
  const [previews, setPreviews] = useState<string[]>([]);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [uniqueImages, setUniqueImages] = useState<string[]>([]);
  // Store image URLs from the server
  const [serverImages, setServerImages] = useState<string[]>([]);

  // Get auth headers for API requests
  const getAuthHeaders = (): { 'Content-Type': string; 'Authorization': string } => {
    const token = localStorage.getItem('token') || '';
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  // Helper function to get the current tab based on path
  const getCurrentTab = (path: string): string => {
    // Default to 'profile' if path is not provided
    if (!path) return 'profile';
    
    if (path.includes('profile')) return 'profile';
    if (path.includes('settings')) return 'settings';
    if (path.includes('orders')) return 'orders';
    if (path.includes('wishlist')) return 'wishlist';
    if (path.includes('addresses')) return 'addresses';
    if (path.includes('products')) return 'products';
    if (path.includes('approvals')) return 'approvals';
    return 'profile';
  };

  // Handle file change for image uploads
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files.length > 0) {
      handleImageUpload(e);
    }
  };

  const [isUploading, setIsUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    console.log("useEffect called to fetch user data");

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    console.log("Fetched user from localStorage:", user);

    if (!user?.userId) {
      console.log("User ID not found in localStorage");
      setAlertMsg("User not found.");
      setAlertOpen(true);
      return;
    }

    const getAuthHeaders = () => {
      const token = localStorage.getItem('token');
      return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
    };

    const fetchDataFromApi = async <T,>(url: string): Promise<T> => {
      try {
        const response = await axios.get<ApiResponse<T>>(`/api/proxy${url}`, {
          headers: getAuthHeaders(),
        });

        if (response.data.error) {
          throw new Error(response.data.message || "API request failed");
        }

        return response.data.data as T;
      } catch (error) {
        console.error("API Error:", error);
        throw error;
      }
    };

    fetchDataFromApi<UserData>(`/user/get?id=${user.userId}`)
      .then((res) => {
        console.log("API response:", res);
        if (res) {
          const info = res;
          setFormValues({
            name: info.name ?? "",
            lastName: info.lastName ?? "",
            email: info.email ?? "",
            phone: info.phone ?? "",
            position: info.position ?? "",
          });
          setServerImages(info.images ?? []);
        } else {
          console.log("Failed to fetch user details: Invalid structure", res);
          setAlertMsg("Failed to fetch user details.");
          setAlertOpen(true);
        }
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
        setAlertMsg("Error fetching user details.");
        setAlertOpen(true);
      });
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.userId) {
      setAlertMsg("User not found.");
      setAlertOpen(true);
      return;
    }

    if (!formField.currentpassword) {
      setAlertMsg("Current Password is required");
      setAlertOpen(true);
      return;
    }
    if (!formField.newpassword) {
      setAlertMsg("New Password is required");
      setAlertOpen(true);
      return;
    }
    if (!formField.confirmnewpassword) {
      setAlertMsg("Confirm New Password is required");
      setAlertOpen(true);
      return;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    if (!passwordRegex.test(formField.newpassword)) {
      setAlertMsg(
        "New Password must be at least 8 characters long and include uppercase, lowercase, number, and special characters."
      );
      setAlertOpen(true);
      return;
    }

    if (formField.newpassword !== formField.confirmnewpassword) {
      setAlertMsg("New Password and Confirm New Password do not match");
      setAlertOpen(true);
      return;
    }

    const data = {
      name: user?.name,
      email: user?.email,
      password: formField.currentpassword,
      newPass: formField.newpassword,
      phone: user?.phone,
      images: user?.images,
      role: user?.role,
      clinicId: user?.clinicId,
      userId: user?.userId,
    };

    const editData = async <T,>(url: string, data: any): Promise<T> => {
      try {
        const response = await fetch(`/api/proxy${url}`, {
          method: "POST",
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        if (!response.ok) {
          throw new Error(`API request failed: ${response.status}`);
        }
        const res: ApiResponse<T> = await response.json();
        if (res.error) {
          throw new Error(res.message || 'API request failed');
        }
        return res.data as T;
      } catch (error) {
        console.error("API Error:", error);
        throw error;
      }
    };

    const handleUpdatePassword = async () => {
      if (formField.newpassword !== formField.confirmnewpassword) {
        setAlertMsg("Passwords do not match.");
        setAlertOpen(true);
        return;
      }

      try {
        const updateData = {
          _id: user.userId,
          currentPassword: formField.currentpassword,
          newPassword: formField.newpassword,
        };

        const response = await axios.put<{ error?: string }>(
          `/api/users/update-password`,
          updateData,
          { headers: getAuthHeaders() }
        );

        if (response.data?.error) {
          setAlertMsg(response.data.error);
        } else {
          setAlertMsg("Password updated successfully.");
          setFormfields(prev => ({
            ...prev,
            currentpassword: "",
            newpassword: "",
            confirmnewpassword: "",
          }));
        }
        setAlertOpen(true);
      } catch (error: unknown) {
        console.error("Error updating password:", error);
        const errorMessage = (error as any)?.response?.data?.message || "Failed to update password";
        setAlertMsg(errorMessage);
        setAlertOpen(true);
      }
    };

    handleUpdatePassword();
  };

  const handleUpdatePhone = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const phone = formValues.phone.trim();

    // Indian mobile validation: 10 digits, starts with 6-9
    const phoneRegex = /^[6-9]\d{9}$/;

    if (!phone) {
      setAlertMsg("Phone number is required.");
      setAlertOpen(true);
      return;
    }

    if (!phoneRegex.test(phone)) {
      setAlertMsg("Please enter a valid 10-digit phone number.");
      setAlertOpen(true);
      return;
    }

    try {
      const updateData = {
        _id: user.userId,
        phone,
      };
      const res = await axios.put<{ error?: string }>(
        `/api/users/update-phone`, 
        updateData, 
        { headers: getAuthHeaders() }
      );
      
      if (res?.data?.error) {
        setAlertMsg(res.data.error);
      } else {
        setAlertMsg("Phone number updated successfully.");
      }
      setAlertOpen(true);
    } catch (error: unknown) {
      console.error("Error updating phone number:", error);
      const errorMessage = (error as any)?.response?.data?.message || "Failed to update phone number";
      setAlertMsg(errorMessage);
      setAlertOpen(true);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      
      setPreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
      setImageFiles(prevFiles => [...prevFiles, ...files]);
    }
  };

  const handleImageDelete = (index: number) => {
    setPreviews(prevPreviews => {
      const newPreviews = [...prevPreviews];
      URL.revokeObjectURL(newPreviews[index]);
      newPreviews.splice(index, 1);
      return newPreviews;
    });
    setImageFiles(prevFiles => {
      const newFiles = [...prevFiles];
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      const response = await axios.post<{ url: string }>(
        "/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            ...getAuthHeaders(),
          },
        }
      );

      if (response.data?.url) {
        setLogoPreview(response.data.url);
        setFormfields(prev => ({
          ...prev,
          profilePicture: response.data.url
        }));
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (error: unknown) {
      console.error("Error uploading image:", error);
      const errorMessage = (error as any)?.response?.data?.message || "Failed to upload image. Please try again.";
      setAlertMsg(errorMessage);
      setAlertOpen(true);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveLogo = async (imgUrl: string) => {
    console.log("Remove image successfully");

    let storedImages = JSON.parse(localStorage.getItem("images")) || [];

    if (Array.isArray(storedImages)) {
      const imgIndex = storedImages.indexOf(imgUrl);

      if (imgIndex > -1) {
        storedImages.splice(imgIndex, 1);
        localStorage.setItem("images", JSON.stringify(storedImages));
      }
    } else {
      console.error("storedImages is not an array");
    }

    if (Array.isArray(previews)) {
      const previewIndex = previews.indexOf(imgUrl);
      if (previewIndex > -1) {
        previews.splice(previewIndex, 1);
      }
    } else {
      console.error("previews is not an array");
    }

    try {
      const response = await axios.delete<ApiResponse<{ message: string }>>(
        `/api/proxy/imageUpload/deleteAllImages?img=${imgUrl}`,
        {
          headers: getAuthHeaders(),
        }
      );

      if (response.data.error) {
        throw new Error(response.data.message || 'Failed to delete image');
      }

      setPreviews([]);
    } catch (error) {
      console.error("Error deleting image:", error);
      setAlertMsg(error instanceof Error ? error.message : "Failed to delete image");
      setAlertOpen(true);
    }
  };

  interface MenuItem {
    id: string;
    label: string;
    path: string;
    external?: boolean;
  }

  const menuItems: MenuItem[] = [
    {
      id: "profile",
      label: "My Profile",
      path: "/profile",
    },
    {
      id: "orders",
      label: "My Orders",
      path: "/orders",
    },
    {
      id: "wishlist",
      label: "My Wishlist",
      path: "/wishlist",
    },
    {
      id: "addresses",
      label: "Saved Addresses",
      path: "/addresses",
    },
    {
      id: "settings",
      label: "Account Settings",
      path: "/settings",
    },
    {
      id: "products",
      label: "Product Management",
      path: "/products",
      external: true,
    },
    {
      id: "orders-management",
      label: "Order Management",
      path: "/orders-management",
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

        {showSuccess && (
          <div className="fixed top-4 right-4 z-50 bg-state-green-light text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
            <Check className="w-5 h-5" />
            Changes saved successfully!
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:hidden mb-6">
            <select
              value={getCurrentTab(currentPath)}
              onChange={(e) => handleNavigation(`/account/${e.target.value}`)}
              onLoad={() => getCurrentTab(currentPath)}
              className="w-full p-3 border border-neutral-30 rounded-lg bg-white font-gabarito font-medium text-primary-dark-blue"
            >
              {menuItems.map((item) => (
                <option key={item.id} value={item.id}>{item.label}</option>
              ))}
            </select>
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="flex flex-col">
              <div className="bg-white border border-neutral-60 rounded-md p-4">
                <div className="text-center mb-4 font-gilroy font-bold text-black">My Account</div>
                <div className="flex flex-col gap-2">
                  {menuItems.map((item) => {
                    const isActive = getCurrentTab(location?.pathname || '') === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavigation(item.path, item.external)}
                        className={`flex items-center justify-between p-2 rounded-md ${isActive ? 'bg-primary-dark-blue text-white' : 'hover:bg-neutral-10 text-black'}`}
                      >
                        <span className={`font-gilroy ${isActive ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
                        <ChevronRight className={`w-5 h-5 ${isActive ? 'text-white' : 'text-black'}`} />
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Account & Settings */}
          <div className="lg:col-span-3">
            <div className="bg-white shadow-lg border border-neutral-20 rounded-md">
              <CardHeader className="p-6 border-b border-neutral-20">
                <CardTitle className="text-2xl font-gabarito font-bold text-primary-dark-blue">Account & Settings</CardTitle>
              </CardHeader>

              <CardContent className="p-6 space-y-8">
                {/* Profile Image Upload */}
                <div>
                  <h3 className="text-lg font-gabarito font-semibold text-primary-dark-blue mb-4">Profile Picture / Clinic Logo</h3>
                  <div className="flex flex-wrap gap-4">
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        id="logo-upload"
                        onChange={handleFileChange}
                        className="hidden"
                        disabled={isUploading}
                      />
                      <label htmlFor="logo-upload" className="cursor-pointer">
                        <div className="w-32 h-32 border-2 border-dashed border-neutral-30 rounded-lg flex items-center justify-center bg-neutral-10 overflow-hidden">
                          {previews?.length !== 0 ? (
                            previews.map((image, index) => (
                              <img
                                key={index}
                                src={image}
                                alt={`Preview ${index}`}
                                className="w-full h-full object-cover"
                              />
                            ))
                          ) : (
                            <div className="text-center flex flex-col items-center justify-center">
                              <Camera className="w-8 h-8 text-neutral-60 mb-2" />
                              <span className="text-xs text-neutral-60">Upload Image</span>
                            </div>
                          )}
                        </div>
                      </label>
                      {previews?.length > 0 && previews.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => handleRemoveLogo(image)}
                          type="button"
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Personal Information */}
                <div className="border-t border-neutral-20 pt-8">
                  <h3 className="text-lg font-gabarito font-semibold text-primary-dark-blue mb-2">Personal Information</h3>
                  <p className="text-neutral-60 text-sm mb-6">Update your personal information below. This information will always be kept private and confidential.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="firstName" className="text-primary-dark-blue font-gabarito font-medium">First Name</Label>
                      <Input id="firstName" value={formValues.name} disabled className="mt-2 border-neutral-30" />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-primary-dark-blue font-gabarito font-medium">Email</Label>
                      <Input id="email" value={formValues.email} disabled className="mt-2 border-neutral-30" />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-primary-dark-blue font-gabarito font-medium">Phone</Label>
                      <Input id="phone" value={formValues.phone} onChange={(e) => setFormValues(prev => ({ ...prev, phone: e.target.value }))} className="mt-2 border-neutral-30" />
                    </div>
                    <div>
                      <Label htmlFor="position" className="text-primary-dark-blue font-gabarito font-medium">Position</Label>
                      <Input id="position" value={formValues.position} disabled className="mt-2 border-neutral-30" />
                    </div>
                  </div>
                  <Button onClick={handleUpdatePhone} className="mt-6 bg-primary-dark-blue text-white rounded-lg px-8">Update Personal Information</Button>
                </div>

                {/* Password Update */}
                <form onSubmit={handleSubmit} className="border-t border-neutral-20 pt-8 space-y-4">
                  <h3 className="text-lg font-gabarito font-semibold text-primary-dark-blue">Update Password</h3>
                  <p className="text-neutral-60 text-sm">If you need to update your password, you may do so below. Your new password must be at least 8 characters.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="currentPassword" className="text-primary-dark-blue font-gabarito font-medium">Old Password</Label>
                      <Input id="currentPassword" type="password" value={formField.currentpassword} onChange={(e) => setFormfields(prev => ({ ...prev, currentpassword: e.target.value }))} className="mt-2 border-neutral-30" />
                    </div>
                    <div>
                      <Label htmlFor="newPassword" className="text-primary-dark-blue font-gabarito font-medium">New Password</Label>
                      <Input id="newPassword" type="password" value={formField.newpassword} onChange={(e) => setFormfields(prev => ({ ...prev, newpassword: e.target.value }))} className="mt-2 border-neutral-30" />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword" className="text-primary-dark-blue font-gabarito font-medium">Confirm New Password</Label>
                      <Input id="confirmPassword" type="password" value={formField.confirmnewpassword} onChange={(e) => setFormfields(prev => ({ ...prev, confirmnewpassword: e.target.value }))} className="mt-2 border-neutral-30" />
                    </div>
                  </div>
                  <Button type="submit" className="mt-4 bg-primary-dark-blue text-white rounded-lg px-8">Update Password</Button>
                </form>
              </CardContent>
            </div>
          </div>

        </div>
      </div>
    </div>

  );
}

export default Accounts;
