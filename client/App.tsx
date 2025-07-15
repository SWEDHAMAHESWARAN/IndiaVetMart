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
  useNavigate,
} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { AlertBox } from "./components/AlertBox";
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
import ApprovalManagement from "./pages/ApprovalManagement";
import NotFound from "./pages/NotFound";
import { createContext, useEffect, useState } from "react";
import { fetchDataFromApi, postData } from "./lib/api";
import { MyContextType, AlertBoxType } from "./types";
import Signup from "./pages/Signup";
import Accounts from "./pages/Account";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  addToCart: () => {},
  addingInCart: false,
  setAddingInCart: () => {},
  setAlertBox: () => {},
});
function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isAuthPage =
  ["/login", "/signup", "/clinicform"].includes(location.pathname);

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
  const [addingInCart, setAddingInCart] = useState(false);
  const [alertBox, setAlertBox] = useState<AlertBoxType>({
    open: false,
    error: false,
    msg: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const userRaw = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        console.log("Auth check:", { userRaw: !!userRaw, token: !!token });

        if (userRaw && token) {
          setUser(userRaw);

          try {
            const parsedUser = JSON.parse(userRaw);
            const clinicId = parsedUser.clinicId;

            // Only fetch data if we have a valid clinicId
            if (clinicId) {
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
                fetchDataFromApi(
                  `/api/orders/client?clinicId=${clinicId}`,
                ).catch(() => []),
                fetchDataFromApi(`/api/category`).catch(() => ({
                  categoryList: [],
                })),
                fetchDataFromApi(`/api/products/popular-products`).catch(
                  () => ({ data: [] }),
                ),
                fetchDataFromApi(`/api/vendor/getall`).catch(() => ({
                  Response: [],
                })),
                fetchDataFromApi(`/api/cart?clinicId=${clinicId}`).catch(
                  () => [],
                ),
                fetchDataFromApi(
                  `/api/products/frequency-orders?clinicId=${clinicId}`,
                ).catch(() => ({ products: [] })),
                fetchDataFromApi(
                  `/api/products/last-orders?clinicId=${clinicId}`,
                ).catch(() => ({ products: [] })),
                fetchDataFromApi(
                  `/api/shipping/addresses?clinicId=${clinicId}`,
                ).catch(() => []),
              ]);

              setOrders(ordersRes || []);
              setcat(catRes?.categoryList || []);
              setPopularProducts(popRes?.data || []);
              setvendors(vendorRes?.Response || []);
              setCartData(cartRes || []);
              setFrequencyProducts(freqRes?.products || []);
              setRecentOrders(recRes?.products || []);
              setShippingAddress(shippingRes || []);

              // Permissions
              const permissionKey = localStorage.getItem("userPermission");
              if (permissionKey) {
                try {
                  const permRes = await fetchDataFromApi(
                    `/api/user/permission?name=${permissionKey}`,
                  );
                  setPermission(permRes?.response || []);
                } catch (err) {
                  console.log("Permission fetch failed:", err);
                  setPermission([]);
                }
              }
            }
          } catch (parseError) {
            console.error("Error parsing user data:", parseError);
            // Clear invalid data
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            setUser("");
          }
        } else {
          // No auth data found, user needs to login
          console.log("No authentication found, showing login");
          setUser("");
        }

        setIsAppReady(true);
      } catch (err) {
        console.error("Error during context init:", err);
        setIsAppReady(true); // Always set ready even if there's an error
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
  const addToCart = (data) => {
    setAddingInCart(true);
    postData(`/api/cart/add`, data).then((res) => {
      console.log("res", res);
      if (res.status !== false) {
        setAlertBox({
          open: true,
          error: false,
          msg: "Item is added in the cart",
        });
        setTimeout(() => {
          setAddingInCart(false);
        }, 1000);
        cartData;
      } else {
        setAlertBox({
          open: true,
          error: true,
          msg: res.msg,
        });
        setAddingInCart(false);
      }
    });
  };

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
    addToCart,
    addingInCart,
    setAddingInCart,
    setAlertBox,
  };
  return (
    <MyContext.Provider value={contextValues}>
      <AlertBox />
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
