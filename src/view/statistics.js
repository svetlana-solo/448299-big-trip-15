import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import SmartView from './smart.js';
import { getTimeByType, getMoneyByType, getCountByType, getChartOptions, getDurationString } from '../utils/statistics.js';

// Рассчитаем высоту канваса в зависимости от того, сколько данных в него будет передаваться
const BAR_HEIGHT = 55;

const renderMoneyChart = (moneyCtx, points) => {
  const info = getMoneyByType(points);
  const { labels, data } = getChartOptions(info);
  moneyCtx.height = BAR_HEIGHT * labels.length;
  return (
    new Chart(moneyCtx, {
      plugins: [ChartDataLabels],
      type: 'horizontalBar',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: '#ffffff',
          hoverBackgroundColor: '#ffffff',
          anchor: 'start',
        }],
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 13,
            },
            color: '#000000',
            anchor: 'end',
            align: 'start',
            formatter: (val) => `€ ${val}`,
          },
        },
        title: {
          display: true,
          text: 'MONEY',
          fontColor: '#000000',
          fontSize: 23,
          position: 'left',
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: '#000000',
              padding: 5,
              fontSize: 13,
            },
            gridLines: {
              display: false,
              drawBorder: false,
            },
            barThickness: 44,
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: false,
            },
            minBarLength: 50,
          }],
        },
        legend: {
          display: false,
        },
        tooltips: {
          enabled: false,
        },
      },
    })
  );
};

const renderTypeChart = (typeCtx, points) => {
  const info = getCountByType(points);
  const { labels, data } = getChartOptions(info);
  typeCtx.height = BAR_HEIGHT * labels.length;
  return (
    new Chart(typeCtx, {
      plugins: [ChartDataLabels],
      type: 'horizontalBar',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: '#ffffff',
          hoverBackgroundColor: '#ffffff',
          anchor: 'start',
        }],
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 13,
            },
            color: '#000000',
            anchor: 'end',
            align: 'start',
            formatter: (val) => `${val}x`,
          },
        },
        title: {
          display: true,
          text: 'TYPE',
          fontColor: '#000000',
          fontSize: 23,
          position: 'left',
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: '#000000',
              padding: 5,
              fontSize: 13,
            },
            gridLines: {
              display: false,
              drawBorder: false,
            },
            barThickness: 44,
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: false,
            },
            minBarLength: 50,
          }],
        },
        legend: {
          display: false,
        },
        tooltips: {
          enabled: false,
        },
      },
    })
  );
};

const renderTimeChart = (timeCtx, points) => {
  const info = getTimeByType(points);
  const { labels, data } = getChartOptions(info);
  timeCtx.height = BAR_HEIGHT * labels.length;
  return (
    new Chart(timeCtx, {
      plugins: [ChartDataLabels],
      type: 'horizontalBar',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: '#ffffff',
          hoverBackgroundColor: '#ffffff',
          anchor: 'start',
        }],
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 13,
            },
            color: '#000000',
            anchor: 'end',
            align: 'start',
            formatter: (val) => getDurationString(val),
          },
        },
        title: {
          display: true,
          text: 'TIME-SPEND',
          fontColor: '#000000',
          fontSize: 23,
          position: 'left',
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: '#000000',
              padding: 5,
              fontSize: 13,
            },
            gridLines: {
              display: false,
              drawBorder: false,
            },
            barThickness: 44,
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: false,
            },
            minBarLength: 50,
          }],
        },
        legend: {
          display: false,
        },
        tooltips: {
          enabled: false,
        },
      },
    })
  );
};

const createStatistics = () => (
  `<section class="statistics">
  <h2 class="visually-hidden">Trip statistics</h2>

  <div class="statistics__item">
    <canvas class="statistics__chart" id="money" width="900"></canvas>
  </div>

  <div class="statistics__item">
    <canvas class="statistics__chart" id="type" width="900"></canvas>
  </div>

  <div class="statistics__item">
    <canvas class="statistics__chart" id="time-spend" width="900"></canvas>
  </div>
</section>`
);

export default class Statistics extends SmartView {
  constructor(points) {
    super();

    this._data = points;
    this._setCharts();
  }


  getTemplate() {
    return createStatistics();
  }

  restoreHandlers() {
    this._setCharts();
  }

  _setCharts() {
    const moneyCtx = this.getElement().querySelector('#money');
    const typeCtx =this.getElement().querySelector('#type');
    const timeCtx = this.getElement().querySelector('#time-spend');

    this._moneyChart = renderMoneyChart(moneyCtx, this._data);
    this._typeChart = renderTypeChart(typeCtx, this._data);
    this._timeChart = renderTimeChart(timeCtx, this._data);
  }
}

