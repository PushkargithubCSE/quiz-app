import { sql, initDB } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  await initDB();
  const rows = await sql`
    SELECT * FROM participants ORDER BY score DESC, time_taken ASC
  `;
  const participants = rows.map((r) => ({
    id: r.id,
    name: r.name,
    phone: r.phone,
    state: r.state,
    district: r.district,
    block: r.block,
    gp: r.gp,
    score: r.score,
    totalQuestions: r.total_questions,
    answers: r.answers,
    completedAt: r.completed_at,
    timeTaken: r.time_taken,
  }));
  return NextResponse.json(participants);
}

export async function POST(req: NextRequest) {
  await initDB();
  const body = await req.json();
  try {
    await sql`
      INSERT INTO participants (id, name, phone, state, district, block, gp, score, total_questions, answers, completed_at, time_taken)
      VALUES (
        ${body.id},
        ${body.name},
        ${body.phone},
        ${body.state},
        ${body.district},
        ${body.block || ''},
        ${body.gp || ''},
        ${body.score},
        ${body.totalQuestions},
        ${JSON.stringify(body.answers)},
        ${body.completedAt},
        ${body.timeTaken}
      )
    `;
    return NextResponse.json({ success: true });
  } catch (err: any) {
    if (err.message?.includes("unique") || err.code === "23505") {
      return NextResponse.json({ error: "already_attempted" }, { status: 409 });
    }
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}

export async function DELETE() {
  await sql`DELETE FROM participants`;
  return NextResponse.json({ success: true });
}