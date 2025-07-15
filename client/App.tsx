import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Category from "./pages/Category";
import ProductDetail from "./pages/ProductDetail";
import Profile from "./pages/Profile";
import OrderHistory from "./pages/OrderHistory";
import ShoppingCart from "./pages/ShoppingCart";
import Checkout from "./pages/Checkout";
import VendorConnection from "./pages/VendorConnection";
import Budget from "./pages/Budget";
import ApprovalManagement from "./pages/ApprovalManagement";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function AppContent() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile/*" element={<Profile />} />
        {/* Placeholder routes for navigation items */}
        <Route path="/category" element={<Category />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/orders" element={<OrderHistory />} />
        <Route
          path="/orders/new"
          element={
            <div className="p-8">
              <h1 className="text-2xl font-gabarito font-bold text-primary-dark-blue">
                Create New Order - Coming Soon
              </h1>
              <p className="text-neutral-60 mt-2">
                New order creation feature will be available soon.
              </p>
            </div>
          }
        />
        <Route path="/shopping" element={<ShoppingCart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/vendors" element={<VendorConnection />} />
        <Route path="/budget" element={<Budget />} />
        <Route path="/approvals" element={<ApprovalManagement />} />
        <Route
          path="/terms"
          element={
            <div className="p-8">
              <h1 className="text-2xl font-gabarito font-bold text-primary-dark-blue">
                Terms of Service - Coming Soon
              </h1>
            </div>
          }
        />
        <Route
          path="/privacy"
          element={
            <div className="p-8">
              <h1 className="text-2xl font-gabarito font-bold text-primary-dark-blue">
                Privacy Policy - Coming Soon
              </h1>
            </div>
          }
        />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
