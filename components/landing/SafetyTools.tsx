"use client";
import { motion, useAnimation, useInView } from "framer-motion";
import { useEffect, useRef } from "react";
import { BadgeCheck, Search, MapPin, Phone, Gavel } from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.18, delayChildren: 0.1 },
  },
} as const;

const item = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
} as const;

// 필요 개수만 남겨 사용하세요 (예: 3개만 보여줄 때는 상위 3개만)
const tools = [
  { icon: BadgeCheck, label: "background checks" },
  { icon: MapPin, label: "sex offender search" },
  { icon: Phone, label: "phone number lookup" },
] as const;

export default function SafetyTools() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, {
    once: true,
    amount: 0.55,
    margin: "0px 0px -25% 0px",
  });
  const controls = useAnimation();
  useEffect(() => {
    if (inView) controls.start("visible");
  }, [inView, controls]);

  return (
    <motion.section
      id="safety"
      ref={ref}
      variants={container}
      initial="hidden"
      animate={controls}
      className="w-full py-20 sm:py-28"
      aria-labelledby="safety-tools-title"
    >
      {/* 섹션 컨테이너: 항상 화면 중앙에 고정 */}
      <div className="mx-auto max-w-7xl px-4">
        {/* 타이틀 */}
        <motion.h2
          id="safety-tools-title"
          variants={item}
          className="text-center text-3xl sm:text-4xl font-extrabold tracking-tight mb-10"
        >
          <span className="mr-2">OUR</span>
          <span className="inline-block rounded-xl border border-black/10 bg-lime-300 px-3 py-1 shadow-[0_2px_0_rgba(0,0,0,0.3)]">
            <span className="tracking-wider text-3xl sm:text-4xl font-black">
              SAFETY
            </span>
          </span>
          <span className="ml-2">TOOLS</span>
        </motion.h2>

        {/* 아이콘 행: 항상 중앙 정렬 */}
        <motion.ul
          variants={container}
          className="
            mx-auto max-w-5xl
            flex flex-wrap justify-center
            gap-x-16 gap-y-10
          "
        >
          {tools.slice(0, 5).map(({ icon: Icon, label }) => (
            <motion.li
              key={label}
              variants={item}
              className="w-[180px] flex flex-col items-center text-center"
            >
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-lime-300 shadow-md">
                <Icon aria-hidden className="h-12 w-12" />
              </div>
              <p className="mt-3 text-base sm:text-lg font-medium text-gray-800">
                {label}
              </p>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </motion.section>
  );
}
