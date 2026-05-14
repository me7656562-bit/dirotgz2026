"use client";

import { Download, Printer } from "lucide-react";
import { btnPrimary, btnSecondary } from "@/lib/uiStyles";

type Props = {
  listingTitle: string;
};

export function ContractActions({ listingTitle }: Props) {
  function handlePrint() {
    window.print();
  }

  function handleDownloadPdf() {
    const content = document.getElementById("contract-content");
    if (!content) return;
    const newWindow = window.open("", "_blank");
    if (!newWindow) return;
    newWindow.document.write(`
      <html dir="rtl" lang="he">
        <head>
          <title>חוזה שכירות - ${listingTitle}</title>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Arial', sans-serif; padding: 20px; line-height: 1.6; }
            .contract-page { max-width: 800px; margin: 0 auto; }
            h1, h2 { text-align: center; }
            .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
            .signature-area { display: flex; justify-content: space-between; margin-top: 40px; }
            .signature-box { text-align: center; min-height: 80px; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>${content.innerHTML}</body>
      </html>
    `);
    newWindow.document.close();
    setTimeout(() => newWindow.print(), 100);
  }

  return (
    <div className="flex gap-3">
      <button
        type="button"
        onClick={handlePrint}
        className={`${btnSecondary} flex items-center gap-2`}
      >
        <Printer className="h-4 w-4" />
        הדפס
      </button>
      <button
        type="button"
        onClick={handleDownloadPdf}
        className={`${btnPrimary} flex items-center gap-2`}
      >
        <Download className="h-4 w-4" />
        הורד PDF
      </button>
    </div>
  );
}
