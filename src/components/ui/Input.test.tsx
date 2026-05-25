import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input from './Input';

describe('Input', () => {
  it('renders with label', () => {
    render(<Input label="Nombre" value="" onChange={() => {}} />);
    expect(screen.getByText('Nombre')).toBeInTheDocument();
  });

  it('renders without label', () => {
    render(<Input value="" onChange={() => {}} />);
    expect(screen.queryByRole('textbox')).toBeInTheDocument();
  });

  it('displays placeholder text', () => {
    render(<Input value="" onChange={() => {}} placeholder="Escribe aquí" />);
    expect(screen.getByPlaceholderText('Escribe aquí')).toBeInTheDocument();
  });

  it('calls onChange when user types', async () => {
    const onChange = vi.fn();
    render(<Input value="" onChange={onChange} />);
    await userEvent.type(screen.getByRole('textbox'), 'hola');
    expect(onChange).toHaveBeenCalled();
  });

  it('renders password type correctly', () => {
    render(<Input value="" onChange={() => {}} type="password" />);
    const input = document.querySelector('input[type="password"]');
    expect(input).toBeInTheDocument();
  });

  it('renders error message when error prop provided', () => {
    render(<Input value="" onChange={() => {}} error="Campo requerido" />);
    expect(screen.getByText('Campo requerido')).toBeInTheDocument();
  });

  it('does not render error message when no error', () => {
    render(<Input value="" onChange={() => {}} />);
    expect(screen.queryByRole('paragraph')).not.toBeInTheDocument();
  });
});
