import type { PageId } from "../../types";

interface DepartmentShortcutCardProps {
  icon: string;
  label: string;
  color: string;
  appCount?: number;
  page: PageId;
  onNavigate?: (page: PageId) => void;
}

export default function DepartmentShortcutCard({
  icon,
  label,
  color,
  appCount,
  page,
  onNavigate,
}: DepartmentShortcutCardProps) {
  return (
    <button className="ui-dept-card" onClick={() => onNavigate?.(page)}>
      <div className="ui-dept-card-icon" style={{ backgroundColor: color }}>
        {icon}
      </div>
      <div className="ui-dept-card-info">
        <span className="ui-dept-card-label">{label}</span>
        {appCount !== undefined && (
          <span className="ui-dept-card-count">{appCount} app{appCount !== 1 ? "s" : ""}</span>
        )}
      </div>
      <span className="ui-dept-card-arrow">›</span>
    </button>
  );
}
