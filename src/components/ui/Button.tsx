import Spinner from './Spinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
}

export default function Button({ children, loading, variant = 'primary', className = '', ...props }: ButtonProps) {
  const base = 'px-4 py-2 rounded-lg text-sm font-medium transition-opacity disabled:opacity-50 flex items-center justify-center gap-2';

  const styles: Record<string, React.CSSProperties> = {
    primary: { backgroundColor: 'var(--primary)', color: '#fff' },
    secondary: { backgroundColor: 'var(--bg-surface)', color: 'var(--fg)', border: '1px solid var(--border)' },
    danger: { backgroundColor: 'var(--danger)', color: '#fff' },
  };

  return (
    <button className={`${base} ${className}`} style={styles[variant]} disabled={loading || props.disabled} {...props}>
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  );
}
