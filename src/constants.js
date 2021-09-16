import { nanoid } from 'nanoid';

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
});
