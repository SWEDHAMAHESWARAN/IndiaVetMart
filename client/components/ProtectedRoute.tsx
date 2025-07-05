import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isLogin, isLoading } = useAuth();

  console.log("ProtectedRoute - isLogin:", isLogin, "isLoading:", isLoading);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-hero-gradient flex items-center justify-center">
        <div className="text-center">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2Fe33c04ad181d47968df9f3990555750a%2F9cc201b9ffd546c487ca47797b751f54?format=webp&width=800"
            alt="IndiaVetMart"
            className="w-48 h-12 mx-auto object-contain mb-6"
          />
          <div className="animate-spin w-8 h-8 border-4 border-brand-navy border-t-transparent rounded-full mx-auto mb-4"></div>
          <p
            className="text-brand-navy font-bold"
            style={{ fontFamily: "Gabarito, Inter, sans-serif" }}
          >
            Loading...
          </p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isLogin) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
