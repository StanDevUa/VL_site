import { NextRequest, NextResponse } from "next/server";

/**
 * Проксі до публічного довідникового API Нової пошти — ключ лишається на
 * сервері, у браузер він не потрапляє (architecture.md, розд. 5.4).
 */
export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim();
  if (!q || q.length < 2) {
    return NextResponse.json([]);
  }

  const response = await fetch("https://api.novaposhta.ua/v2.0/json/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      apiKey: process.env.NOVA_POSHTA_API_KEY,
      modelName: "Address",
      calledMethod: "getCities",
      methodProperties: { FindByString: q, Limit: "10" },
    }),
  });

  const json = await response.json();
  if (!json.success) {
    return NextResponse.json([]);
  }

  const cities = (
    json.data as Array<{ Ref: string; Description: string; AreaDescription: string }>
  ).map((c) => ({
    ref: c.Ref,
    name: c.AreaDescription ? `${c.Description} (${c.AreaDescription} обл.)` : c.Description,
  }));

  return NextResponse.json(cities);
}
