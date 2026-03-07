"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { questions } from "@/lib/questions";
import { Participant } from "@/lib/questions";

export default function QuizPage() {
  const router = useRouter();
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [participantInfo, setParticipantInfo] = useState<{ id: string; name: string; phone: string; state: string; district: string; block: string; gp: string; startTime: number } | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const data = sessionStorage.getItem("quiz_participant");
    if (!data) {
      router.push("/");
      return;
    }
    setParticipantInfo(JSON.parse(data));
  }, [router]);

  const question = questions[currentQ];
  const progress = (currentQ / questions.length) * 100;
  const optionLabels = ["A", "B", "C", "D"];

  // User can freely change answer — no reveal
  const handleSelect = (idx: number) => {
    setSelectedAnswer(idx);
  };

  const handleNext = useCallback(async () => {
    if (selectedAnswer === null) return;
    const newAnswers = [...answers, selectedAnswer];

    if (currentQ < questions.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setAnswers(newAnswers);
        setCurrentQ(currentQ + 1);
        setSelectedAnswer(null);
        setIsTransitioning(false);
      }, 300);
    } else {
      const score = newAnswers.filter((a, i) => a === questions[i].correctAnswer).length;
      if (participantInfo) {
        const participant: Participant = {
          id: participantInfo.id,
          name: participantInfo.name,
          phone: participantInfo.phone,
          state: participantInfo.state,
          district: participantInfo.district,
          block: participantInfo.block,
          gp: participantInfo.gp,
          score,
          totalQuestions: questions.length,
          answers: newAnswers,
          completedAt: new Date().toISOString(),
          timeTaken: Math.floor((Date.now() - participantInfo.startTime) / 1000),
        };

        setIsSaving(true);
        try {
          const res = await fetch("/api/participants", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(participant),
          });
          if (!res.ok) {
            const data = await res.json();
            if (data.error === "already_attempted") {
              router.push("/?error=already_attempted");
              return;
            }
          }
        } catch (err) {
          console.error("Failed to save result:", err);
        } finally {
          setIsSaving(false);
        }

        sessionStorage.setItem("quiz_result", JSON.stringify(participant));
        router.push("/results");
      }
    }
  }, [selectedAnswer, answers, currentQ, participantInfo, router]);

  // Go back to previous question and restore previous answer
  const handleBack = () => {
    if (currentQ === 0) return;
    setIsTransitioning(true);
    setTimeout(() => {
      const prevAnswers = [...answers];
      const prevSelected = prevAnswers.pop() ?? null;
      setAnswers(prevAnswers);
      setCurrentQ(currentQ - 1);
      setSelectedAnswer(prevSelected);
      setIsTransitioning(false);
    }, 300);
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" && selectedAnswer !== null && !isSaving) handleNext();
      const map: { [key: string]: number } = { a: 0, b: 1, c: 2, d: 3, "1": 0, "2": 1, "3": 2, "4": 3 };
      if (map[e.key.toLowerCase()] !== undefined) handleSelect(map[e.key.toLowerCase()]);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedAnswer, handleNext, isSaving]);

  if (!participantInfo) return null;

  const isLastQuestion = currentQ === questions.length - 1;

  return (
    <main className="min-h-screen bg-ink flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gold/4 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gold/4 rounded-full blur-3xl" />
      </div>

      <div className={`w-full max-w-2xl relative z-10 transition-all duration-300 ${isTransitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}`}>

        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/")}
              className="text-parchment/30 hover:text-parchment/60 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <span className="text-parchment/40 text-sm font-body">{participantInfo.name}</span>
          </div>
          <div className="font-mono text-gold text-sm font-medium">
            {currentQ + 1} <span className="text-parchment/30">/ {questions.length}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="h-1 bg-parchment/8 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-gold to-gold-light rounded-full progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            {questions.map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                  i < currentQ ? "bg-gold" : i === currentQ ? "bg-gold animate-pulse" : "bg-parchment/15"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Category badge */}
        <div className="flex items-center gap-3 mb-5">
          <span className="px-3 py-1 rounded-full bg-gold/10 border border-gold/20 text-gold text-xs font-mono tracking-wide uppercase">
            {question.category}
          </span>
          <div className="flex-1 h-px bg-parchment/8" />
        </div>

        {/* Question */}
        <div className="mb-8">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-parchment leading-tight">
            {question.question}
          </h1>
        </div>

        {/* Options — no reveal, freely selectable */}
        <div className="space-y-3 mb-8">
          {question.options.map((option, idx) => {
            const isSelected = selectedAnswer === idx;

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                className={`option-card w-full flex items-center gap-4 px-5 py-4 rounded-xl border transition-all duration-200 ${
                  isSelected
                    ? "border-gold/60 bg-gold/10 text-parchment"
                    : "border-parchment/10 bg-parchment/3 text-parchment hover:border-gold/30 hover:bg-gold/5 cursor-pointer"
                }`}
              >
                {/* Label */}
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-mono font-bold flex-shrink-0 transition-colors ${
                  isSelected ? "bg-gold/20 text-gold" : "bg-parchment/5 text-parchment/40"
                }`}>
                  {optionLabels[idx]}
                </span>

                {/* Option text */}
                <span className="font-body text-sm text-left flex-1">{option}</span>

                {/* Selected checkmark */}
                {isSelected && (
                  <span className="flex-shrink-0">
                    <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between">
          {/* Back button */}
          <button
            onClick={handleBack}
            disabled={currentQ === 0}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-body font-medium text-sm transition-all duration-200 ${
              currentQ === 0
                ? "text-parchment/15 cursor-not-allowed"
                : "border border-parchment/15 text-parchment/50 hover:border-gold/30 hover:text-parchment/80"
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
            </svg>
            Back
          </button>

          <p className="text-parchment/20 text-xs font-body">
            {selectedAnswer === null ? "Select an answer" : "You can change your answer"}
          </p>

          {/* Next / Finish button */}
          <button
            onClick={handleNext}
            disabled={selectedAnswer === null || isSaving}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-body font-semibold text-sm transition-all duration-300 ${
              selectedAnswer !== null && !isSaving
                ? "bg-gold text-ink hover:bg-gold-light scale-100"
                : "bg-parchment/5 text-parchment/20 cursor-not-allowed scale-95"
            }`}
          >
            {isSaving ? (
              <>
                Saving...
                <span className="w-4 h-4 border-2 border-parchment/20 border-t-parchment/60 rounded-full animate-spin" />
              </>
            ) : (
              <>
                {isLastQuestion ? "Finish Quiz" : "Next Question"}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </button>
        </div>

        {/* Keyboard hint */}
        <p className="text-center text-parchment/15 text-xs font-mono mt-6">
          Press 1–4 to select · Enter to continue
        </p>
      </div>
    </main>
  );
}