import React, { useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useBlogStore } from '../services/useBlogStore';
import { IconCalendar, IconClock, IconShare2, IconArrowRight } from '../components/Icons';
import { Reveal } from '../components/Reveal';
import { BlogContentRenderer } from '../components/BlogContentRenderer';

export const BlogDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { getPostBySlug, getFeaturedPosts } = useBlogStore();

  const post = getPostBySlug(slug || '');
  const relatedPosts = getFeaturedPosts().filter(p => p.id !== post?.id).slice(0, 3);
  const shareUrl = window.location.href;
  const shareText = post.title;

  const handleShare = () => {
    const shareOptions = [
      {
        name: "Facebook",
        url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
      },
      {
        name: "Twitter",
        url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`
      },
      {
        name: "WhatsApp",
        url: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + " " + shareUrl)}`
      }
    ];

    // Use native share if available (mobile)
    if (navigator.share) {
      navigator.share({
        title: shareText,
        text: post.excerpt,
        url: shareUrl,
      });
      return;
    }

    // Fallback: open WhatsApp (most common)
    window.open(shareOptions[2].url, "_blank");
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <div className="bg-[#FEFCE8] min-h-screen text-[#1C2E1A] font-sans pt-20 relative">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 z-50 bg-amber-900/10">
        <div className="h-full bg-[#2E5E35] origin-left transform scale-x-0 animate-scroll-progress"></div>
      </div>

      <article>
        {/* Hero */}
        <div className="relative h-[60vh] w-full overflow-hidden">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-neutral-900/60 flex items-center justify-center text-center p-6">
            <Reveal>
              <span className="bg-brand-accent text-brand-dark px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6 inline-block shadow-lg">
                {post.category}
              </span>
              <h1 className="text-4xl md:text-6xl font-display font-bold text-white max-w-5xl mx-auto leading-tight mb-8 drop-shadow-md">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center justify-center gap-6 text-neutral-200 text-sm font-medium backdrop-blur-sm bg-black/20 px-6 py-3 rounded-full inline-flex">
                <div className="flex items-center">
                  <img src={post.author.avatar} alt={post.author.name} className="w-8 h-8 rounded-full border-2 border-brand-accent mr-3" />
                  <span>{post.author.name}</span>
                </div>
                <div className="w-1 h-1 bg-neutral-400 rounded-full"></div>
                <div className="flex items-center">
                  <IconCalendar className="w-4 h-4 mr-2 text-brand-accent" />
                  <span>{post.publishedAt}</span>
                </div>
                <div className="w-1 h-1 bg-neutral-400 rounded-full"></div>
                <div className="flex items-center">
                  <IconClock className="w-4 h-4 mr-2 text-brand-accent" />
                  <span>{post.readingTime}</span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-6 py-12 md:py-20">
          <Reveal>
            <div className="bg-[#FCFBF8] border border-amber-900/10 rounded-3xl shadow-sm p-8 md:p-12">
              <p className="text-2xl font-light text-neutral-800 mb-12 border-l-4 border-[#2E5E35] pl-6 italic leading-relaxed">
                {post.excerpt}
              </p>

              <BlogContentRenderer content={post.content} />

              {/* Tags */}
              <div className="mt-16 pt-8 border-t border-amber-900/10">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <span key={tag} className="px-4 py-2 bg-[#FEFCE8] rounded-full text-sm text-neutral-600 hover:bg-white cursor-pointer transition-colors border border-amber-900/10">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Share */}
              <div className="mt-12 flex items-center justify-between bg-[#FEFCE8]/50 p-6 rounded-2xl border border-amber-900/10">
                <span className="font-bold text-[#1C2E1A]">Share this story</span>
                <div className="flex gap-4">
                  <button
                    onClick={handleShare}
                    className="p-2.5 bg-white rounded-full shadow-sm hover:text-[#2E5E35] hover:border-[#2E5E35] transition-colors border border-neutral-200"
                  >
                    <IconShare2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </article>

      {/* Related Posts */}
      <section className="bg-white/30 backdrop-blur-sm py-24 border-t border-amber-900/5">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-display font-bold text-[#1C2E1A] mb-12">More from the Journal</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {relatedPosts.map((item, idx) => (
              <Reveal key={item.id} delay={idx * 100}>
                <Link to={`/blog/${item.slug}`} target="_blank" rel="noopener noreferrer" className="group block bg-[#FCFBF8] rounded-2xl overflow-hidden shadow-sm border border-amber-900/10 hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                  <div className="h-48 overflow-hidden relative">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#1C2E1A] shadow-sm border border-amber-900/5">
                      {item.category}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-[#1C2E1A] mb-3 group-hover:text-[#2E5E35] transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-neutral-500 text-sm line-clamp-2 mb-4 flex-grow">{item.excerpt}</p>
                    <span className="text-sm font-bold text-[#2E5E35] flex items-center group-hover:underline">
                      Read Story <IconArrowRight className="w-4 h-4 ml-1" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};