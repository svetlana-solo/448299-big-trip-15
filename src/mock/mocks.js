import {TRANSPORT_TYPES} from '../constants.js';
import {getRandomNumber} from '../utils.js';

export const DATA = {
  COUNT_TRIP_POINTS: 3,
  CITIES: ['Tokyo','Seul','Shanghai','Geneva','Amsterdam','Chamonix'],
  RANDOM_TEXT: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.',
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

const getRandomDate = () => {
  const months = ['APR', 'MAR'];
  return {
    date: getRandomNumber(5, 30),
    month: months[getRandomNumber()],
    timeHour: getRandomNumber(10, 12),
    timeMinute: getRandomNumber(10, 30),
  };
};

const getRandomArrayElement = (elements) => elements[getRandomNumber(0, elements.length - 1)].toLowerCase();

const getRandomArray = (array) => (
  array.slice(getRandomNumber(0, array.length), getRandomNumber(0, array.length))
);

const getRandomPhotosArray = () => (
  new Array(getRandomNumber(0, 5)).fill('').map(() => (
    `http://picsum.photos/248/152?r=${getRandomNumber(0, 100)}`
  ))
);

export const getTripPoint = () => {
  const date = getRandomDate().date;
  const month = getRandomDate().month;
  const nextDay = date + getRandomNumber(0, 5);
  const startHour = getRandomDate().timeHour;
  const startMinute = getRandomDate().timeMinute;
  const endHour = startHour + getRandomNumber(0, 5);
  const endMinute = startMinute + getRandomNumber(0, 5);

  const dateStart = `${month} ${date}`;
  const dateEnd = `${month} ${nextDay}`;
  const timeStart = `${startHour}:${startMinute}`;
  const timeEnd = `${endHour}:${endMinute}`;

  const findDurationHour = (...times) => {
    const array = times.sort();
    return array[1] - array[0];
  };

  const findDurationMinute = (...times) => {
    const array = times.sort();
    return array[1] - array[0];
  };

  const findDuration = () => {
    const hour = findDurationHour(startHour, endHour);
    const minute = findDurationMinute(startMinute, endMinute);
    if (!hour) {
      return `${minute}M`;
    }
    if (!minute) {
      return `${hour}H`;
    }
    return `${hour}H ${minute}M`;
  };

  const randomWords = DATA.RANDOM_TEXT.split('. ');

  return {
    price: getRandomNumber(0, 200),
    date: {
      dateStart,
      timeStart,
      dateEnd,
      timeEnd,
    },
    pointType: getRandomArrayElement(TRANSPORT_TYPES),
    destination: {
      city: getRandomArrayElement(DATA.CITIES),
      cities: DATA.CITIES,
    },
    options: getRandomArray(DATA.SELECTOR_SETTINGS),
    destinationInfo:
      {
        infoText: getRandomArray(randomWords).join('. '),
        photos:getRandomPhotosArray(),
      },
    isFavorite: !!getRandomNumber(),
    duration: findDuration(),
  };
};
