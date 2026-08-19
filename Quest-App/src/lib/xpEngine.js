// Core gamification math. Keep this pure (no DB calls) so it's easy to test.

export function calculateXP(difficultyScore, streakCount) {
  const baseXP = difficultyScore * 10;
  const multiplier = Math.min(1 + streakCount * 0.05, 1.5); // caps at +50%
  return Math.round(baseXP * multiplier);
}

export function xpToNextLevel(level) {
  // Increasing curve: fast early levels, slower later ones.
  return Math.round(100 * Math.pow(level, 1.5));
}

export function applyXP(user, xpGained) {
  const updated = { ...user, current_xp: user.current_xp + xpGained };
  let leveledUp = false;

  while (updated.current_xp >= xpToNextLevel(updated.level)) {
    updated.current_xp -= xpToNextLevel(updated.level);
    updated.level += 1;
    leveledUp = true;
  }

  return { user: updated, leveledUp };
}

export function updateStreak(user, lastActiveDate = new Date()) {
  if (!user.last_active_date) return 1;

  const last = new Date(user.last_active_date);
  const today = new Date(lastActiveDate);
  const diffDays = Math.floor((today - last) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return user.streak_count; // already logged today
  if (diffDays === 1) return user.streak_count + 1; // consecutive day
  return 1; // streak broken, reset
}

export function rewardPointsFromXP(xpGained) {
  return Math.round(xpGained / 2);
}
