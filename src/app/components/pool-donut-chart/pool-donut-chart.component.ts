import { Component, Input, OnInit, OnChanges } from '@angular/core';

import { POKERFLOW_GREEN } from '@constants';
import Chart from 'chart.js/auto';
import { PoolData, PoolMember, PoolService } from 'src/app/services/pool/pool.service';

const emptyDoughnutPlugin = {
  id: 'emptyDoughnut',
  afterDraw(chart: any, args: any, options: any) {
    const {datasets} = chart.data;
    const {color, width, radiusDecrease} = options;
    let hasData = false;

    for (let i = 0; i < datasets.length; i += 1) {
      const dataset = datasets[i];
      hasData = hasData || dataset.data.length > 0;
    }

    if (!hasData) {
      const {chartArea: {left, top, right, bottom}, ctx} = chart;
      const centerX = (left + right) / 2;
      const centerY = (top + bottom) / 2;
      const r = Math.min(right - left, bottom - top) / 2;

      ctx.beginPath();
      ctx.lineWidth = width || 2;
      ctx.strokeStyle = color || '#58595b';
      ctx.arc(centerX, centerY, (r - radiusDecrease || 0), 0, 2 * Math.PI);
      ctx.stroke();
    }
  }
};

@Component({
  selector: 'app-pool-donut-chart',
  templateUrl: './pool-donut-chart.component.html',
  styleUrls: ['./pool-donut-chart.component.scss']
})
export class PoolDonutChartComponent implements OnInit, OnChanges {
  @Input() poolData?: PoolData;
  public chart: any = null;
  private colors: string[] = [
    '#f67019',
    '#4dc9f6',
    '#f53794',
    '#537bc4',
    '#166a8f',
    '#58595b',
    '#8549ba'
  ];

  constructor(
    private poolService: PoolService
  ) {}

  ngOnInit(): void {
    this.poolService.poolViewActive.subscribe(active => {
      this.initializeChart(active);
    });
  }

  initializeChart(activePoolView: number) {
    if (!activePoolView && this.chart) {
      this.chart.destroy();
      this.chart = null;
      this.poolService.poolChartViewActive.next(false);
    } else if (activePoolView && this.canCreateChart()) {
      this.createChart();
      this.poolService.poolChartViewActive.next(true);
    }
  }

  canCreateChart(): boolean {
    return !this.chart && !this.poolService.poolChartViewActive.getValue() && this.poolData?.id === this.poolService.poolViewActive.getValue();
  }

  createChart() {
    let delayed: boolean;

    let names: string[] = [];
    let contributions: number[] = [];
    let total: number = 0;
    this.poolData?.contributors.map((member: PoolMember) => {
      names.push(`${member.profile.firstName} ${member.profile.lastName}`);
      contributions.push(member.contribution);
      total += member.contribution;
    });
    let availableRatio: number = this.poolData?.available_pot ? this.poolData?.available_pot/total : 1;

    setTimeout(() => {
      this.chart = new Chart('pool-donut-chart', {
        type: 'doughnut',
        data: {
          labels: ['Available Pot'].concat(names),
          datasets: [
            {
              label: 'Buy In',
              data: contributions.length > 0 ? [0].concat(contributions) : [],
              backgroundColor: Object.values(this.colors),
            },
            {
              data: contributions.length > 0 ? [this.poolData?.available_pot] : [],
              backgroundColor: POKERFLOW_GREEN,
              circumference: 360*availableRatio,
              weight: 0.4,
            }
          ]
        },
        plugins: [
          emptyDoughnutPlugin,
        ],
        options: {
          responsive: true,
          plugins: {
            emptyDoughnut: {
              color: '#58595b',
              width: 20,
              radiusDecrease: 20,
              availablePot: this.poolData?.available_pot
            },
            legend: {
              position: 'top',
              labels: {
                filter: function(item, chart) {
                  return !item.text.includes('Available Pot');
                }
              }
            },
            tooltip: {
              callbacks: {
                label: (data) => ' $'.concat(data.parsed.toFixed(2))
              }
            }
          },
          animation: {
            onComplete: () => {
              delayed = true;
            },
            delay: (context) => {
              let delay = 0;
              if (context.type === 'data' && context.mode === 'default' && !delayed) {
                delay = context.dataIndex * 300 + context.datasetIndex * 100;
              }
              return delay;
            },
          },
        }
      });
    }, 1000);
  }

  /**
   * Updates the chart when the input data receives updates
   */
  ngOnChanges() {
    if (this.chart) {
      let names: string[] = [];
      let contributions: number[] = [];
      let total: number = 0;
      this.poolData?.contributors.map((member: PoolMember) => {
        names.push(`${member.profile.firstName} ${member.profile.lastName}`);
        contributions.push(member.contribution);
        total += member.contribution;
      });
      let availableRatio: number = this.poolData?.available_pot ? this.poolData?.available_pot/total : 1;
      this.chart.data.labels = ['Available Pot'].concat(names);
      this.chart.data.datasets[0].data = contributions.length > 0 ? [0].concat(contributions) : [];
      this.chart.data.datasets[1].data = contributions.length > 0 ? [this.poolData?.available_pot] : [];
      this.chart.data.datasets[1].circumference = 360*availableRatio;

      this.chart.update();
    } else {
      this.initializeChart(this.poolService.poolViewActive.getValue());
    }
  }
}
