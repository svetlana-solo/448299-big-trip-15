import dayjs from 'dayjs';

export const getRandomNumber = (min, max) => {
  const lower = Math.ceil(Math.min(min, max));
  const upper = Math.floor(Math.max(min, max));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
};

//export const toggleFormElements = (elements, status) => {
//  elements.forEach((item) => item.disabled = status);
//};

export const createDestinationsList = (array) => (
  array.map((_, i) => (`<option value="${array[i]}"></option>`)).join('')
);


export const sortPointByDay = (pointA, pointB) => (
  dayjs(pointA.dateStart).diff(dayjs(pointB.dateStart))
);

export const sortPointByTime = (pointA, pointB) => {
  const durationA = dayjs(pointA.dateEnd) - dayjs(pointA.dateStart);
  const durationB = dayjs(pointB.dateEnd) - dayjs(pointB.dateStart);
  return durationA - durationB;
};

export const sortPointByPrice = (pointA, pointB) => (
  pointA.price - pointB.price
);

export const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};
