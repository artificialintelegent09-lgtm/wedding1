import type { InvitationData } from "@/types/invitation";
import { amelia_rafael } from "./amelia-rafael";

/** Every invitation the app serves. The key is the URL slug. */
const all: InvitationData[] = [amelia_rafael];

const bySlug = new Map(all.map((i) => [i.slug, i]));

/** Slug opened by the site root (`/`). */
export const DEFAULT_SLUG = amelia_rafael.slug;

export function getInvitation(slug: string): InvitationData | undefined {
  return bySlug.get(slug);
}

export function getAllSlugs(): string[] {
  return all.map((i) => i.slug);
}
