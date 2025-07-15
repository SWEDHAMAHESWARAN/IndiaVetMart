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
import HomeScreen from "./pages/Index";
import Login from "./pages/Login";
import Category from "./pages/Category";
import ProductDetail from "./pages/ProductDetail";
import Profile from "./pages/Profile";
import OrderHistory from "./pages/OrderHistory";
import ShoppingCart from "./pages/ShoppingCart";
import Checkout from "./pages/Checkout";
import VendorConnection from "./pages/VendorConnection";
import Budget from "./pages/Budget";
//import UserManage from "./pages/UserManagement";
import ApprovalManagement from "./pages/ApprovalManagement";
import NotFound from "./pages/NotFound";
import { createContext, useEffect, useState } from "react";
import { fetchDataFromApi } from "./lib/api";
import { MyContextType } from "./types";
import Signup from "./pages/Signup";
const queryClient = new QueryClient();
export const MyContext = createContext<MyContextType>({
  orders: [],
  cat: [],
  popularProducts: [],
  vendors: [],
  user: "",
  setUser: () => {},
  cartData: [],
  shippingAddress: [],
  fetchShippingAddress: () => {},
  frequencyProducts: [],
  recentOrders: [],
  Permission: [],
});
function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isAuthPage = ["/login", "/signup", "/clinicform"].includes(
    location.pathname,
  );

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
  const [orders, setOrders] = useState<any[]>([]);
  const [cat, setcat] = useState<any[]>([]);
  const [popularProducts, setPopularProducts] = useState<any[]>([]);
  const [vendors, setvendors] = useState<any[]>([]);
  const [user, setUser] = useState<string>("");
  const [Permission, setPermission] = useState<any[]>([]);
  const [cartData, setCartData] = useState<any[]>([]);
  const [shippingAddress, setShippingAddress] = useState<any[]>([]);
  const [frequencyProducts, setFrequencyProducts] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [isAppReady, setIsAppReady] = useState(false);
  const [alertBox, setAlertBox] = useState<{
    open: boolean;
    error: boolean;
    msg: string;
  }>({ open: false, error: false, msg: "" });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const userRaw = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (userRaw && token) {
          setUser(userRaw);
          const parsedUser = JSON.parse(userRaw);
          const clinicId = parsedUser.clinicId;

          const [
            ordersRes,
            catRes,
            popRes,
            vendorRes,
            cartRes,
            freqRes,
            recRes,
            shippingRes,
          ] = await Promise.all([
            fetchDataFromApi(`/api/orders/client?clinicId=${clinicId}`),
            fetchDataFromApi(`/api/category`),
            fetchDataFromApi(`/api/products/popular-products`),
            fetchDataFromApi(`/api/vendor/getall`),
            fetchDataFromApi(`/api/cart?clinicId=${clinicId}`),
            fetchDataFromApi(
              `/api/products/frequency-orders?clinicId=${clinicId}`,
            ),
            fetchDataFromApi(`/api/products/last-orders?clinicId=${clinicId}`),
            fetchDataFromApi(`/api/shipping/addresses?clinicId=${clinicId}`),
          ]);

          setOrders(ordersRes);
          setcat(catRes?.categoryList || []);
          setPopularProducts(popRes?.data || []);
          setvendors(vendorRes?.Response || []);
          setCartData(cartRes);
          setFrequencyProducts(freqRes?.products || []);
          setRecentOrders(recRes?.products || []);
          setShippingAddress(shippingRes);

          // Permissions
          const permissionKey = localStorage.getItem("userPermission");
          if (permissionKey) {
            const permRes = await fetchDataFromApi(
              `/api/user/permission?name=${permissionKey}`,
            );
            setPermission(permRes?.response || []);
          }
        }

        setIsAppReady(true);
      } catch (err) {
        console.error("Error during context init:", err);
      }
    };

    fetchInitialData();
  }, []);

  if (!isAppReady) {
    return (
      <div className="min-h-screen bg-hero-gradient flex items-center justify-center">
        <div className="text-center">
          <img
            src="/client/assets/indiavetmart-logo.png"
            alt="IndiaVetMart"
            className="w-48 h-12 mx-auto object-contain mb-6"
          />
          <div className="animate-spin w-8 h-8 border-4 border-brand-navy border-t-transparent rounded-full mx-auto mb-4"></div>
          <p
            className="text-brand-navy font-bold"
            style={{ fontFamily: "Gabarito, Inter, sans-serif" }}
          >
            Loading app data...
          </p>
        </div>
      </div>
    );
  }

  const contextValues: MyContextType = {
    orders,
    cat,
    popularProducts,
    vendors,
    user,
    setUser,
    cartData,
    shippingAddress,
    fetchShippingAddress: () => {},
    frequencyProducts,
    recentOrders,
    Permission,
    alertBox,
    setAlertBox,
  };
  return (
    <MyContext.Provider value={contextValues}>
      <Layout>
        <Routes>
          <Route
            path="/"
            element={user ? <HomeScreen /> : <Navigate to="/login" />}
          />
          <Route
            path="/home"
            element={user ? <HomeScreen /> : <Navigate to="/login" />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/clinicform" element={<Signup />} />
          <Route
            path="/profile/*"
            element={user ? <Profile /> : <Navigate to="/login" />}
          />
          {/* Placeholder routes for navigation items */}
          <Route
            path="/products/category/:id/:vendorId?/:availability?"
            element={user ? <Category /> : <Navigate to="/login" />}
          />
          <Route
            path="/product/:id"
            element={user ? <ProductDetail /> : <Navigate to="/login" />}
          />
          <Route
            path="/orders"
            element={user ? <OrderHistory /> : <Navigate to="/login" />}
          />
          <Route
            path="/orders/new"
            element={
              user ? (
                <div className="p-8">
                  <h1 className="text-2xl font-gabarito font-bold text-primary-dark-blue">
                    Create New Order - Coming Soon
                  </h1>
                  <p className="text-neutral-60 mt-2">
                    New order creation feature will be available soon.
                  </p>
                </div>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/shopping"
            element={user ? <ShoppingCart /> : <Navigate to="/login" />}
          />
          <Route
            path="/checkout"
            element={user ? <Checkout /> : <Navigate to="/login" />}
          />
          <Route
            path="/vendors"
            element={user ? <VendorConnection /> : <Navigate to="/login" />}
          />
          <Route
            path="/budget"
            element={user ? <Budget /> : <Navigate to="/login" />}
          />
          <Route
            path="/approvals"
            element={user ? <ApprovalManagement /> : <Navigate to="/login" />}
          />
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
    </MyContext.Provider>
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
export default App;
