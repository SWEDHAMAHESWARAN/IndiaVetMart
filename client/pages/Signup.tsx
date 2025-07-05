import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  Building,
  MapPin,
} from "lucide-react";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    clinicName: "",
    clinicEmail: "",
    clinicPhoneNumber: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle signup logic here
    console.log("Signup attempt:", formData);
  };

  const handleGoogleSignup = () => {
    // Handle Google OAuth here
    console.log("Google signup clicked");
  };

  return (
    <div className="min-h-screen bg-hero-gradient flex items-center justify-center p-4 py-8">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="w-[300px] h-[300px] bg-brand-yellow opacity-20 rounded-full absolute -top-20 -right-20"></div>
        <div className="w-[200px] h-[200px] bg-brand-navy opacity-10 rounded-full absolute top-1/3 -left-10"></div>
        <div className="w-[150px] h-[150px] bg-brand-yellow-80 opacity-15 rounded-full absolute bottom-40 right-1/4"></div>
      </div>

      <div className="w-full max-w-2xl relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2Fe33c04ad181d47968df9f3990555750a%2F9cc201b9ffd546c487ca47797b751f54?format=webp&width=800"
            alt="IndiaVetMart"
            className="w-48 h-12 mx-auto object-contain mb-4"
          />
          <h1
            className="text-brand-navy text-2xl font-bold mb-2"
            style={{ fontFamily: "SVN-Gilroy, Inter, sans-serif" }}
          >
            Join IndiaVetMart
          </h1>
          <p
            className="text-brand-neutral-60 font-medium"
            style={{ fontFamily: "Gabarito, Inter, sans-serif" }}
          >
            Create your veterinary practice account
          </p>
        </div>

        {/* Signup Form */}
        <div className="bg-white rounded-2xl shadow-[0px_4px_28px_-2px_rgba(0,0,0,0.08)] p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information Section */}
            <div>
              <h2
                className="text-brand-navy text-lg font-bold mb-4"
                style={{ fontFamily: "SVN-Gilroy, Inter, sans-serif" }}
              >
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label
                    className="block text-brand-neutral-80 text-sm font-bold mb-2"
                    style={{ fontFamily: "Gabarito, Inter, sans-serif" }}
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                      <User className="h-5 w-5 text-brand-neutral-40" />
                    </div>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-brand-neutral-20 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-navy focus:border-transparent text-brand-neutral-80"
                      style={{ fontFamily: "Gabarito, Inter, sans-serif" }}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label
                    className="block text-brand-neutral-80 text-sm font-bold mb-2"
                    style={{ fontFamily: "Gabarito, Inter, sans-serif" }}
                  >
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                      <Phone className="h-5 w-5 text-brand-neutral-40" />
                    </div>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-brand-neutral-20 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-navy focus:border-transparent text-brand-neutral-80"
                      style={{ fontFamily: "Gabarito, Inter, sans-serif" }}
                      placeholder="+91 9876543210"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="mt-4">
                <label
                  className="block text-brand-neutral-80 text-sm font-bold mb-2"
                  style={{ fontFamily: "Gabarito, Inter, sans-serif" }}
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <Mail className="h-5 w-5 text-brand-neutral-40" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-brand-neutral-20 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-navy focus:border-transparent text-brand-neutral-80"
                    style={{ fontFamily: "Gabarito, Inter, sans-serif" }}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Clinic Information Section */}
            <div>
              <h2
                className="text-brand-navy text-lg font-bold mb-4"
                style={{ fontFamily: "SVN-Gilroy, Inter, sans-serif" }}
              >
                Clinic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Clinic Name */}
                <div>
                  <label
                    className="block text-brand-neutral-80 text-sm font-bold mb-2"
                    style={{ fontFamily: "Gabarito, Inter, sans-serif" }}
                  >
                    Clinic Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                      <Building className="h-5 w-5 text-brand-neutral-40" />
                    </div>
                    <input
                      type="text"
                      name="clinicName"
                      value={formData.clinicName}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-brand-neutral-20 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-navy focus:border-transparent text-brand-neutral-80"
                      style={{ fontFamily: "Gabarito, Inter, sans-serif" }}
                      placeholder="Enter clinic name"
                      required
                    />
                  </div>
                </div>

                {/* Clinic Phone */}
                <div>
                  <label
                    className="block text-brand-neutral-80 text-sm font-bold mb-2"
                    style={{ fontFamily: "Gabarito, Inter, sans-serif" }}
                  >
                    Clinic Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                      <Phone className="h-5 w-5 text-brand-neutral-40" />
                    </div>
                    <input
                      type="tel"
                      name="clinicPhoneNumber"
                      value={formData.clinicPhoneNumber}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-brand-neutral-20 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-navy focus:border-transparent text-brand-neutral-80"
                      style={{ fontFamily: "Gabarito, Inter, sans-serif" }}
                      placeholder="+91 9876543210"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Clinic Email */}
              <div className="mt-4">
                <label
                  className="block text-brand-neutral-80 text-sm font-bold mb-2"
                  style={{ fontFamily: "Gabarito, Inter, sans-serif" }}
                >
                  Clinic Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <Mail className="h-5 w-5 text-brand-neutral-40" />
                  </div>
                  <input
                    type="email"
                    name="clinicEmail"
                    value={formData.clinicEmail}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-brand-neutral-20 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-navy focus:border-transparent text-brand-neutral-80"
                    style={{ fontFamily: "Gabarito, Inter, sans-serif" }}
                    placeholder="clinic@example.com"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Password Section */}
            <div>
              <h2
                className="text-brand-navy text-lg font-bold mb-4"
                style={{ fontFamily: "SVN-Gilroy, Inter, sans-serif" }}
              >
                Security
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Password */}
                <div>
                  <label
                    className="block text-brand-neutral-80 text-sm font-bold mb-2"
                    style={{ fontFamily: "Gabarito, Inter, sans-serif" }}
                  >
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                      <Lock className="h-5 w-5 text-brand-neutral-40" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-12 py-3 border border-brand-neutral-20 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-navy focus:border-transparent text-brand-neutral-80"
                      style={{ fontFamily: "Gabarito, Inter, sans-serif" }}
                      placeholder="Create password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-brand-neutral-40" />
                      ) : (
                        <Eye className="h-5 w-5 text-brand-neutral-40" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    className="block text-brand-neutral-80 text-sm font-bold mb-2"
                    style={{ fontFamily: "Gabarito, Inter, sans-serif" }}
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                      <Lock className="h-5 w-5 text-brand-neutral-40" />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-12 py-3 border border-brand-neutral-20 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-navy focus:border-transparent text-brand-neutral-80"
                      style={{ fontFamily: "Gabarito, Inter, sans-serif" }}
                      placeholder="Confirm password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-brand-neutral-40" />
                      ) : (
                        <Eye className="h-5 w-5 text-brand-neutral-40" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start">
              <input
                type="checkbox"
                className="w-4 h-4 text-brand-navy bg-brand-neutral-10 border-brand-neutral-20 rounded focus:ring-brand-navy focus:ring-2 mt-1"
                required
              />
              <span
                className="ml-3 text-sm text-brand-neutral-60 font-medium"
                style={{ fontFamily: "Gabarito, Inter, sans-serif" }}
              >
                I agree to the{" "}
                <Link
                  to="/terms"
                  className="text-brand-navy font-bold hover:text-brand-dark-navy"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy"
                  className="text-brand-navy font-bold hover:text-brand-dark-navy"
                >
                  Privacy Policy
                </Link>
              </span>
            </div>

            {/* Signup Button */}
            <button
              type="submit"
              className="w-full bg-brand-navy text-white py-3 px-6 rounded-lg font-bold hover:bg-brand-dark-navy transition-colors"
              style={{ fontFamily: "Gabarito, Inter, sans-serif" }}
            >
              Create Account
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-brand-neutral-20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span
                  className="px-2 bg-white text-brand-neutral-60 font-medium"
                  style={{ fontFamily: "Gabarito, Inter, sans-serif" }}
                >
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google Sign Up */}
            <button
              type="button"
              onClick={handleGoogleSignup}
              className="w-full flex items-center justify-center gap-3 bg-white border border-brand-neutral-20 text-brand-neutral-80 py-3 px-6 rounded-lg font-bold hover:bg-brand-neutral-10 transition-colors"
              style={{ fontFamily: "Gabarito, Inter, sans-serif" }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-8 text-center">
            <p
              className="text-brand-neutral-60 font-medium"
              style={{ fontFamily: "Gabarito, Inter, sans-serif" }}
            >
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-brand-navy font-bold hover:text-brand-dark-navy transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
