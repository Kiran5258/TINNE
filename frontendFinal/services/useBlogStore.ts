import { create } from "zustand";
import { BlogPost } from "../types";
import { createPost, getAllPosts } from "../services/blogApi";
import { mapPostToBlogPost } from "../utils/mapPostToBlogPost";

interface BlogState {
  posts: BlogPost[];
  loading: boolean;

  loadPosts: () => Promise<void>;
  addPost: (data: any) => Promise<void>;

  getPostBySlug: (slug: string) => BlogPost | undefined;
  getPostsByCategory: (category: string) => BlogPost[];

  getFeaturedPosts: () => BlogPost[];
}

export const useBlogStore = create<BlogState>((set, get) => ({
  posts: [],
  loading: false,

  loadPosts: async () => {
    try {
      set({ loading: true });

      const rawPosts = await getAllPosts();
      const mapped = rawPosts.map(mapPostToBlogPost);

      set({ posts: mapped });
    } catch (error) {
      console.error("Failed to load posts:", error);
    } finally {
      set({ loading: false });
    }
  },

  addPost: async (data) => {
    try {
      await createPost(data);
      await get().loadPosts(); 
    } catch (error) {
      console.error("Failed to create post:", error);
      throw error;
    }
  },

  getPostBySlug: (slug) =>
    get().posts.find((p) => p.slug === slug),

  getPostsByCategory: (category) =>
    get().posts.filter((p) => p.category === category),

  getFeaturedPosts: () =>
    get().posts.slice(0, 3),
}));
