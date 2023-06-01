import { Component, Input, OnInit, OnChanges } from '@angular/core';
import Chart from 'chart.js/auto';
import { PoolData, PoolMember } from 'src/app/services/pool/pool.service';

@Component({
  selector: 'app-pool-donut-chart',
  templateUrl: './pool-donut-chart.component.html',
  styleUrls: ['./pool-donut-chart.component.scss']
})
export class PoolDonutChartComponent implements OnInit, OnChanges {
  @Input() poolData?: PoolData;
  public chart: any;
  private colors: string[] = [
    '#4dc9f6',
    '#f67019',
    '#f53794',
    '#537bc4',
    '#acc236',
    '#166a8f',
    '#00a950',
    '#58595b',
    '#8549ba'
  ];

  ngOnInit(): void {
    this.createChart();
  }

  createChart(){
    let delayed: boolean;

    let names: string[] = [];
    let contributions: number[] = [];
    this.poolData?.members.map((member: PoolMember) => {
      names.push(`${member.profile.firstName} ${member.profile.lastName}`);
      contributions.push(member.contribution);
    });

    this.chart = new Chart('pool-donut-chart', {
      type: 'doughnut',

      data: {
        labels: names,
        datasets: [
          {
            label: 'Buy In',
            data: contributions,
            backgroundColor: Object.values(this.colors),
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
          },
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
      },
      
    });
  }

  /**
   * Updates the chart when the input data receives updates
   */
  ngOnChanges() {
    if (this.chart) {
      let names: string[] = [];
      let contributions: number[] = [];
      this.poolData?.members.map((member: PoolMember) => {
        names.push(`${member.profile.firstName} ${member.profile.lastName}`);
        contributions.push(member.contribution);
      });
      this.chart.data.labels = names;
      this.chart.data.datasets[0].data = contributions;

      this.chart.update();
    }
  }
}
