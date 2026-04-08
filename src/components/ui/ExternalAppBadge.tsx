interface ExternalAppBadgeProps {
  label?: string;
}

export default function ExternalAppBadge({ label = "External" }: ExternalAppBadgeProps) {
  return (
    <span className="ui-external-badge" title="Opens in Power Apps">
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
        <path d="M3 1H9V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      {label}
    </span>
  );
}
