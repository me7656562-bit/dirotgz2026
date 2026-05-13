import type { WalkDistance } from "@/generated/prisma/enums";

const walkDistanceHe: Record<WalkDistance, string> = {
  upTo10: "עד 10 דקות הליכה מבית הכנסת",
  upTo20: "עד 20 דקות הליכה מבית הכנסת",
  over20: "יותר מ-20 דקות הליכה מבית הכנסת",
};

export function walkDistanceLabel(d: WalkDistance): string {
  return walkDistanceHe[d];
}

export function parseWalkDistance(raw: string | undefined): WalkDistance | null {
  if (raw === "upTo10" || raw === "upTo20" || raw === "over20") return raw;
  return null;
}
