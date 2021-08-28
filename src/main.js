import {FILTERS_TYPES} from './constants';
import {DATA, getTripPoint} from './mock/mocks.js';
import {createMenu} from './view/site-menu.js';
import {createTripInfo} from './view/trip-info.js';
import {createFilter, createFiltersForm} from './view/filters.js';
import {createSort} from './view/sort.js';
import {createContentList} from './view/content-list.js';
import {createTripPointForm} from './view/trip-point-form.js';
import {createTripPoint} from './view/trip-point.js';
import './mock/mocks.js';
import {render} from './utils.js';

const tripPointsArray = new Array(DATA.COUNT_TRIP_POINTS).fill(null).map(getTripPoint);

render('.trip-controls__navigation', createMenu(), 'beforeend');
render('.trip-main', createTripInfo(tripPointsArray), 'afterbegin');
render('.trip-events', createSort(), 'beforeend');
render('.trip-events', createContentList(), 'beforeend');

//Фильтры
render('.trip-controls', createFiltersForm(), 'beforeend');
for (const filter of FILTERS_TYPES) {
  render('.trip-filters', createFilter(filter), 'beforeend');
}

//Точки путешествия

render('.trip-events__list', createTripPointForm(tripPointsArray[0], 'false'), 'afterbegin');

for (const point of tripPointsArray) {
  render('.trip-events__list', createTripPoint(point), 'beforeend');
}

render('.trip-events__list', createTripPointForm(tripPointsArray[0], 'true'), 'beforeend');

