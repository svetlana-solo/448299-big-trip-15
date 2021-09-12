import { nanoid } from 'nanoid';
import { DATA } from './mock/mocks';

export const TRANSPORT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
export const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past',
};
export const SortType = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price',
};
export const MenuType = {
  TABLE: 'table',
  STATS: 'stats',
};

export const getEmptyPoint = () => ({
  id: nanoid(),
  price: '',
  dateStart: undefined,
  dateEnd: undefined,
  pointType: undefined,
  destination: {
    city: undefined,
    cities: DATA.CITIES,
  },
  options: [],
  destinationInfo:
    {
      infoText: '',
      photos: [],
    },
  isFavorite: false,
  availableOptions: DATA.SELECTOR_SETTINGS,
});
