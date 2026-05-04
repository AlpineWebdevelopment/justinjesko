"use client";
import { useState } from "react";
import useScrollReveal from "@/lib/useScrollReveal";
import { EnvelopeIcon } from "@heroicons/react/24/outline";

export default function EmailSignup() {
  const [ref, vis] = useScrollReveal(0.4);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Connect to email service (Mailchimp, ConvertKit, Supabase, etc.)
    console.log("Email signup:", email);
    setSubmitted(true);
    setEmail("");
  };

  return (
    <section
      id="signup"
      ref={ref}
      className="relative bg-black text-white overflow-hidden border-t border-white/5"
    >
      {/* Accent gradient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-accent-jesko/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto px-6 md:px-12 py-24 md:py-32 text-center">
        <div
          className={`transition-all duration-1200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Icon */}
          {/* <div className="inline-flex items-center justify-center w-14 h-14 rounded-lg border border-white/10 mb-8">
            <EnvelopeIcon className="size-7 stroke-[2.5] text-accent-jesko" />
          </div> */}

          <h2 className="font-display text-[clamp(1.8rem,4vw,2.8rem)] font-bold leading-tight tracking-tight">
            Be the first to
            <br />
            <span className="text-accent-jesko">hear my music.</span>
          </h2>

          <p className="text-white/50 font-body text-sm mt-4 max-w-md mx-auto">
            Get notified when new tracks drop, sets go live, or shows get
            announced. No spam &mdash; just music.
          </p>
        </div>

        <div
          className={`mt-10 transition-all duration-1200 delay-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {submitted ? (
            <div className="flex items-center justify-center gap-2 text-accent-jesko font-display font-bold">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              You&apos;re on the list.
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm font-body text-white placeholder:text-white/30 focus:outline-none focus:border-accent-jesko/50 focus:ring-1 focus:ring-accent-jesko/20 transition-all"
              />
              <button
                type="submit"
                className="bg-accent-jesko text-black font-display font-bold text-sm px-6 py-3 rounded-lg hover:brightness-110 active:scale-[0.98] transition-all duration-200 whitespace-nowrap cursor-pointer"
              >
                SIGN ME UP
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
