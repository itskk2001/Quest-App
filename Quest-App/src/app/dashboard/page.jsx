"use client";

import { useEffect, useState } from "react";
import XPBar from "@/components/gamification/XPBar";
import LevelUpModal from "@/components/gamification/LevelUpModal";
import AchievementPopup from "@/components/gamification/AchievementPopup";
import QuestCard from "@/components/quests/QuestCard";
import { xpToNextLevel } from "@/lib/xpEngine";
import { supabase } from "@/lib/supabaseClient";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [levelUpTo, setLevelUpTo] = useState(null);
  const [achievement, setAchievement] = useState(null);

  useEffect(() => {
    async function load() {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      if (!authUser) return;

      const { data: userRow } = await supabase
        .from("users")
        .select("*")
        .eq("id", authUser.id)
        .single();
      setUser(userRow);

      const res = await fetch(`/api/tasks?userId=${authUser.id}`);
      const { tasks } = await res.json();
      setTasks(tasks?.filter((t) => t.status === "pending") ?? []);
    }
    load();
  }, []);

  async function handleComplete(taskId) {
    const res = await fetch(`/api/tasks/${taskId}/complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id }),
    });
    const result = await res.json();

    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    setUser(result.user);

    if (result.leveledUp) setLevelUpTo(result.newLevel);
    if (result.newAchievements?.length > 0) setAchievement(result.newAchievements[0]);
  }

  if (!user) {
    return <div className="p-8 text-slate-400">Loading your quest log...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Your Quest Log</h1>

      <div className="bg-quest-card rounded-xl p-4 mb-6 border border-slate-700">
        <XPBar
          currentXP={user.current_xp}
          xpNeeded={xpToNextLevel(user.level)}
          level={user.level}
        />
        <div className="flex gap-4 mt-3 text-sm text-slate-400">
          <span>🔥 {user.streak_count} day streak</span>
          <span>💎 {user.reward_points} reward points</span>
        </div>
      </div>

      <div className="space-y-3">
        {tasks.length === 0 && (
          <p className="text-slate-500 text-sm">No active quests. Add one to get started.</p>
        )}
        {tasks.map((task) => (
          <QuestCard key={task.id} task={task} onComplete={handleComplete} />
        ))}
      </div>

      <LevelUpModal newLevel={levelUpTo} onClose={() => setLevelUpTo(null)} />
      <AchievementPopup achievement={achievement} onClose={() => setAchievement(null)} />
    </div>
  );
}
