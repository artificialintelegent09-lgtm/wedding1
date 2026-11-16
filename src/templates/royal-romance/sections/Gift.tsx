import { Gift as GiftIcon } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { CopyButton } from "@/components/ui/CopyButton";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { BankAccount } from "@/types/invitation";
import type { SectionProps } from "./types";

/** Groups digits for readability: "1234567890" → "1234 5678 90". Copying still uses the raw number. */
const spaced = (n: string) => n.replace(/\s+/g, "").replace(/(.{4})/g, "$1 ").trim();

function BankCard({ account, copy }: { account: BankAccount; copy: SectionProps["copy"] }) {
  return (
    <div className="relative mx-auto w-full max-w-md overflow-hidden border border-gold/70 bg-[linear-gradient(135deg,#fbf3e4_0%,#efe0c6_100%)] p-6 text-left shadow-[0_30px_60px_-25px_rgba(0,0,0,0.6)] sm:p-8">
      <div className="pointer-events-none absolute inset-[6px] border border-gold-deep/25" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full border border-gold-deep/20" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 rounded-full border border-gold-deep/20" aria-hidden="true" />

      <div className="relative flex items-start justify-between">
        <p className="font-display text-2xl font-semibold uppercase tracking-[0.18em] text-primary">{account.bank}</p>
        {/* card chip */}
        <svg viewBox="0 0 40 30" className="h-8 w-11" aria-hidden="true">
          <rect x="1" y="1" width="38" height="28" rx="5" fill="url(#chip)" stroke="#9a7632" strokeWidth="1" />
          <defs>
            <linearGradient id="chip" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0" stopColor="#ecd6a0" />
              <stop offset="1" stopColor="#b8913f" />
            </linearGradient>
          </defs>
          <path d="M1 10h38M1 20h38M14 1v28M26 1v28" stroke="#9a7632" strokeWidth=".7" fill="none" opacity=".7" />
        </svg>
      </div>

      <p className="relative mt-8 break-all font-display text-[1.65rem] font-medium tabular-nums tracking-[0.12em] text-ink sm:text-3xl" aria-label={account.accountNumber.split("").join(" ")}>
        {spaced(account.accountNumber)}
      </p>

      <div className="relative mt-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[0.65rem] font-light uppercase tracking-[0.3em] text-muted">{copy.gift.accountHolder}</p>
          <p className="mt-1 font-display text-lg font-semibold uppercase tracking-[0.1em] text-primary">
            {account.accountHolder}
          </p>
        </div>
        <CopyButton value={account.accountNumber.replace(/\s+/g, "")} bank={account.bank} />
      </div>
    </div>
  );
}

export function Gift({ data, copy }: SectionProps) {
  const gift = data.gift;
  if (!gift) return null;

  return (
    <section id="gift" className="relative isolate overflow-hidden bg-primary bg-damask px-5 py-24 text-paper sm:py-32">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(123,32,56,0.6),transparent_70%)]" aria-hidden="true" />
      <div className="mx-auto max-w-4xl">
        <SectionHeading eyebrow={copy.gift.eyebrow} title={copy.gift.title} tone="light" />

        <Reveal className="mx-auto mt-8 max-w-xl text-center">
          <p className="font-display text-xl italic leading-relaxed text-paper/85 sm:text-2xl">{gift.message}</p>
        </Reveal>

        <div className={`mt-12 grid gap-8 ${gift.accounts.length > 1 ? "md:grid-cols-2" : ""}`}>
          {gift.accounts.map((account, i) => (
            <Reveal key={`${account.bank}-${account.accountNumber}`} delay={i * 0.12} y={36}>
              <BankCard account={account} copy={copy} />
            </Reveal>
          ))}
        </div>

        {gift.address && (
          <Reveal className="mx-auto mt-12 max-w-md border border-gold/50 px-6 py-7 text-center" delay={0.1}>
            <GiftIcon className="mx-auto h-6 w-6 text-gold" strokeWidth={1.2} aria-hidden="true" />
            <p className="mt-3 text-xs font-light uppercase tracking-[0.3em] text-gold-light">{copy.gift.sendTo}</p>
            <p className="mt-2 font-display text-xl font-semibold text-paper">{gift.address.recipient}</p>
            <p className="mt-1 font-light leading-relaxed text-paper/75">{gift.address.address}</p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
