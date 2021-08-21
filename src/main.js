import {FILTERS_TYPES, TRANSPORT_TYPES} from './constants';
import {DATA, getTripPoint} from './mock/mocks.js';
import {createMenu} from './view/site-menu.js';
import {createTripInfo} from './view/trip-info.js';
import {createTripPrice} from './view/trip-price.js';
import {createFilter, createFiltersForm} from './view/filters.js';
import {createSort} from './view/sort.js';
import {createContentList} from './view/content-list.js';
import {createEditNewTripPoint} from './view/edit-new-trip-point.js';
import {createTripPoint} from './view/trip-point.js';
import {createItem} from './view/type-item.js';
import {createOffer} from './view/offer-selector.js';
import './mock/mocks.js';

const tripPointsArray = new Array(DATA.COUNT_TRIP_POINTS).fill('').map(getTripPoint);

const render = (parentSelector, template, place) => {
  const container = document.querySelector(parentSelector);
  container.insertAdjacentHTML(place, template);
};

render('.trip-controls__navigation', createMenu(), 'beforeend');
render('.trip-main', createTripInfo(tripPointsArray), 'afterbegin');
render('.trip-info', createTripPrice(), 'beforeend');
render('.trip-events', createSort(), 'beforeend');
render('.trip-events', createContentList(), 'beforeend');

//Фильтры
render('.trip-controls', createFiltersForm(), 'beforeend');
for (const filter of FILTERS_TYPES) {
  render('.trip-controls', createFilter(filter), 'beforeend');
}

//Точки путешествия

for (const point of tripPointsArray) {
  render('.trip-events__list', createTripPoint(point), 'beforeend');
}

//Функция создания формы для редактирования или создания точки путешествия
const createTripPointForm = (typeForm) => {
  const tripPointState = typeForm === 'edit' ? 'edit' : 'new';
  render('.trip-events__list', createEditNewTripPoint(tripPointsArray[0], tripPointState), 'beforeend');
  for (const type of TRANSPORT_TYPES) {
    render('.event__type-group', createItem(type), 'beforeend');
  }

};

createTripPointForm('new');
//createTripPointForm('edit');

// Выбор опций путешествия
render('.event__available-offers', createOffer(DATA.SELECTOR_SETTINGS), 'beforeend');

