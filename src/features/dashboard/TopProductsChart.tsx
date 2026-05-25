import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import type { TopProduct } from '../../types';

interface Props {
  data: TopProduct[];
}

export default function TopProductsChart({ data }: Props) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!ref.current || data.length === 0) return;

    const svg = d3.select(ref.current);
    svg.selectAll('*').remove();

    const container = ref.current.parentElement!;
    const width = container.clientWidth;
    const barHeight = 36;
    const margin = { top: 16, right: 100, bottom: 16, left: 140 };
    const height = margin.top + margin.bottom + data.length * barHeight;

    svg.attr('width', width).attr('height', height);

    const x = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.totalQuantity)! * 1.1])
      .range([margin.left, width - margin.right]);

    const y = d3.scaleBand()
      .domain(data.map(d => d.productName))
      .range([margin.top, height - margin.bottom])
      .padding(0.25);

    // Color scale
    const color = d3.scaleSequential()
      .domain([0, data.length - 1])
      .interpolator(d3.interpolateWarm);

    // Bars
    svg.selectAll('.bar')
      .data(data)
      .join('rect')
      .attr('class', 'bar')
      .attr('x', margin.left)
      .attr('y', d => y(d.productName)!)
      .attr('height', y.bandwidth())
      .attr('rx', 4)
      .attr('fill', (_, i) => color(i))
      .attr('opacity', 0.85)
      .attr('width', 0)
      .transition()
      .duration(700)
      .delay((_, i) => i * 70)
      .attr('width', d => x(d.totalQuantity) - margin.left);

    // Quantity labels
    svg.selectAll('.qty-label')
      .data(data)
      .join('text')
      .attr('class', 'qty-label')
      .attr('x', d => x(d.totalQuantity) + 6)
      .attr('y', d => y(d.productName)! + y.bandwidth() / 2)
      .attr('dy', '0.35em')
      .attr('fill', 'var(--fg)')
      .attr('font-size', '12px')
      .attr('font-weight', '600')
      .attr('opacity', 0)
      .text(d => `${d.totalQuantity} uds`)
      .transition()
      .duration(400)
      .delay((_, i) => i * 70 + 400)
      .attr('opacity', 1);

    // Product name labels
    svg.selectAll('.name-label')
      .data(data)
      .join('text')
      .attr('class', 'name-label')
      .attr('x', margin.left - 8)
      .attr('y', d => y(d.productName)! + y.bandwidth() / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'end')
      .attr('fill', 'var(--fg-muted)')
      .attr('font-size', '12px')
      .text(d => d.productName.length > 18 ? d.productName.slice(0, 18) + '…' : d.productName);

  }, [data]);

  return <svg ref={ref} className="w-full" />;
}
