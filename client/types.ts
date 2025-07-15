import type { Dispatch, SetStateAction } from "react";

export type MyContextType = {
  alertBox?: { open: boolean; error: boolean; msg: string };
  setAlertBox?: Dispatch<SetStateAction<{ open: boolean; error: boolean; msg: string }>>;
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
};
