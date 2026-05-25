import useSWR from 'swr';
import { statisticsApi } from '../../api/statistics.api';
import Spinner from '../../components/ui/Spinner';
import MonthlySalesChart from './MonthlySalesChart';
import DailySalesAreaChart from './DailySalesAreaChart';
import TopProductsChart from './TopProductsChart';
import CategoryDonutChart from './CategoryDonutChart';

export default function DashboardPage() {
  const { data: stats, isLoading } = useSWR('statistics', statisticsApi.get);

  if (isLoading || !stats) {
    return <div className="flex justify-center py-16"><Spinner size="lg" /></div>;
  }

  const kpis = [
    { label: 'Total Ventas', value: `S/${stats.totalSales.toFixed(2)}`, icon: '◉', color: 'var(--primary)' },
    { label: 'Deuda Total', value: `S/${stats.totalDebt.toFixed(2)}`, icon: '⚠', color: 'var(--danger)' },
    { label: 'Clientes Deudores', value: stats.totalDebtorClients.toString(), icon: '◎', color: 'var(--warning, #f59e0b)' },
    { label: 'Nº Ventas', value: stats.totalSalesCount.toString(), icon: '▣', color: 'var(--accent)' },
    { label: 'Productos', value: stats.totalProductsCount.toString(), icon: '◆', color: 'var(--primary)' },
    { label: 'Clientes', value: stats.totalClientsCount.toString(), icon: '◎', color: 'var(--accent)' },
    { label: 'Ticket Promedio', value: `S/${stats.averageTicket.toFixed(2)}`, icon: '◈', color: 'var(--primary)' },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--fg)' }}>
        Dashboard
      </h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="flex flex-col gap-1 p-4 rounded-xl transition-shadow duration-200 hover:shadow-md"
            style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--border)' }}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg" style={{ color: kpi.color }}>{kpi.icon}</span>
              <span className="text-xs font-medium" style={{ color: 'var(--fg-muted)' }}>{kpi.label}</span>
            </div>
            <p className="text-xl font-bold mt-1" style={{ color: 'var(--fg)' }}>{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Monthly Sales Bar Chart */}
        <ChartCard title="Ventas por Mes" subtitle="Ingresos mensuales">
          <MonthlySalesChart data={stats.salesByMonth} />
        </ChartCard>

        {/* Daily Sales Area Chart */}
        <ChartCard title="Ventas Últimos 30 Días" subtitle="Tendencia diaria">
          <DailySalesAreaChart data={stats.salesLast30Days} />
        </ChartCard>

        {/* Top Products Horizontal Bar */}
        <ChartCard title="Top Productos" subtitle="Por cantidad vendida">
          <TopProductsChart data={stats.topProducts} />
        </ChartCard>

        {/* Category Donut */}
        <ChartCard title="Ventas por Categoría" subtitle="Distribución de ingresos">
          <CategoryDonutChart data={stats.salesByCategory} />
        </ChartCard>
      </div>
    </div>
  );
}

function ChartCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-xl p-5 overflow-hidden"
      style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--border)' }}
    >
      <div className="mb-4">
        <h3 className="text-sm font-bold" style={{ color: 'var(--fg)' }}>{title}</h3>
        <p className="text-xs mt-0.5" style={{ color: 'var(--fg-muted)' }}>{subtitle}</p>
      </div>
      <div className="w-full overflow-hidden">
        {children}
      </div>
    </div>
  );
}
