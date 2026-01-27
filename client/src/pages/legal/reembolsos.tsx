import { Link } from "wouter";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/layout/hero-section";
import { NewsletterSection } from "@/components/layout/newsletter-section";

export default function Reembolsos() {
  return (
    <div className="min-h-screen bg-white font-sans text-left selection:bg-brand-lime selection:text-brand-dark">
      <Navbar />
      <HeroSection 
        className="pt-20 sm:pt-24 lg:pt-28 pb-0"
        title={
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black  tracking-tight text-brand-dark leading-[1.1] text-center sm:text-left">
            Política de <span className="text-brand-lime">Reembolsos</span>
          </h1>
        }
      />
      <NewsletterSection />
      <Footer />
    </div>
  );
}
