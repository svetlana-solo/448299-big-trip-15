import {DATA} from './constants';
import {createMenu} from './view/site-menu.js';
import {createTripInfo} from './view/trip-info.js';
import {createTripPrice} from './view/trip-price.js';
import {createFilter, createFiltersForm} from './view/filters.js';
import {createSort} from './view/sort.js';
import {createContentList} from './view/content-list.js';
import {createNewTripPoint} from './view/new-trip-point.js';
import {createEditTripPoint} from './view/edit-trip-point.js';
import {createTripPoint} from './view/trip-point.js';
import {createItem} from './view/type-item.js';
import {createOfferSelector} from './view/offer-selector.js';

const render = (parent, template, place) => {
  const container = document.querySelector(parent);
  container.insertAdjacentHTML(place, template);
};

render('.trip-controls__navigation', createMenu(), 'beforeend');
render('.trip-main', createTripInfo(), 'afterbegin');
render('.trip-info', createTripPrice(), 'beforeend');
render('.trip-events', createSort(), 'beforeend');
render('.trip-events', createContentList(), 'beforeend');

//Фильтры
render('.trip-controls', createFiltersForm(), 'beforeend');
for (const filter of DATA.FILTERS_TYPES) {
  render('.trip-controls', createFilter(filter), 'beforeend');
}

//Точки путешествия

for (let i = 0; i < DATA.COUNT_TRIP_POINTS; i++) {
  render('.trip-events__list', createTripPoint(), 'beforeend');
}

//Функция создания формы для редактирования или создания точки путешествия
const createTripPointForm = (typeForm) => {
  let createFunction = createNewTripPoint();
  if(typeForm === 'edit') {
    createFunction = createEditTripPoint();
  }
  render('.trip-events__list', createFunction, 'beforeend');
  for (const type of DATA.TRANSPORT_TYPES) {
    render('.event__type-group', createItem(type), 'beforeend');
  }

};

createTripPointForm();
createTripPointForm('edit');

// Выбор опций путешествия
for (const offer of DATA.SELECTOR_SETTINGS) {
  render('.event__available-offers', createOfferSelector(offer.type, offer.title, offer.price), 'beforeend');
}
