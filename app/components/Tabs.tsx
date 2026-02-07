type TabId = "calendar" | "activities" | "dashboard" | "admin";

type TabsProps = {
  activeTab: TabId;
  onChange: (tab: TabId) => void;
};

export function Tabs({ activeTab, onChange }: TabsProps) {
  const tabs: { id: TabId; label: string }[] = [
    { id: "dashboard", label: "Dashboard" },
    { id: "calendar", label: "Calendar" },
    { id: "activities", label: "Activities" },
    { id: "admin", label: "Admin" },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`rounded-md px-5 py-2 text-sm font-medium transition ${
            activeTab === tab.id
              ? "bg-[color:var(--primary)] text-white"
              : "bg-white text-[color:var(--foreground)] shadow-sm hover:bg-[color:var(--secondary)]"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
