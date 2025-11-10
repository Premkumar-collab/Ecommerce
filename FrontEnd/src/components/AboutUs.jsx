import React, { useState } from 'react';

import Navbar from "./Navbar"; 
import { Sparkles, Heart, Leaf, Zap, Users, CheckCircle, Quote } from 'lucide-react';
import img1 from '../assets/images.jpeg'
const AboutUs = () => {
  // Dummy data for the sake of the example
  const companyName = "Bazario"; 
  const establishedYear = 2018;

  const values = [
    {
      icon: Heart,
      title: "Customer First",
      description: "We put our community at the heart of every decision, ensuring delight with every purchase and interaction.",
    },
    {
      icon: Leaf,
      title: "Sustainable Sourcing",
      description: "A commitment to the planet. We prioritize eco-friendly materials and ethical supply chain practices.",
    },
    {
      icon: Zap,
      title: "Pioneering Innovation",
      description: "We constantly seek new technologies and ideas to improve your shopping experience and our products.",
    },
  ];

  // Simple state to show/hide a history detail section
  const [showHistoryDetail, setShowHistoryDetail] = useState(false);

  // --- BRAND COLORS ---
  const BRAND_DARK = '#2e2e3c'; // Primary dark color
  const ACCENT_LIGHT = 'text-gray-300'; // Light accent text on dark backgrounds

  // The outer div now includes pt-24 (96px) to push content down past a fixed navbar.
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 antialiased font-sans pt-24"> 
      
      {/* Assuming Navbar component is defined and imported */}
      <Navbar />

      {/* Header/Hero Section (Using BRAND_DARK as background) 
          Removed 'my-52' class to prevent massive spacing issues. */}
      <header className="bg-white shadow-lg rounded-xl overflow-hidden max-w-7xl mx-auto mb-16">
        <div className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className={`text-base font-semibold tracking-wide ${ACCENT_LIGHT} uppercase flex items-center justify-center`}>
              <Sparkles className="w-5 h-5 mr-2" /> Our Story
            </p>
            <h1 className="mt-2 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-black">
              Welcome to the World of <span className={ACCENT_LIGHT}>{companyName}</span>
            </h1>
            <p className="mt-4 max-w-3xl mx-auto text-xl text-gray-400">
              Transforming the way you shop for quality, design, and inspiration.
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* 1. Mission and Vision Section */}
        <section className="mb-20">
          <div className="md:grid md:grid-cols-2 md:gap-16 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
                Our Mission: Quality, Delivered.
              </h2>
              <p className="mt-4 text-lg text-gray-500 leading-relaxed">
                Founded in {establishedYear}, our mission has always been simple: to curate and deliver exceptional products that enhance your everyday life. We believe that quality should never be a compromise. From the materials we source to the final package delivered to your door, excellence is our standard.
              </p>
              
              <div className="mt-8 space-y-4">
                <p className="flex items-start text-gray-700">
                  <CheckCircle className="w-5 h-5 text-gray-600 mr-2 flex-shrink-0 mt-1" /> 
                  Hand-vetted products for superior craftsmanship.
                </p>
                <p className="flex items-start text-gray-700">
                  <CheckCircle className="w-5 h-5 text-gray-600 mr-2 flex-shrink-0 mt-1" /> 
                  Seamless, fast, and reliable delivery network.
                </p>
                <p className="flex items-start text-gray-700">
                  <CheckCircle className="w-5 h-5 text-gray-600 mr-2 flex-shrink-0 mt-1" /> 
                  Dedicated 24/7 support team.
                </p>
              </div>
            </div>
            
            {/* Image Placeholder */}
            <div className="order-1 md:order-2 mt-8 md:mt-0 p-8 bg-gray-100 rounded-xl shadow-lg transform hover:scale-[1.01] transition duration-300">
              {/* This uses a placeholder image URL. Replace with a high-quality product or company image. */}
              <img 
                src={img1}
                alt="Our Core Team" 
                className="w-full h-80 object-cover rounded-lg shadow-2xl"
                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x400/2e2e3c/ffffff?text=Image+Not+Found" }}
              />
            </div>
          </div>
        </section>

        {/* 2. Core Values Section */}
        <section className="bg-white p-10 rounded-2xl shadow-xl mb-20 border border-gray-100">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Our Guiding Principles
            </h2>
            <p className="mt-3 text-xl text-gray-500">
              The values that drive our passion and purpose every single day.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {values.map((value, index) => (
              <div 
                key={index} 
                className="text-center p-6 rounded-xl border border-gray-200 hover:border-[#2e2e3c] transition duration-300 transform hover:shadow-lg bg-gray-50"
              >
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 text-[#2e2e3c] mb-4"> {/* Icon text color updated */}
                  <value.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{value.title}</h3>
                <p className="mt-2 text-base text-gray-500">{value.description}</p>
              </div>
            ))}
          </div>
        </section>
        
        {/* 3. Detailed History (Interactive Section) */}
        <section className="mb-20 bg-gray-100 p-8 rounded-2xl"> {/* Updated lighter background */}
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                    The {companyName} Timeline
                </h2>
                <button
                    onClick={() => setShowHistoryDetail(!showHistoryDetail)}
                    className="px-6 py-2 bg-[#2e2e3c] text-white font-medium rounded-full shadow-md hover:bg-gray-800 transition duration-150 transform hover:scale-105" // Updated button color
                >
                    {showHistoryDetail ? 'Hide Full Timeline' : 'View Our Journey'}
                </button>
            </div>
            
            <div className={`mt-6 transition-all duration-500 ease-in-out overflow-hidden ${showHistoryDetail ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="border-l-4 border-gray-300 pl-6 space-y-8 pt-4"> {/* Updated border color */}
                    <HistoryEvent year="2018" title="The Founding Idea" description="Two college friends, Prem and Alex, envisioned a marketplace for ethical, minimalist design products. Bazario was born." />
                    <HistoryEvent year="2019" title="First Warehouse & Funding" description="Secured initial seed funding and opened our first small fulfillment center in Seattle." />
                    <HistoryEvent year="2021" title="Expansion into Europe" description="Launched international shipping and established key partnerships with 15 new sustainable brands across Europe." />
                    <HistoryEvent year="2023" title="Mobile App Launch" description="Released our highly-rated mobile application, dramatically improving the customer experience on touch devices." />
                </div>
            </div>
        </section>

        {/* 4. Testimonial / Quote Section */}
        <section className="mb-20">
          <div className="bg-[#2e2e3c] rounded-3xl p-12 lg:p-16 shadow-2xl text-white"> {/* Updated testimonial background */}
            <Quote className="w-10 h-10 text-gray-300 mb-6" /> {/* Updated icon color */}
            <blockquote className="text-2xl italic font-light lg:text-3xl">
              "Building {companyName} has been more than just selling products; it's about creating a community focused on conscious consumption and lasting quality. Thank hour for being part of our journey."
            </blockquote>
            <cite className="mt-6 block text-lg font-semibold text-gray-300"> {/* Updated citation color */}
              — Prem & Alex, Co-Founders of {companyName}
            </cite>
          </div>
        </section>


        {/* 5. Team Section (Simple Cards) */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Meet the Dedicated Team
            </h2>
            <p className="mt-3 text-xl text-gray-500">
              The people who make the magic happen every day.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <TeamMember name="Prem" role="CEO / Visionary" />
            <TeamMember name="Alex Rodriguez" role="CTO / Tech Lead" />
            <TeamMember name="Samantha Lee" role="Head of Design" />
            <TeamMember name="Javier Lopez" role="Operations Manager" />
          </div>
        </section>

      </main>

      {/* Footer (simple placeholder) */}
      <footer className="bg-gray-800 text-white text-center py-8 mt-12">
        <p>&copy; {new Date().getFullYear()} {companyName}. All rights reserved. | Built with Passion.</p>
      </footer>

    </div>
  );
};

// Helper component for the timeline events
const HistoryEvent = ({ year, title, description }) => (
    <div className="relative">
        <div className="absolute w-4 h-4 bg-[#2e2e3c] rounded-full mt-1.5 -left-8 border-4 border-white shadow-md"></div> {/* Updated dot color */}
        <time className="text-sm font-semibold text-[#2e2e3c] uppercase tracking-widest block">{year}</time> {/* Updated time color */}
        <h4 className="text-xl font-bold text-gray-900 mt-1">{title}</h4>
        <p className="text-gray-600 mt-2">{description}</p>
    </div>
);


// Helper component for team cards
const TeamMember = ({ name, role }) => (
  <div className="text-center p-6 bg-white rounded-xl shadow-lg border border-gray-100 transition duration-300 hover:shadow-xl hover:scale-[1.02]">
    <div className="mx-auto h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mb-4">
        {/* Placeholder for an image or avatar */}
        <Users className="w-10 h-10" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
    <p className="text-[#2e2e3c] text-sm font-medium">{role}</p> {/* Updated role text color */}
  </div>
);

export default AboutUs;