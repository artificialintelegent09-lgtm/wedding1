import { getRsvpChannel, showWishes } from "@/lib/contact";
import { getCopy } from "@/lib/i18n";
import type { InvitationData } from "@/types/invitation";
import { Shell } from "./Shell";
import { Closing } from "./sections/Closing";
import { Couple } from "./sections/Couple";
import { Events } from "./sections/Events";
import { Gallery } from "./sections/Gallery";
import { Gift } from "./sections/Gift";
import { Hero } from "./sections/Hero";
import { Intro } from "./sections/Intro";
import { Location } from "./sections/Location";
import { Rsvp } from "./sections/Rsvp";
import { Story } from "./sections/Story";
import { Wishes } from "./sections/Wishes";

/**
 * Royal Romance: burgundy, gold and ivory with lush rose ornaments.
 * Section order lives here, so a variant of this design can reorder or drop
 * sections without touching any section's code.
 */
export function RoyalRomanceTemplate({ data }: { data: InvitationData }) {
  const props = { data, copy: getCopy(data.locale) };

  return (
    <Shell data={data}>
      <Hero />
      <Intro {...props} />
      <Couple {...props} />
      <Events {...props} />
      <Location {...props} />
      <Gallery />
      {data.story && data.story.length > 0 && <Story />}
      {data.gift && <Gift {...props} />}
      {getRsvpChannel(data) && <Rsvp {...props} />}
      {showWishes(data) && <Wishes {...props} />}
      <Closing {...props} />
    </Shell>
  );
}
