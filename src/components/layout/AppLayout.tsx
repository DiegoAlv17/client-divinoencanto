import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import Toaster from '../ui/Toaster';

export default function AppLayout() {
  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{
        backgroundColor: 'var(--bg)',
        gap: 'var(--shell-gap)',
        padding: 'var(--shell-padding)',
      }}
    >
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden" style={{ gap: 'var(--shell-gap)' }}>
        <TopBar />
        <main
          className="flex-1 overflow-y-auto"
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-sm)',
            padding: 'var(--page-padding-y) var(--page-padding-x)',
            borderRadius: 'var(--radius-shell)',
          }}
        >
          <div className="page-enter mx-auto w-full max-w-350">
            <Outlet />
          </div>
        </main>
      </div>
      <Toaster />
    </div>
  );
}
