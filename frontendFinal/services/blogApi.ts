import { axiosInstance } from "../config/axios";

export const getAllPosts = async () => {
  const res = await axiosInstance.get("/posts");
  return res.data;
};

export const getPostBySlug = async (slug: string) => {
  const res = await axiosInstance.get(`/posts/${slug}`);
  return res.data;
};

export const createPost = async (data: any) => {
  const res = await axiosInstance.post("/posts", data);
  return res.data;
};

export const updatePost = async (id: string, data: any) => {
  const res = await axiosInstance.put(`/posts/${id}`, data);
  return res.data;
};

export const deletePost = async (id: string) => {
  const res = await axiosInstance.delete(`/posts/${id}`);
  return res.data;
};
