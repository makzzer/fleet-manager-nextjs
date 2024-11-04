"use client"

import CallToAction from "../components/Landing/CallToAction";
import Hero from "../components/Landing/Hero";
import LogoTicker from "../components/Landing/LogoTicker";
import Pricing from "../components/Landing/Pricing";
import ProductShowcase from "../components/Landing/ProductShowcase";
import Testimonials from "../components/Landing/Testimonials";

const LandingPage = () => {

  return (
    <div>
      <Hero />
      <LogoTicker />
      <ProductShowcase />
      <Pricing />
      <Testimonials />
      <CallToAction />
    </div>
  )
}

export default LandingPage;