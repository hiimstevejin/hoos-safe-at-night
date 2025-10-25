"use client";

import Link from "next/link";
import { motion } from "framer-motion";
// Next.js 13+ App Router에서는 로고에 Image를 사용하는 것이 좋습니다.
// import Image from "next/image";

import { useState } from "react";

export default function NavBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "About", href: "#about" },
    { name: "Safety", href: "#safety" },
    { name: "Log in", href: "/auth/login" },
  ];

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      // 스크롤 시 상단에 고정, 배경은 반투명 흰색 + 블러 효과
      className="w-full sticky top-0 left-0 z-50 bg-white/80 backdrop-blur-md"
    >
      <div className="mx-auto max-w-6xl px-4">
        <nav className="flex items-center justify-between h-16 sm:h-20">
          {/* 1. 로고 */}
          <Link
            href="/"
            className="text-2xl font-bold text-gray-900"
            title="Home"
          >
            WalkTogether
          </Link>

          {/* 2. 데스크탑 메뉴 */}
          <div className="hidden sm:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-600 hover:text-black transition-colors"
              >
                {link.name}
              </Link>
            ))}
            {/* "Get started" 버튼 (Hero 섹션과 동일한 스타일) */}
            <Link
              href="/auth/login"
              className="bg-pink-500 text-white font-medium px-5 py-2 rounded-full shadow-sm hover:bg-pink-600 transition-colors"
            >
              Get started
            </Link>
          </div>

          {/* 3. 모바일 메뉴 버튼 (햄버거) */}
          <div className="sm:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Open main menu"
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
            ></button>
          </div>
        </nav>
      </div>

      {/* 4. 모바일 메뉴 (드롭다운) */}
      {/* framer-motion을 사용하여 부드럽게 열리고 닫히게 할 수 있습니다.
        여기서는 간단하게 표시/숨김 처리했습니다.
      */}
      {isMobileMenuOpen && (
        <div className="sm:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-md shadow-lg border-t border-gray-100">
          <div className="flex flex-col gap-4 p-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-700 hover:text-black text-lg"
                onClick={() => setIsMobileMenuOpen(false)} // 클릭 시 메뉴 닫기
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/signup"
              className="bg-pink-500 text-white font-medium px-5 py-3 rounded-full text-center shadow-sm hover:bg-pink-600 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Get started
            </Link>
          </div>
        </div>
      )}
    </motion.header>
  );
}
