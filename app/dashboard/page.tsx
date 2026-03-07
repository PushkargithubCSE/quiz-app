"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Participant } from "@/lib/questions";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from "recharts";

export default function DashboardPage() {
  const router = useRouter();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [activeTab, setActiveTab] = useState<"leaderboard" | "analytics">("leaderboard");
  const [isExporting, setIsExporting] = useState<"excel" | "pdf" | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const data = sessionStorage.getItem("quiz_result");
    if (!data) {
      router.push("/");
      return;
    }
    const participant = JSON.parse(data);
    if (participant.phone !== "9871291315") {
      router.push("/");
      return;
    }

    fetch("/api/participants")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch");
        return r.json();
      })
      .then((data) => {
        setParticipants(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load participants. Please try again.");
        setIsLoading(false);
      });
  }, [router]);

  const sorted = [...participants].sort((a, b) => b.score - a.score || a.timeTaken - b.timeTaken);
  const avgScore = participants.length > 0
    ? (participants.reduce((a, b) => a + b.score, 0) / participants.length).toFixed(1)
    : "0";
  const topScore = participants.length > 0 ? Math.max(...participants.map((p) => p.score)) : 0;
  const passCount = participants.filter((p) => p.score / p.totalQuestions >= 0.5).length;

  const scoreDistribution = [
    { range: "0–2", count: participants.filter((p) => p.score <= 2).length },
    { range: "3–4", count: participants.filter((p) => p.score >= 3 && p.score <= 4).length },
    { range: "5–6", count: participants.filter((p) => p.score >= 5 && p.score <= 6).length },
    { range: "7–8", count: participants.filter((p) => p.score >= 7 && p.score <= 8).length },
    { range: "9–10", count: participants.filter((p) => p.score >= 9).length },
  ];

  const gradeData = [
    { name: "Excellent (90%+)", value: participants.filter((p) => p.score / p.totalQuestions >= 0.9).length, color: "#D4A853" },
    { name: "Great (70–89%)", value: participants.filter((p) => p.score / p.totalQuestions >= 0.7 && p.score / p.totalQuestions < 0.9).length, color: "#4A7C59" },
    { name: "Pass (50–69%)", value: participants.filter((p) => p.score / p.totalQuestions >= 0.5 && p.score / p.totalQuestions < 0.7).length, color: "#7A8B6F" },
    { name: "Fail (<50%)", value: participants.filter((p) => p.score / p.totalQuestions < 0.5).length, color: "#C23B22" },
  ].filter((d) => d.value > 0);

  const timelineData = [...participants]
    .sort((a, b) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime())
    .map((p, i) => ({ index: i + 1, score: p.score, name: p.name.split(" ")[0] }));

  const handleExport = async (type: "excel" | "pdf") => {
    if (participants.length === 0) return;
    setIsExporting(type);
    try {
      const { exportToExcel, exportToPDF } = await import("@/lib/export");
      if (type === "excel") await exportToExcel(participants);
      else await exportToPDF(participants);
    } catch (e) {
      console.error(e);
    } finally {
      setIsExporting(null);
    }
  };

  const handleClear = async () => {
    try {
      await fetch("/api/participants", { method: "DELETE" });
      setParticipants([]);
      setShowClearConfirm(false);
    } catch (err) {
      console.error("Failed to clear:", err);
    }
  };

  const rankMedal = (i: number) => {
    if (i === 0) return "🥇";
    if (i === 1) return "🥈";
    if (i === 2) return "🥉";
    return null;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload?.length) {
      return (
        <div className="bg-slate border border-gold/20 rounded-lg px-3 py-2">
          <p className="text-parchment/60 text-xs font-body">{label}</p>
          <p className="text-gold text-sm font-mono font-bold">{payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-ink flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-gold/20 border-t-gold rounded-full animate-spin mx-auto mb-4" />
          <p className="text-parchment/40 font-body text-sm">Loading dashboard...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-ink flex items-center justify-center p-6">
        <div className="text-center">
          <div className="font-display text-5xl mb-4">⚠️</div>
          <p className="text-parchment/60 font-body mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gold text-ink rounded-xl font-body font-semibold text-sm hover:bg-gold-light transition-all"
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-ink p-6 relative">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gold/4 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/")}
              className="text-parchment/30 hover:text-parchment/60 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div>
              <h1 className="font-display text-2xl font-bold text-parchment">Dashboard</h1>
              <p className="text-parchment/30 text-xs font-body">
                {participants.length} participants · All time
              </p>
            </div>
          </div>

          {/* Export buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleExport("excel")}
              disabled={isExporting !== null || participants.length === 0}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-sage/30 text-sage hover:bg-sage/10 transition-all text-xs font-body font-medium disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isExporting === "excel" ? (
                <span className="w-3.5 h-3.5 border border-sage/40 border-t-sage rounded-full animate-spin" />
              ) : (
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              )}
              Excel
            </button>
            <button
              onClick={() => handleExport("pdf")}
              disabled={isExporting !== null || participants.length === 0}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-crimson/30 text-crimson hover:bg-crimson/10 transition-all text-xs font-body font-medium disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isExporting === "pdf" ? (
                <span className="w-3.5 h-3.5 border border-crimson/40 border-t-crimson rounded-full animate-spin" />
              ) : (
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              )}
              PDF
            </button>
          </div>
        </div>

        {/* Stats summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Total Participants", value: participants.length.toString(), sub: "all time" },
            { label: "Average Score", value: `${avgScore}/10`, sub: "mean score" },
            { label: "Top Score", value: `${topScore}/10`, sub: "highest ever" },
            {
              label: "Pass Rate",
              value: participants.length > 0 ? `${Math.round((passCount / participants.length) * 100)}%` : "—",
              sub: "score ≥50%",
            },
          ].map((s) => (
            <div key={s.label} className="bg-slate/30 border border-gold/10 rounded-xl p-4">
              <div className="font-display text-2xl font-bold text-gold">{s.value}</div>
              <div className="text-parchment/60 text-xs font-body mt-1">{s.label}</div>
              <div className="text-parchment/25 text-xs font-mono mt-0.5">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-parchment/5 rounded-xl mb-6 w-fit">
          {(["leaderboard", "analytics"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-sm font-body font-medium capitalize transition-all ${
                activeTab === tab ? "bg-gold text-ink" : "text-parchment/40 hover:text-parchment/60"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Empty state */}
        {participants.length === 0 ? (
          <div className="text-center py-20 text-parchment/20">
            <div className="font-display text-6xl mb-4">📋</div>
            <p className="font-body text-lg">No participants yet</p>
            <p className="font-body text-sm mt-1">Complete a quiz to see results here</p>
            <button
              onClick={() => router.push("/")}
              className="mt-6 px-6 py-3 bg-gold text-ink rounded-xl font-body font-semibold text-sm hover:bg-gold-light transition-all"
            >
              Start a Quiz
            </button>
          </div>
        ) : activeTab === "leaderboard" ? (

          /* ── Leaderboard ── */
          <div className="bg-slate/20 border border-gold/10 rounded-2xl overflow-hidden overflow-x-auto">
            <table className="w-full min-w-[900px]">

              {/* Table header */}
              <thead>
                <tr className="border-b border-parchment/8 text-parchment/30 text-xs font-mono uppercase tracking-wider">
                  <th className="px-4 py-3 text-left w-12">Rank</th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Phone</th>
                  <th className="px-4 py-3 text-left">State</th>
                  <th className="px-4 py-3 text-left">District</th>
                  <th className="px-4 py-3 text-left">Block</th>
                  <th className="px-4 py-3 text-left">GP</th>
                  <th className="px-4 py-3 text-center">Score</th>
                  <th className="px-4 py-3 text-center">%</th>
                  <th className="px-4 py-3 text-center">Time</th>
                  <th className="px-4 py-3 text-center">Date</th>
                </tr>
              </thead>

              {/* Table rows */}
              <tbody>
                {sorted.map((p, i) => {
                  const pct = Math.round((p.score / p.totalQuestions) * 100);
                  const medal = rankMedal(i);
                  const grade =
                    pct >= 90 ? "text-gold"
                    : pct >= 70 ? "text-sage"
                    : pct >= 50 ? "text-parchment/60"
                    : "text-crimson/70";

                  return (
                    <tr
                      key={p.id}
                      className={`border-b border-parchment/5 last:border-b-0 hover:bg-parchment/3 transition-colors ${
                        i === 0 ? "bg-gold/5" : ""
                      }`}
                    >
                      {/* Rank */}
                      <td className="px-4 py-4">
                        {medal ? (
                          <span className="text-lg">{medal}</span>
                        ) : (
                          <span className="font-mono text-parchment/30 text-sm">#{i + 1}</span>
                        )}
                      </td>

                      {/* Name */}
                      <td className="px-4 py-4">
                        <div className="font-body text-parchment text-sm font-medium whitespace-nowrap">{p.name}</div>
                        <div className="font-mono text-parchment/25 text-xs">{p.id.slice(0, 8)}</div>
                      </td>

                      {/* Phone */}
                      <td className="px-4 py-4">
                        <span className="font-mono text-parchment/35 text-xs whitespace-nowrap">{p.phone}</span>
                      </td>

                      {/* State */}
                      <td className="px-4 py-4">
                        <span className="text-parchment/60 text-xs font-body">{p.state || "—"}</span>
                      </td>

                      {/* District */}
                      <td className="px-4 py-4">
                        <span className="text-parchment/60 text-xs font-body">{p.district || "—"}</span>
                      </td>

                      {/* Block */}
                      <td className="px-4 py-4">
                        <span className="text-parchment/40 text-xs font-body">{p.block || "—"}</span>
                      </td>

                      {/* GP */}
                      <td className="px-4 py-4">
                        <span className="text-parchment/40 text-xs font-body">{p.gp || "—"}</span>
                      </td>

                      {/* Score */}
                      <td className="px-4 py-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <span className={`font-display text-lg font-bold ${grade}`}>{p.score}</span>
                          <span className="text-parchment/25 text-xs font-mono">/{p.totalQuestions}</span>
                        </div>
                      </td>

                      {/* Percentage */}
                      <td className="px-4 py-4 text-center">
                        <span className={`font-mono text-sm font-bold ${grade}`}>{pct}%</span>
                      </td>

                      {/* Time */}
                      <td className="px-4 py-4 text-center">
                        <span className="font-mono text-parchment/40 text-xs whitespace-nowrap">
                          {Math.floor(p.timeTaken / 60) > 0 ? `${Math.floor(p.timeTaken / 60)}m ` : ""}
                          {p.timeTaken % 60}s
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-4 py-4 text-center">
                        <span className="font-mono text-parchment/25 text-xs whitespace-nowrap">
                          {new Date(p.completedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        ) : (

          /* ── Analytics ── */
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Score distribution */}
              <div className="bg-slate/20 border border-gold/10 rounded-2xl p-6">
                <h3 className="font-display text-parchment text-lg mb-5">Score Distribution</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={scoreDistribution}>
                    <XAxis
                      dataKey="range"
                      tick={{ fill: "rgba(245,240,232,0.4)", fontSize: 11, fontFamily: "DM Sans" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: "rgba(245,240,232,0.3)", fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" fill="#D4A853" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Grade breakdown pie */}
              <div className="bg-slate/20 border border-gold/10 rounded-2xl p-6">
                <h3 className="font-display text-parchment text-lg mb-5">Grade Breakdown</h3>
                {gradeData.length > 0 ? (
                  <div className="flex items-center gap-4">
                    <ResponsiveContainer width={160} height={160}>
                      <PieChart>
                        <Pie
                          data={gradeData}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={70}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {gradeData.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-2 flex-1">
                      {gradeData.map((d) => (
                        <div key={d.name} className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
                          <span className="text-parchment/50 text-xs font-body flex-1 truncate">{d.name}</span>
                          <span className="font-mono text-parchment/60 text-xs">{d.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-40 text-parchment/20 text-sm font-body">
                    No data
                  </div>
                )}
              </div>
            </div>

            {/* Score timeline */}
            {timelineData.length > 1 && (
              <div className="bg-slate/20 border border-gold/10 rounded-2xl p-6">
                <h3 className="font-display text-parchment text-lg mb-5">Score Timeline</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={timelineData}>
                    <XAxis
                      dataKey="index"
                      tick={{ fill: "rgba(245,240,232,0.4)", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      label={{ value: "Participant #", position: "insideBottom", offset: -2, fill: "rgba(245,240,232,0.2)", fontSize: 10 }}
                    />
                    <YAxis
                      domain={[0, 10]}
                      tick={{ fill: "rgba(245,240,232,0.3)", fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#D4A853"
                      strokeWidth={2}
                      dot={{ fill: "#D4A853", strokeWidth: 0, r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}

        {/* Clear data */}
        {participants.length > 0 && (
          <div className="mt-6 flex justify-end">
            {showClearConfirm ? (
              <div className="flex items-center gap-3">
                <span className="text-parchment/40 text-xs font-body">Clear all data from database?</span>
                <button
                  onClick={handleClear}
                  className="px-4 py-1.5 rounded-lg bg-crimson/80 text-white text-xs font-body hover:bg-crimson transition-colors"
                >
                  Yes, clear
                </button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="px-4 py-1.5 rounded-lg border border-parchment/10 text-parchment/40 text-xs font-body hover:text-parchment/60 transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="text-parchment/20 hover:text-crimson/60 text-xs font-body transition-colors"
              >
                Clear all data
              </button>
            )}
          </div>
        )}
      </div>
    </main>
  );
}