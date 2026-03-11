import { create } from "zustand";
import { axiosInstance } from "../config/axios";
import { Product } from "../types";
import toast from "react-hot-toast";

interface ProductState {
  products: Product[];
  loading: boolean;

  fetchProducts: () => Promise<void>;
  getProduct: (id: string) => Promise<Product | null>;
  addProduct: (data: any) => Promise<void>;
  updateProduct: (id: string, updates: any) => Promise<Product | null>;
  deleteProduct: (id: string) => Promise<void>;
  searchProduct: (query: string) => Promise<Product[]>;
}

interface Category {
  slice(arg0: number): unknown;
  charAt(arg0: number): unknown;
  _id: string;
  name: string;
  label: string;
}

interface CategoryState {
  categories: Category[];
  fetchCategories: () => Promise<void>;
}

// ==============================
// CATEGORY STORE (VIEW ONLY)
// ==============================
export const useCategoryStore = create<CategoryState>((set) => ({
  categories: [],

  fetchCategories: async () => {
    try {
      const res = await axiosInstance.get("/product/category");
      set({ categories: res.data });
    } catch (err) {
      toast.error("Failed to load categories");
    }
  },
}));

// ==============================
// PRODUCT STORE
// ==============================
export const useProductStore = create<ProductState>((set) => ({
  products: [],
  loading: false,

  fetchProducts: async () => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get("/product");
      set({ products: res.data.products });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to load products");
    } finally {
      set({ loading: false });
    }
  },

  getProduct: async (id: string) => {
    try {
      const res = await axiosInstance.get(`/product/${id}`);
      return res.data.product;
    } catch {
      toast.error("Failed to fetch product");
      return null;
    }
  },

  addProduct: async (data) => {
    try {
      const res = await axiosInstance.post("/product", data);

      set((state) => ({
        products: [...state.products, res.data.product],
      }));

      toast.success("Product added successfully!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to add product");
    }
  },

  updateProduct: async (id: string, updates: any) => {
    try {
      const res = await axiosInstance.put(`/product/${id}`, updates);

      // Update product in store list
      set((state) => ({
        products: state.products.map((p) =>
          p._id === id ? res.data.product : p
        ),
      }));

      toast.success("Product updated successfully!");
      return res.data.product;

    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update product");
      return null;
    }
  },


  deleteProduct: async (id) => {
    try {
      await axiosInstance.delete(`/product/${id}`);

      set((state) => ({
        products: state.products.filter((p) => p._id !== id),
      }));

      toast.success("Product deleted");
    } catch {
      toast.error("Failed to delete product");
    }
  },

  searchProduct: async (query) => {
    try {
      const res = await axiosInstance.get(`/product/search?query=${query}`);
      return res.data.products;
    } catch {
      toast.error("Search failed");
      return [];
    }
  },

}));
