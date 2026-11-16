import type { ComponentType } from "react";
import type { InvitationData, TemplateId } from "@/types/invitation";
import { RoyalRomanceTemplate } from "./royal-romance/RoyalRomanceTemplate";

export interface TemplateProps {
  data: InvitationData;
}

/**
 * Every visual design is one entry here. A template receives the same
 * `InvitationData` contract, so new designs (Ivory Bloom, Editorial Love...)
 * plug in without any change to content, routing or the API.
 */
export const templates: Record<TemplateId, ComponentType<TemplateProps>> = {
  "royal-romance": RoyalRomanceTemplate,
};
