import { BlogPost } from "../types";

export const mapPostToBlogPost = (post: any): BlogPost => {
  return {
    id: post._id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    category: post.category,
    image: post.image?.url || "",
    author: {
      name: post.author?.name || "",
      avatar: post.author?.avatar || "",
    },

    publishedAt: new Date(post.createdAt).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }),

    readingTime: `${Math.max(
      1,
      Math.ceil((post.content?.length || 0) / 800)
    )} min read`,

    tags: [post.category],

    content: [
      {
        type: "paragraph",
        text: post.content,
      },
    ],
  };
};
