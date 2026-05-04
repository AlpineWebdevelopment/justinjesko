"use client";
import { useState } from "react";
import useScrollReveal from "@/lib/useScrollReveal";
import useParallaxBackground from "@/lib/useParallaxBackground";
import SectionLabel from "./SectionLabel";
import { CheckIcon } from "@heroicons/react/24/outline";

const INQUIRY_TYPES = [
  { value: "", label: "Select inquiry type" },
  { value: "Booking", label: "Booking / Event" },
  { value: "Collab", label: "Collaboration" },
  { value: "Press", label: "Press / Media" },
  { value: "Fan", label: "Fan Message" },
  { value: "Request", label: "Request" },
  { value: "Other", label: "Other" },
];

export default function Contact() {
  const [revealRef, vis] = useScrollReveal(0.5);
  const [sectionRef, bgTextRef] = useParallaxBackground(1.0);

  const [form, setForm] = useState({
    name: "",
    email: "",
    type: "",
    message: "",
    website: "", // honeypot
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const update = (field) => (e) =>
    setForm((p) => ({ ...p, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/jsk/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to send");
      }
      setSubmitted(true);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputBase =
    "w-full bg-black/[0.03] border border-black/10 rounded-lg px-4 py-3 text-sm font-body text-black placeholder:text-black/30 focus:outline-none focus:border-accent-jesko focus:ring-1 focus:ring-accent-jesko/20 transition-all";
  const labelBase =
    "block text-xs font-display font-bold tracking-wider uppercase text-black/50 mb-2";

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative bg-white text-black overflow-hidden scroll-mt-8"
    >
      {/* ── Parallax background text ── */}
      <div
        ref={bgTextRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
      >
        <span className="text-[clamp(5rem,50vw,10rem)] min-[512px]:text-[clamp(6rem,18vw,16rem)] -rotate-90 min-[512px]:rotate-0  font-display font-bold uppercase text-black/5 whitespace-nowrap tracking-tight">
          CONTACT
        </span>
      </div>

      {/* ── Content (scroll-reveal ref lives here) ── */}
      <div
        ref={revealRef}
        className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 py-24 md:py-36"
      >
        <div className="grid md:grid-cols-2 gap-16 md:gap-20">
          {/* Left — heading */}
          <div
            className={`transition-all duration-1200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <SectionLabel text="CONTACT" />
            <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.1] tracking-tight mt-2">
              HOW CAN I
              <br />
              HELP YOU?
            </h2>
            <p className="text-muted mt-6 max-w-sm leading-relaxed font-seriff font-semibold">
              Whether you&apos;re a promoter, fellow artist, or just want to say
              hi &mdash; I&apos;d love to hear from you. Fill out the form and
              I&apos;ll get back to you as soon as I can.
            </p>

            {/* Direct contact */}
            <div className="mt-10 space-y-3">
              <a
                href="mailto:hello@justinjesko.com"
                className="flex items-center gap-3 text-sm font-body text-muted hover:text-black transition-colors group"
              >
                <div className="bg-accent-jesko size-3 rounded-full"></div>
                hello@justinjesko.com
              </a>
            </div>
          </div>

          {/* Right — form */}
          <div
            className={`transition-all duration-1200 delay-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-16">
                <div className="w-16 h-16 rounded-full bg-black text-accent-jesko flex items-center justify-center mb-6">
                  <CheckIcon className="size-7 stroke-4" />
                </div>
                <h3 className="font-display font-bold text-xl mb-2">
                  Message sent!
                </h3>
                <p className="text-muted text-sm font-body">
                  I&apos;ll get back to you soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelBase}>Name</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={update("name")}
                      placeholder="Your name"
                      className={inputBase}
                    />
                  </div>
                  <div>
                    <label className={labelBase}>Email</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={update("email")}
                      placeholder="your@email.com"
                      className={inputBase}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelBase}>Inquiry Type</label>
                  <select
                    required
                    value={form.type}
                    onChange={update("type")}
                    className={`${inputBase} ${!form.type ? "text-black/30" : ""} cursor-pointer`}
                  >
                    {INQUIRY_TYPES.map((opt) => (
                      <option
                        key={opt.value}
                        value={opt.value}
                        disabled={!opt.value}
                      >
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelBase}>Message</label>
                  <textarea
                    required
                    value={form.message}
                    onChange={update("message")}
                    placeholder="Tell me what's on your mind..."
                    rows={5}
                    className={`${inputBase} resize-none`}
                  />
                </div>
                {/* Honeypot — hidden from users, tempts bots */}
                <input
                  type="text"
                  name="website"
                  value={form.website}
                  onChange={update("website")}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    left: "-9999px",
                    width: "1px",
                    height: "1px",
                    opacity: 0,
                  }}
                />

                {error && (
                  <p className="text-sm text-red-600 font-body">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-black text-white font-display font-bold text-sm py-3.5 rounded-lg hover:bg-black/80 active:scale-[0.99] transition-all duration-200 tracking-wider uppercase cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? "SENDING..." : "SEND MESSAGE"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
