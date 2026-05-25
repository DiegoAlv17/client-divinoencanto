import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Toaster from './Toaster';
import { useToastStore } from '../../store/toast.store';

beforeEach(() => {
  useToastStore.setState({ toasts: [] });
  vi.useFakeTimers();
});

describe('Toaster', () => {
  it('renders nothing when there are no toasts', () => {
    const { container } = render(<Toaster />);
    expect(container.firstChild).toBeNull();
  });

  it('renders a success toast', () => {
    useToastStore.getState().push('Guardado correctamente', 'success');
    render(<Toaster />);
    expect(screen.getByText('Guardado correctamente')).toBeInTheDocument();
  });

  it('renders an error toast', () => {
    useToastStore.getState().push('Error al guardar', 'error');
    render(<Toaster />);
    expect(screen.getByText('Error al guardar')).toBeInTheDocument();
  });

  it('renders a warning toast', () => {
    useToastStore.getState().push('Advertencia', 'warning');
    render(<Toaster />);
    expect(screen.getByText('Advertencia')).toBeInTheDocument();
  });

  it('dismisses toast when × button is clicked', () => {
    useToastStore.getState().push('Mensaje', 'success');
    render(<Toaster />);
    const btn = screen.getByRole('button');
    fireEvent.click(btn);
    expect(useToastStore.getState().toasts).toHaveLength(0);
  });

  it('renders multiple toasts', () => {
    useToastStore.getState().push('Primero', 'success');
    useToastStore.getState().push('Segundo', 'error');
    render(<Toaster />);
    expect(screen.getByText('Primero')).toBeInTheDocument();
    expect(screen.getByText('Segundo')).toBeInTheDocument();
  });
});
