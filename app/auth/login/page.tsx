"use client";

import { LoginForm } from "@/components/login-form";
import { motion, Variants } from "framer-motion";
import Image from "next/image";

// --- Icon Type and Data ---
type IconItem = {
  src: string;
  alt: string;
  delay?: number;
};

const ICONS: IconItem[] = [
  { src: "/illustrations/image1.png", alt: "smile", delay: 0 },
  { src: "/illustrations/image2.png", alt: "wink", delay: 0.15 },
  { src: "/illustrations/image3.png", alt: "glasses", delay: 0.3 },
  { src: "/illustrations/image4.png", alt: "safety", delay: 0.45 },
  { src: "/illustrations/image5.png", alt: "pin", delay: 0.6 },
  { src: "/illustrations/image6.png", alt: "thief", delay: 0.6 },
];

// --- Animation Functions ---

// [FIX 3] Explicitly type the function's return value as 'Variants'
const float = (delay = 0): Variants => ({
  initial: { y: -8, opacity: 0 },
  animate: {
    y: [0, -6, 0], // The bobbing animation
    opacity: 1,
    transition: {
      // Fade-in transition
      opacity: { delay, duration: 0.6, ease: "easeOut" },
      // Bobbing transition
      y: {
        repeat: Infinity,
        repeatType: "mirror",
        duration: 3.2,
        delay,
      },
    },
  },
});

// [FIX 4] Explicitly type the 'slide' object as 'Variants'
const slide: Variants = {
  animate: {
    x: ["110%", "-110%"], // Start just off-screen right, end just off-screen left
    transition: {
      x: {
        repeat: Infinity,
        repeatType: "loop", // Jumps from end back to start
        duration: 4, // Adjust duration for speed (15 seconds)
        ease: "linear", // Ensures constant speed
      },
    },
  },
};

// --- Page Component ---
export default function Page() {
  // Split icons into the two groups
  const friendlyIcons = ICONS.slice(0, 6); // First 5 icons

  return (
    <div className="flex min-h-svh w-full bg-[#FFFDF7] items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm flex flex-col">
        {/* --- Start: Icon Display Logic --- */}
        <div className="w-full">
          {/* [MODIFIED] This container is now relative, with overflow-hidden
            to create the "marquee" effect. A fixed height helps.
          */}
          <div className="relative flex items-center px-2 flex-nowrap py-2 sm:py-4 h-24 overflow-hidden">
            {/* [MODIFIED] Group 1: 5 icons, now a motion.div with the `slide` animation.
              It's positioned to fill the container so it can slide across.
            */}
            <motion.div
              className="flex" // This div now slides
              variants={slide}
              animate="animate"
            >
              {friendlyIcons.map((i, idx) => (
                <motion.div
                  key={idx}
                  variants={float(i.delay)}
                  initial="initial"
                  animate="animate"
                  whileHover={{ scale: 1.06, rotate: 2 }}
                  className={`flex items-center justify-center ${
                    idx === 0
                      ? ""
                      : idx === friendlyIcons.length - 1
                      ? "ml-8" // <-- This is the bigger gap for the last element.
                      : "-ml-4" // <-- This is the original overlap for the middle elements.
                  }`}
                  title={i.alt}
                >
                  <Image
                    src={i.src}
                    alt={i.alt}
                    width={80}
                    height={80}
                    priority={idx < 3}
                    className="w-28 h-28 object-cover"
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
        {/* --- End: Icon Display Logic --- */}

        {/* Optional spacing between icons and form */}
        <div className="h-8" />

        {/* Your Login Form */}
        <LoginForm />
      </div>
    </div>
  );
}