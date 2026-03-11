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

export const Blog: React.FC = () => {

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
  const featured = posts.find(p => p.slug === 'red-millet-revival');

  // CATEGORIES
  const fieldNotes = getPostsByCategory('Field Notes from Indian Farms');
  const recipes = getPostsByCategory('Rituals & Recipes');
  const science = getPostsByCategory('Backed by Science');
  const people = getPostsByCategory('People Who Shape Our Brand');

  const artisan = people.length > 0 ? people[0] : null;

  return (
    <div className="pt-20 min-h-screen bg-neutral-50 font-sans">

      {/* HERO */}
      <header className="bg-white text-center py-24">
        <Reveal>
          <IconBookOpen className="w-10 h-10 mx-auto mb-6 text-brand-dark" />
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-4">
            Tinné Journal
          </h1>
          <p className="text-neutral-600 text-xl">
            Insights. Origins. Innovations.
          </p>
        </Reveal>
      </header>

      {/* FEATURED */}
      {featured && (
        <section className="py-20 px-6 max-w-7xl mx-auto">
          <Reveal>
            <div className="grid lg:grid-cols-2 bg-white rounded-3xl overflow-hidden shadow-lg">
              <Link to={`/blog/${featured.slug}`} target="_blank">
                <img
                  src={featured.image}
                  alt={featured.title}
                  className="w-full h-full object-cover"
                />
              </Link>
              <div className="p-12">
                <h2 className="text-4xl font-bold mb-4">
                  {featured.title}
                </h2>
                <p className="text-neutral-600 mb-6">
                  {featured.excerpt}
                </p>
                <Link to={`/blog/${featured.slug}`} target="_blank">
                  <Button variant="outline">
                    Read Full Story <IconArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </Reveal>
        </section>
      )}

      {/* FIELD NOTES */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <Reveal>
          <div className="flex items-center mb-8">
            <IconLeaf className="w-5 h-5 text-brand-accent mr-2" />
            <h2 className="text-3xl font-bold">
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

      {/* RECIPES */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <Reveal>
          <div className="flex items-center mb-8">
            <IconUtensils className="w-5 h-5 text-brand-accent mr-2" />
            <h2 className="text-3xl font-bold">Rituals & Recipes</h2>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-6">
          {recipes.slice(0, 2).map(item => (
            <BlogCard key={item.id} post={item} compact />
          ))}
        </div>
      </section>

      {/* SCIENCE */}
      <section className="py-24 bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="flex items-center mb-8">
              <IconScience className="w-5 h-5 text-brand-accent mr-2" />
              <h2 className="text-3xl font-bold">Backed by Science</h2>
            </div>
          </Reveal>

          <div className="space-y-4">
            {science.map(item => (
              <Link
                key={item.id}
                to={`/blog/${item.slug}`}
                target="_blank"
                className="block bg-neutral-50 p-6 rounded-xl"
              >
                <h3 className="font-bold text-lg">{item.title}</h3>
                <p className="text-neutral-600 text-sm">{item.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* PEOPLE */}
      {artisan && (
        <section className="py-24 px-6 max-w-7xl mx-auto">
          <Reveal>
            <div className="flex items-center mb-8">
              <IconUsers className="w-5 h-5 text-brand-accent mr-2" />
              <h2 className="text-3xl font-bold">
                People Who Shape Our Brand
              </h2>
            </div>
          </Reveal>

          <Link to={`/blog/${artisan.slug}`} target="_blank">
            <img
              src={artisan.image}
              alt={artisan.title}
              className="rounded-3xl w-full h-[400px] object-cover"
            />
          </Link>
        </section>
      )}

      {/* FOOTER */}
      <section className="py-24 bg-brand-muted text-center">
        <Reveal>
          <IconFeather className="w-10 h-10 mx-auto mb-6" />
          <h2 className="text-4xl font-bold mb-4">
            Join the Tinné Community
          </h2>
          <p className="text-neutral-600">
            Weekly insights & heritage recipes.
          </p>
        </Reveal>
      </section>

    </div>
  );
};
