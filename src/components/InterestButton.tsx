"use client";

import { useState, useTransition } from "react";
import { markInterestAction, markRentedAction } from "@/app/actions/interest";
import { btnPrimary, btnSecondary, inputClass } from "@/lib/uiStyles";

export function InterestButton({
  listingId,
  isMine,
  count,
}: {
  listingId: string;
  isMine: boolean;
  count: number;
}) {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(isMine);
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [msg, setMsg] = useState("");
  const [cnt, setCnt] = useState(count);
  const [isPending, startTransition] = useTransition();

  function submit() {
    startTransition(async () => {
      const res = await markInterestAction(listingId, { phone, message });
      setMsg(res.message);
      if (res.ok) {
        setDone(true);
        setOpen(false);
        if (!isMine) setCnt((c) => c + 1);
      }
    });
  }

  if (done) {
    return (
      <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-center font-semibold text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">
        ✅ סימנת עניין — המשכיר רואה את הפרטים שלך ויחזור אליך
      </div>
    );
  }

  if (!open) {
    return (
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={`${btnPrimary} w-full justify-center py-3 text-base shadow-md shadow-teal-700/20`}
        >
          🙋 אני מעוניין/ת בדירה
        </button>
        {cnt > 0 && (
          <p className="text-center text-xs text-stone-500 dark:text-stone-400">
            {cnt} {cnt === 1 ? "אדם סימן עניין" : "אנשים סימנו עניין"} עד כה
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-2xl border border-teal-200 bg-teal-50/40 p-4 dark:border-teal-700/60 dark:bg-teal-950/30">
      <p className="text-sm font-semibold text-teal-900 dark:text-teal-100">
        השאר פרטים — המשכיר יחזור אליך
      </p>
      <div>
        <label className="mb-1 block text-xs font-medium text-stone-600 dark:text-stone-400">טלפון *</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="05X-XXXXXXX"
          className={inputClass}
          required
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-stone-600 dark:text-stone-400">הודעה (אופציונלי)</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="כמה אנשים, מתי לחזור אליי, וכו'…"
          rows={2}
          maxLength={500}
          className={`${inputClass} resize-y`}
        />
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={submit}
          disabled={isPending || phone.trim().length < 8}
          className={`${btnPrimary} flex-1`}
        >
          {isPending ? "שולח…" : "שלח"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className={btnSecondary}>
          ביטול
        </button>
      </div>
      {msg && <p className="text-sm font-medium text-red-700 dark:text-red-300">{msg}</p>}
    </div>
  );
}

export function MarkRentedButton({ listingId }: { listingId: string }) {
  const [done, setDone] = useState(false);
  const [msg, setMsg] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!confirm("לסמן את הדירה כמושכרת? המודעה תוסר מהרשימה.")) return;
    startTransition(async () => {
      const res = await markRentedAction(listingId);
      setMsg(res.message);
      if (res.ok) setDone(true);
    });
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending || done}
        className={`${btnSecondary} w-full justify-center gap-2 border-green-300 text-green-800 hover:bg-green-50 dark:border-green-700 dark:text-green-300`}
      >
        {done ? "✅ הושכרה" : isPending ? "מעדכן…" : "🔑 סמן כמושכרת"}
      </button>
      {msg && <p className="text-sm font-medium text-green-700 dark:text-green-300">{msg}</p>}
    </div>
  );
}
