"use client";

import { useState, useTransition } from "react";
import { markInterestAction, markRentedAction } from "@/app/actions/interest";
import { btnPrimary, btnSecondary } from "@/lib/uiStyles";

export function InterestButton({
  listingId,
  isMine,
  count,
}: {
  listingId: string;
  isMine: boolean;
  count: number;
}) {
  const [done, setDone] = useState(isMine);
  const [msg, setMsg] = useState("");
  const [cnt, setCnt] = useState(count);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (done) return;
    startTransition(async () => {
      const res = await markInterestAction(listingId);
      setMsg(res.message);
      if (res.ok) {
        setDone(true);
        setCnt((c) => c + 1);
      }
    });
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending || done}
        className={`${btnPrimary} gap-2`}
      >
        {done ? "✅ סומנת כמעוניין" : isPending ? "שולח…" : "🙋 מעוניין/ת"}
      </button>
      {cnt > 0 && (
        <p className="text-sm text-stone-500 dark:text-stone-400">
          {cnt} {cnt === 1 ? "מתעניין" : "מתעניינים"} עד כה
        </p>
      )}
      {msg && (
        <p className="text-sm font-medium text-teal-700 dark:text-teal-300">{msg}</p>
      )}
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
        className={`${btnSecondary} gap-2 border-green-300 text-green-800 hover:bg-green-50 dark:border-green-700 dark:text-green-300`}
      >
        {done ? "✅ הושכרה" : isPending ? "מעדכן…" : "🔑 סמן כמושכרת"}
      </button>
      {msg && <p className="text-sm font-medium text-green-700 dark:text-green-300">{msg}</p>}
    </div>
  );
}
