import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  IconArrowRight,
  IconBookOpen,
  IconFeather,
  IconLeaf,
  IconShieldCheck,
  IconTruck,
  IconUtensils,
  IconScience,
  IconGlobe,
  IconUsers
} from '../components/Icons';
import { Button } from '../components/Button';
import { Reveal } from '../components/Reveal';
import { useBlogStore } from '../services/useBlogStore';
import { BlogCard } from '../components/BlogCard';
import { useAuthStore } from '../services/useAuthStore';

// Custom leafy branch SVG decoration
const LeafyBranchDeco = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    {/* Main stem */}
    <path d="M50 95 Q 50 50 30 10" />
    {/* Leaves */}
    <path d="M30 10 C 25 15, 20 18, 30 22 C 40 18, 35 15, 30 10" fill="currentColor" fillOpacity="0.1" />
    <path d="M42 35 C 32 32, 25 35, 32 45 C 42 42, 45 38, 42 35" fill="currentColor" fillOpacity="0.1" />
    <path d="M48 60 C 38 55, 30 60, 38 70 C 48 68, 50 64, 48 60" fill="currentColor" fillOpacity="0.1" />
    <path d="M44 38 C 54 35, 62 38, 55 48 C 45 45, 42 41, 44 38" fill="currentColor" fillOpacity="0.1" />
    <path d="M48 63 C 58 60, 66 63, 59 73 C 49 70, 46 66, 48 63" fill="currentColor" fillOpacity="0.1" />
  </svg>
);

export const Blog: React.FC = () => {

  const { authUser } = useAuthStore();

  // 🔥 BACKEND STORE
  const {
    posts,
    loadPosts,
    getPostsByCategory
  } = useBlogStore();

  // 🔥 PAGE LOAD ஆனவுடனே BACKEND CALL
  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  // FEATURED POST
  const featured = posts.find(p => p.slug === 'red-millet-revival') || (posts.length > 0 ? posts[0] : null);

  // CATEGORIES
  const fieldNotes = getPostsByCategory('Field Notes from Indian Farms');
  const recipes = getPostsByCategory('Rituals & Recipes');
  const science = getPostsByCategory('Backed by Science');
  const people = getPostsByCategory('People Who Shape Our Brand');

  const artisan = people.length > 0 ? people[0] : null;

  // Newest posts first for Latest Stories section
  const latestStories = [...posts].reverse();

  return (
    <div className="pt-28 pb-20 min-h-screen bg-[#FEFCE8] text-[#1C2E1A] font-sans relative overflow-hidden">
      
      {/* Background leaf illustrations */}
      <LeafyBranchDeco className="absolute top-10 left-[-40px] w-64 h-64 text-[#2E5E35]/5 pointer-events-none transform -rotate-12" />
      <LeafyBranchDeco className="absolute top-48 right-[-60px] w-72 h-72 text-[#2E5E35]/5 pointer-events-none transform rotate-45" />
      <LeafyBranchDeco className="absolute bottom-[350px] left-[-30px] w-56 h-56 text-[#2E5E35]/5 pointer-events-none transform rotate-[70deg]" />
      <LeafyBranchDeco className="absolute bottom-10 right-[-50px] w-80 h-80 text-[#2E5E35]/5 pointer-events-none transform -rotate-45" />

      {/* HERO */}
      <header className="text-center py-16 md:py-24 relative z-10">
        <Reveal>
          <IconBookOpen className="w-10 h-10 mx-auto mb-6 text-[#2E5E35]" />
          <h1 className="text-5xl md:text-7xl font-display font-extrabold mb-4 text-[#1C2E1A]">
            Tinné Journal
          </h1>
          <p className="text-neutral-600 text-xl font-light">
            Insights. Origins. Innovations.
          </p>
          {authUser?.role === "admin" && (
            <div className="mt-8">
              <Link to="/account/add-post">
                <Button variant="primary" className="bg-[#2E5E35] text-white hover:bg-[#153A1D] border-none font-bold">
                  + Create New Post
                </Button>
              </Link>
            </div>
          )}
        </Reveal>
      </header>

      {/* FEATURED */}
      {featured && (
        <section className="py-12 px-6 max-w-7xl mx-auto relative z-10">
          <Reveal>
            <div className="grid lg:grid-cols-2 bg-[#FCFBF8] border border-amber-900/10 rounded-3xl overflow-hidden shadow-md">
              <Link to={`/blog/${featured.slug}`} target="_blank" className="block h-96 lg:h-full">
                <img
                  src={featured.image}
                  alt={featured.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </Link>
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <span className="text-[#2E5E35] font-bold text-xs uppercase tracking-wider mb-2 block">FEATURED ARTICLE</span>
                <h2 className="text-3xl md:text-4xl font-display font-extrabold text-[#1C2E1A] mb-4">
                  {featured.title}
                </h2>
                <p className="text-[#5A5A5A] mb-6 font-light leading-relaxed">
                  {featured.excerpt}
                </p>
                <div>
                  <Link to={`/blog/${featured.slug}`} target="_blank">
                    <Button variant="outline" className="border-[#2E5E35] text-[#2E5E35] hover:bg-[#2E5E35] hover:text-white transition-colors">
                      Read Full Story <IconArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      )}

      {/* LATEST STORIES (Ensures any new post is visible instantly) */}
      {latestStories.length > 0 && (
        <section className="py-16 px-6 max-w-7xl mx-auto relative z-10">
          <Reveal>
            <div className="flex items-center mb-8 border-b border-amber-900/10 pb-4">
              <IconFeather className="w-5 h-5 text-[#2E5E35] mr-2" />
              <h2 className="text-3xl font-display font-bold text-[#1C2E1A]">
                Latest Stories
              </h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-8">
            {latestStories.slice(0, 6).map((item, i) => (
              <Reveal key={item.id} delay={i * 100}>
                <BlogCard post={item} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* FIELD NOTES */}
      {fieldNotes.length > 0 && (
        <section className="py-16 px-6 max-w-7xl mx-auto relative z-10">
          <Reveal>
            <div className="flex items-center mb-8 border-b border-amber-900/10 pb-4">
              <IconLeaf className="w-5 h-5 text-[#2E5E35] mr-2" />
              <h2 className="text-3xl font-display font-bold text-[#1C2E1A]">
                Field Notes from Indian Farms
              </h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-8">
            {fieldNotes.map((item, i) => (
              <Reveal key={item.id} delay={i * 100}>
                <BlogCard post={item} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* RECIPES */}
      {recipes.length > 0 && (
        <section className="py-16 px-6 max-w-7xl mx-auto relative z-10">
          <Reveal>
            <div className="flex items-center mb-8 border-b border-amber-900/10 pb-4">
              <IconUtensils className="w-5 h-5 text-[#2E5E35] mr-2" />
              <h2 className="text-3xl font-display font-bold text-[#1C2E1A]">Rituals & Recipes</h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-6">
            {recipes.slice(0, 4).map(item => (
              <BlogCard key={item.id} post={item} compact />
            ))}
          </div>
        </section>
      )}

      {/* SCIENCE */}
      {science.length > 0 && (
        <section className="py-20 bg-white/30 backdrop-blur-sm border-y border-amber-900/5 px-6 relative z-10 my-16">
          <div className="max-w-7xl mx-auto">
            <Reveal>
              <div className="flex items-center mb-8 border-b border-amber-900/10 pb-4">
                <IconScience className="w-5 h-5 text-[#2E5E35] mr-2" />
                <h2 className="text-3xl font-display font-bold text-[#1C2E1A]">Backed by Science</h2>
              </div>
            </Reveal>

            <div className="space-y-4">
              {science.map(item => (
                <Link
                  key={item.id}
                  to={`/blog/${item.slug}`}
                  target="_blank"
                  className="block bg-[#FCFBF8] border border-amber-900/10 p-6 rounded-xl hover:shadow-md transition-shadow"
                >
                  <h3 className="font-bold text-lg text-[#1C2E1A] mb-1">{item.title}</h3>
                  <p className="text-neutral-600 text-sm font-light leading-relaxed">{item.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PEOPLE */}
      {artisan && (
        <section className="py-16 px-6 max-w-7xl mx-auto relative z-10">
          <Reveal>
            <div className="flex items-center mb-8 border-b border-amber-900/10 pb-4">
              <IconUsers className="w-5 h-5 text-[#2E5E35] mr-2" />
              <h2 className="text-3xl font-display font-bold text-[#1C2E1A]">
                People Who Shape Our Brand
              </h2>
            </div>
          </Reveal>

          <Link to={`/blog/${artisan.slug}`} target="_blank" className="block rounded-3xl overflow-hidden shadow-md">
            <img
              src={artisan.image}
              alt={artisan.title}
              className="w-full h-[400px] object-cover hover:scale-105 transition-transform duration-700"
            />
          </Link>
        </section>
      )}

      {/* FOOTER / CTA */}
      <section className="py-16 px-6 max-w-7xl mx-auto relative z-10">
        <Reveal>
          <div className="bg-[#153A1D] text-white rounded-3xl p-12 shadow-xl relative overflow-hidden text-center">
            {/* Decorative leaf watermarks */}
            <div className="absolute inset-0 opacity-5 pointer-events-none flex justify-around items-center">
              <svg className="w-48 h-48 rotate-12" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17 8C8 9 9 17 9 17C9 17 17 18 18 10C18 9 18 8 17 8Z" />
              </svg>
              <svg className="w-64 h-64 -rotate-45" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17 8C8 9 9 17 9 17C9 17 17 18 18 10C18 9 18 8 17 8Z" />
              </svg>
            </div>
            
            <div className="relative z-10">
              <IconFeather className="w-10 h-10 mx-auto mb-6 text-[#A7F3D0]" />
              <h2 className="text-4xl font-display font-bold mb-4">
                Join the Tinné Community
              </h2>
              <p className="text-neutral-200 text-lg font-light max-w-md mx-auto mb-8">
                Weekly insights & heritage recipes straight to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-6 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#A7F3D0] flex-grow text-sm font-sans"
                />
                <Button className="bg-[#FEFCE8] hover:bg-white text-[#153A1D] border-none font-bold px-8 py-3 rounded-full text-sm">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

    </div>
  );
};
