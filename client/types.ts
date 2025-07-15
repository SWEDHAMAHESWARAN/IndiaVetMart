import type { Dispatch, SetStateAction } from "react";

export type AlertBoxType = {
  open: boolean;
  error: boolean;
  msg: string;
};

export type MyContextType = {
  orders: any[];
  cat: any[];
  popularProducts: any[];
  vendors: any[];
  user: string;
  setUser: Dispatch<SetStateAction<string>>;
  cartData: any[];
  shippingAddress: any[];
  fetchShippingAddress: () => void;
  frequencyProducts: any[];
  recentOrders: any[];
  Permission: any[];
  addToCart: (item?: any) => void;
  addingInCart: boolean;
  setAddingInCart: Dispatch<SetStateAction<boolean>>;
  setAlertBox: (alert: AlertBoxType) => void;
};
