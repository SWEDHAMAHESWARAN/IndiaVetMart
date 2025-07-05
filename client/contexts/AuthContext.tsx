import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { authAPI, AuthResponse } from "../lib/api";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AlertBox {
  open: boolean;
  error: boolean;
  msg: string;
}

interface AuthContextType {
  user: User | null;
  isLogin: boolean;
  isLoading: boolean;
  alertBox: AlertBox;
  setUser: (user: User | null) => void;
  setIsLogin: (status: boolean) => void;
  setIsLoading: (status: boolean) => void;
  setAlertBox: (alert: AlertBox) => void;
  logout: () => void;
  showAlert: (msg: string, error?: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [alertBox, setAlertBox] = useState<AlertBox>({
    open: false,
    error: false,
    msg: "",
  });

  // Check if user is logged in on app start
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsLogin(true);
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsLogin(false);
    showAlert("Logged out successfully");
  };

  const showAlert = (msg: string, error: boolean = false) => {
    setAlertBox({
      open: true,
      error,
      msg,
    });

    // Auto close alert after 3 seconds
    setTimeout(() => {
      setAlertBox({ open: false, error: false, msg: "" });
    }, 3000);
  };

  const value: AuthContextType = {
    user,
    isLogin,
    isLoading,
    alertBox,
    setUser,
    setIsLogin,
    setIsLoading,
    setAlertBox,
    logout,
    showAlert,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
