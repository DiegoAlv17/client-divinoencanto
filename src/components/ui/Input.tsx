interface InputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  className?: string;
}

export default function Input({ label, value, onChange, type = 'text', placeholder, className = '' }: InputProps) {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--fg-muted)' }}>
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-all duration-200 focus:ring-2"
        style={{
          backgroundColor: 'var(--bg)',
          border: '1px solid var(--border)',
          color: 'var(--fg)',
          boxShadow: 'var(--shadow-sm)',
          // @ts-expect-error CSS custom property
          '--tw-ring-color': 'var(--accent)',
        }}
      />
    </div>
  );
}
