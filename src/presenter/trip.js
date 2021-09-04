import {FILTERS_TYPES} from '../constants.js';
import MenuView from '../view/menu.js';
import TripInfoView from '../view/trip-info.js';
import FiltersFormView from '../view/filters-form.js';
import FilterView from '../view/filters.js';
import SortView from '../view/sort.js';
import ContentListView from '../view/content-list.js';
import TripPointFormView from '../view/trip-point-form.js';
import TripPointView from '../view/trip-point.js';
import InfoView from '../view/info.js';
import {render, RenderPosition, replace} from '../utils/render.js';

export default class Trip {
  constructor() {
    this._menuView = new MenuView();
    this._filtersFormView = new FiltersFormView();
    this._sortComponent = new SortView();
    this._contentListView = new ContentListView();
  }

  init(tripPoints) {
    // Метод для инициализации (начала работы) модуля,
    // малая часть текущей функции renderTrip в main.js
    this._renderMenu();
    this._renderFilters();
    this._renderTrip(tripPoints);

  }

  _renderMenu() {
    // Метод для рендеринга меню навигации
    const menuContainer = document.querySelector('.trip-controls__navigation');
    render(menuContainer, this._menuView, RenderPosition.BEFOREEND);
  }

  _renderFilters() {
    // Метод для рендеринга фильтров
    const filtersFormContainer = document.querySelector('.trip-controls');
    render(filtersFormContainer, this._filtersFormView, RenderPosition.BEFOREEND);
    const filtersContainer = document.querySelector('.trip-filters');
    for (const filter of FILTERS_TYPES) {
      render(filtersContainer, new FilterView(filter), RenderPosition.BEFOREEND);
    }
  }

  _renderNoPoints() {
    // Метод для рендеринга сообщения при отсутствии точек путешествия
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
    const eventsContainer = document.querySelector('.trip-events');
    render(eventsContainer, new InfoView(state), RenderPosition.BEFOREEND);
  }

  _renderTripInfo(tripPointsArray) {
    // Метод для рендеринга суммарной информации о поездке
    const mainElement = document.querySelector('.trip-main');
    render(mainElement, new TripInfoView(tripPointsArray), RenderPosition.AFTERBEGIN);
  }

  _renderSort() {
    // Метод для рендеринга сортировки
    const eventsContainer = document.querySelector('.trip-events');
    render(eventsContainer, this._sortComponent, RenderPosition.BEFOREEND);
  }

  _renderContentList() {
    // Метод для рендеринга контейнера для точек маршрута
    const eventsContainer = document.querySelector('.trip-events');
    render(eventsContainer, this._contentListView, RenderPosition.BEFOREEND);
  }

  _renderPoint(pointsContainer, point) {
    // Метод, куда уйдёт логика созданию и рендерингу компонетов задачи,
    // текущая функция renderPoint в main.js
    const tripPointComponent = new TripPointView(point);
    const tripPointFormComponent = new TripPointFormView(point, true);

    const replacePointToForm = () => {
      replace(tripPointFormComponent, tripPointComponent);
    };

    const replaceFormToPoint = () => {
      replace(tripPointComponent, tripPointFormComponent);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceFormToPoint();
      }
    };

    tripPointComponent.setEditClickHandler(() => {
      replacePointToForm();
      document.addEventListener('keydown', onEscKeyDown);
    });

    tripPointFormComponent.setEditClickHandler(() => {
      replaceFormToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    tripPointFormComponent.setFormSubmitHandler((evt) => {
      evt.preventDefault();
      replaceFormToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    });
    render(pointsContainer, tripPointComponent, RenderPosition.BEFOREEND);
  }

  _renderPoints(tripPointsArray) {
    // Метод для рендеринга N-задач за раз
    this._renderContentList();
    const eventsListContainer = document.querySelector('.trip-events__list');
    for (const point of tripPointsArray) {
      this._renderPoint(eventsListContainer, point);
    }
  }

  _renderTrip(tripPoints) {
    // Метод для инициализации (начала работы) модуля,
    // бОльшая часть текущей функции renderTrip в main.js
    if (!tripPoints || tripPoints.length === 0) {
      this._renderNoPoints();
      return;
    }
    this._renderTripInfo(tripPoints);
    this._renderSort();

    this._renderPoints(tripPoints);
  }
}
