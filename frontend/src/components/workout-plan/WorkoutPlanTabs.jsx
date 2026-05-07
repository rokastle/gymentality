export default function WorkoutPlanTabs({ tabs, activeTabId, onSelectTab }) {
  return (
    <div className="my-workout-page__tabbar">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`my-workout-page__tab ${
            tab.id === activeTabId ? "is-active" : ""
          }`}
          onClick={() => onSelectTab(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
