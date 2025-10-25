"use client";
import { motion, useAnimation, useInView } from "framer-motion";
import { useEffect, useRef } from "react";

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.3, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

export default function WhySection() {
  const ref = useRef<HTMLDivElement>(null);

  // Trigger only after user scrolls down far enough (one-time)
  const inView = useInView(ref, {
    once: true,
    amount: 0.6,
    margin: "0px 0px -30% 0px",
  });

  const controls = useAnimation();
  useEffect(() => {
    if (inView) controls.start("visible");
  }, [inView, controls]);

  return (
    <motion.section
      id="about"
      ref={ref}
      variants={container}
      initial="hidden"
      animate={controls}
      className="w-full py-24 sm:py-55"
      aria-labelledby="why-title"
    >
      <motion.div variants={container} className="mx-auto max-w-6xl px-4">
        {/* centered layout */}
        <motion.div
          variants={container}
          className="max-w-2xl mx-auto text-center"
        >
          {/* Title with gradient text */}
          <motion.h2
            id="why-title"
            variants={item}
            className="text-3xl sm:text-4xl font-bold mb-6"
          >
            <motion.span
              variants={item}
              className="bg-gradient-to-r from-pink-500 to-yellow-400 bg-clip-text text-transparent"
            >
              Why we built WalkTogether
            </motion.span>
            ?
          </motion.h2>

          {/* Paragraph 1 */}
          <motion.p
            variants={item}
            className="text-lg sm:text-xl text-gray-700 leading-relaxed mb-4"
          >
            Late-night walks can feel uneasy for anyone. We believed technology
            could ease that anxiety—even just a little.
          </motion.p>

          {/* Paragraph 2 */}
          <motion.p
            variants={item}
            className="text-lg sm:text-xl text-gray-700 leading-relaxed"
          >
            WalkTogether isn’t just an app. It’s about{" "}
            <span className="font-semibold">connection</span>—becoming one
            another’s safe path home.
          </motion.p>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
