import { Home, Users, Package, ShoppingBag, Upload, Gift } from "lucide-react";
import { SidebarItem } from "./types";

export const PIE_COLORS = ["#3366FF", "#00B8D9", "#FFAB00", "#FF5630"];

export const SIDEBAR_ITEMS: SidebarItem[] = [
  { key: "overview", label: "Dashboard", icon: Home },
  { key: "users", label: "User", icon: Users },
  { key: "products", label: "Product", icon: Package },
  { key: "orders", label: "Orders", icon: ShoppingBag },
  { key: "import", label: "CSV Import", icon: Upload },
  { key: "loyalty", label: "Loyalty", icon: Gift },
];

export const EMPTY_PRODUCT = {
  name: "",
  description: "",
  price: 0,
  category: "game",
  image: "",
  stock: 0,
};
