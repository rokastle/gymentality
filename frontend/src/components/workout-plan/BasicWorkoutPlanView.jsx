import { useMemo, useState } from "react";
import { basicPlanData } from "../../data/myWorkoutPlansData";
import WorkoutPlanHeader from "./WorkoutPlanHeader";
import WorkoutPlanMetricBar from "./WorkoutPlanMetricBar";
import WorkoutPlanTabs from "./WorkoutPlanTabs";
import WorkoutVideoCard from "./WorkoutVideoCard";

export default function BasicWorkoutPlanView() {
  const [activeTabId, setActiveTabId] = useState(basicPlanData.tabs[0].id);

  const activeTab = useMemo(() => {
    return (
      basicPlanData.tabs.find((tab) => tab.id === activeTabId) ??
      basicPlanData.tabs[0]
    );
  }, [activeTabId]);

  return (
    <div className="my-workout-page__basic">
      <WorkoutPlanHeader
        title={basicPlanData.title}
        description={basicPlanData.description}
      />

      <WorkoutPlanTabs
        tabs={basicPlanData.tabs}
        activeTabId={activeTab.id}
        onSelectTab={setActiveTabId}
      />

      <div className="my-workout-page__panel my-workout-page__panel--basic gm-surface-card">
        <div className="my-workout-page__routine-header">
          <h2 className="my-workout-page__routine-title">
            {activeTab.routineTitle}
          </h2>
          <p className="my-workout-page__routine-meta">
            {activeTab.routineMeta}
          </p>
        </div>

        <WorkoutPlanMetricBar metrics={basicPlanData.metrics} />

        <h3 className="my-workout-page__section-heading gm-section-heading-lined">
          {activeTab.sectionTitle}
        </h3>

        <div className="my-workout-page__videos-grid">
          {activeTab.exercises.map((exercise) => (
            <WorkoutVideoCard key={exercise.id} exercise={exercise} />
          ))}
        </div>
      </div>
    </div>
  );
}
