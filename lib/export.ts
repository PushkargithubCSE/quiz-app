"use client";

import { Participant } from "./questions";

export async function exportToExcel(participants: Participant[]): Promise<void> {
  const XLSX = await import("xlsx");

  const worksheetData = [
    ["Rank", "Participant Name", "Score", "Max Score", "Percentage", "Time Taken (s)", "Completed At"],
    ...participants
      .sort((a, b) => b.score - a.score)
      .map((p, index) => [
        index + 1,
        p.name,
        p.score,
        p.totalQuestions,
        `${Math.round((p.score / p.totalQuestions) * 100)}%`,
        p.timeTaken,
        new Date(p.completedAt).toLocaleString(),
      ]),
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();

  // Style the header row
  worksheet["!cols"] = [
    { wch: 8 },
    { wch: 24 },
    { wch: 10 },
    { wch: 12 },
    { wch: 14 },
    { wch: 18 },
    { wch: 24 },
  ];

  XLSX.utils.book_append_sheet(workbook, worksheet, "Quiz Results");

  // Summary sheet
  const summaryData = [
    ["Quiz Results Summary"],
    [""],
    ["Total Participants", participants.length],
    ["Average Score", participants.length > 0 ? (participants.reduce((a, b) => a + b.score, 0) / participants.length).toFixed(1) : 0],
    ["Highest Score", participants.length > 0 ? Math.max(...participants.map((p) => p.score)) : 0],
    ["Lowest Score", participants.length > 0 ? Math.min(...participants.map((p) => p.score)) : 0],
    [""],
    ["Score Distribution"],
    ["90-100%", participants.filter((p) => p.score / p.totalQuestions >= 0.9).length],
    ["70-89%", participants.filter((p) => p.score / p.totalQuestions >= 0.7 && p.score / p.totalQuestions < 0.9).length],
    ["50-69%", participants.filter((p) => p.score / p.totalQuestions >= 0.5 && p.score / p.totalQuestions < 0.7).length],
    ["Below 50%", participants.filter((p) => p.score / p.totalQuestions < 0.5).length],
  ];

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  summarySheet["!cols"] = [{ wch: 22 }, { wch: 16 }];
  XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary");

  XLSX.writeFile(workbook, "quiz_results.xlsx");
}

export async function exportToPDF(participants: Participant[]): Promise<void> {
  const { default: jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");

  const doc = new jsPDF();

  // Header
  doc.setFillColor(10, 10, 15);
  doc.rect(0, 0, 210, 40, "F");

  doc.setTextColor(212, 168, 83);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("QUIZ RESULTS REPORT", 105, 18, { align: "center" });

  doc.setTextColor(200, 200, 200);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Generated: ${new Date().toLocaleString()}`, 105, 28, { align: "center" });
  doc.text(`Total Participants: ${participants.length}`, 105, 35, { align: "center" });

  // Summary stats
  const avgScore = participants.length > 0
    ? (participants.reduce((a, b) => a + b.score, 0) / participants.length).toFixed(1)
    : "0";
  const topScore = participants.length > 0 ? Math.max(...participants.map((p) => p.score)) : 0;

  doc.setFillColor(245, 240, 232);
  doc.rect(10, 45, 190, 22, "F");
  doc.setTextColor(10, 10, 15);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(`Average Score: ${avgScore}/10`, 20, 54);
  doc.text(`Top Score: ${topScore}/10`, 80, 54);
  doc.text(`Pass Rate (≥50%): ${participants.filter((p) => p.score / p.totalQuestions >= 0.5).length}/${participants.length}`, 140, 54);

  // Participants table
  const sorted = [...participants].sort((a, b) => b.score - a.score);

  autoTable(doc, {
    startY: 72,
    head: [["Rank", "Name", "Score", "Percentage", "Time", "Completed At"]],
    body: sorted.map((p, i) => [
      `#${i + 1}`,
      p.name,
      `${p.score}/${p.totalQuestions}`,
      `${Math.round((p.score / p.totalQuestions) * 100)}%`,
      `${p.timeTaken}s`,
      new Date(p.completedAt).toLocaleDateString(),
    ]),
    headStyles: {
      fillColor: [10, 10, 15],
      textColor: [212, 168, 83],
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [245, 240, 232],
    },
    styles: {
      fontSize: 9,
      cellPadding: 4,
    },
    columnStyles: {
      0: { cellWidth: 14, halign: "center" },
      2: { halign: "center" },
      3: { halign: "center" },
      4: { halign: "center" },
    },
  });

  doc.save("quiz_results.pdf");
}
