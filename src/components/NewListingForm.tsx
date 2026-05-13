"use client";

import { useActionState } from "react";
import { createListingAction } from "@/app/actions/listings";
import { SYNAGOGUE_ADDRESS_HE } from "@/lib/synagogue";
import { btnPrimary, cardClass, hintClass, inputClass, labelClass, selectClass, textareaClass } from "@/lib/uiStyles";

const fieldsetClass =
  "space-y-4 rounded-2xl border border-stone-200/70 bg-stone-50/50 p-5 dark:border-stone-700/70 dark:bg-stone-900/35";
const legendClass = "mb-3 block w-full border-b border-stone-200/80 pb-2 text-sm font-bold text-teal-900 dark:border-stone-600 dark:text-teal-200";

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

      <fieldset className={fieldsetClass}>
        <legend className={legendClass}>פרטים כלליים</legend>
        <div>
          <label htmlFor="title" className={labelClass}>
            כותרת
          </label>
          <input
            id="title"
            name="title"
            required
            maxLength={120}
            className={inputClass}
            placeholder="למשל: דירה מרווחת ליד בית הכנסת"
          />
        </div>
        <div>
          <label htmlFor="description" className={labelClass}>
            תיאור
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={5}
            maxLength={4000}
            className={textareaClass}
            placeholder="ציוד, קומה, גישה לשבת, חניה, שבתון…"
          />
        </div>
      </fieldset>

      <fieldset className={fieldsetClass}>
        <legend className={legendClass}>מיקום ודירה</legend>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="city" className={labelClass}>
              עיר
            </label>
            <input id="city" name="city" required className={inputClass} placeholder="גבעת זאב" />
          </div>
          <div>
            <label htmlFor="neighborhood" className={labelClass}>
              שכונה (אופציונלי)
            </label>
            <input id="neighborhood" name="neighborhood" maxLength={80} className={inputClass} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="rooms" className={labelClass}>
              חדרים (כולל סלון)
            </label>
            <input
              id="rooms"
              name="rooms"
              type="number"
              min={1}
              max={30}
              defaultValue={4}
              required
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="beds" className={labelClass}>
              מיטות
            </label>
            <input
              id="beds"
              name="beds"
              type="number"
              min={2}
              max={30}
              defaultValue={4}
              required
              className={inputClass}
            />
          </div>
        </div>
        <div>
          <label htmlFor="walkDistance" className={labelClass}>
            מרחק מבית הכנסת (לפי תקנון)
          </label>
          <p className={hintClass}>נקודת ייחוס: {SYNAGOGUE_ADDRESS_HE}</p>
          <select id="walkDistance" name="walkDistance" required defaultValue="" className={`${selectClass} mt-2`}>
            <option value="" disabled>
              בחרו קטגוריה…
            </option>
            <option value="upTo10">עד 10 דקות הליכה מבית הכנסת</option>
            <option value="upTo20">עד 20 דקות הליכה מבית הכנסת</option>
            <option value="over20">יותר מ-20 דקות הליכה מבית הכנסת</option>
          </select>
        </div>
      </fieldset>

      <fieldset className={fieldsetClass}>
        <legend className={legendClass}>זמינות ומחיר</legend>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="availableFrom" className={labelClass}>
              זמין מתאריך
            </label>
            <input id="availableFrom" name="availableFrom" type="date" required className={inputClass} />
          </div>
          <div>
            <label htmlFor="availableTo" className={labelClass}>
              עד תאריך
            </label>
            <input id="availableTo" name="availableTo" type="date" required className={inputClass} />
          </div>
        </div>
        <div>
          <label htmlFor="askingPriceNis" className={labelClass}>
            מחיר מבוקש בשקלים (אופציונלי)
          </label>
          <input
            id="askingPriceNis"
            name="askingPriceNis"
            type="number"
            min={0}
            className={inputClass}
            placeholder="ריק אם לא רוצים לפרסם"
          />
        </div>
        <div>
          <label htmlFor="imageUrl" className={labelClass}>
            קישור לתמונה (אופציונלי)
          </label>
          <input id="imageUrl" name="imageUrl" type="url" maxLength={2000} className={inputClass} placeholder="https://…" />
        </div>
      </fieldset>

      <fieldset className={fieldsetClass}>
        <legend className={legendClass}>יצירת קשר</legend>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="contactPhone" className={labelClass}>
              טלפון
            </label>
            <input id="contactPhone" name="contactPhone" type="tel" required className={inputClass} />
          </div>
          <div>
            <label htmlFor="contactWhatsapp" className={labelClass}>
              וואטסאפ (אופציונלי)
            </label>
            <input id="contactWhatsapp" name="contactWhatsapp" type="tel" className={inputClass} />
          </div>
        </div>
        <p className={hintClass}>
          הפרטים יוצגו בדף המודעה. לפני פרסום מומלץ לאמת מול התקנון ולחתום על חוזה ברור.
        </p>
      </fieldset>

      <button type="submit" disabled={pending} className={`${btnPrimary} w-full py-3.5 text-base shadow-lg shadow-teal-800/20`}>
        {pending ? "שולח…" : "פרסום מודעה"}
      </button>
    </form>
  );
}
