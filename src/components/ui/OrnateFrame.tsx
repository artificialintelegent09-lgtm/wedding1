"use client";

import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { luxe } from "@/lib/motion";

const FLOURISH = "M1 23V9C1 4.6 4.6 1 9 1h14M6 23V12c0-3.3 2.7-6 6-6h11";

function Corner({ className }: { className: string }) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      className={`absolute h-6 w-6 text-gold ${className}`}
      initial={{ opacity: 0, scale: 0.4 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: luxe, delay: 0.7 }}
      aria-hidden="true"
    >
      <path d={FLOURISH} fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <circle cx="1.5" cy="1.5" r="1.5" fill="currentColor" />
    </motion.svg>
  );
}

/**
 * A double gold border that unfolds from the centre, with flourished corners.
 * Wrap any card-like content with it.
 */
export function OrnateFrame({
  children,
  className = "",
  innerClassName = "",
}: {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
}) {
  // Observe the unclipped wrapper: a clipped element can never report itself as in view.
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  const reveal = {
    initial: { clipPath: "inset(50% 50% 50% 50%)" },
    animate: { clipPath: inView ? "inset(0% 0% 0% 0%)" : "inset(50% 50% 50% 50%)" },
  } as const;

  return (
    <div ref={ref} className={`relative ${className}`}>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 border border-gold/70"
        {...reveal}
        transition={{ duration: 1.3, ease: luxe }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[7px] border border-gold/35"
        {...reveal}
        transition={{ duration: 1.3, ease: luxe, delay: 0.15 }}
      />
      <Corner className="-left-px -top-px" />
      <Corner className="-right-px -top-px rotate-90" />
      <Corner className="-bottom-px -right-px rotate-180" />
      <Corner className="-bottom-px -left-px -rotate-90" />
      <div className={`relative ${innerClassName}`}>{children}</div>
    </div>
  );
}
