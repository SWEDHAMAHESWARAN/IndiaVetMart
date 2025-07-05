import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useAuth } from "../contexts/AuthContext";
import { authAPI } from "../lib/api";
import { auth, googleProvider } from "../lib/firebase";

export default function Login() {
  const navigate = useNavigate();
  const { setUser, setIsLogin, showAlert } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [positions, setPositions] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [formfields, setFormfields] = useState({
    name: "",
    email: "",
    password: "",
    isAdmin: true,
    clinicname: "",
    clinicphone: "",
    clinicemail: "",
    position: positions,
  });

  useEffect(() => {
    // Fetch positions data if needed
    // fetchDataFromApi(`/api/position/id`).then((res) => {
    //   console.log("Res", res.response);
    //   setPositions(res.response);
    // });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const onchangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormfields(() => ({
      ...formfields,
      [e.target.name]: e.target.value,
    }));
  };

  const handleforposition = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log("e", e.target.id);
    setSelectedPosition(e.target.value);
    setFormfields(() => ({
      ...formfields,
      position: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if required fields are filled
    if (!formData.email || !formData.password) {
      showAlert("Please fill in all fields", true);
      return;
    }

    setIsSubmitting(true);
    setIsLoading(true);

    try {
      console.log("Attempting login with:", { email: formData.email });
      let response;

      try {
        response = await authAPI.signIn(formData);
      } catch (apiError: any) {
        console.error("API call failed:", JSON.stringify(apiError, null, 2));

        // If API fails with timeout or network error, offer demo mode
        if (
          apiError.msg &&
          (apiError.msg.includes("timeout") ||
            apiError.msg.includes("connect") ||
            apiError.msg.includes("unavailable") ||
            apiError.msg.includes("Request timeout") ||
            apiError.msg.includes("server is taking too long"))
        ) {
          // Allow demo login for testing
          if (
            formData.email === "demo@demo.com" &&
            formData.password === "demo123"
          ) {
            response = {
              error: false,
              msg: "Demo login successful! (API unavailable)",
              token: "demo-token-123",
              user: {
                id: "demo-1",
                name: "Demo User",
                email: formData.email,
              },
            };
          } else {
            // Show user-friendly message with demo credentials
            throw new Error(
              "🚧 Server timeout detected. Use demo credentials (demo@demo.com / demo123) or try the Quick Demo button below.",
            );
          }
        } else {
          // For any other API error, also check if user is trying demo credentials
          if (
            formData.email === "demo@demo.com" &&
            formData.password === "demo123"
          ) {
            response = {
              error: false,
              msg: "Demo login successful! (API error bypassed)",
              token: "demo-token-123",
              user: {
                id: "demo-1",
                name: "Demo User",
                email: formData.email,
              },
            };
          } else {
            throw apiError;
          }
        }
      }
      console.log("Login response:", response);

      if (!response.error && response.token && response.user) {
        localStorage.setItem("token", response.token);
        const user = {
          id: response.user.id,
          name: response.user.name,
          email: response.user.email,
        };
        localStorage.setItem("user", JSON.stringify(user));

        // Update auth state immediately
        setUser(user);
        setIsLogin(true);

        showAlert(response.msg || "Login successful!");

        // Navigate directly to homepage
        navigate("/", { replace: true });
      } else {
        showAlert(response.msg || "Login failed", true);
      }
    } catch (error: any) {
      console.error("Login error:", JSON.stringify(error, null, 2));

      // Handle error object properly
      let errorMessage = "Login failed. Please try again.";

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "object" && error !== null) {
        if (error.msg) {
          errorMessage = error.msg;
        } else if (error.message) {
          errorMessage = error.message;
        }
      } else if (typeof error === "string") {
        errorMessage = error;
      }

      showAlert(errorMessage, true);
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    if (!auth || !googleProvider) {
      showAlert("Google authentication is not configured", true);
      return;
    }

    setIsLoading(true);
    signInWithPopup(auth, googleProvider)
      .then(async (result) => {
        const user = result.user;

        const fields = {
          name: user.displayName || "",
          email: user.email || "",
          password: null,
          images: user.photoURL || "",
          phone: user.phoneNumber || "",
        };

        try {
          const response = await authAPI.authWithGoogle(fields);

          if (!response.error && response.token && response.user) {
            localStorage.setItem("token", response.token);
            const userData = {
              id: response.user.id,
              name: response.user.name,
              email: response.user.email,
            };
            localStorage.setItem("user", JSON.stringify(userData));

            setUser(userData);
            setIsLogin(true);
            showAlert(response.msg || "Google login successful!");

            // Navigate directly to homepage
            navigate("/", { replace: true });
          } else {
            showAlert(response.msg || "Google login failed", true);
          }
        } catch (error: any) {
          console.error("Google login API error:", error);

          let errorMessage = "Google login failed";
          if (typeof error === "object" && error !== null) {
            if (error.msg) {
              errorMessage = error.msg;
            } else if (error.message) {
              errorMessage = error.message;
            }
          }

          showAlert(errorMessage, true);
        }
      })
      .catch((error) => {
        const errorMessage = error.message;
        showAlert(errorMessage || "Google login failed", true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const register = (e: React.FormEvent) => {
    console.log(formfields);
    e.preventDefault();
    try {
      if (formfields.name === "") {
        showAlert("Name is required", true);
        return false;
      }

      if (formfields.email === "") {
        showAlert("Email is required", true);
        return false;
      }

      if (formfields.password === "") {
        showAlert("Password is required", true);
        return false;
      }
      if (formfields.clinicname === "") {
        showAlert("Clinic name is required", true);
        return false;
      }
      if (formfields.clinicphone === "") {
        showAlert("Clinic phone is required", true);
        return false;
      }
      if (formfields.clinicemail === "") {
        showAlert("Clinic email is required", true);
        return false;
      }
      if (formfields.position === "") {
        showAlert("Position is required", true);
        return false;
      }

      setIsLoading(true);
      console.log("formfields", formfields);

      // Using our existing signup API
      authAPI
        .signUp({
          name: formfields.name,
          email: formfields.email,
          password: formfields.password,
          phone: formfields.clinicphone,
          clinicName: formfields.clinicname,
          clinicEmail: formfields.clinicemail,
          clinicPhoneNumber: formfields.clinicphone,
        })
        .then((res) => {
          console.log(`res ${JSON.stringify(res)}`);
          if (!res.error) {
            showAlert(res?.msg || "Registration successful");
            localStorage.setItem("user", JSON.stringify(res.user));

            setTimeout(() => {
              setIsLoading(false);
              navigate("/", { replace: true });
            }, 2000);
          } else {
            setIsLoading(false);
            showAlert(res.msg || "Registration failed", true);
          }
        });
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-hero-gradient flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="w-[300px] h-[300px] bg-brand-yellow opacity-20 rounded-full absolute -top-20 -left-20"></div>
        <div className="w-[200px] h-[200px] bg-brand-navy opacity-10 rounded-full absolute top-1/4 right-0"></div>
        <div className="w-[150px] h-[150px] bg-brand-yellow-80 opacity-15 rounded-full absolute bottom-20 left-1/4"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
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
            Welcome Back
          </h1>
          <p
            className="text-brand-neutral-60 font-medium"
            style={{ fontFamily: "Gabarito, Inter, sans-serif" }}
          >
            Sign in to your veterinary account
          </p>
          <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800 font-bold">
              ⚠️ API Server Timeout - Use Demo Mode
            </p>
            <p className="text-xs text-red-600 mt-1">
              Email: demo@demo.com | Password: demo123
            </p>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-[0px_4px_28px_-2px_rgba(0,0,0,0.08)] p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
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
                  disabled={isSubmitting}
                  className="w-full pl-10 pr-4 py-3 border border-brand-neutral-20 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-navy focus:border-transparent text-brand-neutral-80 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontFamily: "Gabarito, Inter, sans-serif" }}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
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
                  disabled={isSubmitting}
                  className="w-full pl-10 pr-12 py-3 border border-brand-neutral-20 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-navy focus:border-transparent text-brand-neutral-80 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontFamily: "Gabarito, Inter, sans-serif" }}
                  placeholder="Enter your password"
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

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-brand-navy bg-brand-neutral-10 border-brand-neutral-20 rounded focus:ring-brand-navy focus:ring-2"
                />
                <span
                  className="ml-2 text-sm text-brand-neutral-60 font-medium"
                  style={{ fontFamily: "Gabarito, Inter, sans-serif" }}
                >
                  Remember me
                </span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-brand-navy font-bold hover:text-brand-dark-navy transition-colors"
                style={{ fontFamily: "Gabarito, Inter, sans-serif" }}
              >
                Forgot password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-brand-navy text-white py-3 px-6 rounded-lg font-bold hover:bg-brand-dark-navy transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: "Gabarito, Inter, sans-serif" }}
            >
              {isSubmitting ? "Signing In..." : "Sign In"}
            </button>

            {/* Demo Quick Login */}
            <button
              type="button"
              onClick={async () => {
                setIsSubmitting(true);
                setIsLoading(true);

                // Simulate demo login
                try {
                  const demoUser = {
                    id: "demo-1",
                    name: "Demo User",
                    email: "demo@demo.com",
                  };

                  localStorage.setItem("token", "demo-token-123");
                  localStorage.setItem("user", JSON.stringify(demoUser));

                  setUser(demoUser);
                  setIsLogin(true);
                  showAlert("Demo mode activated! Welcome to IndiaVetMart 🎉");

                  // Navigate to homepage
                  setTimeout(() => {
                    navigate("/", { replace: true });
                  }, 500);
                } catch (error) {
                  showAlert("Demo mode failed", true);
                } finally {
                  setTimeout(() => {
                    setIsSubmitting(false);
                    setIsLoading(false);
                  }, 600);
                }
              }}
              disabled={isSubmitting}
              className="w-full bg-green-500 text-white py-3 px-6 rounded-lg font-bold hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: "Gabarito, Inter, sans-serif" }}
            >
              {isSubmitting
                ? "Loading Demo..."
                : "🎯 Enter Demo Mode - Skip API"}
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

            {/* Google Sign In */}
            <button
              type="button"
              onClick={handleGoogleSignup}
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-3 bg-white border border-brand-neutral-20 text-brand-neutral-80 py-3 px-6 rounded-lg font-bold hover:bg-brand-neutral-10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: "Gabarito, Inter, sans-serif" }}
            >
              {isSubmitting ? (
                <div className="animate-spin w-5 h-5 border-2 border-brand-navy border-t-transparent rounded-full"></div>
              ) : (
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
              )}
              {isSubmitting ? "Signing in..." : "Continue with Google"}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p
              className="text-brand-neutral-60 font-medium"
              style={{ fontFamily: "Gabarito, Inter, sans-serif" }}
            >
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-brand-navy font-bold hover:text-brand-dark-navy transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
