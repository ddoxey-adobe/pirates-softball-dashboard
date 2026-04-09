/**
 * Tabs — Gold active, gray inactive tab bar
 *
 * Usage:
 *   <Tabs
 *     tabs={[{ id: 'roster', label: 'Roster', icon: '...' }, ...]}
 *     activeId="roster"
 *     onChange={(id) => setActiveTab(id)}
 *   />
 */
export default function Tabs({ tabs = [], activeId, onChange }) {
  return (
    <div className="flex gap-1 overflow-x-auto scrollbar-hide border-b border-[#3A3A3A] px-2">
      {tabs.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            onClick={() => onChange?.(tab.id)}
            className={`
              flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium
              whitespace-nowrap transition-colors duration-150 border-b-2
              ${
                isActive
                  ? 'text-[#FDB515] border-[#FDB515]'
                  : 'text-[#8E8E8E] border-transparent hover:text-[#C4C4C4] hover:border-[#555]'
              }
            `}
          >
            {tab.icon && <span className="text-base">{tab.icon}</span>}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
