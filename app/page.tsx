"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { generateId } from "@/lib/store";

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [block, setBlock] = useState("");
  const [gp, setGp] = useState("");
  const [error, setError] = useState("");
  const [isStarting, setIsStarting] = useState(false);

  const handleStart = async () => {
    setError("");

    if (!name.trim() || name.trim().length < 2) {
      setError("Please enter a valid name (at least 2 characters)");
      return;
    }
    const cleanPhone = phone.trim().replace(/\s+/g, "");
    if (!/^\+?[0-9]{7,15}$/.test(cleanPhone)) {
      setError("Please enter a valid contact number");
      return;
    }
    if (!state.trim()) {
      setError("State is required");
      return;
    }
    if (!district.trim()) {
      setError("District is required");
      return;
    }

    setIsStarting(true);

    const res = await fetch(`/api/check-phone?phone=${encodeURIComponent(cleanPhone)}`);
    const data = await res.json();

    if (data.attempted) {
      if (cleanPhone === "9871291315") {
        // Admin can skip quiz and go directly to dashboard
        sessionStorage.setItem(
          "quiz_result",
          JSON.stringify({ phone: "9871291315" })
        );
        router.push("/dashboard");
        return;
      }
      setError("This contact number has already attempted the quiz.");
      setIsStarting(false);
      return;
    }

    const id = generateId();
    const startTime = Date.now();
    sessionStorage.setItem(
      "quiz_participant",
      JSON.stringify({
        id,
        name: name.trim(),
        phone: cleanPhone,
        state: state.trim(),
        district: district.trim(),
        block: block.trim(),
        gp: gp.trim(),
        startTime,
      })
    );
    router.push("/quiz");
  };

  const inputClass = "w-full bg-ink/60 border border-gold/20 rounded-xl px-5 py-3.5 text-parchment font-body placeholder:text-parchment/20 focus:outline-none focus:border-gold/50 focus:bg-ink/80 transition-all text-sm";
  const labelClass = "block text-parchment/60 text-xs font-body font-medium tracking-wider uppercase mb-2";

  return (
    <main className="min-h-screen bg-ink flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gold/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-gold/5 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-gold/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-gold/8" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#D4A853 1px, transparent 1px), linear-gradient(90deg, #D4A853 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="w-full max-w-lg relative z-10">
        {/* Header badge */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/30 bg-gold/5 text-gold text-xs font-mono tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
            Knowledge Challenge
          </div>
        </div>

        {/* Main card */}
        <div className="bg-slate/40 border border-gold/15 rounded-2xl p-8 glass-card">
          {/* Title */}
          <div className="text-center mb-8">
            <div className="font-display text-5xl font-bold text-parchment mb-2 leading-tight">
              Quiz<span className="gold-shimmer">Master</span>
            </div>
            <div className="deco-line w-32 mx-auto mt-4 mb-4" />
            <p className="text-parchment/50 font-body text-sm leading-relaxed">
              10 questions · 4 choices each · Instant results
            </p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[
              { num: "10", label: "Questions" },
              { num: "4", label: "Options Each" },
              { num: "1", label: "Attempt Only" },
            ].map((s) => (
              <div key={s.label} className="text-center p-3 rounded-xl bg-parchment/3 border border-gold/10">
                <div className="font-display text-2xl text-gold font-bold">{s.num}</div>
                <div className="text-parchment/40 text-xs font-body mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Form fields */}
          <div className="space-y-4 mb-6">

            {/* Name */}
            <div>
              <label className={labelClass}>
                Your Name <span className="text-crimson">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleStart()}
                placeholder="Enter your full name..."
                maxLength={40}
                className={inputClass}
              />
            </div>

            {/* Contact Number */}
            <div>
              <label className={labelClass}>
                Contact Number <span className="text-crimson">*</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => { setPhone(e.target.value); setError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleStart()}
                placeholder="+91 9876543210"
                maxLength={16}
                className={inputClass}
              />
            </div>

            {/* State + District — side by side */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>
                  State <span className="text-crimson">*</span>
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => { setState(e.target.value); setError(""); }}
                  placeholder="e.g. Bihar"
                  maxLength={50}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>
                  District <span className="text-crimson">*</span>
                </label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => { setDistrict(e.target.value); setError(""); }}
                  placeholder="e.g. Patna"
                  maxLength={50}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Block + GP — side by side */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>
                  Block <span className="text-parchment/25 normal-case font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={block}
                  onChange={(e) => setBlock(e.target.value)}
                  placeholder="e.g. Danapur"
                  maxLength={50}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>
                  GP <span className="text-parchment/25 normal-case font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={gp}
                  onChange={(e) => setGp(e.target.value)}
                  placeholder="Gram Panchayat"
                  maxLength={50}
                  className={inputClass}
                />
              </div>
            </div>

          </div>

          {/* Mandatory note */}
          <p className="text-parchment/25 text-xs font-body mb-4">
            <span className="text-crimson">*</span> Required fields
          </p>

          {/* Error */}
          {error && (
            <p className="mb-4 text-crimson text-xs font-body bg-crimson/10 border border-crimson/20 rounded-lg px-4 py-2">
              {error}
            </p>
          )}

          {/* Start button */}
          <button
            onClick={handleStart}
            disabled={isStarting}
            className="w-full relative overflow-hidden rounded-xl py-4 font-body font-semibold text-ink text-sm tracking-wide transition-all duration-300 group"
            style={{
              background: "linear-gradient(135deg, #D4A853, #F0C87A, #D4A853)",
              backgroundSize: "200%",
            }}
          >
            <span className={`relative z-10 flex items-center justify-center gap-2 transition-all ${isStarting ? "opacity-0" : "opacity-100"}`}>
              Begin the Challenge
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
            {isStarting && (
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="w-5 h-5 border-2 border-ink/30 border-t-ink rounded-full animate-spin" />
              </span>
            )}
          </button>

          {/* Footer link */}
          <div className="mt-6 text-center">
            <button
              onClick={() => router.push("/dashboard")}
              className="text-parchment/30 hover:text-gold text-xs font-body transition-colors inline-flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              View Leaderboard & Dashboard
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="mt-6 flex flex-wrap gap-2 justify-center">
          {["Science", "History", "Art", "Geography", "Technology", "Literature"].map((cat) => (
            <span key={cat} className="px-3 py-1 rounded-full bg-parchment/5 border border-parchment/10 text-parchment/30 text-xs font-body">
              {cat}
            </span>
          ))}
        </div>
      </div>
    </main>
  );
}