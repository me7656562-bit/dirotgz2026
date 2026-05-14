"use client";

import { useEffect, useRef, useState } from "react";

type UploadedImage = { url: string; publicId: string };

interface Props {
  cloudName: string;
  uploadPreset: string;
  onUploaded: (imgs: UploadedImage[]) => void;
  maxFiles?: number;
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cloudinary?: any;
  }
}

export function CloudinaryUpload({ cloudName, uploadPreset, onUploaded, maxFiles = 6 }: Props) {
  const widgetRef = useRef<ReturnType<typeof window.cloudinary.createUploadWidget> | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [previews, setPreviews] = useState<UploadedImage[]>([]);

  // טוען את ה-SDK של Cloudinary פעם אחת
  useEffect(() => {
    if (window.cloudinary) { setLoaded(true); return; }
    const script = document.createElement("script");
    script.src = "https://upload-widget.cloudinary.com/global/all.js";
    script.async = true;
    script.onload = () => setLoaded(true);
    document.head.appendChild(script);
  }, []);

  function openWidget() {
    if (!loaded || !window.cloudinary) return;

    if (!widgetRef.current) {
      widgetRef.current = window.cloudinary.createUploadWidget(
        {
          cloudName,
          uploadPreset,
          multiple: true,
          maxFiles,
          sources: ["local", "camera"],
          language: "he",
          text: {
            he: {
              or: "או",
              back: "חזרה",
              advanced: "מתקדם",
              close: "סגור",
              no_results: "אין תוצאות",
              search_placeholder: "חפש קובץ",
              about_uw: "אודות ה-Upload Widget",
              menu: { files: "הקבצים שלי", camera: "מצלמה", url: "קישור אינטרנט" },
              selection_counter: { file: "קובץ" },
              actions: { upload: "העלה", clear_all: "נקה הכל", log_out: "התנתק" },
              notifications: {
                general_error: "שגיאה",
                general_prompt: "בטוח שברצונך לצאת?",
                limit_reached: `אפשר להעלות עד ${maxFiles} תמונות`,
              },
              local: {
                browse: "בחר קבצים",
                dd_title_single: "גרור לכאן תמונה",
                dd_title_multi: "גרור לכאן תמונות",
                drop_title_single: "שחרר לכאן",
                drop_title_multiple: "שחרר לכאן",
              },
            },
          },
          styles: {
            palette: {
              window: "#FFFFFF",
              windowBorder: "#d1d5db",
              tabIcon: "#0d9488",
              menuIcons: "#0d9488",
              textDark: "#1c1917",
              textLight: "#FFFFFF",
              link: "#0d9488",
              action: "#0d9488",
              inactiveTabIcon: "#6b7280",
              error: "#ef4444",
              inProgress: "#14b8a6",
              complete: "#22c55e",
              sourceBg: "#f9fafb",
            },
            fonts: { default: { active: true } },
          },
          cropping: false,
          resourceType: "image",
          clientAllowedFormats: ["jpg", "jpeg", "png", "webp", "heic"],
          maxFileSize: 10_000_000,
        },
        (error: unknown, result: { event: string; info: { secure_url: string; public_id: string } }) => {
          if (error) return;
          if (result.event === "success") {
            const img: UploadedImage = {
              url: result.info.secure_url,
              publicId: result.info.public_id,
            };
            setPreviews((prev) => {
              const next = [...prev, img];
              onUploaded(next);
              return next;
            });
          }
        }
      );
    }

    widgetRef.current.open();
  }

  function removeImage(publicId: string) {
    setPreviews((prev) => {
      const next = prev.filter((i) => i.publicId !== publicId);
      onUploaded(next);
      return next;
    });
  }

  return (
    <div className="space-y-3">
      {/* תצוגה מקדימה */}
      {previews.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {previews.map((img, i) => (
            <div key={img.publicId} className="group relative overflow-hidden rounded-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt={`תמונה ${i + 1}`}
                className="h-24 w-full object-cover"
              />
              {i === 0 && (
                <span className="absolute bottom-1 right-1 rounded-full bg-teal-600 px-2 py-0.5 text-[10px] font-bold text-white">
                  ראשית
                </span>
              )}
              <button
                type="button"
                onClick={() => removeImage(img.publicId)}
                className="absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white opacity-0 transition group-hover:opacity-100"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* כפתור העלאה */}
      {previews.length < maxFiles && (
        <button
          type="button"
          onClick={openWidget}
          disabled={!loaded}
          className="flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-teal-300 bg-teal-50/60 py-5 text-sm font-semibold text-teal-700 transition hover:border-teal-400 hover:bg-teal-50 disabled:opacity-50 dark:border-teal-700/60 dark:bg-teal-950/20 dark:text-teal-400"
        >
          <span className="text-2xl">📷</span>
          {!loaded ? "טוען…" : previews.length === 0 ? "העלה תמונות מהמכשיר" : `הוסף עוד תמונות (${previews.length}/${maxFiles})`}
        </button>
      )}
    </div>
  );
}
