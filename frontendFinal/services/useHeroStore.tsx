import { create } from "zustand";
import { axiosInstance } from "../config/axios";
import toast from "react-hot-toast";

interface HeroState {
  images: string[];
  fetchHero: () => Promise<void>;
  updateHero: (images: string[]) => Promise<void>;
}

export const useHeroStore = create<HeroState>((set) => ({
  images: [],

  fetchHero: async () => {
    try {
      const res = await axiosInstance.get("/hero");
      set({ images: res.data.images || [] });
    } catch {
      toast.error("Failed to load hero images");
    }
  },

  updateHero: async (images: string[]) => {
    try {
      const res = await axiosInstance.put("/hero", { images });
      set({ images: res.data.images });
      toast.success("Hero Banner Updated!");
    } catch {
      toast.error("Failed to update hero banner");
    }
  },
}));
