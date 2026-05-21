import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Spinner from './Spinner';

describe('Spinner', () => {
  it('renders without crashing', () => {
    const { container } = render(<Spinner />);
    expect(container.firstChild).toBeTruthy();
  });

  it('applies sm size class', () => {
    const { container } = render(<Spinner size="sm" />);
    expect(container.firstChild).toHaveClass('h-4', 'w-4');
  });

  it('applies lg size class', () => {
    const { container } = render(<Spinner size="lg" />);
    expect(container.firstChild).toHaveClass('h-10', 'w-10');
  });

  it('has animate-spin class', () => {
    const { container } = render(<Spinner />);
    expect(container.firstChild).toHaveClass('animate-spin');
  });
});
