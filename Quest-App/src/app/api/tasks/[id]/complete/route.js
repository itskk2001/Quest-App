import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { calculateXP, applyXP, updateStreak, rewardPointsFromXP } from "@/lib/xpEngine";

// POST /api/tasks/:id/complete  { userId }
export async function POST(request, { params }) {
  const taskId = params.id;
  const { userId } = await request.json();

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  // 1. Fetch task + user
  const { data: task, error: taskError } = await supabase
    .from("tasks")
    .select("*")
    .eq("id", taskId)
    .single();
  if (taskError) return NextResponse.json({ error: taskError.message }, { status: 404 });

  const { data: user, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();
  if (userError) return NextResponse.json({ error: userError.message }, { status: 404 });

  // 2. Compute new streak, XP, level
  const newStreak = updateStreak(user);
  const xpGained = calculateXP(task.difficulty_score, newStreak);
  const { user: leveledUser, leveledUp } = applyXP(user, xpGained);
  const newRewardPoints = user.reward_points + rewardPointsFromXP(xpGained);

  // 3. Persist updates
  const { error: updateTaskError } = await supabase
    .from("tasks")
    .update({ status: "done", completed_at: new Date().toISOString() })
    .eq("id", taskId);
  if (updateTaskError)
    return NextResponse.json({ error: updateTaskError.message }, { status: 500 });

  const { data: updatedUser, error: updateUserError } = await supabase
    .from("users")
    .update({
      level: leveledUser.level,
      current_xp: leveledUser.current_xp,
      streak_count: newStreak,
      reward_points: newRewardPoints,
      last_active_date: new Date().toISOString(),
    })
    .eq("id", userId)
    .select()
    .single();
  if (updateUserError)
    return NextResponse.json({ error: updateUserError.message }, { status: 500 });

  // 4. Check for newly unlocked achievements (simple example rule)
  const newAchievements = [];
  const { count: completedCount } = await supabase
    .from("tasks")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("status", "done");

  if (completedCount === 1) {
    newAchievements.push({ key: "first_quest", title: "First Quest Complete" });
  }
  if (completedCount === 5) {
    newAchievements.push({ key: "five_quests", title: "Getting Into It" });
  }

  for (const ach of newAchievements) {
    await supabase.from("achievements").insert({
      user_id: userId,
      achievement_key: ach.key,
      tier: "mini",
    });
  }

  return NextResponse.json({
    xpGained,
    leveledUp,
    newLevel: leveledUser.level,
    newAchievements,
    user: updatedUser,
  });
}
