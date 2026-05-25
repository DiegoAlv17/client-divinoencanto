import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NotFoundPage from './NotFoundPage';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return { ...actual };
});

function Wrapper({ children }: { children: React.ReactNode }) {
  return <MemoryRouter>{children}</MemoryRouter>;
}

describe('NotFoundPage', () => {
  it('renders 404 heading', () => {
    render(<NotFoundPage />, { wrapper: Wrapper });
    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('renders descriptive message', () => {
    render(<NotFoundPage />, { wrapper: Wrapper });
    expect(screen.getByText('Página no encontrada')).toBeInTheDocument();
  });

  it('renders back home button', () => {
    render(<NotFoundPage />, { wrapper: Wrapper });
    expect(screen.getByRole('button', { name: /volver al inicio/i })).toBeInTheDocument();
  });
});
