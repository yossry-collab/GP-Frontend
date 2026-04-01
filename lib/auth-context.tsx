"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { AUTH_LOGOUT_EVENT, authAPI, usersAPI } from "@/lib/api";

interface User {
  _id: string;
  username: string;
  email: string;
  phonenumber?: string;
  profileImage?: string;
  role: "user" | "admin";
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string,
    phonenumber?: string,
  ) => Promise<void>;
  refreshUserFromStorage: () => void;
  logout: () => void;
  updateProfile: (data: {
    username?: string;
    email?: string;
    phonenumber?: string;
    currentPassword?: string;
    newPassword?: string;
  }) => Promise<void>;
  uploadProfileImage: (file: File) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        const savedUser = localStorage.getItem("user");

        if (token && savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    const handleAuthLogout = () => {
      setUser(null);
      setIsLoading(false);
    };

    window.addEventListener(AUTH_LOGOUT_EVENT, handleAuthLogout);

    return () => window.removeEventListener(AUTH_LOGOUT_EVENT, handleAuthLogout);
  }, []);

  const refreshUserFromStorage = useCallback(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await authAPI.login({ email, password });
      const { token, user } = response.data;
      console.log("Login Token:", token);

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string,
    phonenumber?: string,
  ): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await authAPI.register({
        username,
        email,
        password,
        phonenumber,
      });
      const { token, user } = response.data;
      console.log("Registration Token:", token);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: {
    username?: string;
    email?: string;
    phonenumber?: string;
    currentPassword?: string;
    newPassword?: string;
  }) => {
    try {
      const response = await usersAPI.updateProfile(data);
      const updatedUser = response.data.user;
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Profile update failed");
    }
  };

  const uploadProfileImage = async (file: File) => {
    try {
      const response = await usersAPI.uploadProfileImage(file);
      const updatedUser = response.data.user;
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Profile image upload failed");
    }
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        refreshUserFromStorage,
        logout,
        updateProfile,
        uploadProfileImage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
