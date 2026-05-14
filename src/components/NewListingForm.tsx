"use client";

import { useActionState, useState, useMemo } from "react";
import { createListingAction } from "@/app/actions/listings";
import { SYNAGOGUE_ADDRESS_HE } from "@/lib/synagogue";
import { computeShavuot5786Total } from "@/lib/pricing/shavuot5786StolinKarlin";
import type { WalkDistance } from "@/lib/pricing/shavuot5786StolinKarlin";
import { btnPrimary, hintClass, inputClass, labelClass, selectClass } from "@/lib/uiStyles";

/* ─── Toggle card ─── */
function Toggle({
  name, label, emoji, checked, onChange,
}: { name: string; label: string; emoji: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className={`flex cursor-pointer select-none items-center gap-2.5 rounded-xl border px-3 py-2.5 transition ${
      checked
        ? "border-teal-400 bg-teal-50 dark:border-teal-600 dark:bg-teal-950/40"
        : "border-stone-200 bg-white hover:border-teal-200 dark:border-stone-700 dark:bg-stone-900"
    }`}>
      <input type="checkbox" name={name} checked={checked}
        onChange={(e) => onChange(e.target.checked)} className="sr-only" />
      <span className="text-lg leading-none">{emoji}</span>
      <span className="flex-1 text-sm font-medium text-stone-800 dark:text-stone-200">{label}</span>
      <span className={`text-base ${checked ? "text-teal-500" : "text-stone-200 dark:text-stone-700"}`}>
        {checked ? "✅" : "☐"}
      </span>
    </label>
  );
}

/* ─── +/− counter ─── */
function Num({
  name, label, value, onChange, min = 0, max = 30,
}: { name: string; label: string; value: number; onChange: (v: number) => void; min?: number; max?: number }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-sm text-stone-700 dark:text-stone-300">{label}</span>
      <div className="flex items-center gap-1.5">
        <button type="button" onClick={() => onChange(Math.max(min, value - 1))}
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-stone-200 bg-white font-bold text-stone-600 hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-800">−</button>
        <span className="w-6 text-center text-sm font-bold tabular-nums">{value}</span>
        <button type="button" onClick={() => onChange(Math.min(max, value + 1))}
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-stone-200 bg-white font-bold text-stone-600 hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-800">+</button>
        <input type="hidden" name={name} value={value} />
      </div>
    </div>
  );
}

/* ─── Main form ─── */
export function NewListingForm() {
  const [state, formAction, pending] = useActionState(createListingAction, null);

  const [rooms, setRooms] = useState(3);
  const [beds, setBeds] = useState(4);
  const [bedsDouble, setBedsDouble] = useState(0);
  const [bedsJewish, setBedsJewish] = useState(0);
  const [mattresses, setMattresses] = useState(0);
  const [renterMattresses, setRenterMattresses] = useState(0);
  const [cribs, setCribs] = useState(0);
  const [bathrooms, setBathrooms] = useState(1);
  const [floor, setFloor] = useState(0);

  const [walkDistance, setWalkDistance] = useState<WalkDistance | "">("");
  const [ac, setAc] = useState(false);
  const [shabbatPlate, setShabbatPlate] = useState(false);
  const [shabbatUrn, setShabbatUrn] = useState(false);
  const [shabbatClock, setShabbatClock] = useState(false);
  const [sofa, setSofa] = useState(false);
  const [bedLinens, setBedLinens] = useState(false);

  const priceResult = useMemo(() => {
    if (!walkDistance) return null;
    return computeShavuot5786Total(beds, walkDistance as WalkDistance, rooms, {
      missingBasicItem: false,
      notFullAirConditioning: !ac,
      landlordMattresses: mattresses,
      renterMattresses,
    });
  }, [beds, rooms, walkDistance, ac, mattresses, renterMattresses]);

  return (
    <form action={formAction} className="mx-auto max-w-lg space-y-5">

      {state?.ok === false && (
        <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800 dark:border-red-800/50 dark:bg-red-950/50 dark:text-red-200">
          ⚠️ {state.message}
        </div>
      )}

      {/* ── כותרת ── */}
      <section className="overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-sm dark:border-stone-700/80 dark:bg-stone-900">
        <div className="bg-gradient-to-l from-teal-600 to-cyan-600 px-5 py-2.5">
          <p className="text-sm font-bold text-white">📝 כותרת ומיקום</p>
        </div>
        <div className="space-y-4 p-5">
          <div>
            <label htmlFor="title" className={labelClass}>כותרת המודעה *</label>
            <input id="title" name="title" required maxLength={120} className={inputClass}
              placeholder="למשל: דירה מרווחת 4 חדרים, קרוב לבית הכנסת" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label htmlFor="address" className={labelClass}>כתובת מדויקת</label>
              <input id="address" name="address" maxLength={200} className={inputClass}
                placeholder="רחוב האתרוג 12" />
              <p className={hintClass}>לחישוב הליכה בגוגל מפות</p>
            </div>
            <div>
              <label className={labelClass}>קומה</label>
              <div className="flex flex-col items-center gap-1 pt-1">
                <button type="button" onClick={() => setFloor((f) => Math.min(50, f + 1))}
                  className="flex h-7 w-full items-center justify-center rounded-lg border border-stone-200 bg-white font-bold hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-800">+</button>
                <span className="w-full text-center text-sm font-bold tabular-nums">
                  {floor === 0 ? "קרקע" : floor > 0 ? `+${floor}` : floor}
                </span>
                <button type="button" onClick={() => setFloor((f) => Math.max(-5, f - 1))}
                  className="flex h-7 w-full items-center justify-center rounded-lg border border-stone-200 bg-white font-bold hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-800">−</button>
                <input type="hidden" name="floor" value={floor} />
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="walkDistance" className={labelClass}>מרחק מבית הכנסת *</label>
            <p className={hintClass}>{SYNAGOGUE_ADDRESS_HE}</p>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {(["upTo10","upTo20","over20"] as WalkDistance[]).map((d) => {
                const labels: Record<string, string> = { upTo10: "עד 10 דק'", upTo20: "עד 20 דק'", over20: "מעל 20" };
                const colors: Record<string, string> = {
                  upTo10: walkDistance === d ? "border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40" : "border-stone-200 dark:border-stone-700",
                  upTo20: walkDistance === d ? "border-amber-500 bg-amber-50 text-amber-800 dark:bg-amber-950/40" : "border-stone-200 dark:border-stone-700",
                  over20:  walkDistance === d ? "border-rose-500 bg-rose-50 text-rose-800 dark:bg-rose-950/40" : "border-stone-200 dark:border-stone-700",
                };
                return (
                  <label key={d} className={`flex cursor-pointer flex-col items-center rounded-xl border-2 px-2 py-2 text-center transition ${colors[d]}`}>
                    <input type="radio" name="walkDistance" value={d} required
                      checked={walkDistance === d} onChange={() => setWalkDistance(d)} className="sr-only" />
                    <span className="text-lg">{d === "upTo10" ? "🟢" : d === "upTo20" ? "🟡" : "🔴"}</span>
                    <span className="text-xs font-semibold">{labels[d]}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── חדרים וציוד (grid אחד) ── */}
      <section className="overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-sm dark:border-stone-700/80 dark:bg-stone-900">
        <div className="bg-gradient-to-l from-blue-600 to-indigo-600 px-5 py-2.5">
          <p className="text-sm font-bold text-white">🛏️ חדרים, שינה וציוד</p>
        </div>
        <div className="p-5">
          {/* מספרים — grid 2 עמודות */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            <Num name="rooms" label="חדרים סגורים" value={rooms} onChange={setRooms} min={1} />
            <Num name="beds" label="סה״כ מיטות" value={beds} onChange={setBeds} min={1} max={50} />
            <Num name="bedsDouble" label="מיטות זוגיות" value={bedsDouble} onChange={setBedsDouble} />
            <Num name="bedsJewish" label="מיטות יהודיות" value={bedsJewish} onChange={setBedsJewish} />
            <Num name="mattresses" label="מזרונים (משכיר)" value={mattresses} onChange={setMattresses} />
            <Num name="cribs" label="עריסות / לולים" value={cribs} onChange={setCribs} />
            <Num name="bathrooms" label="שירותים/אמבטיות" value={bathrooms} onChange={setBathrooms} min={1} />
          </div>

          {/* ציוד — 2 עמודות */}
          <div className="mt-4 grid grid-cols-2 gap-2 border-t border-stone-100 pt-4 dark:border-stone-800">
            <Toggle name="ac" label="מזגן" emoji="❄️" checked={ac} onChange={setAc} />
            <Toggle name="shabbatPlate" label="פלטה" emoji="🍲" checked={shabbatPlate} onChange={setShabbatPlate} />
            <Toggle name="shabbatUrnBoiler" label="מיחם שבת" emoji="☕" checked={shabbatUrn} onChange={setShabbatUrn} />
            <Toggle name="shabbatClock" label="שעון שבת" emoji="⏰" checked={shabbatClock} onChange={setShabbatClock} />
            <Toggle name="sofa" label="ספה נפתחת" emoji="🛋️" checked={sofa} onChange={setSofa} />
            <Toggle name="bedLinens" label="מצעים" emoji="🛏️" checked={bedLinens} onChange={setBedLinens} />
          </div>

          {/* נוספים */}
          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-stone-100 pt-4 dark:border-stone-800">
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
              <label htmlFor="diningTable" className={labelClass}>שולחן אוכל</label>
              <select id="diningTable" name="diningTable" className={selectClass}>
                <option value="">אין</option>
                <option value="שולחן מטבח">מטבח</option>
                <option value="שולחן רגיל">רגיל</option>
                <option value="שולחן גדול">גדול</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* ── מחיר לפי תקנון ── */}
      {priceResult ? (
        <section className="overflow-hidden rounded-3xl border border-teal-300/70 shadow-md shadow-teal-200/40 dark:border-teal-700/50 dark:shadow-teal-900/20">
          <div className="bg-gradient-to-l from-teal-500 to-emerald-500 px-5 py-2.5">
            <p className="text-sm font-bold text-white">💰 מחיר לפי תקנון — חישוב אוטומטי</p>
          </div>
          <div className="bg-white p-5 dark:bg-stone-900">
            <ul className="space-y-1.5 text-sm">
              {priceResult.lines.map((l, i) => (
                <li key={i} className="flex justify-between gap-3">
                  <span className="text-stone-600 dark:text-stone-400">{l.label}</span>
                  <span className={`tabular-nums font-semibold ${l.amount < 0 ? "text-red-600 dark:text-red-400" : "text-stone-800 dark:text-stone-100"}`}>
                    {l.amount > 0 ? "+" : ""}{l.amount.toLocaleString("he-IL")} ₪
                  </span>
                </li>
              ))}
            </ul>

            {/* מזרון שוכר */}
            <div className="mt-3 border-t border-stone-100 pt-3 dark:border-stone-800">
              <Num name="renterMattresses" label="מזרון שהשוכר מביא (+50 ₪)" value={renterMattresses} onChange={setRenterMattresses} />
            </div>

            <div className="mt-3 flex items-center justify-between rounded-2xl bg-gradient-to-l from-teal-500 to-emerald-500 px-4 py-3">
              <span className="font-bold text-white">סה״כ לפי תקנון</span>
              <span className="text-2xl font-black tabular-nums text-white">
                {priceResult.total.toLocaleString("he-IL")} ₪
              </span>
            </div>

            {priceResult.warnings.map((w, i) => (
              <p key={i} className="mt-2 text-xs text-amber-700 dark:text-amber-400">⚠️ {w}</p>
            ))}

            {/* מחיר נעול — לפי תקנון בלבד */}
            <input type="hidden" name="askingPriceNis" value={priceResult.total} />
            <p className={`${hintClass} mt-2 text-center`}>המחיר נקבע לפי התקנון ולא ניתן לשינוי</p>
          </div>
        </section>
      ) : (
        <div className="rounded-2xl border border-dashed border-teal-200 bg-teal-50/50 p-4 text-center text-sm text-teal-700 dark:border-teal-800/40 dark:bg-teal-950/20 dark:text-teal-400">
          📍 בחרו מרחק מבית הכנסת למעלה — המחיר יחושב אוטומטית
        </div>
      )}

      {/* ── קשר ── */}
      <section className="overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-sm dark:border-stone-700/80 dark:bg-stone-900">
        <div className="bg-gradient-to-l from-green-600 to-teal-600 px-5 py-2.5">
          <p className="text-sm font-bold text-white">📞 יצירת קשר ותיאור</p>
        </div>
        <div className="space-y-4 p-5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="contactPhone" className={labelClass}>טלפון *</label>
              <input id="contactPhone" name="contactPhone" type="tel" required className={inputClass} placeholder="05X-XXXXXXX" />
            </div>
            <div>
              <label htmlFor="contactWhatsapp" className={labelClass}>וואטסאפ</label>
              <input id="contactWhatsapp" name="contactWhatsapp" type="tel" className={inputClass} placeholder="05X-XXXXXXX" />
            </div>
          </div>
          <div>
            <label htmlFor="description" className={labelClass}>הערות נוספות</label>
            <textarea id="description" name="description" rows={2} maxLength={4000}
              className={`${inputClass} resize-y`} placeholder="פרטים שחשוב שהשוכרים ידעו…" />
          </div>
          <div>
            <label htmlFor="imageUrl" className={labelClass}>קישור לתמונה</label>
            <input id="imageUrl" name="imageUrl" type="url" maxLength={2000} className={inputClass} placeholder="https://…" />
          </div>
        </div>
      </section>

      <button type="submit" disabled={pending || !priceResult}
        className={`${btnPrimary} w-full py-4 text-base shadow-lg shadow-teal-800/25`}>
        {pending ? "שולח…" : !priceResult ? "בחר מרחק כדי לפרסם" : "✓ פרסם מודעה"}
      </button>
    </form>
  );
}
