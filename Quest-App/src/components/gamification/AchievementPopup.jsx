export default function AchievementPopup({ achievement, onClose }) {
  if (!achievement) return null;

  return (
    <div className="fixed top-6 right-6 bg-quest-card border border-quest-xp rounded-xl p-4 shadow-lg flex items-center gap-3 z-50 animate-in slide-in-from-top duration-300">
      <div className="text-3xl">🏆</div>
      <div>
        <p className="text-xs text-quest-xp font-semibold uppercase tracking-wide">
          Achievement Unlocked
        </p>
        <p className="text-white font-bold">{achievement.title}</p>
      </div>
      <button onClick={onClose} className="ml-2 text-slate-400 hover:text-white">
        ✕
      </button>
    </div>
  );
}
