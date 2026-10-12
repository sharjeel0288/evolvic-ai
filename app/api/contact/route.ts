import { NextResponse } from "next/server";

/**
 * Contact endpoint. Forwards the inquiry as JSON to CONTACT_WEBHOOK_URL
 * (e.g. Zapier/Make/Slack/Resend relay). Without that env var it returns 503,
 * so the UI shows the failure message instead of a false success.
 */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false }, { status: 400 }); }
  if (body.company_url) return NextResponse.json({ ok: true }); // honeypot
  const name = String(body.name ?? "").trim(), email = String(body.email ?? "").trim(), message = String(body.message ?? "").trim();
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !message || message.length > 5000)
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 422 });
  const hook = process.env.CONTACT_WEBHOOK_URL;
  if (!hook) return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
  const r = await fetch(hook, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...body, receivedAt: new Date().toISOString() }) });
  return NextResponse.json({ ok: r.ok }, { status: r.ok ? 200 : 502 });
}
