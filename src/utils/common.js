import dayjs from 'dayjs';
import { SortType } from '../constants';
import { FilterType } from '../constants';

const sortPointByDay = (pointA, pointB) => (
  dayjs(pointA.dateStart).diff(dayjs(pointB.dateStart))
);

const sortPointByTime = (pointA, pointB) => {
  const durationA = dayjs(pointA.dateEnd) - dayjs(pointA.dateStart);
  const durationB = dayjs(pointB.dateEnd) - dayjs(pointB.dateStart);
  return durationA - durationB;
};

const sortPointByPrice = (pointA, pointB) => (
  pointA.price - pointB.price
);

export const sortPoints = (sortType, points) => {
  switch (sortType) {
    case SortType.TIME:
      return [...points].sort(sortPointByTime);
    case SortType.PRICE:
      return [...points].sort(sortPointByPrice);
    default:
      return [...points].sort(sortPointByDay);
  }
};

const isFuture = (point) => {
  const now = new dayjs();
  return now.diff(dayjs(point.dateStart)) <= 0;
};

const isPast = (point) => {
  const now = new dayjs();
  return now.diff(dayjs(point.dateStart)) > 0;
};

export const filterPoints = (filterType, points) => {
  switch (filterType) {
    case FilterType.FUTURE:
      return points.filter(isFuture);
    case FilterType.PAST:
      return points.filter(isPast);
    default:
      return points;
  }
};
