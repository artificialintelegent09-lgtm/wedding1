import { GoldDivider } from "@/components/ornaments/GoldDivider";
import { Reveal } from "@/components/motion/Reveal";

/** Script eyebrow, serif title and gold divider. `tone` picks colors for the surface it sits on. */
export function SectionHeading({
  eyebrow,
  title,
  tone = "dark",
  className = "",
}: {
  eyebrow: string;
  title: string;
  /** "dark" text for ivory sections, "light" text for burgundy sections. */
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <Reveal className={`text-center ${className}`}>
      <p className="font-script text-4xl leading-none text-gold-gradient sm:text-5xl">{eyebrow}</p>
      <h2
        className={`mt-3 font-display text-[1.75rem] font-medium uppercase tracking-[0.18em] sm:text-4xl ${
          tone === "dark" ? "text-primary" : "text-paper"
        }`}
      >
        {title}
      </h2>
      <GoldDivider className="mt-5" />
    </Reveal>
  );
}
