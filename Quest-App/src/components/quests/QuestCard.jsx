const DIFFICULTY_LABELS = { 1: "Easy", 2: "Easy", 3: "Medium", 4: "Hard", 5: "Epic" };
const DIFFICULTY_COLORS = {
  1: "bg-green-500/20 text-green-400",
  2: "bg-green-500/20 text-green-400",
  3: "bg-yellow-500/20 text-yellow-400",
  4: "bg-orange-500/20 text-orange-400",
  5: "bg-red-500/20 text-red-400",
};

export default function QuestCard({ task, onComplete }) {
  const label = DIFFICULTY_LABELS[task.difficulty_score] ?? "Medium";
  const colorClass = DIFFICULTY_COLORS[task.difficulty_score] ?? DIFFICULTY_COLORS[3];

  return (
    <div className="bg-quest-card rounded-xl p-4 border border-slate-700 hover:border-quest-xp/50 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-white">{task.title}</h3>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${colorClass}`}>
          {label}
        </span>
      </div>
      {task.description && (
        <p className="text-sm text-slate-400 mb-3">{task.description}</p>
      )}
      <div className="flex justify-between items-center">
        <span className="text-xs text-slate-500">
          ~{task.estimated_minutes} min · +{task.xp_value} XP
        </span>
        <button
          onClick={() => onComplete(task.id)}
          className="text-sm bg-quest-xp/90 hover:bg-quest-xp text-slate-900 font-semibold px-3 py-1.5 rounded-lg transition-colors"
        >
          Complete Quest
        </button>
      </div>
    </div>
  );
}
