"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Participant } from "@/lib/questions";
import { questions } from "@/lib/questions";

export default function ResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<Participant | null>(null);
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const data = sessionStorage.getItem("quiz_result");
    if (!data) { router.push("/"); return; }
    const p: Participant = JSON.parse(data);
    setResult(p);

    // Animate score
    let current = 0;
    const interval = setInterval(() => {
      current++;
      setAnimatedScore(current);
      if (current >= p.score) clearInterval(interval);
    }, 120);
    return () => clearInterval(interval);
  }, [router]);

  if (!result) return null;

  const pct = Math.round((result.score / result.totalQuestions) * 100);
  const grade = pct >= 90 ? { label: "Excellent!", color: "text-gold", desc: "Outstanding performance!" }
    : pct >= 70 ? { label: "Great Job!", color: "text-sage", desc: "Well above average!" }
    : pct >= 50 ? { label: "Good Work", color: "text-gold/70", desc: "Passing score achieved." }
    : { label: "Keep Trying", color: "text-crimson", desc: "Practice makes perfect." };

  const mins = Math.floor(result.timeTaken / 60);
  const secs = result.timeTaken % 60;
  const timeStr = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;

  // Conic gradient for score circle
  const conicPct = `${pct * 3.6}deg`;

  return (
    <main className="min-h-screen bg-ink flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 blur-3xl rounded-full" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/5 blur-3xl rounded-full" />
      </div>

      <div className="w-full max-w-xl relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/30 bg-gold/5 text-gold text-xs font-mono tracking-widest uppercase mb-4">
            Quiz Complete
          </div>
          <h1 className="font-display text-4xl font-bold text-parchment">
            Well done, {result.name.split(" ")[0]}!
          </h1>
        </div>

        {/* Score circle */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div
              className="w-44 h-44 rounded-full flex items-center justify-center"
              style={{
                background: `conic-gradient(#D4A853 ${conicPct}, rgba(255,255,255,0.05) ${conicPct})`,
              }}
            >
              <div className="w-36 h-36 rounded-full bg-ink flex flex-col items-center justify-center">
                <div className="font-display text-5xl font-bold text-parchment leading-none">
                  {animatedScore}
                </div>
                <div className="font-body text-parchment/40 text-sm mt-1">out of {result.totalQuestions}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Grade */}
        <div className="text-center mb-8">
          <div className={`font-display text-3xl font-bold ${grade.color} mb-1`}>{grade.label}</div>
          <p className="text-parchment/40 font-body text-sm">{grade.desc}</p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "Score", value: `${pct}%` },
            { label: "Time Taken", value: timeStr },
            { label: "Correct", value: `${result.score}/${result.totalQuestions}` },
          ].map((s) => (
            <div key={s.label} className="text-center p-4 rounded-xl bg-parchment/3 border border-gold/10">
              <div className="font-display text-xl text-gold font-bold">{s.value}</div>
              <div className="text-parchment/40 text-xs font-body mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Answer review */}
        <div className="bg-slate/30 border border-gold/10 rounded-2xl p-5 mb-6">
          <h3 className="font-display text-parchment text-lg mb-4">Answer Review</h3>
          <div className="space-y-2">
            {questions.map((q, i) => {
              const correct = result.answers[i] === q.correctAnswer;
              return (
                <div key={i} className={`flex items-start gap-3 p-3 rounded-lg ${correct ? "bg-sage/8" : "bg-crimson/8"}`}>
                  <span className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${correct ? "bg-sage/20" : "bg-crimson/20"}`}>
                    {correct ? (
                      <svg className="w-3 h-3 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-3 h-3 text-crimson" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-parchment/70 text-xs font-body leading-tight truncate">{q.question}</p>
                    {!correct && (
                      <p className="text-sage/70 text-xs font-body mt-0.5">
                        Correct: {q.options[q.correctAnswer]}
                      </p>
                    )}
                  </div>
                  <span className="text-parchment/30 text-xs font-mono flex-shrink-0">Q{i + 1}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
<div className="grid grid-cols-2 gap-3">
  <button
    onClick={() => { sessionStorage.clear(); router.push("/"); }}
    className="py-3.5 rounded-xl border border-gold/20 text-parchment/60 hover:text-parchment hover:border-gold/40 transition-all font-body text-sm font-medium"
  >
    Play Again
  </button>

  {result.phone === "9871291315" ? (
    <button
      onClick={() => router.push("/dashboard")}
      className="py-3.5 rounded-xl bg-gold text-ink font-body text-sm font-semibold hover:bg-gold-light transition-all"
    >
      View Dashboard →
    </button>
  ) : (
    <button
      disabled
      className="py-3.5 rounded-xl bg-parchment/5 border border-parchment/10 text-parchment/20 cursor-not-allowed font-body text-sm font-medium"
      title="Admin access only"
    >
      🔒 Admin Only
    </button>
  )}
</div>
      </div>
    </main>
  );
}
