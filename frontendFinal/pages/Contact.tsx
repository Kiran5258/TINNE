import React, { useState } from 'react';
import { Reveal } from '../components/Reveal';

// Custom SVGs matching the fine-line premium style (no standard emojis as requested)
const PhoneIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const MailIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const MapPinIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const UserIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const DocumentIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const PenIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>
);

const SendIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const ClockIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const SunIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const TruckIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="3" width="15" height="13" />
    <polygon points="16 8 20 8 23 11 23 16 16 16" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);

const HeartIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>
);

const LeafDeco = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 8C8 9 9 17 9 17C9 17 17 18 18 10C18 9 18 8 17 8Z" />
    <path d="M9 17C8.5 17.5 7 21 7 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

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

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In actual app, we would post this. For now, simulate success:
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 4000);
  };

  return (
    <div className="bg-[#FEFCE8] min-h-screen text-[#1C2E1A] relative font-sans">
      
      {/* Background leaf illustrations */}
      <LeafyBranchDeco className="absolute top-10 left-[-40px] w-64 h-64 text-[#2E5E35]/5 pointer-events-none transform -rotate-12" />
      <LeafyBranchDeco className="absolute top-48 right-[-60px] w-72 h-72 text-[#2E5E35]/5 pointer-events-none transform rotate-45" />
      <LeafyBranchDeco className="absolute bottom-[350px] left-[-30px] w-56 h-56 text-[#2E5E35]/5 pointer-events-none transform rotate-[70deg]" />
      <LeafyBranchDeco className="absolute bottom-10 right-[-50px] w-80 h-80 text-[#2E5E35]/5 pointer-events-none transform -rotate-45" />
      
      {/* Hero Section */}
      <section className="pt-28 md:pt-36 pb-16 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* Left Column: Text */}
          <Reveal direction="left">
            <div className="flex items-center space-x-1 mb-2">
              <span className="text-[#2E5E35] font-bold text-xs uppercase tracking-wider">GET IN TOUCH</span>
              <svg className="w-8 h-4 text-[#2E5E35] fill-none stroke-current stroke-[1.5]" viewBox="0 0 30 10">
                <path d="M 2,5 Q 15,1 28,5" />
                <path d="M 22,2 Q 25,5 28,8" />
              </svg>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-display font-extrabold text-[#1C2E1A] leading-[1.1] mb-6">
              We'd Love to
              <br />
              Hear from <div className="inline-block relative">
                <span className="font-script text-[#2E5E35] text-5xl md:text-7xl font-bold ml-1">You!</span>
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-[#2E5E35] fill-none stroke-current stroke-[2]" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M 0,5 Q 50,0 100,5" />
                </svg>
                <svg className="absolute -top-3 -right-6 w-5 h-5 text-[#2E5E35] fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
            </h1>

            <p className="text-[#4A4A4A] text-lg font-light mb-10 max-w-lg">
              Have a question, feedback, or just want to say hello? We're here for you!
            </p>

            {/* 3 Contact Info Cards */}
            <div className="space-y-4 max-w-xl">
              
              {/* Call Us */}
              <div className="flex items-center space-x-4 bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-amber-900/5 shadow-sm">
                <div className="p-3 bg-[#E2F0D9] text-[#2E5E35] rounded-full shadow-inner">
                  <PhoneIcon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold tracking-widest text-[#2E5E35] uppercase block">Call Us</span>
                  <span className="text-base font-bold text-[#1C2E1A] block">+91 12345 67890</span>
                  <span className="text-[11px] text-[#5A5A5A]">Mon - Sat, 9AM - 6PM</span>
                </div>
              </div>

              {/* Email Us */}
              <div className="flex items-center space-x-4 bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-amber-900/5 shadow-sm">
                <div className="p-3 bg-[#FCE2E2] text-red-600 rounded-full shadow-inner">
                  <MailIcon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold tracking-widest text-red-600 uppercase block">Email Us</span>
                  <span className="text-base font-bold text-[#1C2E1A] block">hello@tinne.com</span>
                  <span className="text-[11px] text-[#5A5A5A]">We reply within 24 hrs</span>
                </div>
              </div>

              {/* Visit Us */}
              <div className="flex items-center space-x-4 bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-amber-900/5 shadow-sm">
                <div className="p-3 bg-[#FCF2D9] text-amber-700 rounded-full shadow-inner">
                  <MapPinIcon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold tracking-widest text-amber-700 uppercase block">Visit Us</span>
                  <span className="text-base font-bold text-[#1C2E1A] block">Tinné Foods Pvt. Ltd.</span>
                  <span className="text-[11px] text-[#5A5A5A]">Coimbatore, Tamil Nadu, India - 641XXX</span>
                </div>
              </div>

            </div>
          </Reveal>

          {/* Right Column: Contact Hero Image */}
          <Reveal direction="right" delay={200} className="relative flex justify-center md:justify-end w-full">
            <div className="relative max-w-lg lg:max-w-xl xl:max-w-2xl w-full px-4 md:px-0">
              <div className="relative aspect-[4/5] lg:h-[650px] xl:h-[700px] w-full overflow-hidden rounded-3xl shadow-xl border border-[#2E5E35]/10 bg-white">
                <img 
                  src="/contact_hero.jpg" 
                  alt="Tinné Amla Zing spice jar and vase" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Decorative elements */}
              <LeafDeco className="absolute -bottom-6 -left-6 w-16 h-16 text-[#2E5E35] opacity-25 transform rotate-[-45deg] pointer-events-none" />
              <div className="absolute -top-4 -right-4 w-12 h-12 border-2 border-emerald-800/10 rounded-full animate-ping pointer-events-none" />
            </div>
          </Reveal>

        </div>
      </section>

      {/* Form & Map Section */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12">
          
          {/* Left Column: Form Card */}
          <Reveal direction="left" className="h-full">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-neutral-100/55 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-display font-extrabold text-[#1C2E1A] flex items-center">
                    Send Us a Message
                    <LeafDeco className="w-5 h-5 text-[#2E5E35] ml-2 rotate-12" />
                  </h2>
                </div>

                {isSubmitted ? (
                  <div className="bg-[#E2F0D9] text-[#2E5E35] p-6 rounded-xl text-center shadow-inner my-12 animate-[fadeIn_0.5s_ease-out]">
                    <HeartIcon className="w-12 h-12 mx-auto mb-4 text-[#2E5E35] animate-bounce" />
                    <h3 className="text-lg font-bold mb-2">Thank you!</h3>
                    <p className="text-sm">We've received your message and will get back to you shortly.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Name */}
                      <div className="relative">
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="Your Name"
                          className="w-full bg-[#FEFCE8]/50 border border-neutral-200 focus:border-[#2E5E35] focus:bg-white rounded-xl py-3 pl-4 pr-10 outline-none transition-all text-sm text-[#1C2E1A]"
                        />
                        <UserIcon className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
                      </div>

                      {/* Email */}
                      <div className="relative">
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="Email Address"
                          className="w-full bg-[#FEFCE8]/50 border border-neutral-200 focus:border-[#2E5E35] focus:bg-white rounded-xl py-3 pl-4 pr-10 outline-none transition-all text-sm text-[#1C2E1A]"
                        />
                        <MailIcon className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
                      </div>
                    </div>

                    {/* Subject */}
                    <div className="relative">
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        placeholder="Subject"
                        className="w-full bg-[#FEFCE8]/50 border border-neutral-200 focus:border-[#2E5E35] focus:bg-white rounded-xl py-3 pl-4 pr-10 outline-none transition-all text-sm text-[#1C2E1A]"
                      />
                      <DocumentIcon className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
                    </div>

                    {/* Message */}
                    <div className="relative">
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        placeholder="Your Message"
                        className="w-full bg-[#FEFCE8]/50 border border-neutral-200 focus:border-[#2E5E35] focus:bg-white rounded-xl py-3 pl-4 pr-10 outline-none transition-all text-sm text-[#1C2E1A] resize-none"
                      />
                      <PenIcon className="absolute right-3.5 bottom-3 text-neutral-400 w-4 h-4" />
                    </div>

                    {/* Submit Button */}
                    <div className="flex items-center space-x-3 pt-2">
                      <button
                        type="submit"
                        className="bg-[#153A1D] hover:bg-[#1e4e28] text-white rounded-full font-bold px-8 py-3.5 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 text-sm"
                      >
                        <span>Send Message</span>
                        <SendIcon className="w-4 h-4" />
                      </button>

                      {/* Accent sparkles */}
                      <svg className="w-8 h-8 text-[#EAB308] opacity-60 animate-pulse" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l1.5 5.5L19 9l-5.5 1.5L12 16l-1.5-5.5L5 9l5.5-1.5z" />
                      </svg>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </Reveal>

          {/* Right Column: Find Us Card & Map */}
          <Reveal direction="right" delay={200} className="flex flex-col justify-between space-y-6 h-full">
            
            {/* Map & Info Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-neutral-100/55 flex-grow">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6">
                
                {/* Left Side: Text and Hours */}
                <div className="sm:col-span-4 flex flex-col justify-between h-full">
                  <div>
                    <h2 className="text-xl font-display font-extrabold text-[#1C2E1A] mb-3">Find Us Here</h2>
                    <p className="text-xs text-[#5A5A5A] leading-relaxed mb-6 font-light">
                      Come visit our kitchen where tradition is crafted with care.
                      <LeafDeco className="inline w-3 h-3 text-[#2E5E35] ml-1 rotate-12" />
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-extrabold tracking-widest text-[#2E5E35] uppercase block mb-3">Working Hours</span>
                    
                    <div className="space-y-3 text-xs">
                      {/* Mon - Sat */}
                      <div className="flex items-start space-x-2">
                        <ClockIcon className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold block text-[#1C2E1A]">Monday - Saturday</span>
                          <span className="text-[#5A5A5A]">9:00 AM - 6:00 PM</span>
                        </div>
                      </div>

                      {/* Sunday */}
                      <div className="flex items-start space-x-2">
                        <SunIcon className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold block text-[#1C2E1A]">Sunday</span>
                          <span className="text-red-500 font-bold">Closed</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side: Mock Coimbatore Map */}
                <div className="sm:col-span-8 relative h-[360px] md:h-[400px] bg-[#ECE7DC] rounded-xl overflow-hidden border border-neutral-200/40 shadow-inner">
                  {/* SVG map visual */}
                  <svg className="w-full h-full" viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
                    {/* Water / Greenery blocks */}
                    <path d="M -10,120 Q 30,130 60,110 T 120,130 T 210,125 L 210,160 L -10,160 Z" fill="#D8E6D3" opacity="0.6" />
                    <path d="M 150,0 Q 170,20 160,40 T 190,80 L 210,80 L 210,0 Z" fill="#E2EDDE" opacity="0.8" />
                    
                    {/* Roads grid (styled paths) */}
                    <path d="M 0,20 Q 80,40 200,30" fill="none" stroke="#FDFBF7" strokeWidth="2.5" />
                    <path d="M 0,80 Q 90,70 200,90" fill="none" stroke="#FDFBF7" strokeWidth="2.5" />
                    <path d="M 30,0 L 50,150" fill="none" stroke="#FDFBF7" strokeWidth="1.5" />
                    <path d="M 120,0 L 100,150" fill="none" stroke="#FDFBF7" strokeWidth="2" />
                    <path d="M 170,0 L 180,150" fill="none" stroke="#FDFBF7" strokeWidth="1" />
                    
                    {/* Minor connecting lanes */}
                    <path d="M 50,40 Q 80,60 105,80" fill="none" stroke="#FDFBF7" strokeWidth="1" />
                    <path d="M 120,30 Q 150,55 180,90" fill="none" stroke="#FDFBF7" strokeWidth="1" />
                    <path d="M 50,110 Q 75,100 100,90" fill="none" stroke="#FDFBF7" strokeWidth="1" />

                    {/* Neighborhood Labels */}
                    <text x="35" y="25" fill="#8B8375" fontSize="5" fontWeight="bold" fontFamily="sans-serif">Peelamedu</text>
                    <text x="140" y="20" fill="#8B8375" fontSize="5" fontWeight="bold" fontFamily="sans-serif">Sainbba Colony</text>
                    <text x="25" y="70" fill="#8B8375" fontSize="5" fontWeight="bold" fontFamily="sans-serif">Kuniyamuthur</text>
                    <text x="135" y="60" fill="#8B8375" fontSize="5" fontWeight="bold" fontFamily="sans-serif">Gandhipuram</text>
                    <text x="130" y="105" fill="#8B8375" fontSize="5" fontWeight="bold" fontFamily="sans-serif">Tatabad</text>
                    <text x="145" y="130" fill="#8B8375" fontSize="5" fontWeight="bold" fontFamily="sans-serif">Sulur</text>
                    <text x="25" y="115" fill="#8B8375" fontSize="5" fontWeight="bold" fontFamily="sans-serif">Saravanampatty</text>
                    <text x="140" y="8" fill="#8B8375" fontSize="4.5" fontWeight="semibold" fontFamily="sans-serif">Ramanathapuram</text>

                    {/* Central city name */}
                    <text x="85" y="55" fill="#4E432F" fontSize="8" fontWeight="extrabold" fontFamily="sans-serif">Coimbatore</text>

                    {/* Location marker pin matching Tinné design */}
                    <g transform="translate(100, 75)">
                      {/* Pulse effect */}
                      <circle cx="0" cy="0" r="10" fill="none" stroke="#153A1D" strokeWidth="1.5" className="animate-ping" />
                      {/* Ring */}
                      <circle cx="0" cy="0" r="6" fill="#FEFCE8" stroke="#153A1D" strokeWidth="2.5" />
                      {/* T symbol */}
                      <text x="-2.5" y="3" fill="#153A1D" fontSize="8.5" fontWeight="black" fontFamily="serif">T</text>
                    </g>
                  </svg>
                  
                  {/* Floating map controls graphic */}
                  <div className="absolute bottom-2 right-2 bg-white/95 shadow p-1.5 rounded flex flex-col space-y-1.5 border border-neutral-200/50">
                    <div className="w-4 h-4 flex items-center justify-center text-xs font-bold text-neutral-500 hover:text-black cursor-pointer">+</div>
                    <div className="w-4 h-0.5 bg-neutral-200"></div>
                    <div className="w-4 h-4 flex items-center justify-center text-xs font-bold text-neutral-500 hover:text-black cursor-pointer">-</div>
                  </div>
                </div>

              </div>
            </div>

            {/* Bottom Wide Bar - PAN India Delivery */}
            <div className="bg-[#FAF2D9] border border-amber-900/10 rounded-2xl p-5 shadow-sm flex items-center justify-between">
              <div className="flex items-center space-x-3.5">
                <div className="p-2.5 bg-white rounded-full text-amber-700 shadow-sm border border-[#EEDFB3]/50">
                  <TruckIcon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-extrabold text-amber-900 tracking-wider block uppercase">PAN India Delivery</span>
                  <span className="text-2xs sm:text-xs text-amber-800 font-light block mt-0.5">Bringing homemade goodness to your doorstep.</span>
                </div>
              </div>
              <div className="text-red-500 animate-[pulse_2s_infinite]">
                <HeartIcon className="w-5 h-5 fill-current" />
              </div>
            </div>

          </Reveal>

        </div>
      </section>

    </div>
  );
};
