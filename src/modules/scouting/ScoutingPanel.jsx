export default function ScoutingPanel() {
  return (
    <div className="p-6">
      <div className="bg-[#27251F] border border-[#3A3A3A] rounded-xl p-8 text-center">
        <p className="text-4xl mb-4">{'\uD83D\uDD0D'}</p>
        <h2 className="text-xl font-bold text-[#FDB515] mb-2">Scouting Module</h2>
        <p className="text-[#C4C4C4]">
          Opponent scouting reports, tendencies, and game prep notes.
        </p>
        <p className="text-xs text-[#E67E22] mt-2 font-medium">Advanced tier</p>
        <p className="text-sm text-[#8E8E8E] mt-2">Module loaded successfully.</p>
      </div>
    </div>
  );
}
