"use client";

import { createContext, useContext } from "react";
import type { Copy } from "@/lib/i18n";
import type { InvitationData } from "@/types/invitation";

interface InvitationContextValue {
  data: InvitationData;
  copy: Copy;
  /** True once the guest has opened the cover. Entrance animations wait for it. */
  opened: boolean;
  /** Personalised guest name from `?to=`, or "" when absent. */
  guestName: string;
}

export const InvitationContext = createContext<InvitationContextValue | null>(null);

export function useInvitation(): InvitationContextValue {
  const ctx = useContext(InvitationContext);
  if (!ctx) throw new Error("useInvitation must be used inside an InvitationContext provider");
  return ctx;
}
