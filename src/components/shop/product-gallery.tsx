"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

export function ProductGallery({
  mainPhotoUrl,
  gallery,
}: {
  mainPhotoUrl: string;
  gallery: string[];
}) {
  const [active, setActive] = useState(mainPhotoUrl);
  const t = useTranslations("Shop");

  return (
    <div>
      <div className="relative h-[420px] rounded-card border border-navy/10 overflow-hidden bg-navy/5">
        <Image src={active} alt="" fill className="object-cover" />
      </div>
      {gallery.length > 0 && (
        <div className="mt-4">
          <p className="text-center text-sm font-bold text-navy-soft mb-3">{t("gallery")}</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[mainPhotoUrl, ...gallery].map((url, i) => (
              <button
                key={url + i}
                type="button"
                onClick={() => setActive(url)}
                className={
                  "relative w-[100px] h-[76px] rounded-field overflow-hidden border-2 transition-colors " +
                  (active === url ? "border-magenta" : "border-transparent hover:border-navy/20")
                }
              >
                <Image src={url} alt="" fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
