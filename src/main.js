import {FILTERS_TYPES} from './constants';
import {DATA, getTripPoint} from './mock/mocks.js';
import MenuView from './view/site-menu.js';
import TripInfoView from './view/trip-info.js';
import FiltersFormView from './view/filters-form.js';
import FilterView from './view/filters.js';
import SortView from './view/sort.js';
import ContentListView from './view/content-list.js';
import TripPointFormView from './view/trip-point-form.js';
import TripPointView from './view/trip-point.js';
import InfoView from './view/info.js';
import './mock/mocks.js';
import {render, RenderPosition, isEscEvent} from './utils.js';

const tripPointsArray = new Array(DATA.COUNT_TRIP_POINTS).fill(null).map(getTripPoint);
const mainElement = document.querySelector('.trip-main');
const menuContainer = document.querySelector('.trip-controls__navigation');
const filtersFormContainer = document.querySelector('.trip-controls');
const eventsContainer = document.querySelector('.trip-events');

render(menuContainer, new MenuView().getElement(), RenderPosition.BEFOREEND);

//Фильтры
render(filtersFormContainer, new FiltersFormView().getElement(), RenderPosition.BEFOREEND);
const filtersContainer = document.querySelector('.trip-filters');
for (const filter of FILTERS_TYPES) {
  render(filtersContainer, new FilterView(filter).getElement(), RenderPosition.BEFOREEND);
}

if (!tripPointsArray || tripPointsArray.length === 0) {
  const futureFilter = document.querySelector('#filter-future');
  const isFuture = futureFilter && futureFilter.checked;
  const pastFilter = document.querySelector('#filter-past');
  const isPast = pastFilter && pastFilter.checked;
  let state = 'Everything';
  if(isFuture) {
    state = 'Future';
  }
  if(isPast) {
    state = 'Past';
  }
  render(eventsContainer, new InfoView(state).getElement(), RenderPosition.BEFOREEND);
} else {
  render(mainElement, new TripInfoView(tripPointsArray).getElement(), RenderPosition.AFTERBEGIN);
  render(eventsContainer, new SortView().getElement(), RenderPosition.BEFOREEND);
  render(eventsContainer, new ContentListView().getElement(), RenderPosition.BEFOREEND);

  const eventsListContainer = document.querySelector('.trip-events__list');

  const renderPoint = (pointsContainer, point) => {
    const tripPointComponent = new TripPointView(point);
    const tripPointFormComponent = new TripPointFormView(point, true);

    const replacePointToForm = () => {
      pointsContainer.replaceChild(tripPointFormComponent.getElement(), tripPointComponent.getElement());
    };

    const replaceFormToPoint = () => {
      pointsContainer.replaceChild(tripPointComponent.getElement(), tripPointFormComponent.getElement());
    };

    const onEscKeydown = (evt) => {
      if (isEscEvent(evt)) {
        evt.preventDefault();
        replaceFormToPoint();
      }
    };

    document.addEventListener('keydown', onEscKeydown);

    tripPointComponent.getElement().querySelector('.event__rollup-btn').addEventListener('click', () => {
      replacePointToForm();
    });

    tripPointFormComponent.getElement().querySelector('.event__rollup-btn').addEventListener('click', () => {
      replaceFormToPoint();
    });

    tripPointFormComponent.getElement().addEventListener('submit', (evt) => {
      evt.preventDefault();
      replaceFormToPoint();
    });


    render(pointsContainer, tripPointComponent.getElement(), RenderPosition.BEFOREEND);
  };
  for (const point of tripPointsArray) {
    renderPoint(eventsListContainer, point);
  }
}

