import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../config/axios";

export const useAuthStore = create((set, get) => ({

  authUser: null,

  isSignup: false,
  isLoginIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,

  // ======================
  // CHECK AUTH
  // ======================
  checkAuth: async () => {
    set({ isCheckingAuth: true });

    try {
      const res = await axiosInstance.get("/auth/checkauth");

      set({ authUser: res.data.user }); 
    } catch (err) {
      set({ authUser: null });
      console.log("Error in checkAuth", err);
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // ======================
  // SIGNUP
  // ======================
  signup: async (data) => {
    set({ isSignup: true });

    try {
      const res = await axiosInstance.post("/auth/register", data);

      set({ authUser: res.data.user });
      toast.success("Account created successfully");
    } catch (err) {
      const message =
        err.response?.data?.message || "Signup failed. Please try again";

      toast.error(message);
      set({ authUser: null });
    } finally {
      set({ isSignup: false });
    }
  },

  // ======================
  // LOGIN
  // ======================
  login: async (data) => {
    set({ isLoginIn: true });

    try {
      const res = await axiosInstance.post("/auth/login", data);

      set({ authUser: res.data.user });
      toast.success("Login successful");
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";
      toast.error(message);
    } finally {
      set({ isLoginIn: false });
    }
  },

  // ======================
  // LOGOUT
  // ======================
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
    } catch (err) {
      const message = err.response?.data?.message || "Logout failed";
      toast.error(message);
    }
  },

  // Simple check
  isAuthenticated: () => {
    return get().authUser !== null;
  },

  // ======================
  // UPDATE PROFILE (Address etc.)
  // ======================
  updateprofile: async (data) => {
    set({ isUpdatingProfile: true });

    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data.user });
      toast.success("Address updated");
    } catch (err) {
      const message = err.response?.data?.message || "Update failed";
      toast.error(message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  }

}));
