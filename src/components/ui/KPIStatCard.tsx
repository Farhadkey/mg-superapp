import type { StatCard } from "../../types";

interface KPIStatCardProps {
  stat: StatCard;
}

export default function KPIStatCard({ stat }: KPIStatCardProps) {
  return (
    <div className="ui-kpi-card">
      <div className="ui-kpi-card-icon">{stat.icon}</div>
      <div className="ui-kpi-card-body">
        <span className="ui-kpi-card-value">{stat.value}</span>
        <span className="ui-kpi-card-label">{stat.label}</span>
      </div>
      {stat.trend && (
        <span className={`ui-kpi-card-trend ui-kpi-card-trend--${stat.trend}`}>
          {stat.trend === "up" ? "▲" : stat.trend === "down" ? "▼" : "—"}
        </span>
      )}
    </div>
  );
}
