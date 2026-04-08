interface QuickActionCardProps {
  icon: string;
  label: string;
  color?: string;
  onClick?: () => void;
}

export default function QuickActionCard({ icon, label, color, onClick }: QuickActionCardProps) {
  return (
    <button className="ui-quick-action" onClick={onClick}>
      <span
        className="ui-quick-action-icon"
        style={color ? { backgroundColor: color, color: "#fff" } : undefined}
      >
        {icon}
      </span>
      <span className="ui-quick-action-label">{label}</span>
    </button>
  );
}
