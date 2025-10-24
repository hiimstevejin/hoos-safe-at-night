// app/page.tsx
import Hero from "@/components/landing/Hero";
import IconStrip from "@/components/landing/IconStrip";
import Navbar from "@/components/landing/Navbar";

export default function Landing() {
  return (
    <main className="min-h-screen bg-[#f4f5f3] text-gray-900">
      <Navbar />
      <IconStrip />
      <div className="mx-auto max-w-6xl">
        <Hero />
      </div>
    </main>
  );
}
