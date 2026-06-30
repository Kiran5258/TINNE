import React from 'react';
import { Reveal } from '../components/Reveal';

// Custom SVGs matching the fine-line premium style (no standard emojis as requested)
const HeartIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const LeafIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1 9.8a7 7 0 0 1-9 8.2z" />
    <path d="M9 22v-4" />
    <path d="M11 8c3.5 0 6.5 3 7 7" />
  </svg>
);

const PreservativeFreeIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const TraditionalPotIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 3h12l1.5 5h-15z" />
    <path d="M4.5 8v8a3 3 0 0 0 3 3h9a3 3 0 0 0 3-3V8" />
    <path d="M12 3v12" />
    <circle cx="12" cy="15" r="2" />
  </svg>
);

const MortarPestleIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 10h16v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-6z" />
    <path d="M6 10V6a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v4" />
    <path d="M12 10V5a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v5" />
    <path d="M8 14h8" />
  </svg>
);

const GlobeIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
    <path d="M2 12h20" />
  </svg>
);

const SmileyIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" />
    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
    <line x1="9" y1="9" x2="9.01" y2="9" />
    <line x1="15" y1="9" x2="15.01" y2="9" />
  </svg>
);

const MapPinIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const LeafDeco = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 8C8 9 9 17 9 17C9 17 17 18 18 10C18 9 18 8 17 8Z" />
    <path d="M9 17C8.5 17.5 7 21 7 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const About: React.FC = () => {
  return (
    <div className="bg-[#FEFCE8] min-h-screen text-[#1C2E1A] font-sans">
      
      {/* Hero Section */}
      <section className="pt-28 md:pt-36 pb-16 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* Left Column: Text */}
          <Reveal direction="left">
            <div className="flex items-center space-x-1 mb-2">
              <span className="text-[#2E5E35] font-bold text-xs uppercase tracking-wider">ABOUT US</span>
              <svg className="w-8 h-4 text-[#2E5E35] fill-none stroke-current stroke-[1.5]" viewBox="0 0 30 10">
                <path d="M 2,5 Q 15,1 28,5" />
                <path d="M 22,2 Q 25,5 28,8" />
              </svg>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-display font-extrabold text-[#1C2E1A] leading-[1.1] mb-6">
              Rooted in <span className="font-script text-[#2E5E35] text-5xl md:text-7xl font-bold ml-1 inline-block">Tradition.</span>
              <br />
              Made for <div className="inline-block relative">
                <span className="font-script text-[#2E5E35] text-5xl md:text-7xl font-bold ml-1">Today.</span>
                <svg className="absolute -top-3 -right-6 w-5 h-5 text-[#2E5E35] fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
            </h1>

            <div className="space-y-4 text-[#4A4A4A] text-lg leading-relaxed mb-8 font-light max-w-xl">
              <p>
                Tinné is inspired by grandma's thinnai — a place where love, stories, and the most delicious home-cooked meals came together.
              </p>
              <p>
                We bring those timeless recipes to your modern kitchen with natural ingredients and zero shortcuts.
              </p>
            </div>

            {/* 4 Feature icons grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-amber-900/10">
              {/* 1. Homemade Goodness */}
              <div className="flex flex-col items-center text-center p-2">
                <div className="p-2.5 bg-[#F3F8F2] text-[#2E5E35] rounded-full mb-2 border border-[#E2F0D9] shadow-sm">
                  <TraditionalPotIcon className="w-5 h-5" />
                </div>
                <span className="text-[#1C2E1A] font-semibold text-[10px] tracking-wider uppercase leading-tight">Homemade Goodness</span>
              </div>

              {/* 2. No Artificial Preservatives */}
              <div className="flex flex-col items-center text-center p-2">
                <div className="p-2.5 bg-[#F3F8F2] text-[#2E5E35] rounded-full mb-2 border border-[#E2F0D9] shadow-sm">
                  <PreservativeFreeIcon className="w-5 h-5" />
                </div>
                <span className="text-[#1C2E1A] font-semibold text-[10px] tracking-wider uppercase leading-tight">No Preservatives</span>
              </div>

              {/* 3. 100% Natural Ingredients */}
              <div className="flex flex-col items-center text-center p-2">
                <div className="p-2.5 bg-[#F3F8F2] text-[#2E5E35] rounded-full mb-2 border border-[#E2F0D9] shadow-sm">
                  <LeafIcon className="w-5 h-5" />
                </div>
                <span className="text-[#1C2E1A] font-semibold text-[10px] tracking-wider uppercase leading-tight">100% Natural</span>
              </div>

              {/* 4. Traditional Recipes */}
              <div className="flex flex-col items-center text-center p-2">
                <div className="p-2.5 bg-[#F3F8F2] text-[#2E5E35] rounded-full mb-2 border border-[#E2F0D9] shadow-sm">
                  <MortarPestleIcon className="w-5 h-5" />
                </div>
                <span className="text-[#1C2E1A] font-semibold text-[10px] tracking-wider uppercase leading-tight">Traditional Recipes</span>
              </div>
            </div>
          </Reveal>

          {/* Right Column: Hero Image with Badge */}
          <Reveal direction="right" delay={200} className="relative flex justify-center">
            <div className="relative max-w-md w-full px-4 md:px-0">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-white aspect-[3/2] md:aspect-[4/3]">
                <img 
                  src="/about_hero_grandma.jpg" 
                  alt="Grandma and granddaughter preparing Tinné foods" 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating Stamp / Circular Text Badge */}
              <div className="absolute -top-8 -right-4 w-28 h-28 md:w-36 md:h-36 bg-[#FCF2D9] rounded-full shadow-lg border border-[#F5E6BE] flex items-center justify-center animate-[spin_25s_linear_infinite] z-20">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <path
                    id="textPath"
                    d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0"
                    fill="none"
                  />
                  <text className="font-display text-[7.5px] uppercase tracking-[0.16em] fill-[#6B4E3D] font-extrabold">
                    <textPath href="#textPath" startOffset="0%">
                      MADE WITH LOVE & TRADITION • MADE WITH LOVE & TRADITION •
                    </textPath>
                  </text>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center animate-[pulse_3s_infinite]">
                  <svg className="w-5 h-5 text-[#8B4513] fill-current" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          
          {/* Polaroid Courtyard Image */}
          <Reveal direction="left" className="flex justify-center">
            <div className="relative p-4 pb-12 bg-white shadow-2xl border border-neutral-200/50 rounded-sm transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500 max-w-md w-full">
              {/* Tape decoration at the top */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-7 bg-amber-100/40 border border-amber-200/20 shadow-sm backdrop-blur-[1px] rotate-[1deg]" />
              
              <img 
                src="/about_story_thinnai.jpg" 
                alt="Traditional Thinnai Courtyard" 
                className="w-full aspect-[4/3] object-cover rounded-sm border border-neutral-100"
              />
              
              {/* Handwritten text under the Polaroid photo */}
              <div className="mt-6 text-center">
                <span className="font-script text-neutral-800 text-3xl font-bold">Our Grandma's Thinnai</span>
              </div>
            </div>
          </Reveal>

          {/* Story Content */}
          <Reveal direction="right" delay={200}>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-[#2E5E35] font-bold text-xs uppercase tracking-wider">OUR STORY</span>
              <svg className="w-12 h-2 text-[#2E5E35] fill-none stroke-current stroke-[1.5]" viewBox="0 0 50 10">
                <line x1="0" y1="5" x2="50" y2="5" />
              </svg>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-display font-bold text-[#1C2E1A] mb-6 leading-tight">
              From Our <span className="font-script text-[#2E5E35] text-5xl md:text-6xl font-bold inline-block ml-1">Thinnai</span> To Yours
            </h2>
            
            <div className="space-y-6 text-[#4A4A4A] text-lg leading-relaxed font-light">
              <p>
                It all began in a small village home, where recipes were never written down. They were remembered, passed down, and made with intuition and love.
              </p>
              <p>
                Today, we bottle that same love and tradition into every pack of Tinné — so you can enjoy the comfort of homemade meals, anytime, anywhere.
              </p>
            </div>

            <div className="mt-8 flex items-center space-x-2">
              <span className="font-script text-[#2E5E35] text-3xl font-bold">- Made with love, just like Grandma did.</span>
              <HeartIcon className="w-6 h-6 text-red-500 fill-current animate-pulse" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-20 px-6 bg-white/50 backdrop-blur-sm border-y border-amber-900/5">
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center mb-16">
            <div className="flex flex-col items-center justify-center">
              <span className="text-[#2E5E35] font-bold text-xs uppercase tracking-wider mb-2">OUR VALUES</span>
              <div className="w-12 h-[2px] bg-[#2E5E35] mb-6" />
              <h2 className="text-3xl md:text-4xl font-display font-bold text-[#1C2E1A]">Values we hold dear</h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-4 gap-8">
            {/* Card 1 */}
            <Reveal delay={100} className="bg-[#FCFBF8] border border-amber-900/10 shadow-sm rounded-xl p-8 pt-10 text-center relative mt-6 hover:shadow-md transition-shadow">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#E2F0D9] text-[#2E5E35] w-12 h-12 rounded-full border-2 border-white flex items-center justify-center shadow-md">
                <LeafIcon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#1C2E1A] mb-3">Pure & Honest</h3>
              <p className="text-sm text-[#5A5A5A] leading-relaxed">
                We use clean, natural ingredients. No nasties, just the real stuff.
              </p>
            </Reveal>

            {/* Card 2 */}
            <Reveal delay={200} className="bg-[#FCFBF8] border border-amber-900/10 shadow-sm rounded-xl p-8 pt-10 text-center relative mt-6 hover:shadow-md transition-shadow">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#FCF2D9] text-[#D97706] w-12 h-12 rounded-full border-2 border-white flex items-center justify-center shadow-md">
                <MortarPestleIcon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#1C2E1A] mb-3">Tradition First</h3>
              <p className="text-sm text-[#5A5A5A] leading-relaxed">
                Our recipes are rooted in tradition and perfected with care.
              </p>
            </Reveal>

            {/* Card 3 */}
            <Reveal delay={300} className="bg-[#FCFBF8] border border-amber-900/10 shadow-sm rounded-xl p-8 pt-10 text-center relative mt-6 hover:shadow-md transition-shadow">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#FCE2E2] text-[#DC2626] w-12 h-12 rounded-full border-2 border-white flex items-center justify-center shadow-md">
                <HeartIcon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#1C2E1A] mb-3">Made with Love</h3>
              <p className="text-sm text-[#5A5A5A] leading-relaxed">
                Every batch is made in small quantities with love and intention.
              </p>
            </Reveal>

            {/* Card 4 */}
            <Reveal delay={400} className="bg-[#FCFBF8] border border-amber-900/10 shadow-sm rounded-xl p-8 pt-10 text-center relative mt-6 hover:shadow-md transition-shadow">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#E0F2FE] text-[#0369A1] w-12 h-12 rounded-full border-2 border-white flex items-center justify-center shadow-md">
                <GlobeIcon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#1C2E1A] mb-3">Better for You</h3>
              <p className="text-sm text-[#5A5A5A] leading-relaxed">
                Good for your health and kind to the earth.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Crafted by People Who Care Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto overflow-visible">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          
          {/* Text column */}
          <Reveal direction="left">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-[#2E5E35] font-bold text-xs uppercase tracking-wider">CRAFTED BY PEOPLE WHO CARE</span>
              <svg className="w-12 h-2 text-[#2E5E35] fill-none stroke-current stroke-[1.5]" viewBox="0 0 50 10">
                <line x1="0" y1="5" x2="50" y2="5" />
              </svg>
            </div>
            
            <h2 className="text-4xl font-display font-bold text-[#1C2E1A] mb-6 leading-tight">
              Behind every jar is a team that believes in quality, sustainability, and making a difference.
            </h2>
            
            <p className="text-[#4A4A4A] text-lg leading-relaxed mb-8 font-light">
              We are a collective of farmers, makers, and dreamers working together to bring Grandma's wisdom into the modern age. We source ethically, process cleanly, and package lovingly.
            </p>

            <div className="flex items-center space-x-3 text-[#2E5E35] text-2xl font-bold font-script">
              <span>Real people. Real food. Real impact.</span>
              <LeafDeco className="w-8 h-8 text-[#2E5E35] rotate-12" />
            </div>
          </Reveal>

          {/* Photo + Post-its column */}
          <Reveal direction="right" delay={200} className="relative py-8 px-4 md:px-8">
            
            {/* Main Image Container */}
            <div className="relative mx-auto max-w-md bg-white p-3 shadow-xl rounded-lg border border-neutral-100">
              <img 
                src="/about_team.jpg" 
                alt="The Tinné Team" 
                className="w-full aspect-[4/3] object-cover rounded-md"
              />
            </div>

            {/* Floating Sticky Notes - hidden on mobile, absolutely positioned on md+ */}
            {/* 1. Carefully Sourced Ingredients */}
            <div className="hidden md:block absolute top-2 -left-4 w-40 bg-[#FCF7D9] shadow-md border border-yellow-200/50 p-3 rounded-sm transform rotate-[-4deg] text-center">
              <span className="font-sans text-xs font-bold text-[#635532] block">Carefully Sourced</span>
              <span className="font-script text-lg text-[#2E5E35] font-semibold leading-none block mt-1">Ingredients</span>
              {/* Hand-drawn look arrow pointing to image */}
              <svg className="w-6 h-6 text-[#2E5E35] mx-auto mt-1 fill-none stroke-current stroke-[1.5]" viewBox="0 0 24 24">
                <path d="M4 4c4 4 8 2 12 6" />
                <path d="M12 10h4V6" />
              </svg>
            </div>

            {/* 2. Hygienically Processed */}
            <div className="hidden md:block absolute -bottom-4 -left-6 w-36 bg-[#FCF7D9] shadow-md border border-yellow-200/50 p-3 rounded-sm transform rotate-[3deg] text-center">
              <span className="font-sans text-xs font-bold text-[#635532] block">Hygienically</span>
              <span className="font-script text-lg text-[#2E5E35] font-semibold leading-none block mt-1">Processed</span>
              <div className="flex justify-center mt-1">
                <SmileyIcon className="w-5 h-5 text-[#2E5E35]" />
              </div>
            </div>

            {/* 3. Small Batches Big Love */}
            <div className="hidden md:block absolute top-6 -right-6 w-36 bg-[#FCF7D9] shadow-md border border-yellow-200/50 p-3 rounded-sm transform rotate-[2deg] text-center">
              <span className="font-sans text-xs font-bold text-[#635532] block">Small Batches</span>
              <span className="font-script text-lg text-red-600 font-semibold leading-none block mt-1">Big Love</span>
              <div className="flex justify-center mt-1">
                <HeartIcon className="w-5 h-5 text-red-500 fill-current" />
              </div>
            </div>

            {/* 4. Quality You Can Trust */}
            <div className="hidden md:block absolute bottom-4 -right-4 w-36 bg-[#FCF7D9] shadow-md border border-yellow-200/50 p-3 rounded-sm transform rotate-[-3deg] text-center">
              <span className="font-sans text-xs font-bold text-[#635532] block">Quality You Can</span>
              <span className="font-script text-lg text-[#2E5E35] font-semibold leading-none block mt-1">Trust</span>
            </div>

            {/* Mobile-only Sticky Notes display grid below image */}
            <div className="grid grid-cols-2 gap-4 mt-6 md:hidden">
              <div className="bg-[#FCF7D9] shadow-sm border border-yellow-200/50 p-3 rounded-sm text-center transform rotate-[-1deg]">
                <span className="font-sans text-[10px] font-bold text-[#635532] block">Carefully Sourced</span>
                <span className="font-script text-base text-[#2E5E35] block leading-none mt-0.5">Ingredients</span>
              </div>
              <div className="bg-[#FCF7D9] shadow-sm border border-yellow-200/50 p-3 rounded-sm text-center transform rotate-[1deg]">
                <span className="font-sans text-[10px] font-bold text-[#635532] block">Hygienically</span>
                <span className="font-script text-base text-[#2E5E35] block leading-none mt-0.5">Processed</span>
              </div>
              <div className="bg-[#FCF7D9] shadow-sm border border-yellow-200/50 p-3 rounded-sm text-center transform rotate-[2deg]">
                <span className="font-sans text-[10px] font-bold text-[#635532] block">Small Batches</span>
                <span className="font-script text-base text-red-600 block leading-none mt-0.5">Big Love</span>
              </div>
              <div className="bg-[#FCF7D9] shadow-sm border border-yellow-200/50 p-3 rounded-sm text-center transform rotate-[-2deg]">
                <span className="font-sans text-[10px] font-bold text-[#635532] block">Quality You Can</span>
                <span className="font-script text-base text-[#2E5E35] block leading-none mt-0.5">Trust</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Bottom Stats Banner */}
      <section className="py-16 px-6 max-w-7xl mx-auto relative overflow-visible">
        {/* Floating Leaf Decorations around stats bar */}
        <LeafDeco className="absolute -top-6 -left-2 w-12 h-12 text-[#2E5E35] opacity-20 transform -rotate-12 pointer-events-none" />
        <LeafDeco className="absolute -bottom-8 -right-2 w-16 h-16 text-[#2E5E35] opacity-20 transform rotate-45 pointer-events-none" />

        <Reveal>
          <div className="bg-[#153A1D] text-white rounded-2xl p-8 md:p-12 shadow-xl relative overflow-hidden">
            {/* Decorative leaf watermarks in background */}
            <div className="absolute inset-0 opacity-5 pointer-events-none flex justify-around items-center">
              <LeafDeco className="w-48 h-48 rotate-12" />
              <LeafDeco className="w-64 h-64 -rotate-45" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 relative z-10">
              {/* Stat 1 */}
              <div className="flex flex-col items-center text-center px-4 md:border-r border-[#2C5634]/50 last:border-none">
                <LeafIcon className="w-8 h-8 text-[#A7F3D0] mb-3" />
                <span className="text-3xl font-display font-bold block mb-1">100%+</span>
                <span className="text-xs text-neutral-300 uppercase tracking-widest leading-relaxed">Natural Ingredients</span>
              </div>

              {/* Stat 2 */}
              <div className="flex flex-col items-center text-center px-4 md:border-r border-[#2C5634]/50 last:border-none">
                <SmileyIcon className="w-8 h-8 text-[#A7F3D0] mb-3" />
                <span className="text-3xl font-display font-bold block mb-1">50K+</span>
                <span className="text-xs text-neutral-300 uppercase tracking-widest leading-relaxed">Happy Customers</span>
              </div>

              {/* Stat 3 */}
              <div className="flex flex-col items-center text-center px-4 md:border-r border-[#2C5634]/50 last:border-none">
                <HeartIcon className="w-8 h-8 text-[#A7F3D0] mb-3" />
                <span className="text-3xl font-display font-bold block mb-1">7+</span>
                <span className="text-xs text-neutral-300 uppercase tracking-widest leading-relaxed">Signature Products</span>
              </div>

              {/* Stat 4 */}
              <div className="flex flex-col items-center text-center px-4 last:border-none">
                <MapPinIcon className="w-8 h-8 text-[#A7F3D0] mb-3" />
                <span className="text-3xl font-display font-bold block mb-1">Pan India</span>
                <span className="text-xs text-neutral-300 uppercase tracking-widest leading-relaxed">Delivery</span>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

    </div>
  );
};