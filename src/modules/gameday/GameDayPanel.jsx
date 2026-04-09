export default function GameDayPanel() {
  return (
    <div className="p-6">
      <div className="bg-[#27251F] border border-[#3A3A3A] rounded-xl p-8 text-center">
        <p className="text-4xl mb-4">{'\u26BE'}</p>
        <h2 className="text-xl font-bold text-[#FDB515] mb-2">Game Day Module</h2>
        <p className="text-[#C4C4C4]">
          Lineups, live scoring, pitch counts, and post-game notes.
        </p>
        <p className="text-sm text-[#8E8E8E] mt-4">Module loaded successfully.</p>
      </div>
    </div>
  );
}
