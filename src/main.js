import {createMenu} from './view/site-menu.js';
import {createTripInfo} from './view/trip-info.js';
import {createTripPrice} from './view/trip-price.js';
import {createFilters} from './view/filters.js';
import {createSort} from './view/sort.js';
import {createContentList} from './view/content-list.js';
import {createNewTripPoint} from './view/new-trip-point.js';
import {createEditTripPoint} from './view/edit-trip-point.js';
import {createTripPoint} from './view/trip-point.js';

const render = (parent, template, place) => {
  const container = document.querySelector(parent);
  container.insertAdjacentHTML(place, template);
};

render('.trip-controls__navigation', createMenu(), 'beforeend');
render('.trip-main', createTripInfo(), 'afterbegin');
render('.trip-info', createTripPrice(), 'beforeend');
render('.trip-controls', createFilters(), 'beforeend');
render('.trip-events', createSort(), 'beforeend');
render('.trip-events', createContentList(), 'beforeend');
render('.trip-events__list', createNewTripPoint(), 'beforeend');
render('.trip-events__list', createEditTripPoint(), 'beforeend');

const COUNT_TRIP_POINTS = 3;

for (let i = 0; i < COUNT_TRIP_POINTS; i++) {
  render('.trip-events__list', createTripPoint(), 'beforeend');
}
