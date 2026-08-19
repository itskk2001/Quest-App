export default function XPBar({ currentXP, xpNeeded, level }) {
  const pct = Math.min((currentXP / xpNeeded) * 100, 100);

  return (
    <div className="w-full">
      <div className="flex justify-between text-sm mb-1 text-slate-300">
        <span className="font-semibold">Level {level}</span>
        <span>
          {currentXP}/{xpNeeded} XP
        </span>
      </div>
      <div className="w-full h-4 bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-quest-xp to-quest-xpEnd transition-all duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
