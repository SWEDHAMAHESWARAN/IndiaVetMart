import { useState, useEffect, useContext } from "react";
import React, { FormEvent } from "react";
import { useNavigate, useLocation, Routes, Route } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { deleteImages, fetchDataFromApi, uploadImage } from "@/lib/api";
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
  Plus,
  Trash2,
  Edit,
  ChevronRight,
} from "lucide-react";
import { postData } from "@/lib/api";
import { MyContext } from "../App";
import { set } from "date-fns";
import { SelectRangeProvider } from "react-day-picker";

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
  const context = useContext(MyContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [formField, setFormfields] = useState({
    currentpassword: "",
    newpassword: "",
    confirmnewpassword: ""
  });
  const [formValues, setFormValues] = useState({
    name: "",
    lastName: "",
    email: "",
    phone: "",
    position: "",
  });
  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews] = useState<any[]>([]);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
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

  fetchDataFromApi(`/api/user/get?id=${user.userId}`)
    .then((res) => {
      console.log("API response:", res);
      if (res?.response && res.response[0]) {
        const info = res.response[0];
        setFormValues({
          name: info.name || "",
          lastName: info.lastName || "",
          email: info.email || "",
          phone: info.phone || "",
          position: info.position || "",
        });
        setPreviews(info.images || []);
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


  const handleSubmit = (e) => {
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

    editData(`/api/user/changePassword/${user.userId}`, data).then((res) => {
      console.log("data", data);
      console.log("res:", res);
      if (res.error) {
        setAlertMsg(res.error);
        setAlertOpen(true);
      } else {
        setAlertMsg("Password updated successfully");
        setAlertOpen(true);
        setFormfields({
          currentpassword: "",
          newpassword: "",
          confirmnewpassword: ""
        });
      }
    });
  };


  // Get current active tab from URL
  const getCurrentTab = () => {
    const path = location.pathname.split("/")[2] || "account";
    return path;
  };


  const handleRemoveLogo = async(imgUrl:any) => {
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
      const response = await deleteImages(
        `/api/imageUpload/deleteAllImages?img=${imgUrl}`,previews
      );
      setPreviews([])
    } catch (error) {
      console.error("Error deleting image:", error);
      
    }
  
  };



  const handleUpdatePhone = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const phone = formValues.phone.trim();

    // Indian mobile validation: 10 digits, starts with 6-9
    const phoneRegex = /^[6-9]\d{9}$/;

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
      const res = await editData(`/api/user/update`, updateData);
      if (res?.error) {
        setAlertMsg(res.error);
        setAlertOpen(true);
      } else {
        setAlertMsg("Phone number updated successfully.");
        setAlertOpen(true);
      
      }
    } catch (error) {
      setAlertMsg("Failed to update phone number.");
      setAlertOpen(true);
    }
  };
   const onChangeFile = async (e:any, apiEndPoint:any) => {
    console.log("File changed:", e.target.files);
    try {
      const files = e.target.files;
      console.log("Selected files:", files);

      if (!files || files.length === 0) {
        setAlertMsg("Please select at least one image to upload."); 
        return;
      }

      const formdata = new FormData();
      const validImages = [];
      for (const file of files) {
        if (
          ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
            file.type
          )
        ) {
          validImages.push(file);
          formdata.append("images", file);
        } else {
          setAlertMsg(
            "Invalid file type. Please upload only images (JPEG, PNG, WEBP)."
          );
          return;
        }
      }

      await uploadImage(apiEndPoint, formdata);
      const response = await fetchDataFromApi("/api/imageUpload");
      console.log("Image upload response:", response);
      if (response?.length > 0) {
        console.log("Image upload response:", response);
        const uniqueImages = Array.from(
          new Set(response.flatMap((item) => item.images || []))
        );

        setPreviews((prevPreviews) => [
          ...(Array.isArray(prevPreviews) ? prevPreviews : []),
          ...uniqueImages,
        ]);

        localStorage.setItem("images", JSON.stringify(uniqueImages));
        
        setUploading(false);
        setAlertMsg("Image uploaded successfully.");
      } else {
        setUploading(false);
        setAlertMsg("Image upload failed.");
      }
      setAlertOpen(true);
      setLogoPreview(null);
    } catch (error) {
      console.error("Error during file upload:", error);
      setUploading(false);
      setAlertMsg("Image upload failed.");
      setAlertOpen(true);
      setLogoPreview(null);
    }
  };

  const handleDeleteImage = async () => {
    setIsUploading(true);
    try {
      await deleteData("/api/imageUpload/deleteAllImages");
      setLogoPreview(null);
      // setFormValues((prev) => ({
      //   ...prev,
      //   clinicInfo: { ...prev.clinicInfo, logo: null },
      // }));
      setAlertMsg("Profile image deleted.");
      setAlertOpen(true);
     
    } catch (error) {
      setAlertMsg("Failed to delete profile image.");
      setAlertOpen(true);
    } finally {
      setIsUploading(false);
    }
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

        {showSuccess && (
          <div className="fixed top-4 right-4 z-50 bg-state-green-light text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
            <Check className="w-5 h-5" />
            Changes saved successfully!
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:hidden mb-6">
            <select
              value={getCurrentTab()}
              onChange={(e) => navigate(`/profile/${e.target.value}`)}
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
                    const isActive = getCurrentTab() === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => item.external ? window.location.href = item.path : navigate(item.path)}
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
                        onChange={(e) => onChangeFile(e, "/api/products/upload")}
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
