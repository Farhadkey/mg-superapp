import type { ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  action?: string;
  onAction?: () => void;
  icon?: ReactNode;
}

export default function SectionHeader({ title, action, onAction, icon }: SectionHeaderProps) {
  return (
    <div className="ui-section-header">
      <div className="ui-section-header-left">
        {icon && <span className="ui-section-header-icon">{icon}</span>}
        <h3 className="ui-section-header-title">{title}</h3>
      </div>
      {action && (
        <button className="ui-section-header-action" onClick={onAction}>
          {action}
        </button>
      )}
    </div>
  );
}
