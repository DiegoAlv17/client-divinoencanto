import { useToastStore } from '../../store/toast.store';
import type { ToastType } from '../../store/toast.store';

const bgMap: Record<ToastType, string> = {
  success: '#166534',
  error: '#991b1b',
  warning: '#92400e',
};

export default function Toaster() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="px-5 py-3.5 rounded-xl text-sm text-white flex items-center gap-3 min-w-[300px]"
          style={{ backgroundColor: bgMap[toast.type], boxShadow: 'var(--shadow-lg)' }}
        >
          <span className="flex-1 font-medium">{toast.message}</span>
          <button onClick={() => dismiss(toast.id)} className="text-white/70 hover:text-white text-lg leading-none">
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
