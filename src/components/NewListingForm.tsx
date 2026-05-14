"use client";

import { useActionState } from "react";
import { createListingAction } from "@/app/actions/listings";
import { SYNAGOGUE_ADDRESS_HE } from "@/lib/synagogue";
import { btnPrimary, cardClass, hintClass, inputClass, labelClass, selectClass } from "@/lib/uiStyles";

const fieldsetClass =
  "space-y-4 rounded-2xl border border-stone-200/70 bg-stone-50/50 p-5 dark:border-stone-700/70 dark:bg-stone-900/35";
const legendClass =
  "mb-3 block w-full border-b border-stone-200/80 pb-2 text-sm font-bold text-teal-900 dark:border-stone-600 dark:text-teal-200";

function CheckboxField({ name, label }: { name: string; label: string }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5">
      <input
        type="checkbox"
        name={name}
        className="h-4 w-4 rounded border-stone-300 text-teal-600 focus:ring-teal-500 dark:border-stone-600"
      />
      <span className="text-sm text-stone-700 dark:text-stone-300">{label}</span>
    </label>
  );
}

function NumberField({
  name,
  label,
  min = 0,
  max = 30,
  defaultValue,
  required,
}: {
  name: string;
  label: string;
  min?: number;
  max?: number;
  defaultValue?: number;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className={labelClass}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type="number"
        min={min}
        max={max}
        defaultValue={defaultValue}
        required={required}
        className={inputClass}
      />
    </div>
  );
}

export function NewListingForm() {
  const [state, formAction, pending] = useActionState(createListingAction, null);

  return (
    <form action={formAction} className={`mx-auto max-w-xl space-y-8 ${cardClass}`}>
      {state?.ok === false && (
        <div
          role="alert"
          className="rounded-xl border border-red-200/90 bg-red-50 px-4 py-3 text-sm text-red-900 dark:border-red-900/60 dark:bg-red-950/50 dark:text-red-100"
        >
          {state.message}
        </div>
      )}

      {/* כותרת */}
      <fieldset className={fieldsetClass}>
        <legend className={legendClass}>כותרת</legend>
        <div>
          <label htmlFor="title" className={labelClass}>
            כותרת המודעה
          </label>
          <input
            id="title"
            name="title"
            required
            maxLength={120}
            className={inputClass}
            placeholder="למשל: דירה מרווחת ליד בית הכנסת, 4 חדרים"
          />
        </div>
        <div>
          <label htmlFor="description" className={labelClass}>
            תיאור חופשי (אופציונלי)
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            maxLength={4000}
            className={`${inputClass} min-h-[80px] resize-y`}
            placeholder="פרטים נוספים שלא נכנסו לשדות…"
          />
        </div>
      </fieldset>

      {/* מיקום */}
      <fieldset className={fieldsetClass}>
        <legend className={legendClass}>מיקום</legend>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="city" className={labelClass}>עיר</label>
            <input id="city" name="city" required className={inputClass} placeholder="גבעת זאב" />
          </div>
          <div>
            <label htmlFor="neighborhood" className={labelClass}>שכונה (אופציונלי)</label>
            <input id="neighborhood" name="neighborhood" maxLength={80} className={inputClass} />
          </div>
        </div>
        <div>
          <label htmlFor="address" className={labelClass}>כתובת מדויקת (רחוב ומספר)</label>
          <input id="address" name="address" maxLength={200} className={inputClass} placeholder="רחוב הרצל 12" />
          <p className={hintClass}>הכתובת תשמש לחישוב זמן הליכה מבית הכנסת בגוגל מפות.</p>
        </div>
        <div>
          <label htmlFor="floor" className={labelClass}>קומה</label>
          <input id="floor" name="floor" type="number" min={0} max={50} className={inputClass} placeholder="0 = קרקע" />
        </div>
        <div>
          <label htmlFor="walkDistance" className={labelClass}>
            מרחק מבית הכנסת (לפי תקנון)
          </label>
          <p className={hintClass}>נקודת ייחוס: {SYNAGOGUE_ADDRESS_HE}</p>
          <select id="walkDistance" name="walkDistance" required defaultValue="" className={`${selectClass} mt-2`}>
            <option value="" disabled>בחרו קטגוריה…</option>
            <option value="upTo10">עד 10 דקות הליכה</option>
            <option value="upTo20">עד 20 דקות הליכה</option>
            <option value="over20">יותר מ-20 דקות הליכה</option>
          </select>
        </div>
      </fieldset>

      {/* שינה */}
      <fieldset className={fieldsetClass}>
        <legend className={legendClass}>חדרים ושינה</legend>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <NumberField name="rooms" label="חדרים סגורים" min={0} max={20} defaultValue={3} required />
          <NumberField name="beds" label="סה״כ מיטות" min={0} max={50} defaultValue={4} required />
          <NumberField name="bedsDouble" label='מיטות זוגיות' min={0} max={20} />
          <NumberField name="bedsJewish" label="מיטות יהודיות (נפרדות)" min={0} max={20} />
          <NumberField name="mattresses" label="מזרונים" min={0} max={20} />
          <NumberField name="cribs" label='עריסות / לולים' min={0} max={10} />
        </div>
        <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <CheckboxField name="sofa" label="ספה נפתחת" />
          <CheckboxField name="bedLinens" label="מצעים" />
        </div>
      </fieldset>

      {/* ציוד שבת */}
      <fieldset className={fieldsetClass}>
        <legend className={legendClass}>ציוד שבת וחג</legend>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <CheckboxField name="ac" label="מזגן מרכזי" />
          <CheckboxField name="shabbatPlate" label="פלטה לשבת" />
          <CheckboxField name="shabbatUrnBoiler" label="מיחם שבת" />
          <CheckboxField name="shabbatClock" label="שעון שבת" />
        </div>
      </fieldset>

      {/* שירותים ומרפסת */}
      <fieldset className={fieldsetClass}>
        <legend className={legendClass}>שירותים, מרפסת וסלון</legend>
        <div className="grid grid-cols-2 gap-4">
          <NumberField name="bathrooms" label="מספר שירותים / חדרי רחצה" min={0} max={10} />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="balconyType" className={labelClass}>מרפסת / חצר</label>
            <select id="balconyType" name="balconyType" defaultValue="" className={selectClass}>
              <option value="">אין</option>
              <option value="מרפסת">מרפסת</option>
              <option value="גינה">גינה</option>
              <option value="חצר">חצר</option>
              <option value="מרפסת וגינה">מרפסת + גינה</option>
            </select>
          </div>
          <div>
            <label htmlFor="balconySize" className={labelClass}>גודל מרפסת / חצר</label>
            <select id="balconySize" name="balconySize" defaultValue="" className={selectClass}>
              <option value="">לא רלוונטי</option>
              <option value="קטנה">קטנה</option>
              <option value="בינונית">בינונית</option>
              <option value="גדולה">גדולה</option>
            </select>
          </div>
          <div>
            <label htmlFor="livingRoomSize" className={labelClass}>גודל סלון</label>
            <select id="livingRoomSize" name="livingRoomSize" defaultValue="" className={selectClass}>
              <option value="">לא ידוע</option>
              <option value="קטן">קטן</option>
              <option value="בינוני">בינוני</option>
              <option value="גדול">גדול</option>
            </select>
          </div>
          <div>
            <label htmlFor="diningTable" className={labelClass}>שולחן אוכל</label>
            <select id="diningTable" name="diningTable" defaultValue="" className={selectClass}>
              <option value="">אין</option>
              <option value="שולחן מטבח">שולחן מטבח</option>
              <option value="שולחן רגיל">שולחן רגיל</option>
              <option value="שולחן גדול">שולחן גדול</option>
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="chairs" className={labelClass}>כסאות (סוג וכמות)</label>
          <input id="chairs" name="chairs" maxLength={100} className={inputClass} placeholder="למשל: 6 כסאות רגילים + 2 כסאות ילדים" />
        </div>
      </fieldset>

      {/* זמינות ומחיר */}
      <fieldset className={fieldsetClass}>
        <legend className={legendClass}>זמינות ומחיר</legend>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="availableFrom" className={labelClass}>זמין מתאריך</label>
            <input id="availableFrom" name="availableFrom" type="date" required className={inputClass} />
          </div>
          <div>
            <label htmlFor="availableTo" className={labelClass}>עד תאריך</label>
            <input id="availableTo" name="availableTo" type="date" required className={inputClass} />
          </div>
        </div>
        <div>
          <label htmlFor="askingPriceNis" className={labelClass}>מחיר מבוקש בשקלים (אופציונלי)</label>
          <input
            id="askingPriceNis"
            name="askingPriceNis"
            type="number"
            min={0}
            className={inputClass}
            placeholder="ריק = לא מפרסמים מחיר"
          />
        </div>
        <div>
          <label htmlFor="imageUrl" className={labelClass}>קישור לתמונה (אופציונלי)</label>
          <input id="imageUrl" name="imageUrl" type="url" maxLength={2000} className={inputClass} placeholder="https://…" />
        </div>
      </fieldset>

      {/* יצירת קשר */}
      <fieldset className={fieldsetClass}>
        <legend className={legendClass}>יצירת קשר</legend>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="contactPhone" className={labelClass}>טלפון</label>
            <input id="contactPhone" name="contactPhone" type="tel" required className={inputClass} />
          </div>
          <div>
            <label htmlFor="contactWhatsapp" className={labelClass}>וואטסאפ (אופציונלי)</label>
            <input id="contactWhatsapp" name="contactWhatsapp" type="tel" className={inputClass} />
          </div>
        </div>
        <p className={hintClass}>הפרטים יוצגו בדף המודעה.</p>
      </fieldset>

      <button type="submit" disabled={pending} className={`${btnPrimary} w-full py-3.5 text-base shadow-lg shadow-teal-800/20`}>
        {pending ? "שולח…" : "פרסום מודעה"}
      </button>
    </form>
  );
}
