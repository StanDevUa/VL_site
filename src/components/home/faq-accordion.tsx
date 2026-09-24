"use client";

import { useState } from "react";

type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState(-1);

  return (
    <div className="flex flex-col gap-3">
      {items.map((item, i) => {
        const open = openIndex === i;
        return (
          <div
            key={item.id}
            className="rounded-card border transition-[border-color,background-color] duration-300 ease-in-out"
            style={{
              background: open ? "rgba(251,239,236,.6)" : "#FFFDFC",
              borderColor: open ? "rgba(201,48,124,.32)" : "rgba(30,42,90,.12)",
            }}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(open ? -1 : i)}
              className="flex w-full items-center gap-[18px] bg-transparent px-6 py-[22px] text-left font-heading text-lg font-bold text-navy"
            >
              <span className="flex-1">{item.question}</span>
              <span
                className={
                  "flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[9px] bg-magenta/10 text-lg text-magenta transition-[rotate] duration-300 ease-in-out " +
                  (open ? "rotate-45" : "rotate-0")
                }
              >
                +
              </span>
            </button>
            <div
              className="overflow-hidden transition-[max-height] duration-[400ms] ease-[cubic-bezier(.22,.7,.25,1)]"
              style={{ maxHeight: open ? "460px" : "0px" }}
            >
              <p className="m-0 py-0 pr-[60px] pb-6 pl-6 text-base leading-[1.7] text-navy-soft">
                {item.answer}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
