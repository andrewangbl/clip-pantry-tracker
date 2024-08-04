import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

export default function TinyBarChart({items, scores}) {
  return (
    <BarChart
      width={400}
      height={300}
      series={[
        { data: scores, label: 'Confidence', type: 'bar' }
      ]}
      yAxis={[{
        scaleType: 'band',
        data: items,
        tickLabelStyle: {
          fontSize: 12
        }
      }]}
      xAxis={[{ 
        max: 1,
        tickNumber: 5,
        labelStyle: {
          fontSize: 12
        }
      }]}
      layout="horizontal"
      axisHighlight={{x: 'none', y: 'none'}}
    />
  );
}
