import {FILTERS_TYPES, SortType} from '../constants.js';
import MenuView from '../view/menu.js';
import TripInfoView from '../view/trip-info.js';
import FiltersFormView from '../view/filters-form.js';
import FilterView from '../view/filters.js';
import SortView from '../view/sort.js';
import ContentListView from '../view/content-list.js';
import PointPresenter from './point.js';
import InfoView from '../view/info.js';
import {render, RenderPosition} from '../utils/render.js';
import {sortPointByDay, sortPointByTime, sortPointByPrice, updateItem} from '../utils/common.js';

export default class Trip {
  constructor() {
    this._menuView = new MenuView();
    this._filtersFormView = new FiltersFormView();
    this._sortComponent = new SortView();
    this._contentListView = new ContentListView();
    this._pointPresenter = new Map();
    this._currentSortType = SortType.DAY;

    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handlePointChange = this._handlePointChange.bind(this);
  }

  init(tripPoints) {
    // Метод для инициализации (начала работы) модуля,
    // малая часть текущей функции renderTrip в main.js
    this._tripPoints = tripPoints;
    this._renderMenu();
    this._renderFilters();
    this._sortPoints(SortType.DAY);
    this._sourcedPoints = this._tripPoints.slice();
    this._renderTrip();
  }

  _handleModeChange() {
    this._pointPresenter.forEach((presenter) => presenter.resetView());
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

  _sortPoints(sortType) {
    switch (sortType) {
      case SortType.TIME:
        this._tripPoints.sort(sortPointByTime);
        break;
      case SortType.PRICE:
        this._tripPoints.sort(sortPointByPrice);
        break;
      default:
        this._tripPoints.sort(sortPointByDay);
    }

    this._currentSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
    // - Сортируем задачи
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortPoints(sortType);
    // - Очищаем список
    this._clearPoints();
    // - Рендерим список заново
    this._renderPoints();
  }

  _renderSort() {
    // Метод для рендеринга сортировки
    const eventsContainer = document.querySelector('.trip-events');
    render(eventsContainer, this._sortComponent, RenderPosition.BEFOREEND);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderContentList() {
    // Метод для рендеринга контейнера для точек маршрута
    const eventsContainer = document.querySelector('.trip-events');
    render(eventsContainer, this._contentListView, RenderPosition.BEFOREEND);
  }

  _renderPoint(pointsContainer, point) {
    // Метод, куда уйдёт логика созданию и рендерингу компонетов задачи,
    // текущая функция renderPoint в main.js
    const pointPresenter = new PointPresenter(pointsContainer, this._handlePointChange, this._handleModeChange);
    pointPresenter.init(point);
    this._pointPresenter.set(point.id, pointPresenter);
  }

  _renderPoints() {
    // Метод для рендеринга N-задач за раз
    this._renderContentList();
    const eventsListContainer = document.querySelector('.trip-events__list');
    for (const point of this._tripPoints) {
      this._renderPoint(eventsListContainer, point);
    }
  }

  _clearPoints() {
    this._pointPresenter.forEach((presenter) => presenter.destroy());
    this._pointPresenter.clear();
  }

  _renderTrip() {
    // Метод для инициализации (начала работы) модуля,
    // бОльшая часть текущей функции renderTrip в main.js
    if (!this._tripPoints || this._tripPoints.length === 0) {
      this._renderNoPoints();
      return;
    }
    this._renderTripInfo(this._sourcedPoints);
    this._renderSort();
    this._renderPoints();
  }

  _handlePointChange(updatedPoint) {
    this._tripPoints = updateItem(this._tripPoints, updatedPoint);
    this._pointPresenter.get(updatedPoint.id).init(updatedPoint);
  }
}
