import {FILTERS_TYPES} from './constants';
import {DATA, getTripPoint} from './mock/mocks.js';
import {MenuView} from './view/site-menu.js';
import {createTripInfo} from './view/trip-info.js';
import {createFilter, createFiltersForm} from './view/filters.js';
import {createSort} from './view/sort.js';
import {createContentList} from './view/content-list.js';
import {createTripPointForm} from './view/trip-point-form.js';
import {createTripPoint} from './view/trip-point.js';
import './mock/mocks.js';
import {renderTemplate, renderElement, RenderPosition} from './utils.js';

const tripPointsArray = new Array(DATA.COUNT_TRIP_POINTS).fill(null).map(getTripPoint);

renderElement('.trip-controls__navigation', new MenuView().getElement(), RenderPosition.BEFOREEND);
renderTemplate('.trip-main', createTripInfo(tripPointsArray), 'afterbegin');
renderTemplate('.trip-events', createSort(), 'beforeend');
renderTemplate('.trip-events', createContentList(), 'beforeend');

//Фильтры
renderTemplate('.trip-controls', createFiltersForm(), 'beforeend');
for (const filter of FILTERS_TYPES) {
  renderTemplate('.trip-filters', createFilter(filter), 'beforeend');
}

//Точки путешествия

renderTemplate('.trip-events__list', createTripPointForm(tripPointsArray[0], false), 'afterbegin');

for (const point of tripPointsArray) {
  renderTemplate('.trip-events__list', createTripPoint(point), 'beforeend');
}

renderTemplate('.trip-events__list', createTripPointForm(tripPointsArray[0], true), 'beforeend');

