"use client";

import { useActionState, useState, useCallback } from "react";
import { createListingAction } from "@/app/actions/listings";
import { SYNAGOGUE_ADDRESS_HE } from "@/lib/synagogue";
import { computeShavuot5786Total } from "@/lib/pricing/shavuot5786StolinKarlin";
import type { WalkDistance } from "@/lib/pricing/shavuot5786StolinKarlin";
import { btnPrimary, cardClass, hintClass, inputClass, labelClass, selectClass } from "@/lib/uiStyles";

/* ── עזרים ── */
const sec =
  "flex cursor-pointer select-none items-center gap-3 rounded-xl border border-stone-200 bg-white px-4 py-3 transition hover:border-teal-300 hover:bg-teal-50/40 dark:border-stone-700 dark:bg-stone-900 dark:hover:border-teal-700";
const secActive =
  "flex cursor-pointer select-none items-center gap-3 rounded-xl border border-teal-400 bg-teal-50 px-4 py-3 dark:border-teal-600 dark:bg-teal-950/40";

function Toggle({
  name,
  label,
  emoji,
  checked,
  onChange,
}: {
  name: string;
  label: string;
  emoji: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className={checked ? secActive : sec}>
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      <span className="text-xl leading-none">{emoji}</span>
      <span className="flex-1 text-sm font-medium text-stone-800 dark:text-stone-200">{label}</span>
      <span className={`text-lg ${checked ? "opacity-100" : "opacity-20"}`}>{checked ? "✅" : "☐"}</span>
    </label>
  );
}

function Num({
  name,
  label,
  value,
  onChange,
  min = 0,
  max = 30,
}: {
  name: string;
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm text-stone-700 dark:text-stone-300">{label}</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-stone-200 bg-white text-lg font-bold text-stone-600 hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
        >
          −
        </button>
        <span className="w-6 text-center font-bold tabular-nums text-stone-900 dark:text-stone-50">{value}</span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-stone-200 bg-white text-lg font-bold text-stone-600 hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
        >
          +
        </button>
        <input type="hidden" name={name} value={value} />
      </div>
    </div>
  );
}

/* ── טופס ראשי ── */
export function NewListingForm() {
  const [state, formAction, pending] = useActionState(createListingAction, null);

  // מספרים
  const [rooms, setRooms] = useState(3);
  const [beds, setBeds] = useState(4);
  const [bedsDouble, setBedsDouble] = useState(0);
  const [bedsJewish, setBedsJewish] = useState(0);
  const [mattresses, setMattresses] = useState(0);
  const [cribs, setCribs] = useState(0);
  const [bathrooms, setBathrooms] = useState(1);

  // מרחק
  const [walkDistance, setWalkDistance] = useState<WalkDistance | "">("");

  // ציוד — תיבות סימון
  const [ac, setAc] = useState(false);
  const [shabbatPlate, setShabbatPlate] = useState(false);
  const [shabbatUrn, setShabbatUrn] = useState(false);
  const [shabbatClock, setShabbatClock] = useState(false);
  const [sofa, setSofa] = useState(false);
  const [bedLinens, setBedLinens] = useState(false);

  // חישוב מחיר
  const price = useCallback(() => {
    if (!walkDistance) return null;
    const result = computeShavuot5786Total(beds, walkDistance as WalkDistance, rooms, {
      missingBasicItem: false,
      notFullAirConditioning: !ac,
      landlordMattresses: mattresses,
      renterMattresses: 0,
    });
    return result;
  }, [beds, rooms, walkDistance, ac, mattresses]);

  const priceResult = price();

  return (
    <form action={formAction} className={`mx-auto max-w-lg space-y-6 ${cardClass}`}>
      {state?.ok === false && (
        <div role="alert" className="rounded-xl border border-red-200/90 bg-red-50 px-4 py-3 text-sm text-red-900 dark:border-red-900/60 dark:bg-red-950/50 dark:text-red-100">
          {state.message}
        </div>
      )}

      {/* כותרת */}
      <div>
        <label htmlFor="title" className={labelClass}>כותרת המודעה</label>
        <input id="title" name="title" required maxLength={120} className={inputClass} placeholder='למשל: דירה מרווחת, 4 חדרים, קרוב לבית הכנסת' />
      </div>

      {/* כתובת + קומה */}
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2">
          <label htmlFor="address" className={labelClass}>כתובת (רחוב ומספר)</label>
          <input id="address" name="address" maxLength={200} className={inputClass} placeholder="רחוב האתרוג 12" />
          <p className={hintClass}>לחישוב זמן הליכה בגוגל מפות</p>
        </div>
        <div>
          <label htmlFor="floor" className={labelClass}>קומה</label>
          <input id="floor" name="floor" type="number" min={0} max={50} defaultValue={0} className={inputClass} />
        </div>
      </div>

      {/* מרחק */}
      <div>
        <label htmlFor="walkDistance" className={labelClass}>מרחק מבית הכנסת</label>
        <p className={hintClass}>{SYNAGOGUE_ADDRESS_HE}</p>
        <select
          id="walkDistance"
          name="walkDistance"
          required
          value={walkDistance}
          onChange={(e) => setWalkDistance(e.target.value as WalkDistance | "")}
          className={`${selectClass} mt-1.5`}
        >
          <option value="" disabled>בחרו…</option>
          <option value="upTo10">עד 10 דקות הליכה</option>
          <option value="upTo20">עד 20 דקות הליכה</option>
          <option value="over20">יותר מ-20 דקות</option>
        </select>
      </div>

      {/* מספרים */}
      <div className="space-y-3 rounded-2xl border border-stone-200/70 bg-stone-50/50 p-4 dark:border-stone-700/70 dark:bg-stone-900/35">
        <p className="text-sm font-bold text-teal-900 dark:text-teal-200">חדרים ושינה</p>
        <Num name="rooms" label="חדרים סגורים" value={rooms} onChange={setRooms} min={1} />
        <Num name="beds" label="סה״כ מיטות" value={beds} onChange={setBeds} min={1} max={50} />
        <Num name="bedsDouble" label="מיטות זוגיות" value={bedsDouble} onChange={setBedsDouble} />
        <Num name="bedsJewish" label="מיטות יהודיות (נפרדות)" value={bedsJewish} onChange={setBedsJewish} />
        <Num name="mattresses" label="מזרונים (מהמשכיר)" value={mattresses} onChange={setMattresses} />
        <Num name="cribs" label="עריסות / לולים" value={cribs} onChange={setCribs} />
        <Num name="bathrooms" label="שירותים / חדרי רחצה" value={bathrooms} onChange={setBathrooms} min={1} />
      </div>

      {/* ציוד — תיבות גדולות */}
      <div className="space-y-2">
        <p className="text-sm font-bold text-teal-900 dark:text-teal-200">ציוד — סמנו מה יש</p>
        <Toggle name="ac" label="מזגן מרכזי" emoji="❄️" checked={ac} onChange={setAc} />
        <Toggle name="shabbatPlate" label="פלטה לשבת" emoji="🍲" checked={shabbatPlate} onChange={setShabbatPlate} />
        <Toggle name="shabbatUrnBoiler" label="מיחם שבת" emoji="☕" checked={shabbatUrn} onChange={setShabbatUrn} />
        <Toggle name="shabbatClock" label="שעון שבת" emoji="⏰" checked={shabbatClock} onChange={setShabbatClock} />
        <Toggle name="sofa" label="ספה נפתחת" emoji="🛋️" checked={sofa} onChange={setSofa} />
        <Toggle name="bedLinens" label="מצעים" emoji="🛏️" checked={bedLinens} onChange={setBedLinens} />
      </div>

      {/* שדות נוספים */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="balconyType" className={labelClass}>מרפסת / חצר</label>
          <select id="balconyType" name="balconyType" className={selectClass}>
            <option value="">אין</option>
            <option value="מרפסת">מרפסת</option>
            <option value="גינה">גינה</option>
            <option value="חצר">חצר</option>
          </select>
        </div>
        <div>
          <label htmlFor="balconySize" className={labelClass}>גודל</label>
          <select id="balconySize" name="balconySize" className={selectClass}>
            <option value="">—</option>
            <option value="קטנה">קטנה</option>
            <option value="בינונית">בינונית</option>
            <option value="גדולה">גדולה</option>
          </select>
        </div>
        <div>
          <label htmlFor="livingRoomSize" className={labelClass}>גודל סלון</label>
          <select id="livingRoomSize" name="livingRoomSize" className={selectClass}>
            <option value="">—</option>
            <option value="קטן">קטן</option>
            <option value="בינוני">בינוני</option>
            <option value="גדול">גדול</option>
          </select>
        </div>
        <div>
          <label htmlFor="diningTable" className={labelClass}>שולחן אוכל</label>
          <select id="diningTable" name="diningTable" className={selectClass}>
            <option value="">אין</option>
            <option value="שולחן מטבח">מטבח</option>
            <option value="שולחן רגיל">רגיל</option>
            <option value="שולחן גדול">גדול</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="chairs" className={labelClass}>כסאות</label>
        <input id="chairs" name="chairs" maxLength={100} className={inputClass} placeholder="למשל: 8 כסאות רגילים" />
      </div>

      {/* תיאור */}
      <div>
        <label htmlFor="description" className={labelClass}>הערות נוספות (אופציונלי)</label>
        <textarea id="description" name="description" rows={2} maxLength={4000} className={`${inputClass} min-h-[60px] resize-y`} placeholder="פרטים נוספים…" />
      </div>

      {/* תמונה */}
      <div>
        <label htmlFor="imageUrl" className={labelClass}>קישור לתמונה (אופציונלי)</label>
        <input id="imageUrl" name="imageUrl" type="url" maxLength={2000} className={inputClass} placeholder="https://…" />
      </div>

      {/* קשר */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="contactPhone" className={labelClass}>טלפון</label>
          <input id="contactPhone" name="contactPhone" type="tel" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="contactWhatsapp" className={labelClass}>וואטסאפ</label>
          <input id="contactWhatsapp" name="contactWhatsapp" type="tel" className={inputClass} />
        </div>
      </div>

      {/* מחיר לפי תקנון */}
      {priceResult && (
        <div className="rounded-2xl border border-teal-300/60 bg-teal-50 p-4 dark:border-teal-700/60 dark:bg-teal-950/40">
          <p className="mb-2 text-sm font-bold text-teal-900 dark:text-teal-100">מחיר לפי תקנון (חישוב אוטומטי)</p>
          <ul className="space-y-1 text-sm text-stone-700 dark:text-stone-300">
            {priceResult.lines.map((l, i) => (
              <li key={i} className="flex justify-between">
                <span>{l.label}</span>
                <span className={`tabular-nums font-medium ${l.amount < 0 ? "text-red-600" : "text-stone-900 dark:text-stone-100"}`}>
                  {l.amount > 0 ? "+" : ""}{l.amount.toLocaleString("he-IL")} ₪
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex items-center justify-between border-t border-teal-200/80 pt-3 dark:border-teal-700/60">
            <span className="font-bold text-teal-900 dark:text-teal-100">סה״כ לפי תקנון</span>
            <span className="text-2xl font-black tabular-nums text-teal-800 dark:text-teal-200">
              {priceResult.total.toLocaleString("he-IL")} ₪
            </span>
          </div>
          {priceResult.warnings.map((w, i) => (
            <p key={i} className="mt-2 text-xs text-amber-700 dark:text-amber-400">⚠️ {w}</p>
          ))}
          <div className="mt-3">
            <label htmlFor="askingPriceNis" className={labelClass}>מחיר מבוקש (אפשר לשנות)</label>
            <input
              id="askingPriceNis"
              name="askingPriceNis"
              type="number"
              min={0}
              defaultValue={priceResult.total}
              className={inputClass}
            />
          </div>
        </div>
      )}

      {!priceResult && (
        <div>
          <label htmlFor="askingPriceNis" className={labelClass}>מחיר מבוקש בשקלים (אופציונלי)</label>
          <p className={hintClass}>בחרו מרחק מבית הכנסת כדי לחשב מחיר אוטומטי לפי התקנון</p>
          <input id="askingPriceNis" name="askingPriceNis" type="number" min={0} className={inputClass} placeholder="₪" />
        </div>
      )}

      <button type="submit" disabled={pending} className={`${btnPrimary} w-full py-4 text-base shadow-lg shadow-teal-800/20`}>
        {pending ? "שולח…" : "פרסום מודעה ✓"}
      </button>
    </form>
  );
}
