import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle password reset logic here
    console.log("Password reset request for:", email);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-hero-gradient flex items-center justify-center p-4">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="w-[250px] h-[250px] bg-brand-yellow opacity-20 rounded-full absolute top-10 right-10"></div>
          <div className="w-[180px] h-[180px] bg-brand-navy opacity-10 rounded-full absolute bottom-20 left-10"></div>
        </div>

        <div className="w-full max-w-md relative z-10">
          {/* Logo */}
          <div className="text-center mb-8">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2Fe33c04ad181d47968df9f3990555750a%2F9cc201b9ffd546c487ca47797b751f54?format=webp&width=800"
              alt="IndiaVetMart"
              className="w-48 h-12 mx-auto object-contain mb-4"
            />
          </div>

          {/* Success Message */}
          <div className="bg-white rounded-2xl shadow-[0px_4px_28px_-2px_rgba(0,0,0,0.08)] p-8 text-center">
            <div className="w-16 h-16 bg-brand-green bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-brand-green" />
            </div>

            <h1
              className="text-brand-navy text-2xl font-bold mb-4"
              style={{ fontFamily: "SVN-Gilroy, Inter, sans-serif" }}
            >
              Check Your Email
            </h1>

            <p
              className="text-brand-neutral-60 font-medium mb-6"
              style={{ fontFamily: "Gabarito, Inter, sans-serif" }}
            >
              We've sent a password reset link to <strong>{email}</strong>.
              Please check your email and follow the instructions to reset your
              password.
            </p>

            <div className="space-y-4">
              <Link
                to="/login"
                className="w-full inline-block bg-brand-navy text-white py-3 px-6 rounded-lg font-bold hover:bg-brand-dark-navy transition-colors text-center"
                style={{ fontFamily: "Gabarito, Inter, sans-serif" }}
              >
                Back to Sign In
              </Link>

              <p
                className="text-sm text-brand-neutral-60 font-medium"
                style={{ fontFamily: "Gabarito, Inter, sans-serif" }}
              >
                Didn't receive the email?{" "}
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="text-brand-navy font-bold hover:text-brand-dark-navy transition-colors"
                >
                  Try again
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-hero-gradient flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="w-[250px] h-[250px] bg-brand-yellow opacity-20 rounded-full absolute top-10 right-10"></div>
        <div className="w-[180px] h-[180px] bg-brand-navy opacity-10 rounded-full absolute bottom-20 left-10"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Back to Login Link */}
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-brand-navy font-bold hover:text-brand-dark-navy transition-colors mb-6"
          style={{ fontFamily: "Gabarito, Inter, sans-serif" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Sign In
        </Link>

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
            Forgot Password?
          </h1>
          <p
            className="text-brand-neutral-60 font-medium"
            style={{ fontFamily: "Gabarito, Inter, sans-serif" }}
          >
            No worries, we'll send you reset instructions
          </p>
        </div>

        {/* Reset Form */}
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-brand-neutral-20 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-navy focus:border-transparent text-brand-neutral-80"
                  style={{ fontFamily: "Gabarito, Inter, sans-serif" }}
                  placeholder="Enter your email address"
                  required
                />
              </div>
            </div>

            {/* Reset Button */}
            <button
              type="submit"
              className="w-full bg-brand-navy text-white py-3 px-6 rounded-lg font-bold hover:bg-brand-dark-navy transition-colors"
              style={{ fontFamily: "Gabarito, Inter, sans-serif" }}
            >
              Send Reset Instructions
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
