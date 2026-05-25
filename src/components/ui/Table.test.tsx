import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Table from './Table';

interface Row { id: number; name: string; age: number }

const columns = [
  { key: 'name', header: 'Nombre' },
  { key: 'age', header: 'Edad' },
];

const data: Row[] = [
  { id: 1, name: 'Ana', age: 25 },
  { id: 2, name: 'Luis', age: 30 },
];

describe('Table', () => {
  it('renders column headers', () => {
    render(<Table columns={columns} data={data} />);
    expect(screen.getByText('Nombre')).toBeInTheDocument();
    expect(screen.getByText('Edad')).toBeInTheDocument();
  });

  it('renders row data', () => {
    render(<Table columns={columns} data={data} />);
    expect(screen.getByText('Ana')).toBeInTheDocument();
    expect(screen.getByText('Luis')).toBeInTheDocument();
  });

  it('shows default empty message when data is empty', () => {
    render(<Table columns={columns} data={[]} />);
    expect(screen.getByText('Sin datos')).toBeInTheDocument();
  });

  it('shows custom empty message when data is empty', () => {
    render(<Table columns={columns} data={[]} emptyMessage="No hay productos" />);
    expect(screen.getByText('No hay productos')).toBeInTheDocument();
  });

  it('renders custom cell with render function', () => {
    const columnsWithRender = [
      ...columns,
      { key: 'actions', header: '', render: (row: Row) => <button>Editar {row.name}</button> },
    ];
    render(<Table columns={columnsWithRender} data={data} />);
    expect(screen.getByText('Editar Ana')).toBeInTheDocument();
  });

  it('calls onRowClick when a row is clicked', async () => {
    const onRowClick = vi.fn();
    render(<Table columns={columns} data={data} onRowClick={onRowClick} />);
    const rows = screen.getAllByRole('row');
    // rows[0] is header, rows[1] is first data row
    await userEvent.click(rows[1]);
    expect(onRowClick).toHaveBeenCalledWith(data[0]);
  });
});
