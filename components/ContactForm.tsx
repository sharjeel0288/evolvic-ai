"use client";
import { ArrowRight } from "lucide-react";
import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { contactPage } from "@/lib/content";

type Status = "idle" | "sending" | "ok" | "error";

export default function ContactForm() {
  const f = contactPage.form;
  const [status, setStatus] = useState<Status>("idle");
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const r = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      // Success is shown ONLY when the backend confirms delivery.
      setStatus(r.ok ? "ok" : "error");
      if (r.ok) e.currentTarget.reset();
    } catch { setStatus("error"); }
  }
  const L = "mb-2 block text-[13px] font-medium text-ink2";
  return (
    <form id="form" onSubmit={onSubmit} className="nm grid gap-5 p-7 md:grid-cols-2 md:p-10" noValidate={false}>
      <label className="block"><span className={L}>Full name *</span><input className="field" name="name" required autoComplete="name" /></label>
      <label className="block"><span className={L}>Work email *</span><input className="field" type="email" name="email" required autoComplete="email" /></label>
      <label className="block"><span className={L}>Company name</span><input className="field" name="company" autoComplete="organization" /></label>
      <label className="block"><span className={L}>Website (optional)</span><input className="field" type="url" name="website" placeholder="https://" autoComplete="url" /></label>
      <label className="block md:col-span-2"><span className={L}>Which solution are you interested in?</span>
        <select className="field" name="solution" defaultValue={f.solutions[f.solutions.length - 1]}>{f.solutions.map((s) => <option key={s}>{s}</option>)}</select>
      </label>
      <label className="block md:col-span-2"><span className={L}>What would you like to improve? *</span>
        <textarea className="field min-h-40" name="message" required placeholder={f.placeholder} />
      </label>
      <fieldset className="md:col-span-2"><legend className={L}>Preferred way to connect</legend>
        <div className="flex flex-wrap gap-3">{f.connect.map((c, i) => (
          <label key={c} className="flex cursor-pointer items-center gap-2 rounded-full border border-white/10 bg-white/[.03] px-4 py-2.5 text-sm text-ink2 transition-colors hover:border-white/20 has-[:checked]:border-iris/60 has-[:checked]:bg-iris/10 has-[:checked]:text-ink">
            <input type="radio" name="connect" value={c} defaultChecked={i === 0} className="accent-[#5b4cf5]" />{c}
          </label>))}
        </div>
      </fieldset>
      {/* honeypot */}
      <input type="text" name="company_url" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <div className="flex flex-col gap-4 md:col-span-2 md:flex-row md:items-center md:justify-between">
        <p className="max-w-md text-sm text-mut">{f.privacy}</p>
        <button type="submit" className="btn p shrink-0 whitespace-nowrap" disabled={status === "sending"}>{status === "sending" ? "Sending…" : f.submit} <ArrowRight size={16} aria-hidden /></button>
      </div>
      <div aria-live="polite" className="md:col-span-2">
        <AnimatePresence>
          {(status === "ok" || status === "error") && (
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`well p-4 text-sm ${status === "ok" ? "text-green" : "text-[#ff8a8a]"}`}>
              {status === "ok" ? f.success : f.failure}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}
