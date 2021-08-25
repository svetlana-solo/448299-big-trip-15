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
import {renderTemplate} from './utils.js';

const tripPointsArray = new Array(DATA.COUNT_TRIP_POINTS).fill(null).map(getTripPoint);

renderTemplate('.trip-controls__navigation', createMenu(), 'beforeend');
renderTemplate('.trip-main', createTripInfo(tripPointsArray), 'afterbegin');
renderTemplate('.trip-events', createSort(), 'beforeend');
renderTemplate('.trip-events', createContentList(), 'beforeend');

//Фильтры
renderTemplate('.trip-controls', createFiltersForm(), 'beforeend');
for (const filter of FILTERS_TYPES) {
  renderTemplate('.trip-controls', createFilter(filter), 'beforeend');
}

//Точки путешествия

for (const point of tripPointsArray) {
  renderTemplate('.trip-events__list', createTripPoint(point), 'beforeend');
}

//Функция создания формы для редактирования или создания точки путешествия
const createTripPointForms = (typeForm) => {
  const tripPointState = typeForm === 'edit' ? 'edit' : 'new';
  renderTemplate('.trip-events__list', createTripPointForm(tripPointsArray[0], tripPointState), 'beforeend');
};

createTripPointForms('new');
//createTripPointForm('edit');


