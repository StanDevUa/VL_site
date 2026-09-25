"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CustomSelect } from "@/components/admin/custom-select";
import { primaryButtonClass, secondaryButtonClass } from "@/components/ui/button-styles";
import { ORDER_STATUS_LABELS } from "@/lib/order-status";
import type { OrderStatus } from "@prisma/client";

const fieldClass =
  "w-full rounded-field border border-navy/15 px-4 py-3 text-navy outline-none focus:border-indigo focus:ring-4 focus:ring-indigo/15";
const labelClass = "block text-xs font-bold text-navy-soft mb-1.5";

export function OrdersFilterBar({
  dateFrom,
  dateTo,
  activeStatus,
  activeCategoryId,
  activeProductId,
  categories,
  products,
}: {
  dateFrom?: string;
  dateTo?: string;
  activeStatus?: OrderStatus;
  activeCategoryId?: string;
  activeProductId?: string;
  categories: { id: string; nameUk: string }[];
  products: { id: string; nameUk: string }[];
}) {
  const router = useRouter();

  const exportParams = new URLSearchParams();
  if (dateFrom) exportParams.set("dateFrom", dateFrom);
  if (dateTo) exportParams.set("dateTo", dateTo);
  if (activeStatus) exportParams.set("status", activeStatus);
  if (activeCategoryId) exportParams.set("categoryId", activeCategoryId);
  if (activeProductId) exportParams.set("productId", activeProductId);
  const exportQs = exportParams.toString();
  const exportHref = `/api/admin/zamovlennia/export${exportQs ? `?${exportQs}` : ""}`;

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(window.location.search);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    const qs = params.toString();
    router.replace(qs ? `/admin/zamovlennia?${qs}` : "/admin/zamovlennia");
  }

  return (
    <>
      <div className="bg-white rounded-card border border-navy/10 p-4 mb-3 grid grid-cols-2 md:grid-cols-5 gap-3 items-end">
        <div>
          <label className={labelClass}>Від</label>
          <input
            type="date"
            defaultValue={dateFrom ?? ""}
            onChange={(e) => updateParam("dateFrom", e.target.value)}
            className={fieldClass}
          />
        </div>
        <div>
          <label className={labelClass}>До</label>
          <input
            type="date"
            defaultValue={dateTo ?? ""}
            onChange={(e) => updateParam("dateTo", e.target.value)}
            className={fieldClass}
          />
        </div>
        <div>
          <label className={labelClass}>Статус</label>
          <CustomSelect
            name="status"
            defaultValue={activeStatus ?? ""}
            placeholder="Усі"
            onChange={(value) => updateParam("status", value)}
            options={[
              { value: "", label: "Усі" },
              ...Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => ({ value, label })),
            ]}
          />
        </div>
        <div>
          <label className={labelClass}>Категорія</label>
          <CustomSelect
            name="categoryId"
            defaultValue={activeCategoryId ?? ""}
            placeholder="Усі"
            onChange={(value) => updateParam("categoryId", value)}
            options={[
              { value: "", label: "Усі" },
              ...categories.map((c) => ({ value: c.id, label: c.nameUk })),
            ]}
          />
        </div>
        <div>
          <label className={labelClass}>Товар</label>
          <CustomSelect
            name="productId"
            defaultValue={activeProductId ?? ""}
            placeholder="Усі"
            onChange={(value) => updateParam("productId", value)}
            options={[
              { value: "", label: "Усі" },
              ...products.map((p) => ({ value: p.id, label: p.nameUk })),
            ]}
          />
        </div>
      </div>
      <div className="flex justify-between mb-6">
        <a href={exportHref} className={primaryButtonClass}>
          Експорт в Excel
        </a>
        <Link href="/admin/zamovlennia" className={secondaryButtonClass}>
          Скинути усі фільтри
        </Link>
      </div>
    </>
  );
}
