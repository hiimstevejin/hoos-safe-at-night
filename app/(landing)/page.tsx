// app/page.tsx
import Hero from "@/components/landing/Hero";

export default function Landing() {
  return (
    <main className="min-h-screen bg-[#FFFDF7] text-gray-900">
      <div className="mx-auto max-w-6xl">
        <Hero />
      </div>
    </main>
  );
}
