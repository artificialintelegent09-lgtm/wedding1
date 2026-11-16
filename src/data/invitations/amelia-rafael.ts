import type { InvitationData } from "@/types/invitation";

/**
 * Demo invitation for the Royal Romance template.
 *
 * To create a real invitation: copy this file, change the values, point the
 * images at real photos in /public, then register it in ../registry.ts.
 * All names, numbers and addresses below are fictional sample content.
 */
const img = (name: string, w: number, h: number, alt: string, focal?: string) => ({
  src: `/images/demo/${name}.jpg`,
  width: w,
  height: h,
  alt,
  focal,
});

export const amelia_rafael: InvitationData = {
  slug: "amelia-rafael",
  templateId: "royal-romance",
  locale: "en",
  meta: {
    title: "Amelia & Rafael — Wedding Invitation",
    description:
      "Together with their families, Amelia and Rafael joyfully invite you to celebrate their wedding on Saturday, 20 March 2027.",
    ogImage: "/images/demo/og.jpg",
  },
  couple: {
    monogram: "A&R",
    bride: {
      role: "bride",
      nickname: "Amelia",
      fullName: "Amelia Putri Wijaya",
      childOf: "The eldest daughter of",
      fatherName: "Mr. Hendra Wijaya",
      motherName: "Mrs. Sari Dewi Wijaya",
      photo: img("bride", 1000, 1300, "Portrait of the bride", "50% 40%"),
      instagram: "amelia.wijaya",
    },
    groom: {
      role: "groom",
      nickname: "Rafael",
      fullName: "Rafael Adhitama Pratama",
      childOf: "The second son of",
      fatherName: "Mr. Bambang Pratama",
      motherName: "Mrs. Lestari Pratama",
      photo: img("groom", 1000, 1300, "Portrait of the groom", "50% 40%"),
      instagram: "rafael.pratama",
    },
  },
  weddingDate: "2027-03-20T08:00:00+07:00",
  images: {
    cover: img("cover", 900, 1200, "Golden light through an arched doorway"),
    hero: img("hero", 1600, 2000, "The couple beneath a golden arch", "50% 45%"),
    closing: img("closing", 1800, 1200, "Golden hour glow with soft florals"),
  },
  intro: {
    quote:
      "And among His signs is that He created for you mates from among yourselves, that you may find tranquility in them, and He placed between you affection and mercy.",
    quoteSource: "Ar-Rum 30:21",
    message:
      "With the blessing of God and the love of our families, we joyfully invite you to witness and celebrate the beginning of our new life together.",
  },
  events: [
    {
      id: "akad",
      kind: "akad",
      title: "Akad Nikah",
      startsAt: "2027-03-20T08:00:00+07:00",
      endsAt: "2027-03-20T10:00:00+07:00",
      timeZone: "Asia/Jakarta",
      timezoneLabel: "WIB",
      venue: {
        name: "The Garden Terrace",
        placeName: "Hotel Indonesia Kempinski Jakarta",
        address: "Hotel Indonesia Kempinski, Jl. M.H. Thamrin No. 1, Menteng, Jakarta Pusat 10310",
        city: "Jakarta",
        mapsUrl:
          "https://www.google.com/maps/search/?api=1&query=Hotel+Indonesia+Kempinski+Jakarta",
        mapsQuery: "Hotel Indonesia Kempinski Jakarta",
      },
      note: "Immediate family and close relatives.",
      dressCode: "Soft ivory & champagne",
    },
    {
      id: "reception",
      kind: "reception",
      title: "Wedding Reception",
      startsAt: "2027-03-20T18:00:00+07:00",
      endsAt: "2027-03-20T21:30:00+07:00",
      timeZone: "Asia/Jakarta",
      timezoneLabel: "WIB",
      venue: {
        name: "Grand Ballroom",
        placeName: "Hotel Indonesia Kempinski Jakarta",
        address: "Hotel Indonesia Kempinski, Jl. M.H. Thamrin No. 1, Menteng, Jakarta Pusat 10310",
        city: "Jakarta",
        mapsUrl:
          "https://www.google.com/maps/search/?api=1&query=Hotel+Indonesia+Kempinski+Jakarta",
        mapsQuery: "Hotel Indonesia Kempinski Jakarta",
      },
      note: "Dinner and celebration to follow.",
      dressCode: "Black tie · Burgundy & gold",
    },
  ],
  gallery: [
    { ...img("gallery-1", 1000, 1333, "Light falling through an arch at dusk"), layout: "tall" },
    { ...img("gallery-2", 1400, 1000, "Ivory arch in soft morning light"), layout: "wide" },
    { ...img("gallery-3", 1000, 1000, "Burgundy and blush roses in bloom"), layout: "square" },
    { ...img("gallery-4", 1000, 1400, "Blush tones and roses"), layout: "tall" },
    { ...img("gallery-5", 1500, 1000, "Golden hour bokeh"), layout: "wide" },
    { ...img("gallery-6", 1000, 1400, "Deep burgundy archway"), layout: "tall" },
    { ...img("gallery-7", 1000, 1000, "Blush rose on ivory"), layout: "square" },
    { ...img("gallery-8", 1400, 1000, "Garden flowers in soft focus"), layout: "wide" },
    { ...img("gallery-9", 1000, 1333, "Candlelit arch in wine tones"), layout: "tall" },
  ],
  story: [
    {
      date: "June 2018",
      title: "The First Hello",
      body: "A mutual friend's birthday dinner, a shared love of old jazz records, and a conversation that somehow lasted until the restaurant closed.",
      image: img("story-1", 900, 900, "Ivory arch in morning light"),
    },
    {
      date: "December 2020",
      title: "Our First Journey",
      body: "Rain-soaked streets, missed trains and a hundred laughs. It was the trip that taught us home isn't a place, it's each other.",
      image: img("story-2", 900, 900, "Golden dusk bokeh"),
    },
    {
      date: "September 2025",
      title: "The Proposal",
      body: "Under a canopy of fairy lights, with a ring hidden inside a book of our favourite poems, Rafael asked the question. Amelia said yes before he finished.",
      image: img("story-3", 900, 900, "Soft roses in bloom"),
    },
    {
      date: "March 2027",
      title: "Forever Begins",
      body: "Surrounded by the people we love most, we step into the next chapter, and we would be honoured to have you beside us.",
      image: img("story-4", 900, 900, "Burgundy archway"),
    },
  ],
  gift: {
    message:
      "Your presence is the greatest gift. Should you wish to bless us further, you may send a gift through the accounts below.",
    accounts: [
      { bank: "BCA", accountNumber: "1234567890", accountHolder: "Amelia Putri Wijaya" },
      { bank: "Bank Mandiri", accountNumber: "1230009876543", accountHolder: "Rafael Adhitama Pratama" },
    ],
    address: {
      recipient: "Amelia & Rafael",
      address: "Jl. Kemang Raya No. 18, Jakarta Selatan 12730",
    },
  },
  rsvp: {
    // Replies are sent to this WhatsApp number (international format). SAMPLE number: replace it.
    whatsappNumber: "6281234567890",
    maxGuests: 4,
    deadline: "2027-03-01",
    message: "Your confirmation helps us prepare a seat and a place setting for you.",
  },
  wishes: {
    // Optional: an https link to your own Google Form (or similar). When set, the guestbook
    // card opens it. When omitted, guests send their wishes by WhatsApp (to the RSVP number
    // unless `whatsappNumber` is set here).
    // formUrl: "https://forms.gle/your-form-id",
    //
    // Messages you want shown on the invitation. There is no database: copy the wishes you
    // receive here and redeploy.
    featured: [
      {
        name: "Aunt Maya & Uncle Dimas",
        message: "May your home be filled with laughter, patience and endless cups of tea. We are so happy for you both.",
        date: "2027-01-12",
      },
      {
        name: "Nadia Kusuma",
        message: "Amelia, you glow every time you speak of Rafael. Wishing you a lifetime of exactly that. Can't wait to dance!",
        date: "2027-01-15",
      },
      {
        name: "Reza & Tika",
        message: "Congratulations, you two! Here's to adventures, quiet Sunday mornings and growing old together.",
        date: "2027-01-20",
      },
      {
        name: "Pak Hendro",
        message: "Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Barakallah untuk kalian berdua.",
        date: "2027-02-02",
      },
    ],
  },
  closing: {
    message:
      "It is our honour to share this day with you. Your presence, your prayers and your warm wishes will be a treasured part of our story.",
    signature: "With love & gratitude",
  },
};
