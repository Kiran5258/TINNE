import React from 'react';
import { IconLeaf, IconShieldCheck, IconGlobe, IconAward } from '../components/Icons';
import { Reveal } from '../components/Reveal';

export const About: React.FC = () => {
  return (
    <div className="pt-20 min-h-screen bg-white overflow-hidden">
      
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1546816570-36365b934b9d?auto=format&fit=crop&q=80&w=2000" 
            alt="Traditional Indian Courtyard" 
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-neutral-900/60" />
        </div>
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <Reveal delay={200}>
             <h1 className="font-script text-6xl md:text-8xl text-white mb-6 drop-shadow-2xl">About Tinné</h1>
          </Reveal>
          <Reveal delay={400}>
            <p className="text-xl md:text-3xl text-neutral-200 font-light tracking-wider leading-relaxed">
              Where Heritage Becomes a <span className="text-brand-accent font-normal italic">Luxury Experience</span>
            </p>
          </Reveal>
        </div>
      </section>

      {/* Origin Story */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <Reveal direction="left">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-neutral-900 mb-8 leading-tight">
              Preserving the taste of yesterday, for tomorrow.
            </h2>
            <div className="space-y-6 text-lg text-neutral-600 leading-relaxed font-light">
              <p>
                In a world moving faster each day, Tinné began with a simple question:
                <br/>
                <span className="italic font-medium text-neutral-900">“How do we preserve the taste of yesterday while meeting the standards of tomorrow?”</span>
              </p>
              <p>
                Our story started in a quiet countryside courtyard — a <span className="font-bold text-brand-dark">thinnai</span> — where families gathered, where recipes were passed down without being written, and where food meant memory, identity, and belonging.
              </p>
              <p>
                From that warm simplicity, Tinné was born. It is not just a brand. It is a curated experience, built to bring the finest elements of India’s food heritage into a refined, modern lifestyle.
              </p>
            </div>
          </Reveal>
          <Reveal direction="right" delay={300}>
            <div className="relative">
              <div className="absolute -inset-4 border-2 border-brand-accent/30 rounded-full animate-[spin_30s_linear_infinite]" />
              <img 
                src="https://images.unsplash.com/photo-1596208643924-f7c8702c2869?auto=format&fit=crop&q=80&w=800" 
                alt="Heritage Spices" 
                className="rounded-full w-full aspect-square object-cover shadow-2xl z-10 relative"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Values / Philosophy - Dark Section */}
      <section className="py-32 bg-neutral-900 text-white relative">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
           <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-brand-accent rounded-full blur-[150px]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <Reveal className="text-center mb-20">
            <span className="text-brand-accent uppercase tracking-[0.2em] text-sm font-bold mb-4 block">Our Philosophy</span>
            <h2 className="text-4xl md:text-6xl font-display font-bold">A Heritage Reimagined</h2>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: IconLeaf,
                title: "Curated Ingredients",
                text: "From ancient millets grown in rain-fed soils to handpicked spices from estates, our products are crafted with deep respect for origin and purity."
              },
              {
                icon: IconShieldCheck,
                title: "Precision Craftsmanship",
                text: "Every batch reflects world-class FMCG standards — stone-ground processing, cold-pressed extraction, and nitrogen sealing. Luxury is consistency."
              },
              {
                icon: IconGlobe,
                title: "Ethical Sourcing",
                text: "We work directly with farming communities ensuring ethical sourcing, transparent processes, and sustainable practices that honor both people and planet."
              }
            ].map((item, i) => (
              <Reveal key={i} delay={i * 200} className="bg-white/5 backdrop-blur-sm p-10 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                <item.icon className="w-12 h-12 text-brand-accent mb-6" />
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-neutral-400 leading-relaxed">
                  {item.text}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Product Promise - Light Section */}
      <section className="py-32 px-6 bg-brand-muted">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
             <Reveal className="order-2 md:order-1 relative h-[600px] w-full rounded-3xl overflow-hidden shadow-2xl">
               <img 
                 src="https://aistudiocdn.com/d/ef70b686-e91b-4f91-817e-7bf33f019054" 
                 alt="Premium Packaging" 
                 className="absolute inset-0 w-full h-full object-cover"
               />
             </Reveal>
             <Reveal direction="right" className="order-1 md:order-2">
               <h2 className="text-4xl font-display font-bold text-neutral-900 mb-8">Luxury is Purity You Can Trust</h2>
               <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
                 Good food is not created — it is curated. This is why every Tinné product carries the quiet luxury of tradition combined with modern professionalism.
               </p>
               
               <ul className="space-y-6">
                 {[
                   "Origin traceability for every grain",
                   "Batch-tested quality reports",
                   "Certified facility processing",
                   "Minimalist, premium packaging",
                   "A flavor profile that respects tradition"
                 ].map((item, i) => (
                   <li key={i} className="flex items-center text-neutral-800 font-medium">
                     <IconAward className="w-6 h-6 text-brand-accent mr-4 flex-shrink-0" />
                     {item}
                   </li>
                 ))}
               </ul>
             </Reveal>
          </div>
        </div>
      </section>

      {/* Global Vision */}
      <section className="py-24 bg-white text-center">
        <div className="max-w-4xl mx-auto px-6">
          <Reveal>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-neutral-900 mb-10">
              Crafted in India. <span className="text-brand-accent">Designed for the World.</span>
            </h2>
            <p className="text-xl text-neutral-600 leading-relaxed mb-12">
              Tinné brings India’s timeless culinary heritage into a global format. 
              Whether for modern homes, boutique retailers, or gourmet chefs, we deliver the soul of tradition in every pack.
            </p>
            <div className="inline-block p-1 bg-gradient-to-r from-brand-dark via-brand-accent to-brand-dark rounded-full">
               <div className="bg-white px-10 py-4 rounded-full">
                 <span className="font-script text-3xl font-bold text-brand-dark">From Grandma's Thinnai to the Global Shelf</span>
               </div>
            </div>
          </Reveal>
        </div>
      </section>

    </div>
  );
};