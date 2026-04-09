export default function ReportsPanel() {
  return (
    <div className="p-6">
      <div className="bg-[#27251F] border border-[#3A3A3A] rounded-xl p-8 text-center">
        <p className="text-4xl mb-4">{'\uD83D\uDCCA'}</p>
        <h2 className="text-xl font-bold text-[#FDB515] mb-2">Reports Module</h2>
        <p className="text-[#C4C4C4]">
          Stats dashboards, player progress charts, and season analytics.
        </p>
        <p className="text-sm text-[#8E8E8E] mt-4">Module loaded successfully.</p>
      </div>
    </div>
  );
}
