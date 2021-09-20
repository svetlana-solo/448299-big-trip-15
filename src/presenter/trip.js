import {FilterType, MenuType, SortType,  UpdateType, UserAction} from '../constants.js';
import MenuView from '../view/menu.js';
import StatisticsView from '../view/statistics.js';
import TripInfoView from '../view/trip-info.js';
import FiltersView from '../view/filters.js';
import SortView from '../view/sort.js';
import ContentListView from '../view/content-list.js';
import PointPresenter, {State as PointPresenterViewState} from './point.js';
import NewPointPresenter from './new-point.js';
import InfoView from '../view/info.js';
import {render, RenderPosition, remove} from '../utils/render.js';
import {sortPoints, filterPoints} from '../utils/common.js';
import TripControlsView from '../view/trip-controls.js';
import AddButtonView from '../view/add-button.js';
import LoadingView from '../view/loading.js';
import ErrorView from '../view/error.js';

export default class Trip {
  constructor(headerContainer, eventsContainer, pointsModel, api) {
    this._pointsModel = pointsModel;
    this._api = api;

    this._headerContainer = headerContainer;
    this._eventsContainer = eventsContainer;

    this._currentSortType = SortType.DAY;
    this._currentMenuType = MenuType.TABLE;
    this._currentFilterType = FilterType.EVERYTHING;
    this._isLoading = true;
    this._isError = false;
    this._isNewFormOpened = false;

    this._tripControlsComponent = new TripControlsView();
    this._sortComponent = new SortView(this._currentSortType);
    this._contentListComponent = new ContentListView();
    this._statisticComponent = null;
    this._infoComponent = null;
    this._tripInfoComponent = null;
    this._loadingComponent = new LoadingView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleMenuChange = this._handleMenuChange.bind(this);
    this._handleFilterChange = this._handleFilterChange.bind(this);
    this._handleAddButtonClick = this._handleAddButtonClick.bind(this);

    this._pointsModel.addObserver(this._handleModelEvent);

    this._pointPresenter = new Map();
    this._newPointPresenter = new NewPointPresenter(this._contentListComponent, this._handleViewAction, () => {
      this._addButtonComponent.setDisabled(false);
      this._isNewFormOpened = false;
    });
  }

  init() {
    this._renderTrip();
  }

  _getPoints() {
    const currentPoints = filterPoints(this._currentFilterType, this._pointsModel.getPoints());
    const sortedPoints = sortPoints(this._currentSortType, currentPoints);
    return sortedPoints;
  }

  _handleModeChange() {
    this._pointPresenter.forEach((presenter) => presenter.resetView());
    this._newPointPresenter.destroy();
  }

  _handleMenuChange(currentMenu) {
    if (this._currentMenuType === currentMenu) {
      return;
    }
    this._currentMenuType = currentMenu;
    this._clearTrip();
    this._renderTrip();
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._currentSortType = sortType;
    this._clearTrip();
    this._renderTrip();
  }

  _handleFilterChange(filterType) {
    if (this._currentFilterType === filterType) {
      return;
    }
    this._currentFilterType = filterType;
    this._clearTrip();
    this._renderTrip();
  }

  _handleAddButtonClick() {
    this._clearTrip({resetFilterType: true, resetSortType: true});
    this._currentMenuType = MenuType.TABLE;
    this._isNewFormOpened = true;
    this._renderTrip();
    this._addButtonComponent.setDisabled(true);
    this._newPointPresenter.init(this._pointsModel.offers, this._pointsModel.destinations);
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._pointPresenter.get(update.id).setViewState(PointPresenterViewState.SAVING);
        this._api.updatePoint(update)
          .then((response) => {
            this._pointsModel.updatePoint(updateType, response);
          })
          .catch(() => {
            this._pointPresenter.get(update.id).setViewState(PointPresenterViewState.ABORTING);
          });
        break;
      case UserAction.ADD_POINT:
        this._newPointPresenter.setSaving();
        this._api.addPoint(update)
          .then((response) => {
            this._pointsModel.addPoint(updateType, response);
            this._isNewFormOpened = false;
          })
          .catch(() => {
            this._newPointPresenter.setAborting();
          });
        break;
      case UserAction.DELETE_POINT:
        this._pointPresenter.get(update.id).setViewState(PointPresenterViewState.DELETING);
        this._api.deletePoint(update)
          .then(() => {
            this._pointsModel.deletePoint(updateType, update);
          })
          .catch(() => {
            this._pointPresenter.get(update.id).setViewState(PointPresenterViewState.ABORTING);
          });
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        // - обновить часть списка (например, когда поменялось описание)
        this._pointPresenter.get(data.id).init(data, this._pointsModel.offers, this._pointsModel.destinations);
        break;
      case UpdateType.MINOR:
        // - обновить список (например, когда задача ушла в архив)
        this._clearTrip();
        this._renderTrip();
        break;
      case UpdateType.MAJOR:
        // - обновить всю доску (например, при переключении фильтра)
        this._clearTrip({resetFilterType: true, resetSortType: true});
        this._renderTrip();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        this._clearTrip();
        this._renderTrip();
        break;
      case UpdateType.ERROR:
        this._isLoading = false;
        this._isError = true;
        this._clearTrip();
        this._renderTrip();
    }
  }

  _clearPoints() {
    this._pointPresenter.forEach((presenter) => presenter.destroy());
    this._pointPresenter.clear();
  }

  _clearTrip({resetFilterType = false, resetSortType = false} = {}) {
    this._clearPoints();
    remove(this._contentListComponent);
    remove(this._sortComponent);
    remove(this._addButtonComponent);
    remove(this._filtersComponent);
    remove(this._tripInfoComponent);
    remove(this._menuComponent);
    remove(this._statisticComponent);
    remove(this._infoComponent);
    remove(this._loadingComponent);
    this._newPointPresenter.destroy();

    if(resetFilterType) {
      this._currentFilterType = FilterType.EVERYTHING;
    }

    if(resetSortType) {
      this._currentSortType = SortType.DAY;
    }
  }

  _renderTripControls() {
    render(this._headerContainer, this._tripControlsComponent, RenderPosition.BEFOREEND);
    this._renderMenu();
    this._renderFilters();
  }

  _renderAddButton() {
    this._addButtonComponent = new AddButtonView();
    this._addButtonComponent.setAddButtonClickHandler(this._handleAddButtonClick);
    render(this._headerContainer, this._addButtonComponent, RenderPosition.BEFOREEND);
  }

  _renderMenu() {
    // Метод для рендеринга меню навигации
    this._menuComponent = new MenuView(this._currentMenuType);
    this._menuComponent.setClickMenuItemHandler(this._handleMenuChange);
    render(this._tripControlsComponent, this._menuComponent, RenderPosition.BEFOREEND);
  }

  _renderFilters() {
    // Метод для рендеринга фильтров
    this._filtersComponent = new FiltersView(this._currentFilterType, this._currentMenuType === MenuType.STATS);
    this._filtersComponent.setFilterTypeChangeHandler(this._handleFilterChange);
    render(this._tripControlsComponent, this._filtersComponent, RenderPosition.BEFOREEND);
  }

  _renderNoPoints() {
    // Метод для рендеринга сообщения при отсутствии точек путешествия
    this._infoComponent = new InfoView(this._currentFilterType);
    render(this._eventsContainer, this._infoComponent, RenderPosition.AFTERBEGIN);
  }

  _renderLoading() {
    this._addButtonComponent.setDisabled(true);
    render(this._eventsContainer, this._loadingComponent, RenderPosition.AFTERBEGIN);
  }

  _renderTripInfo(tripPointsArray) {
    // Метод для рендеринга суммарной информации о поездке
    this._tripInfoComponent = new TripInfoView(tripPointsArray);
    render(this._headerContainer, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
  }

  _renderSort() {
    // Метод для рендеринга сортировки
    remove(this._sortComponent);
    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
    render(this._eventsContainer, this._sortComponent, RenderPosition.BEFOREEND);
  }

  _renderContentList() {
    // Метод для рендеринга контейнера для точек маршрута
    render(this._eventsContainer, this._contentListComponent, RenderPosition.BEFOREEND);
  }

  _renderPoint(pointsContainer, point) {
    const pointPresenter = new PointPresenter(pointsContainer, this._handleViewAction, this._handleModeChange);
    pointPresenter.init(point, this._pointsModel.offers, this._pointsModel.destinations);
    this._pointPresenter.set(point.id, pointPresenter);
  }

  _renderPoints(points) {
    // Метод для рендеринга N-задач за раз
    this._renderContentList();
    for (const point of points) {
      this._renderPoint(this._contentListComponent, point);
    }
  }

  _renderStatistics() {
    this._statisticComponent = new StatisticsView(this._pointsModel.getPoints());
    render(this._eventsContainer,  this._statisticComponent, RenderPosition.BEFOREEND);
  }

  _renderTrip() {
    this._renderTripControls();
    this._renderAddButton();

    if (this._isLoading) {
      this._renderLoading();
      this._addButtonComponent.setDisabled(true);
      return;
    }

    if(this._isError) {
      render(this._eventsContainer, new ErrorView(), RenderPosition.AFTERBEGIN);
      this._addButtonComponent.setDisabled(true);
      return;
    }

    const points = this._getPoints();
    if (points.length) {
      this._renderTripInfo(sortPoints(SortType.DAY, this._pointsModel.getPoints()));
    }

    if (this._currentMenuType === MenuType.STATS) {
      this._renderStatistics();
      return;
    }

    if (points.length === 0 && !this._isNewFormOpened) {
      this._renderNoPoints();
      return;
    }

    if (points.length === 0 && this._isNewFormOpened) {
      this._renderContentList();
      return;
    }

    this._renderSort();
    this._renderPoints(points);
  }
}
