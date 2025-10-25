// app/page.tsx
import SafetyTools from "@/components/landing/SafetyTools";
import Hero from "@/components/landing/Hero";
import IconStrip from "@/components/landing/IconStrip";
import Navbar from "@/components/landing/Navbar";
import WhySection from "@/components/landing/WhySection";
import Footer from "@/components/landing/Footer";

export default function Landing() {
  return (
    <main className="min-h-screen bg-[#f4f5f3] text-gray-900">
      <Navbar />
      <IconStrip />
      <div className="mx-auto max-w-6xl">
        <Hero />
        <WhySection />
        <SafetyTools />
      </div>
      <Footer />
    </main>
  );
}
