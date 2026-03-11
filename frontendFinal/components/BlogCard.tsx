import React from "react";
import { Link } from "react-router-dom";
import { IconArrowRight, IconCalendar, IconClock } from "./Icons";
import { BlogPost } from "../types";

interface Props {
  post: BlogPost;
  compact?: boolean;
}

export const BlogCard: React.FC<Props> = ({ post, compact = false }) => {
  return (
    <article className="bg-white rounded-2xl overflow-hidden border hover:shadow-lg transition">
      <Link to={`/blog/${post.slug}`} target="_blank">
        <img
          src={post.image}
          alt={post.title}
          className={`w-full object-cover ${
            compact ? "h-48" : "h-56"
          }`}
        />
      </Link>

      <div className="p-6 flex flex-col h-full">
        {!compact && (
          <div className="flex items-center text-xs text-neutral-500 mb-2 gap-3">
            <span className="flex items-center gap-1">
              <IconCalendar className="w-3 h-3" />
              {post.publishedAt}
            </span>
            <span className="flex items-center gap-1">
              <IconClock className="w-3 h-3" />
              {post.readingTime}
            </span>
          </div>
        )}

        <h3 className="font-bold text-lg mb-2">{post.title}</h3>
        <p className="text-sm text-neutral-600 mb-4 line-clamp-2">
          {post.excerpt}
        </p>

        <Link
          to={`/blog/${post.slug}`}
          className="text-sm font-semibold mt-auto flex items-center gap-1"
        >
          Read More <IconArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </article>
  );
};
