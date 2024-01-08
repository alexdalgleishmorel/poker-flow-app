import { Component, Input, OnChanges, OnDestroy, AfterViewInit } from '@angular/core';
import Chart from 'chart.js/auto';

import { POKERFLOW_GREEN } from '@constants';
import { getLogoSVGName, getPrefersDark } from 'src/app/app.component';
import { GameData, GameMember, GameService } from 'src/app/services/game/game.service';

@Component({
  selector: 'app-donut-chart',
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.scss']
})
export class DonutChartComponent implements AfterViewInit, OnDestroy, OnChanges {
  @Input() gameData?: GameData;
  public chart: any = null;
  private colors: string[] = [
    '#f67019', // orange
    '#4dc9f6', // light blue
    '#f53794', // pink
    '#537bc4', // blue
    '#166a8f', // dark blue
    '#d62728', // vibrant red
    '#8549ba', // purple
    '#ffb300', // darker yellow
    '#008080', // vibrant teal
    '#E6E6FA', // lavender
    '#FF00FF', // magenta
    '#40E0D0'  // turquoise
  ];

  constructor(private gameService: GameService) {}

  /**
   * Renders chart and subscribes to theme changes after view initialization
   */
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.createChart();
      this.subscribeToThemeChanges();
    }, 1000);
  }

  /**
   * Ensures the chart instance is destroyed when the component is destroyed
   */
  ngOnDestroy() {
    this.chart?.destroy();
    this.chart = null;
  }

  /**
   * Subscribes to theme changes, ensuring the chart colour is updated accordingly
   */
  subscribeToThemeChanges() {
    this.gameService.colorThemeSubject.subscribe(() => {
      if (this.chart) {
        this.chart.data.datasets[1].borderColor = getPrefersDark() ? '#000000' : '#FFFFFF';
        this.chart.update();
      }
    });
  }

  /**
   * Creates an instance of a chart.js pie chart, representing the buy-ins and available cashout of the current game data
   */
  createChart() {
    let delayed: boolean;

    let names: string[] = [];
    let contributions: number[] = [];
    let total: number = 0;
    this.gameData?.contributors.map((member: GameMember) => {
      names.push(`${member.profile.firstName} ${member.profile.lastName}`);
      contributions.push(member.contribution);
      total += member.contribution;
    });
    let availableRatio: number = this.gameData?.availableCashout ? this.gameData?.availableCashout/total : 1;

    this.chart = new Chart('game-donut-chart', {
      type: 'doughnut',
      data: {
        labels: ['Available Cashout'].concat(names),
        datasets: [
          {
            label: 'Buy In',
            data: contributions.length > 0 ? [0].concat(contributions) : [],
            backgroundColor: Object.values(this.colors),
            borderColor: 'transparent'
          },
          {
            data: contributions.length > 0 ? [this.gameData?.availableCashout] : [],
            backgroundColor: POKERFLOW_GREEN,
            circumference: 360*availableRatio,
            weight: 0.4,
            borderColor: getPrefersDark() ? '#000000' : '#FFFFFF'
          }
        ]
      },
      options: {
        responsive: true,
        devicePixelRatio: 4,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              filter: function(item, chart) {
                return !item.text.includes('Available Cashout');
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
  }

  /**
   * Updates the chart data to be aligned with the most recently provided game data
   */
  updateChart() {
    let names: string[] = [];
    let contributions: number[] = [];
    let total: number = 0;
    this.gameData?.contributors.map((member: GameMember) => {
      names.push(`${member.profile.firstName} ${member.profile.lastName}`);
      contributions.push(member.contribution);
      total += member.contribution;
    });
    let availableRatio: number = this.gameData?.availableCashout ? this.gameData?.availableCashout/total : 1;
    this.chart.data.labels = ['Available Cashout'].concat(names);
    this.chart.data.datasets[0].data = contributions.length > 0 ? [0].concat(contributions) : [];
    this.chart.data.datasets[1].data = contributions.length > 0 ? [this.gameData?.availableCashout] : [];
    this.chart.data.datasets[1].circumference = 360*availableRatio;
    this.chart.data.datasets[1].borderColor = getPrefersDark() ? '#000000' : '#FFFFFF';

    this.chart.update();
  }

  /**
   * Updates the chart instance when the input data has changed
   */
  ngOnChanges() {
    if (this.chart) {
      this.updateChart();
    }
  }

  /**
   * @param {string} prefix The path to the assets directory containing the logo
   * @returns {string} The full file path of the logo, based on light or dark theme
   */
  getLogoName = (prefix: string): string => getLogoSVGName(prefix);
}
