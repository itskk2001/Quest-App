export default function LevelUpModal({ newLevel, onClose }) {
  if (!newLevel) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-quest-card border-2 border-quest-xp rounded-2xl p-8 text-center max-w-sm mx-4 animate-in zoom-in duration-300">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-quest-xp mb-2">Level Up!</h2>
        <p className="text-slate-300 mb-6">
          You've reached <span className="font-bold text-white">Level {newLevel}</span>.
          New quests are now available.
        </p>
        <button
          onClick={onClose}
          className="bg-gradient-to-r from-quest-xp to-quest-xpEnd text-slate-900 font-bold px-6 py-2 rounded-full hover:scale-105 transition-transform"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
