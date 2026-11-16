/**
 * The invitation data contract.
 *
 * Everything a customer would personalise lives in one `InvitationData`
 * object. Templates only ever read from this shape, so a new design can be
 * built without touching content, and new content can be produced without
 * touching a design.
 */

export type Locale = "en" | "id";

/** Identifier of a visual design in `src/templates/registry.ts`. */
export type TemplateId = "royal-romance";

export interface ImageAsset {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** CSS `object-position`, e.g. "50% 30%" to keep faces in frame when cropped. */
  focal?: string;
}

export interface Person {
  role: "bride" | "groom";
  /** Name used in headlines, e.g. "Alessandra". */
  nickname: string;
  fullName: string;
  /** Short line about the person, e.g. "The eldest daughter of". */
  childOf: string;
  fatherName: string;
  motherName: string;
  photo: ImageAsset;
  instagram?: string;
}

export interface Venue {
  /** Hall or room, e.g. "Grand Ballroom". */
  name: string;
  /** Building or complex shared by several events, e.g. a hotel. Falls back to `name`. */
  placeName?: string;
  address: string;
  city?: string;
  /** Opens in Google Maps (any share link or search URL). */
  mapsUrl: string;
  /** Free-text query or "lat,lng" used for the keyless Google Maps embed. */
  mapsQuery: string;
}

export interface WeddingEvent {
  id: string;
  kind: "akad" | "reception" | "ceremony" | "other";
  title: string;
  /** ISO 8601 with a UTC offset, e.g. "2027-03-20T08:00:00+07:00". */
  startsAt: string;
  endsAt: string;
  /** Display timezone label, e.g. "WIB". */
  timezoneLabel?: string;
  /** IANA zone used to format the date/time for display. */
  timeZone: string;
  venue: Venue;
  note?: string;
  dressCode?: string;
}

export interface BankAccount {
  bank: string;
  accountNumber: string;
  accountHolder: string;
}

export interface StoryMoment {
  date: string;
  title: string;
  body: string;
  image?: ImageAsset;
}

export interface FeaturedWish {
  name: string;
  message: string;
  /** ISO date (YYYY-MM-DD), optional. */
  date?: string;
  /**
   * Mark placeholder messages. They are shown with a visible "Sample" tag so nobody
   * mistakes them for real guest messages. Remove the flag once a message is a real one.
   */
  sample?: boolean;
}

export interface GalleryImage extends ImageAsset {
  /** Layout hint for the editorial grid. */
  layout?: "tall" | "wide" | "square";
}

export interface InvitationData {
  /** URL segment: `/{slug}`. Also the key under which RSVPs and wishes are stored. */
  slug: string;
  templateId: TemplateId;
  locale: Locale;
  meta: {
    title: string;
    description: string;
    ogImage: string;
  };
  couple: {
    bride: Person;
    groom: Person;
    /** Letters in the monogram, e.g. "A&E". */
    monogram: string;
  };
  /** Primary date used for hero, countdown and closing. ISO 8601 with offset. */
  weddingDate: string;
  images: {
    cover: ImageAsset;
    hero: ImageAsset;
    closing: ImageAsset;
  };
  intro: {
    /** Short blessing or verse shown after the hero. */
    quote: string;
    quoteSource?: string;
    message: string;
  };
  events: WeddingEvent[];
  gallery: GalleryImage[];
  story?: StoryMoment[];
  gift?: {
    message: string;
    accounts: BankAccount[];
    /** Optional physical delivery address for gifts. */
    address?: { recipient: string; address: string };
  };
  /**
   * RSVP is sent through WhatsApp: the guest's reply is prefilled into a chat
   * with `whatsappNumber`. Omit this block to hide the RSVP section.
   */
  rsvp?: {
    /** International format, digits only or with separators: "6281234567890" / "+62 812-3456-7890". */
    whatsappNumber: string;
    /** Guests per response, including the respondent. */
    maxGuests: number;
    /** ISO date (YYYY-MM-DD). Shown as a reminder only; nothing enforces it. */
    deadline?: string;
    message?: string;
  };
  /**
   * Wishes are collected outside the site (there is no backend). Priority:
   *  1. `formUrl`: an https link to e.g. a Google Form, opened in a new tab.
   *  2. WhatsApp: a prefilled message to `whatsappNumber` (falls back to the RSVP number).
   * `featured` are messages the couple chose to display on the invitation.
   */
  wishes?: {
    formUrl?: string;
    whatsappNumber?: string;
    featured?: FeaturedWish[];
  };
  closing: {
    message: string;
    signature: string;
  };
}
