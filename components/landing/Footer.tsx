import Link from "next/link";
import { Instagram, Twitter, Github, Mail, Phone } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#45612a] text-slate-100 border-t border-black/5">
      {/* 상단: CTA + 브랜드 */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="space-y-6 text-center md:text-left">
          {/* CTA */}
          <div>
            <h3 className="text-2xl font-extrabold tracking-tight">
              Ready to walk safer?
            </h3>
            <p className="mt-1 text-slate-200/90">
              Join WalkTogether and make every trip home feel safer.
            </p>
          </div>

          {/* 브랜드 + 설명 */}
          <div>
            <Link href="/" className="inline-block">
              <span className="text-xl font-black tracking-tight">
                WalkTogether
              </span>
            </Link>
            <p className="mt-2 max-w-prose text-sm leading-relaxed text-slate-200/90">
              Safety through connection — walk home with confidence, together.
            </p>
          </div>

          {/* 연락처 */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-3 text-sm">
            <a
              href="mailto:hello@walktogether.app"
              className="inline-flex items-center hover:text-white"
            >
              <Mail className="h-4 w-4 mr-2 translate-y-[1px]" />
              hello@walktogether.app
            </a>
            <a
              href="tel:+14342270820"
              className="inline-flex items-center hover:text-white"
            >
              <Phone className="h-4 w-4 mr-2 translate-y-[1px]" />
              <span className="tabular-nums">+1 (434) 227-0820</span>
            </a>
          </div>
        </div>
      </div>

      {/* 중간: 소셜 아이콘 (하단에 위치) */}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex justify-center md:justify-end gap-4">
        <a
          aria-label="Twitter"
          href="#"
          className="rounded-full bg-white/10 p-2 hover:bg-white/20 transition"
        >
          <Twitter className="h-5 w-5" />
        </a>
        <a
          aria-label="Instagram"
          href="#"
          className="rounded-full bg-white/10 p-2 hover:bg-white/20 transition"
        >
          <Instagram className="h-5 w-5" />
        </a>
        <a
          aria-label="GitHub"
          href="#"
          className="rounded-full bg-white/10 p-2 hover:bg-white/20 transition"
        >
          <Github className="h-5 w-5" />
        </a>
      </div>

      {/* 하단: 카피라이트 */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 py-5">
            <p className="text-xs text-slate-200/75 text-center md:text-left">
              © {year} HoosSafeAtNight. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-200/75">
              <Link href="#privacy" className="hover:text-slate-100">
                Privacy
              </Link>
              <span className="opacity-40">•</span>
              <Link href="#terms" className="hover:text-slate-100">
                Terms
              </Link>
              <span className="opacity-40">•</span>
              <Link href="#cookies" className="hover:text-slate-100">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
