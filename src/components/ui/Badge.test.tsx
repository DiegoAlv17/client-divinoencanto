import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Badge from './Badge';

describe('Badge', () => {
  it('renders children text', () => {
    render(<Badge>Activo</Badge>);
    expect(screen.getByText('Activo')).toBeInTheDocument();
  });

  it('renders success variant', () => {
    render(<Badge variant="success">OK</Badge>);
    const el = screen.getByText('OK');
    expect(el).toHaveStyle({ color: 'rgb(22, 101, 52)' }); // #166534
  });

  it('renders danger variant', () => {
    render(<Badge variant="danger">Error</Badge>);
    const el = screen.getByText('Error');
    expect(el).toHaveStyle({ color: 'rgb(153, 27, 27)' }); // #991b1b
  });
});
