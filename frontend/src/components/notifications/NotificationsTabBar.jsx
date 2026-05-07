import IconImage from "../common/IconImage";
import { NOTIFICATION_TABS } from "../../utils/notificationsPageUtils";

export default function NotificationsTabBar({ activeTabId, onSelectTab }) {
  return (
    <div className="notifications-page__tabbar">
      {NOTIFICATION_TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`notifications-page__tab ${
            tab.id === activeTabId ? "is-active" : ""
          }`}
          onClick={() => onSelectTab(tab.id)}
        >
          <IconImage
            name={tab.icon}
            decorative
            className="notifications-page__tab-icon"
          />
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
