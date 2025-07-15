// src/pages/HomePage.jsx
import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import OpportunitySection from '../components/OpportunitySection';
import WhyChooseUs from '../components/WhyChooseUs';
import Footer from '../components/Footer';

const HomePage = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <OpportunitySection />
      <WhyChooseUs />
      <Footer />
    </>
  );
};

export default HomePage;
