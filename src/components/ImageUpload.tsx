"use client";

import { useRef, useState } from "react";

export type UploadedImage = { url: string; publicId: string };

interface Props {
  onChange: (imgs: UploadedImage[]) => void;
  maxFiles?: number;
}

/** דוחס תמונה ל־JPEG ברוחב מקסימלי וגודל סביר, ומחזיר data URL */
async function compressImage(file: File, maxWidth = 1200, quality = 0.72): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      try {
        const ratio = Math.min(1, maxWidth / img.width);
        const w = Math.round(img.width * ratio);
        const h = Math.round(img.height * ratio);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("no-ctx");
        ctx.drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        URL.revokeObjectURL(url);
        resolve(dataUrl);
      } catch (e) {
        URL.revokeObjectURL(url);
        reject(e);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("load-failed"));
    };
    img.src = url;
  });
}

export function ImageUpload({ onChange, maxFiles = 6 }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<UploadedImage[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    setError(null);

    const room = maxFiles - previews.length;
    const list = Array.from(files).slice(0, room);
    const newImgs: UploadedImage[] = [];

    for (const file of list) {
      if (!file.type.startsWith("image/")) continue;
      try {
        const dataUrl = await compressImage(file);
        newImgs.push({
          url: dataUrl,
          publicId: `local_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        });
      } catch {
        setError("בעיה בעיבוד תמונה — נסו תמונה אחרת");
      }
    }

    const next = [...previews, ...newImgs];
    setPreviews(next);
    onChange(next);
    setBusy(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  function remove(publicId: string) {
    const next = previews.filter((i) => i.publicId !== publicId);
    setPreviews(next);
    onChange(next);
  }

  return (
    <div className="space-y-3">
      {previews.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {previews.map((img, i) => (
            <div key={img.publicId} className="group relative overflow-hidden rounded-2xl border border-stone-200 dark:border-stone-700">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={`תמונה ${i + 1}`} className="h-24 w-full object-cover" />
              {i === 0 && (
                <span className="absolute bottom-1 right-1 rounded-full bg-teal-600 px-2 py-0.5 text-[10px] font-bold text-white shadow">
                  ראשית
                </span>
              )}
              <button
                type="button"
                onClick={() => remove(img.publicId)}
                aria-label="הסר תמונה"
                className="absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white opacity-90 transition hover:bg-red-600"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {previews.length < maxFiles && (
        <label className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-pink-300 bg-pink-50/60 py-6 text-sm font-semibold text-pink-700 transition hover:border-pink-400 hover:bg-pink-50 dark:border-pink-700/60 dark:bg-pink-950/20 dark:text-pink-300">
          <span className="text-2xl">📷</span>
          <span>
            {busy
              ? "מעבד תמונות…"
              : previews.length === 0
                ? "בחרו תמונות מהמכשיר"
                : `הוסיפו עוד תמונות (${previews.length}/${maxFiles})`}
          </span>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            disabled={busy}
            onChange={(e) => handleFiles(e.target.files)}
            className="sr-only"
          />
        </label>
      )}

      {error && <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>}

      <p className="text-xs text-stone-500 dark:text-stone-400">
        💡 התמונות נדחסות אוטומטית ונשמרות במאגר. עד {maxFiles} תמונות.
      </p>
    </div>
  );
}
