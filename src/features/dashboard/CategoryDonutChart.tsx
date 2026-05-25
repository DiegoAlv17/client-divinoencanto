import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import type { CategorySales } from '../../types';

interface Props {
  data: CategorySales[];
}

export default function CategoryDonutChart({ data }: Props) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!ref.current || data.length === 0) return;

    const svg = d3.select(ref.current);
    svg.selectAll('*').remove();

    const container = ref.current.parentElement!;
    const size = Math.min(container.clientWidth, 360);
    const radius = size / 2 - 20;
    const innerRadius = radius * 0.55;

    svg.attr('width', size).attr('height', size);

    const g = svg.append('g')
      .attr('transform', `translate(${size / 2},${size / 2})`);

    const color = d3.scaleOrdinal<string>()
      .domain(data.map(d => d.categoryName))
      .range(d3.schemeTableau10);

    const pie = d3.pie<CategorySales>()
      .value(d => d.totalRevenue)
      .sort(null)
      .padAngle(0.02);

    const arc = d3.arc<d3.PieArcDatum<CategorySales>>()
      .innerRadius(innerRadius)
      .outerRadius(radius)
      .cornerRadius(4);

    const arcs = g.selectAll('.arc')
      .data(pie(data))
      .join('g')
      .attr('class', 'arc');

    arcs.append('path')
      .attr('d', arc)
      .attr('fill', d => color(d.data.categoryName))
      .attr('opacity', 0.9)
      .attr('stroke', 'var(--bg-surface)')
      .attr('stroke-width', 2)
      .each(function(d) {
        (this as any)._current = { startAngle: d.startAngle, endAngle: d.startAngle };
      })
      .transition()
      .duration(800)
      .attrTween('d', function(d) {
        const interpolate = d3.interpolate((this as any)._current, d);
        (this as any)._current = interpolate(1);
        return (t: number) => arc(interpolate(t))!;
      });

    // Center total
    const total = data.reduce((sum, d) => sum + d.totalRevenue, 0);
    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '-0.2em')
      .attr('fill', 'var(--fg)')
      .attr('font-size', '18px')
      .attr('font-weight', '700')
      .text(`S/${total.toFixed(0)}`);

    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '1.3em')
      .attr('fill', 'var(--fg-muted)')
      .attr('font-size', '12px')
      .text('Total');

  }, [data]);

  return (
    <div className="flex flex-col items-center gap-3">
      <svg ref={ref} />
      <div className="flex flex-wrap justify-center gap-3">
        {data.map((d, i) => (
          <div key={d.categoryId} className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--fg-muted)' }}>
            <span
              className="w-3 h-3 rounded-sm inline-block"
              style={{ backgroundColor: d3.schemeTableau10[i % 10] }}
            />
            {d.categoryName}
          </div>
        ))}
      </div>
    </div>
  );
}
