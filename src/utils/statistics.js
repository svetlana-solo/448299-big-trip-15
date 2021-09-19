import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

export const getDurationString = (eventDuration) => {
  const days = dayjs.duration(eventDuration).days().toString().padStart(2, '0');
  const hours = dayjs.duration(eventDuration).hours().toString().padStart(2, '0');
  const minutes = dayjs.duration(eventDuration).minutes().toString().padStart(2, '0');

  if (days > 0) {
    return `${days}D ${hours}H ${minutes}M`;
  } else if (hours > 0) {
    return `${hours}H ${minutes}M`;
  }
  return `${minutes}M`;
};

export const getTimeByType = (points) => (
  points.reduce((acc, point) => {
    const eventDuration = dayjs(point.dateEnd) - dayjs(point.dateStart);
    acc[point.pointType] = (acc[point.pointType] || 0) + eventDuration;
    return acc;
  }, {})
);

export const getMoneyByType = (points) => (
  points.reduce((acc, point) => {
    acc[point.pointType] = (acc[point.pointType] || 0) + point.price;
    return acc;
  }, {})
);

export const getCountByType = (points) => (
  points.reduce((acc, point) => {
    acc[point.pointType] = (acc[point.pointType] || 0) + 1;
    return acc;
  }, {})
);

export const getChartOptions = (info) => {
  const values = Object.entries(info).sort((a, b) => {
    if (a[1] === b[1]) {
      return 0;
    }
    return b[1] - a[1];
  });

  const labels = values.map((value) => value[0]);
  const data = values.map((value) => value[1]);

  return {labels, data};
};
