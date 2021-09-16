import {FilterType, getEmptyPoint, MenuType, SortType} from '../constants.js';
import MenuView from '../view/menu.js';
import TripInfoView from '../view/trip-info.js';
import FiltersView from '../view/filters.js';
import SortView from '../view/sort.js';
import ContentListView from '../view/content-list.js';
import PointPresenter from './point.js';
import InfoView from '../view/info.js';
import {render, RenderPosition, remove} from '../utils/render.js';
import {updateItem, sortPoints, filterPoints} from '../utils/common.js';
import TripControlsView from '../view/trip-controls.js';
import AddButtonView from '../view/add-button.js';
import TripPointForm from '../view/trip-point-form.js';

export default class Trip {
  constructor(headerContainer, eventsContainer) {
    this._headerContainer = headerContainer;
    this._eventsContainer = eventsContainer;
    this._tripControlsView = new TripControlsView();
    this._currentSortType = SortType.DAY;
    this._currentMenu = MenuType.TABLE;
    this._currentFilter = FilterType.EVERYTHING;
    this._sortComponent = new SortView(this._currentSortType);
    this._contentListView = new ContentListView();
    this._pointPresenter = new Map();
    this._isNewFormOpened = false;

    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handlePointChange = this._handlePointChange.bind(this);
    this._handleMenuChange = this._handleMenuChange.bind(this);
    this._handleFilterChange = this._handleFilterChange.bind(this);
    this._handleAddButtonClick = this._handleAddButtonClick.bind(this);
    this._handleNewFormClose = this._handleNewFormClose.bind(this);
  }

  init({points, offers, destinations}) {
    // Метод для инициализации (начала работы) модуля,
    // малая часть текущей функции renderTrip в main.js
    this._tripPoints = points;
    this._offers = offers;
    this._destinations = destinations;
    this._sourcedPoints = this._tripPoints.slice();
    this._renderTripControls();
    this._renderAddButton();
    this._sortPoints(SortType.DAY, this._tripPoint);
    this._renderTrip();
  }

  _handleModeChange() {
    this._pointPresenter.forEach((presenter) => presenter.resetView());
  }

  _handleMenuChange(currentMenu) {
    if (this._currentMenu === currentMenu) {
      return;
    }
    this._currentMenu = currentMenu;
    remove(this._menuView);
    this._menuView = new MenuView(this._currentMenu);
    this._renderMenu();
    if (this._currentMenu === MenuType.STATS) {
      this._clearTable();
    } else {
      this._renderTable();
    }
  }

  _handleSortTypeChange(sortType) {
    // - Сортируем задачи
    if (this._currentSortType === sortType) {
      return;
    }
    this._sortPoints(sortType);

    this._renderSort();
    // - Очищаем список
    this._clearPoints();
    // - Рендерим список заново
    this._renderPoints();
  }

  _handleFilterChange(filterType) {
    if (this._currentFilter === filterType) {
      return;
    }
    this._filterPoints(filterType);
    remove(this._filtersView);
    this._renderFilters();
    this._clearPoints();
    this._renderPoints();
  }

  _handleAddButtonClick() {
    this._currentSortType = SortType.DAY;
    this._isNewFormOpened = true;
    this._filterPoints(FilterType.EVERYTHING);
    remove(this._addButtonView);
    remove(this._filtersView);
    this._clearPoints();
    this._renderAddButton();
    this._renderFilters();
    this._renderSort();
    this._renderPoints();
    this._renderNewPointForm();
  }

  _handlePointChange(updatedPoint) {
    this._tripPoints = updateItem(this._tripPoints, updatedPoint);
    this._pointPresenter.get(updatedPoint.id).init(updatedPoint);
  }

  _handleNewFormClose() {
    remove(this._newPointFormView);
    this._isNewFormOpened = false;
    remove(this._addButtonView);
    this._renderAddButton();
  }

  _sortPoints(sortType) {
    this._tripPoints = sortPoints(sortType, this._tripPoints);
    this._currentSortType = sortType;
  }

  _filterPoints(filterType) {
    const sortedPoints = sortPoints(this._currentSortType, this._sourcedPoints);
    this._tripPoints = filterPoints(filterType, sortedPoints);
    this._currentFilter = filterType;
  }

  _clearPoints() {
    this._pointPresenter.forEach((presenter) => presenter.destroy());
    this._pointPresenter.clear();
  }

  _clearTable() {
    this._clearPoints();
    remove(this._contentListView);
    remove(this._sortComponent);
  }

  _renderTripControls() {
    render(this._headerContainer, this._tripControlsView, RenderPosition.BEFOREEND);
    this._renderMenu();
    this._renderFilters();
  }

  _renderAddButton() {
    this._addButtonView = new AddButtonView(this._isNewFormOpened);
    this._addButtonView.setAddButtonClickHandler(this._handleAddButtonClick);
    render(this._headerContainer, this._addButtonView, RenderPosition.BEFOREEND);
  }

  _renderTable() {
    this._renderSort();
    this._renderPoints();
  }

  _renderMenu() {
    // Метод для рендеринга меню навигации
    this._menuView = new MenuView(this._currentMenu);
    this._menuView.setClickMenuItemHandler(this._handleMenuChange);
    render(this._tripControlsView, this._menuView, RenderPosition.BEFOREEND);
  }

  _renderFilters() {
    // Метод для рендеринга фильтров
    this._filtersView = new FiltersView(this._currentFilter);
    this._filtersView.setFilterTypeChangeHandler(this._handleFilterChange);
    render(this._tripControlsView, this._filtersView, RenderPosition.BEFOREEND);
  }

  _renderNoPoints() {
    // Метод для рендеринга сообщения при отсутствии точек путешествия
    render(this._eventsContainer, new InfoView(this._currentFilter), RenderPosition.BEFOREEND);
  }

  _renderTripInfo(tripPointsArray) {
    // Метод для рендеринга суммарной информации о поездке
    render(this._headerContainer, new TripInfoView(tripPointsArray), RenderPosition.AFTERBEGIN);
  }

  _renderSort() {
    // Метод для рендеринга сортировки
    remove(this._sortComponent);
    this._sortComponent = new SortView(this._currentSortType);
    render(this._eventsContainer, this._sortComponent, RenderPosition.BEFOREEND);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderContentList() {
    // Метод для рендеринга контейнера для точек маршрута
    render(this._eventsContainer, this._contentListView, RenderPosition.BEFOREEND);
  }

  _renderPoint(pointsContainer, point) {
    // Метод, куда уйдёт логика созданию и рендерингу компонетов задачи,
    // текущая функция renderPoint в main.js
    const pointPresenter = new PointPresenter(pointsContainer, this._handlePointChange, this._handleModeChange);
    pointPresenter.init({point, offers: this._offers, destinations: this._destinations});
    this._pointPresenter.set(point.id, pointPresenter);
  }

  _renderPoints() {
    // Метод для рендеринга N-задач за раз
    this._renderContentList();
    for (const point of this._tripPoints) {
      this._renderPoint(this._contentListView, point);
    }
  }

  _renderNewPointForm() {
    this._newPointFormView = new TripPointForm({...getEmptyPoint(), offers : this._offers, destinations : this._destinations}, false);
    this._newPointFormView.setCloseHandler(this._handleNewFormClose);
    render(this._contentListView, this._newPointFormView, RenderPosition.AFTERBEGIN);
  }

  _renderTrip() {
    // Метод для инициализации (начала работы) модуля,
    // бОльшая часть текущей функции renderTrip в main.js
    if (!this._tripPoints || this._tripPoints.length === 0) {
      this._renderNoPoints();
      return;
    }
    this._renderTripInfo(sortPoints(SortType.DAY, this._sourcedPoints));
    this._renderSort();
    this._renderPoints();
  }
}
