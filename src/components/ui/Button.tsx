import Spinner from './Spinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
}

export default function Button({ children, loading, variant = 'primary', className = '', ...props }: ButtonProps) {
  const base = 'inline-flex min-h-11 items-center justify-center gap-2 px-4 py-3 text-sm font-semibold leading-none transition-all duration-200 disabled:opacity-50 hover:opacity-90 active:scale-[0.98] whitespace-nowrap';

  const styles: Record<string, React.CSSProperties> = {
    primary: { backgroundColor: 'var(--primary)', color: '#fff', boxShadow: 'var(--shadow-sm)', borderRadius: 'var(--radius-control)' },
    secondary: { backgroundColor: 'var(--bg-surface)', color: 'var(--fg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', borderRadius: 'var(--radius-control)' },
    danger: { backgroundColor: 'var(--danger)', color: '#fff', boxShadow: 'var(--shadow-sm)', borderRadius: 'var(--radius-control)' },
  };

  return (
    <button className={`${base} ${className}`} style={styles[variant]} disabled={loading || props.disabled} {...props}>
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  );
}
