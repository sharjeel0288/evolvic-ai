import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: Request) {
  let input: unknown;
  try { input = await req.json(); } catch { return NextResponse.json({ ok: false }, { status: 400 }); }
  if (!input || typeof input !== "object" || Array.isArray(input))
    return NextResponse.json({ ok: false }, { status: 400 });
  const body = input as Record<string, unknown>;
  if (body.company_url) return NextResponse.json({ ok: true }); // honeypot
  const field = (key: string) => typeof body[key] === "string" ? body[key].trim() : "";
  const name = field("name"), email = field("email"), message = field("message");
  const company = field("company");
  const website = field("website");
  const solution = field("solution");
  const connect = field("connect");
  if (!name || name.length > 200 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 320
    || !message || message.length > 5000 || company.length > 200 || website.length > 500
    || solution.length > 200 || connect.length > 100)
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 422 });

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });

  const resend = new Resend(apiKey);
  try {
    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? "Evolviq AI <onboarding@resend.dev>",
      to: "info@evolviqai.com",
      replyTo: email,
      subject: "New contact form inquiry",
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Company: ${company || "Not provided"}`,
        `Website: ${website || "Not provided"}`,
        `Interested solution: ${solution || "Not provided"}`,
        `Preferred connection: ${connect || "Not provided"}`,
        "",
        "Message:",
        message,
        "",
        `Received: ${new Date().toISOString()}`,
      ].join("\n"),
    });

    if (error) {
      console.error("Resend could not deliver the contact inquiry:", error);
      return NextResponse.json({ ok: false, error: "delivery_failed" }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Resend request failed while sending the contact inquiry:", error);
    return NextResponse.json({ ok: false, error: "delivery_failed" }, { status: 502 });
  }
}
