import React from "react";

export interface UserType {
  _id: string;
  username: string;
  email: string;
  phonenumber?: string;
  role: string;
  createdAt?: string;
  isBanned?: boolean;
  banReason?: string;
}

export interface ProductType {
  _id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  image?: string;
  stock: number;
  createdAt?: string;
}

export interface StatsData {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  completedOrders: number;
  pendingOrders: number;
  failedOrders: number;
  monthlyOrders: {
    month: string;
    year: number;
    orders: number;
    revenue: number;
    completed: number;
    pending: number;
    failed: number;
  }[];
  monthlyUsers: { month: string; year: number; users: number }[];
  categories: Record<string, number>;
  recentUsers: UserType[];
}

export type Page = "overview" | "users" | "products" | "import" | "loyalty" | "orders";

export interface SidebarItem {
  key: Page;
  label: string;
  icon: React.ElementType;
}
