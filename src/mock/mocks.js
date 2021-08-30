import {TRANSPORT_TYPES} from '../constants.js';
import {getRandomNumber} from '../utils/utils.js';
import dayjs from 'dayjs';

export const DATA = {
  COUNT_TRIP_POINTS: 10,
  CITIES: ['Tokyo', 'Seul', 'Shanghai', 'Geneva', 'Amsterdam', 'Chamonix'],
  RANDOM_TEXT: [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    'Cras aliquet varius magna, non porta ligula feugiat eget.',
    'Fusce tristique felis at fermentum pharetra.',
    'Aliquam id orci ut lectus varius viverra.',
    'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
    'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
    'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
    'Sed sed nisi sed augue convallis suscipit in sed felis.',
    'Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus.',
    'In rutrum ac purus sit amet tempus.',
  ],
  SELECTOR_SETTINGS:[
    {
      type: 'luggage',
      title: 'Add luggage',
      price: 30,
    },
    {
      type: 'comfort',
      title: 'Switch to comfort class',
      price: 100,
    },
    {
      type: 'meal',
      title: 'Add meal',
      price: 15,
    },
    {
      type: 'seats',
      title: 'Choose seats',
      price: 5,
    },
    {
      type: 'train',
      title: 'Travel by train',
      price: 40,
    },
  ],
};

const getRandomArrayElement = (elements) => elements[getRandomNumber(0, elements.length - 1)];

const getRandomArray = (array) => (
  array.slice(0, getRandomNumber(1, array.length))
);

const getRandomPhotosArray = () => (
  new Array(getRandomNumber(1, 5)).fill(null).map(() => (
    `http://picsum.photos/300/200?r=${Math.random()}`
  ))
);

export const getTripPoint = () => {
  const getDateStart = () => {
    const MAX_MINUTES_GAP = 7 * 24 * 60;
    const dateGap = getRandomNumber(-MAX_MINUTES_GAP, MAX_MINUTES_GAP);
    return dayjs().add(dateGap, 'minute');
  };
  const dateStart = getDateStart();

  const getDateEnd = () => {
    const MAX_MINUTES_GAP = 2 * 24 * 60;
    const dateGap = getRandomNumber(30, MAX_MINUTES_GAP);
    return dayjs(dateStart).add(dateGap, 'minute');
  };
  const dateEnd = getDateEnd();

  const randomMaxText = getRandomNumber(1, DATA.RANDOM_TEXT.length);

  return {
    price: getRandomNumber(0, 200),
    dateStart: dateStart.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
    dateEnd: dateEnd.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
    pointType: getRandomArrayElement(TRANSPORT_TYPES),
    destination: {
      city: getRandomArrayElement(DATA.CITIES),
      cities: DATA.CITIES,
    },
    options: getRandomArray(DATA.SELECTOR_SETTINGS),
    destinationInfo:
      {
        infoText: DATA.RANDOM_TEXT.slice(0, randomMaxText),
        photos:getRandomPhotosArray(),
      },
    isFavorite: Boolean(getRandomNumber(0, 1)),
  };
};
