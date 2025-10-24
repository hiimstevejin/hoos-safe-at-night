"use client";

import { motion } from "framer-motion";
import Image from "next/image";

type IconItem = {
  src: string; // /public 경로
  alt: string;
  delay?: number; // float animation offset
};

// 6개의 아이콘이 포함된 배열 (제공해주신 대로)
const ICONS: IconItem[] = [
  {
    src: "/illustrations/image1.png",
    alt: "smile",
    delay: 0,
  },
  {
    src: "/illustrations/image2.png",
    alt: "wink",
    delay: 0.15,
  },
  {
    src: "/illustrations/image3.png",
    alt: "glasses",
    delay: 0.3,
  },
  {
    src: "/illustrations/image4.png",
    alt: "safety",
    delay: 0.45,
  },
  {
    src: "/illustrations/image5.png",
    alt: "pin",
    delay: 0.6,
  },
  {
    src: "/illustrations/image6.png", // 6번째 '도둑' 이미지
    alt: "thief", // alt를 'thief'로 변경하는 것을 권장합니다.
    delay: 0.6, // delay는 필요에 맞게 조정하세요.
  },
];

const float = (delay = 0) => ({
  initial: { y: -8, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: { delay, duration: 0.6, ease: "easeOut" },
  },
  whileInView: {
    y: [0, -6, 0],
    transition: {
      repeat: Infinity,
      repeatType: "mirror",
      duration: 3.2,
      delay,
    },
  },
});

export default function IconStrip() {
  // 아이콘 배열을 두 그룹으로 분리
  const friendlyIcons = ICONS.slice(0, 5); // 처음 5개 아이콘
  const thiefIcon = ICONS[5]; // 6번째 아이콘

  return (
    <section className="w-full">
      <div className="mx-auto max-w-6xl px-4">
        {/* [수정된 부분]
          1. flex-wrap -> flex-nowrap (줄바꿈 방지)
          2. justify-center -> justify-between (양쪽 끝으로 정렬)
          3. gap- 제거 (그룹별로 처리)
          4. py-2 sm:py-4 (이전 요청대로 간격 좁게 유지)
        */}
        <div className="flex items-center justify-between px-2 flex-nowrap py-2 sm:py-4">
          {/* 그룹 1: 겹쳐진 5개의 아이콘 (왼쪽 정렬) */}
          {/*
            [핵심] '-space-x-6' 클래스를 사용해 아이콘들이 겹치도록 설정
            (이미지 크기 80px 기준 -24px 겹침, 값은 원하는 만큼 조정하세요)
          */}
          <div className="flex -space-x-25">
            {friendlyIcons.map((i, idx) => (
              <motion.div
                key={idx}
                variants={float(i.delay)}
                initial="initial"
                animate="animate"
                whileInView="whileInView"
                whileHover={{ scale: 1.06, rotate: 2 }}
                className="flex items-center justify-center"
                title={i.alt}
              >
                <Image
                  src={i.src}
                  alt={i.alt}
                  width={180}
                  height={100}
                  priority={idx < 3}
                />
              </motion.div>
            ))}
          </div>

          {/* 그룹 2: '도둑' 아이콘 (오른쪽 정렬) */}
          {/* 6번째 아이콘이 존재할 경우에만 렌더링 */}
          {thiefIcon && (
            <motion.div
              key={5} // 6번째 아이콘의 index
              variants={float(thiefIcon.delay)}
              initial="initial"
              animate="animate"
              whileInView="whileInView"
              whileHover={{ scale: 1.06, rotate: 2 }}
              className="flex items-center justify-center"
              title={thiefIcon.alt}
            >
              <Image
                src={thiefIcon.src}
                alt={thiefIcon.alt}
                width={180}
                height={80}
                priority={false}
              />
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
