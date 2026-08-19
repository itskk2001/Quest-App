import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { scoreManualTask, estimatedMinutesFromDifficulty } from "@/lib/difficultyScorer";

// GET /api/tasks?userId=...
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ tasks: data });
}

// POST /api/tasks  { userId, title, description, dueDate }
export async function POST(request) {
  const body = await request.json();
  const { userId, title, description, dueDate } = body;

  if (!userId || !title) {
    return NextResponse.json({ error: "userId and title are required" }, { status: 400 });
  }

  const difficulty_score = scoreManualTask({ title, description, dueDate });
  const estimated_minutes = estimatedMinutesFromDifficulty(difficulty_score);
  const xp_value = difficulty_score * 10;

  const { data, error } = await supabase
    .from("tasks")
    .insert({
      user_id: userId,
      source_type: "manual",
      title,
      description,
      difficulty_score,
      estimated_minutes,
      xp_value,
      status: "pending",
      due_date: dueDate ?? null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ task: data }, { status: 201 });
}
