import { NextRequest, NextResponse } from "next/server";

/**
 * Проксі до публічного довідникового API Нової пошти — ключ лишається на
 * сервері, у браузер він не потрапляє (architecture.md, розд. 5.4).
 */
export async function GET(request: NextRequest) {
  const cityRef = request.nextUrl.searchParams.get("cityRef")?.trim();
  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (!cityRef) {
    return NextResponse.json([]);
  }

  const response = await fetch("https://api.novaposhta.ua/v2.0/json/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      apiKey: process.env.NOVA_POSHTA_API_KEY,
      modelName: "AddressGeneral",
      calledMethod: "getWarehouses",
      methodProperties: { CityRef: cityRef, FindByString: q, Limit: "30" },
    }),
  });

  const json = await response.json();
  if (!json.success) {
    return NextResponse.json([]);
  }

  const warehouses = (json.data as Array<{ Ref: string; Description: string }>).map((w) => ({
    ref: w.Ref,
    name: w.Description,
  }));

  return NextResponse.json(warehouses);
}
