import { create } from "zustand";
import { toast } from "react-hot-toast";
import { axiosInstance } from "../config/axios";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, googleProvider } from "../config/firebase";

// ======================
// TYPES
// ======================

// BACKEND USER SCHEMA MATCH
export interface IUser {
  role: 'user' | 'admin';
  _id: string;
  fullName: string;
  email: string;
  phoneNo: string;
  addresses: {
    isPrimary: unknown;
    address1: string;
    address2?: string;
    address3?: string;
    state: string;
    district: string;
    pincode: string;
  }[];
}

// Step-1
export interface ISignupData {
  fullName: string;
  email: string;
  password: string;
}

// Login
export interface ILoginData {
  email: string;
  password: string;
}

// Step-2 → FINAL REGISTER
export interface IFinalRegisterData {
  fullName: string;
  phoneNo: string;
  email: string;
  password: string;

  addresses: {
    address1: string;
    address2?: string;
    address3?: string;
    state: string;
    district: string;
    pincode: string;
  }[];
}

// ======================
// STORE TYPE
// ======================

interface AuthStore {
  authUser: IUser | null;

  isSignup: boolean;
  isLoginIn: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;

  signupStepOneData: ISignupData | null;

  setSignupStepOne: (data: ISignupData) => void;
  finalRegister: (data: IFinalRegisterData) => Promise<{ requiresVerification?: boolean; email?: string } | void>;

  checkAuth: () => Promise<void>;
  signup: (data: ISignupData) => Promise<void>;
  login: (data: ILoginData) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: () => boolean;
  updateprofile: (data: any) => Promise<void>;
  googleLogin: () => Promise<void>;
  verifyOTP: (email: string, otp: string) => Promise<void>;
  resendOTP: (email: string) => Promise<void>;
}

// ======================
// Zustand Store
// ======================

export const useAuthStore = create<AuthStore>((set, get) => ({
  authUser: null,

  isSignup: false,
  isLoginIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,

  signupStepOneData: null,

  // Store Step-1 data
  setSignupStepOne: (data: ISignupData) => set({ signupStepOneData: data }),

  // FINAL REGISTER (Step-1 + Step-2)
  finalRegister: async (finalData: IFinalRegisterData) => {
    try {
      const res = await axiosInstance.post<{ user: IUser; requiresVerification?: boolean; email?: string }>("/auth/register", finalData);

      if (res.data.requiresVerification) {
        toast.success("Verification code sent to your email!");
        return { requiresVerification: true, email: res.data.email };
      }

      set({ authUser: res.data.user });
      toast.success("Registration completed!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Registration failed");
      throw err;
    }
  },

  // ------------------------------
  // CHECK AUTH
  // ------------------------------
  checkAuth: async () => {
    set({ isCheckingAuth: true });

    try {
      const res = await axiosInstance.get<{ user: IUser }>("/auth/checkauth");
      set({ authUser: res.data.user });
    } catch {
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // UNUSED SIGNUP
  signup: async () => {},

  // ------------------------------
  // LOGIN
  // ------------------------------
  login: async (data: ILoginData) => {
    set({ isLoginIn: true });

    try {
      const res = await axiosInstance.post<{ user: IUser }>("/auth/login", data);
      set({ authUser: res.data.user });
      toast.success("Login successful");
    } catch (err: any) {
      if (err.response?.data?.requiresVerification) {
        toast.error(err.response.data.message);
        throw err.response.data; // Pass requiresVerification and email back
      }
      toast.error(err.response?.data?.message || "Login failed");
      throw err;
    } finally {
      set({ isLoginIn: false });
    }
  },

  // ------------------------------
  // LOGOUT
  // ------------------------------
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Logout failed");
    }
  },

  // ------------------------------
  // CHECK AUTH FLAG
  // ------------------------------
  isAuthenticated: () => {
    return get().authUser !== null;
  },

  // ------------------------------
  // UPDATE PROFILE
  // ------------------------------
  updateprofile: async (data: any) => {
    set({ isUpdatingProfile: true });

    try {
      const res = await axiosInstance.put<{ user: IUser }>("/auth/update-profile", data);
      set({ authUser: res.data.user });
      toast.success("Profile updated");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  // ------------------------------
  // GOOGLE LOGIN
  // ------------------------------
  googleLogin: async () => {
    set({ isLoginIn: true });

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const tokenId = credential?.idToken;

      if (!tokenId) {
        throw new Error("Could not retrieve Google sign-in credential ID token.");
      }

      const res = await axiosInstance.post<{ user: IUser }>("/auth/google-login", { tokenId });
      set({ authUser: res.data.user });
      toast.success("Google login successful");
    } catch (err: any) {
      console.error("Google Sign-In Error:", err);
      toast.error(err.response?.data?.message || err.message || "Google login failed");
      throw err;
    } finally {
      set({ isLoginIn: false });
    }
  },

  verifyOTP: async (email: string, otp: string) => {
    set({ isLoginIn: true });
    try {
      const res = await axiosInstance.post<{ user: IUser }>("/auth/verify-otp", { email, otp });
      set({ authUser: res.data.user });
      toast.success("Email verified successfully!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Verification failed");
      throw err;
    } finally {
      set({ isLoginIn: false });
    }
  },

  resendOTP: async (email: string) => {
    try {
      await axiosInstance.post("/auth/resend-otp", { email });
      toast.success("Verification code resent successfully!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to resend code");
      throw err;
    }
  },
}));
