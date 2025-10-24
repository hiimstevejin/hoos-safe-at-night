"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";

const container = (delay = 0) => ({
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { delay, staggerChildren: 0.08 },
  },
});

const item = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const pop = {
  hidden: { opacity: 0, scale: 0.9 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 220, damping: 18 },
  },
};

export default function Hero() {
  const prefersReduced = useReducedMotion();

  return (
    <section className="min-h-[40vh] flex flex-col items-center justify-center text-center px-4">
      {/* 헤드라인 */}
      <motion.h1
        variants={container()}
        initial="hidden"
        animate="show"
        className="font-extrabold leading-tight text-4xl sm:text-6xl"
      >
        <motion.span variants={item}>Walk </motion.span>
        <motion.span variants={item}>safe, </motion.span>
        <motion.span
          variants={item}
          className="bg-gradient-to-r from-pink-500 to-yellow-400 bg-clip-text text-transparent"
        >
          together.
        </motion.span>
      </motion.h1>

      {/* 서브 카피 */}
      <motion.p
        variants={pop}
        initial="hidden"
        animate="show"
        className="mt-4 text-lg sm:text-xl text-gray-600 max-w-2xl"
      >
        A friendly way to <strong>find companions nearby</strong>, share your
        route, and get home with <strong>peace of mind</strong>.
      </motion.p>

      {/* 핵심 포인트 3줄 (스태거) */}
      <motion.ul
        variants={container(0.2)}
        initial="hidden"
        animate="show"
        className="mt-6 space-y-2 text-gray-700"
      >
        {[
          "One-tap ‘Walk Together’ posts",
          "Distance-based matching from your location",
          "Lightweight safety layer without personal pinpointing",
        ].map((line) => (
          <motion.li
            key={line}
            variants={item}
            className="flex items-center justify-center gap-2"
          >
            <span className="text-pink-500">✦</span>
            {line}
          </motion.li>
        ))}
      </motion.ul>

      {/* CTA */}
      <motion.div
        variants={pop}
        initial="hidden"
        animate="show"
        className="mt-8 flex gap-3"
      >
        <Link
          href="/auth/login"
          className="rounded-full bg-pink-500 text-white px-6 py-3 text-lg hover:scale-105 transition"
        >
          Get started
        </Link>
        <Link
          href="/protected"
          className="rounded-full border border-pink-300 text-pink-600 bg-white px-6 py-3 text-lg hover:bg-pink-50 transition"
        >
          See a demo
        </Link>
      </motion.div>
    </section>
  );
}
