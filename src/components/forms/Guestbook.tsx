"use client";

import { ExternalLink, MessageCircle, MessageCircleHeart, Quote } from "lucide-react";
import { useId, useState, type FormEvent } from "react";
import { useInvitation } from "@/components/InvitationContext";
import { Reveal } from "@/components/motion/Reveal";
import { getWishChannel, whatsAppUrl } from "@/lib/contact";
import { formatShortDate } from "@/lib/datetime";
import { fieldMessage } from "@/lib/form-messages";
import { clean, LIMITS, validateWish, type FieldErrors } from "@/lib/validation";
import type { FeaturedWish } from "@/types/invitation";
import { Field, inputClass, SubmitButton } from "./fields";

const primaryLink =
  "inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-full bg-primary px-8 text-sm font-medium uppercase tracking-[0.2em] text-gold-light transition-colors hover:bg-primary-soft";

/** Opens WhatsApp in a new tab; if the browser blocks the popup, navigates this tab instead. */
function openWhatsApp(url: string) {
  const win = window.open(url, "_blank");
  if (win) win.opener = null;
  else window.location.assign(url);
}

/** Fallback when no external form is configured: compose a wish, hand it to WhatsApp. */
function WhatsAppWishForm({ number }: { number: string }) {
  const { data, copy, guestName } = useInvitation();
  const uid = useId();
  const [typedName, setTypedName] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [handoffUrl, setHandoffUrl] = useState<string | null>(null);

  const name = typedName ?? guestName;
  const err = (f: string) => (errors[f] ? fieldMessage(errors[f], f, copy) : undefined);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const found = validateWish({ name, message });
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const { bride, groom } = data.couple;
    const url = whatsAppUrl(
      number,
      copy.wishes.whatsappMessage({
        couple: `${bride.nickname} & ${groom.nickname}`,
        name: clean(name),
        message: clean(message),
      }),
    );
    setHandoffUrl(url);
    openWhatsApp(url);
  }

  if (handoffUrl) {
    return (
      <div className="text-center" role="status">
        <MessageCircle className="mx-auto h-10 w-10 text-gold-deep" strokeWidth={1.2} aria-hidden="true" />
        <p className="mx-auto mt-4 max-w-xs font-light leading-relaxed text-ink/80">{copy.wishes.handoff}</p>
        <a href={handoffUrl} target="_blank" rel="noopener noreferrer" className={`${primaryLink} mt-6`}>
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          {copy.wishes.openAgain}
        </a>
        <button
          type="button"
          onClick={() => {
            setHandoffUrl(null);
            setMessage("");
          }}
          className="mt-4 min-h-11 text-xs font-medium uppercase tracking-[0.2em] text-gold-deep underline underline-offset-4 hover:text-primary"
        >
          {copy.rsvp.edit}
        </button>
      </div>
    );
  }

  const left = LIMITS.wishMax - message.length;

  return (
    <form onSubmit={onSubmit} noValidate className="text-left">
      <Field id={`${uid}-name`} label={copy.wishes.name} error={err("name")}>
        <input
          id={`${uid}-name`}
          type="text"
          name="name"
          autoComplete="name"
          maxLength={LIMITS.nameMax + 20}
          placeholder={copy.wishes.namePlaceholder}
          value={name}
          onChange={(e) => setTypedName(e.target.value)}
          aria-invalid={!!errors.name}
          aria-describedby={`${uid}-name-error`}
          className={inputClass}
        />
      </Field>

      <Field
        id={`${uid}-msg`}
        label={copy.wishes.message}
        error={err("message")}
        hint={copy.wishes.remaining(left)}
      >
        <textarea
          id={`${uid}-msg`}
          name="message"
          rows={4}
          maxLength={LIMITS.wishMax + 50}
          placeholder={copy.wishes.messagePlaceholder}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          aria-invalid={!!errors.message}
          aria-describedby={`${uid}-msg-error`}
          className={`${inputClass} resize-none`}
        />
      </Field>

      <SubmitButton idle={copy.wishes.submit} icon={<MessageCircle className="h-4 w-4" aria-hidden="true" />} />
      <p className="mt-4 text-center text-xs font-light leading-relaxed tracking-wide text-muted">
        {copy.wishes.channelHint}
      </p>
    </form>
  );
}

function ExternalFormCard({ url }: { url: string }) {
  const { copy } = useInvitation();
  return (
    <div className="text-center">
      <MessageCircleHeart className="mx-auto h-10 w-10 text-gold-deep" strokeWidth={1.2} aria-hidden="true" />
      <h3 className="mt-3 font-display text-2xl font-semibold uppercase tracking-[0.14em] text-primary">
        {copy.wishes.cardTitle}
      </h3>
      <p className="mx-auto mt-3 max-w-xs font-light leading-relaxed text-ink/80">{copy.wishes.formIntro}</p>
      <a href={url} target="_blank" rel="noopener noreferrer" className={`${primaryLink} mt-6`}>
        <ExternalLink className="h-4 w-4" aria-hidden="true" />
        {copy.wishes.openForm}
      </a>
      <p className="mt-4 text-xs font-light tracking-wide text-muted">{copy.wishes.formNote}</p>
    </div>
  );
}

function WishCard({ wish, index }: { wish: FeaturedWish; index: number }) {
  const { data } = useInvitation();
  return (
    <li className="list-none">
      <Reveal delay={(index % 2) * 0.08} y={24} className="h-full">
        <div className="relative h-full border border-gold-deep/30 bg-white/50 p-5 shadow-[0_10px_30px_-18px_rgba(91,18,36,0.35)]">
        <Quote className="absolute right-4 top-4 h-6 w-6 rotate-180 text-gold/40" strokeWidth={1.2} aria-hidden="true" />
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary font-display text-lg text-gold-light ring-1 ring-gold/60 ring-offset-2 ring-offset-paper"
          >
            {wish.name.trim().charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="truncate font-display text-lg font-semibold leading-tight text-primary">{wish.name}</p>
            {wish.date && (
              <time dateTime={wish.date} className="text-xs font-light uppercase tracking-[0.16em] text-muted">
                {formatShortDate(wish.date, data.locale)}
              </time>
            )}
          </div>
        </div>
        <p className="mt-3 whitespace-pre-line break-words font-display text-[1.15rem] italic leading-relaxed text-ink/90">
          {wish.message}
        </p>
        </div>
      </Reveal>
    </li>
  );
}

/**
 * Guestbook without a backend: a way to *send* wishes (external form, or WhatsApp),
 * and a wall of messages the couple chose to feature in the invitation's data file.
 */
export function Guestbook() {
  const { data } = useInvitation();
  const channel = getWishChannel(data);
  const featured = data.wishes?.featured ?? [];

  const composer = channel && (
    <div className="relative border border-gold-deep/40 bg-paper p-6 shadow-[0_20px_50px_-30px_rgba(91,18,36,0.5)] sm:p-8">
      <div className="pointer-events-none absolute inset-[6px] border border-gold/30" aria-hidden="true" />
      <div className="relative">
        {channel.kind === "form" ? <ExternalFormCard url={channel.url} /> : <WhatsAppWishForm number={channel.number} />}
      </div>
    </div>
  );

  if (featured.length === 0) {
    return <div className="mx-auto max-w-md">{composer}</div>;
  }

  return (
    <div className={`mx-auto grid max-w-6xl gap-10 ${channel ? "lg:grid-cols-[minmax(0,26rem)_1fr] lg:gap-16" : ""}`}>
      {composer && <div className="lg:sticky lg:top-8 lg:self-start">{composer}</div>}
      <ul className={`grid min-w-0 gap-4 sm:grid-cols-2 ${channel ? "lg:grid-cols-1 xl:grid-cols-2" : ""}`}>
        {featured.map((wish, i) => (
          <WishCard key={`${wish.name}-${i}`} wish={wish} index={i} />
        ))}
      </ul>
    </div>
  );
}
