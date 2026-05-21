interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'danger' | 'warning' | 'neutral';
}

const colors: Record<string, { bg: string; fg: string }> = {
  success: { bg: '#dcfce7', fg: '#166534' },
  danger: { bg: '#fee2e2', fg: '#991b1b' },
  warning: { bg: '#fef3c7', fg: '#92400e' },
  neutral: { bg: 'var(--bg-surface-alt)', fg: 'var(--fg-muted)' },
};

export default function Badge({ children, variant = 'neutral' }: BadgeProps) {
  const c = colors[variant];
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold tracking-wide"
      style={{ backgroundColor: c.bg, color: c.fg }}
    >
      {children}
    </span>
  );
}
