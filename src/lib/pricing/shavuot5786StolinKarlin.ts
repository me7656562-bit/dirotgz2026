/**
 * תקנון שכירות דירות — חג השבועות תשפ"ו — מרכז סטאלין קארלין.
 * מחיר בסיס לפי טבלה: מרחק הליכה, מספר חדרים (כולל סלון), מספר מיטות (2–15).
 * המקדמים לפי שורות (1)–(7) במסמך; סכום "חסר ציוד" הוא לפחות 100 ₪ — כאן 100 ₪ לפריט לוגי אחד (סימון אחד).
 */

export type WalkDistance = "upTo10" | "upTo20" | "over20";

export type RoomBand = "upTo3" | "upTo4" | "fivePlus";

const BASE_BY_CELL: Record<
  WalkDistance,
  Record<RoomBand, { intercept: number; perExtraBed: number }>
> = {
  upTo10: {
    upTo3: { intercept: 970, perExtraBed: 160 },
    upTo4: { intercept: 1060, perExtraBed: 160 },
    fivePlus: { intercept: 1150, perExtraBed: 160 },
  },
  upTo20: {
    upTo3: { intercept: 880, perExtraBed: 140 },
    upTo4: { intercept: 960, perExtraBed: 140 },
    fivePlus: { intercept: 1040, perExtraBed: 140 },
  },
  over20: {
    upTo3: { intercept: 770, perExtraBed: 100 },
    upTo4: { intercept: 830, perExtraBed: 100 },
    fivePlus: { intercept: 890, perExtraBed: 110 },
  },
};

export function roomBand(rooms: number): RoomBand {
  const r = Number.isFinite(rooms) ? Math.round(rooms) : 0;
  if (r <= 3) return "upTo3";
  if (r === 4) return "upTo4";
  /* עמודה שלישית בטבלה: "5 ומעלה" — כולל דירה עם בדיוק 5 חדרים */
  return "fivePlus";
}

export function clampInt(n: number, min: number, max: number): number {
  if (!Number.isFinite(n)) return min;
  return Math.min(max, Math.max(min, Math.round(n)));
}

export type AdjustmentFlags = {
  /** חסר פריט בסיסי — הפחתה של לפחות 100 ₪ (ממומש כ-100 ₪) */
  missingBasicItem: boolean;
  /** אין מיזוג בכל החדרים */
  notFullAirConditioning: boolean;
  /** מזרונים שהמשכיר מספק — +100 ₪ כל אחד */
  landlordMattresses: number;
  /** מזרונים שהשוכר מביא — +50 ₪ כל אחד */
  renterMattresses: number;
};

export type PriceLine = { label: string; amount: number };

export type Shavuot5786Computation = {
  base: number;
  lines: PriceLine[];
  total: number;
  warnings: string[];
};

export function computeBaseNis(
  beds: number,
  distance: WalkDistance,
  rooms: number
): { value: number; warnings: string[] } {
  const warnings: string[] = [];
  let b = beds;
  if (!Number.isFinite(b) || b < 2) {
    warnings.push("מספר המיטות מחוץ לטבלה (הטבלה מתחילה ב-2 מיטות). מוצג חישוב ל-2 מיטות.");
    b = 2;
  } else if (b > 15) {
    warnings.push("מספר המיטות מחוץ לטבלה (הטבלה עד 15 מיטות). מוצג חישוב ל-15 מיטות.");
    b = 15;
  } else {
    b = Math.round(b);
  }

  const band = roomBand(rooms);
  const { intercept, perExtraBed } = BASE_BY_CELL[distance][band];
  const value = intercept + (b - 2) * perExtraBed;
  return { value, warnings };
}

export function computeShavuot5786Total(
  beds: number,
  distance: WalkDistance,
  rooms: number,
  flags: AdjustmentFlags
): Shavuot5786Computation {
  const { value: base, warnings: w1 } = computeBaseNis(beds, distance, rooms);
  const lines: PriceLine[] = [{ label: "מחיר בסיס לפי טבלת התקנון", amount: base }];

  if (flags.missingBasicItem) {
    lines.push({
      label: "חסר ציוד בסיסי (הנחה של לפחות 100 ₪ — לפי הסימון)",
      amount: -100,
    });
  }
  const lm = clampInt(flags.landlordMattresses, 0, 50);
  if (lm > 0) {
    lines.push({ label: `מזרון מהמשכיר (${lm} × 100 ₪)`, amount: lm * 100 });
  }
  const rm = clampInt(flags.renterMattresses, 0, 50);
  if (rm > 0) {
    lines.push({ label: `מזרון מהשוכר (${rm} × 50 ₪)`, amount: rm * 50 });
  }
  if (flags.notFullAirConditioning) {
    lines.push({ label: "ללא מיזוג אוויר בכל החדרים", amount: -75 });
  }

  const total = lines.reduce((s, l) => s + l.amount, 0);
  const warnings = [...w1];
  return { base, lines, total, warnings };
}
