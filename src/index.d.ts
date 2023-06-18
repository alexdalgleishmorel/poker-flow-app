import { ChartType, Plugin } from 'chart.js';

declare module 'chart.js' {
  interface PluginOptionsByType<TType extends ChartType> {
    emptyDoughnut?: {
      color?: string,
      width?: number,
      radiusDecrease?: number,
      availablePot?: number
    }; 
  }
}
