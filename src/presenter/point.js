import TripPointFormView from '../view/trip-point-form.js';
import TripPointView from '../view/trip-point.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';
import { UserAction, UpdateType } from '../constants.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export const State = {
  SAVING: 'SAVING',
  DELETING: 'DELETING',
  ABORTING: 'ABORTING',
};

export default class Point {
  constructor(pointsContainer, changeData, changeMode) {
    this._pointsContainer = pointsContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._tripPointComponent = null;
    this._tripPointFormComponent = null;
    this._mode = Mode.DEFAULT;

    this._handleOpenEditClick = this._handleOpenEditClick.bind(this);
    this._handleCloseEditClick = this._handleCloseEditClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
  }

  init(point, offers, destinations) {
    this._point = point;
    this._offers = offers;
    this._destinations = destinations;

    const prevTripPointComponent = this._tripPointComponent;
    const prevTripPointFormComponent = this._tripPointFormComponent;

    this._tripPointComponent = new TripPointView(point);
    this._tripPointFormComponent = new TripPointFormView(point, offers, destinations);

    this._tripPointComponent.setEditClickHandler(this._handleOpenEditClick);
    this._tripPointFormComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._tripPointFormComponent.setCloseHandler(this._handleCloseEditClick);
    this._tripPointComponent.setIsFavoriteClickHandler(this._handleFavoriteClick);
    this._tripPointFormComponent.setDeleteClickHandler(this._handleDeleteClick);

    if(prevTripPointComponent === null || prevTripPointFormComponent === null) {
      render(this._pointsContainer, this._tripPointComponent, RenderPosition.BEFOREEND);
      return;
    }
    if (this._mode === Mode.DEFAULT) {
      replace(this._tripPointComponent, prevTripPointComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._tripPointComponent, prevTripPointFormComponent);
      this._mode = Mode.DEFAULT;
    }

    remove(prevTripPointComponent);
    remove(prevTripPointFormComponent);
  }

  destroy() {
    remove(this._tripPointComponent);
    remove(this._tripPointFormComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToPoint();
    }
  }

  setViewState(state) {
    if (this._mode === Mode.DEFAULT) {
      return;
    }

    const resetFormState = () => {
      this._tripPointFormComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    switch (state) {
      case State.SAVING:
        this._tripPointFormComponent.updateData({
          isDisabled: true,
          isSaving: true,
        });
        break;
      case State.DELETING:
        this._tripPointFormComponent.updateData({
          isDisabled: true,
          isDeleting: true,
        });
        break;
      case State.ABORTING:
        this._tripPointComponent.shake(resetFormState);
        this._tripPointFormComponent.shake(resetFormState);
        break;
    }
  }

  _replacePointToForm() {
    replace(this._tripPointFormComponent, this._tripPointComponent);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceFormToPoint() {
    replace(this._tripPointComponent, this._tripPointFormComponent);
    this._mode = Mode.DEFAULT;
  }

  _escKeyDownHandler (evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._replaceFormToPoint();
    }
  }

  _handleOpenEditClick() {
    this._replacePointToForm();
    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  _handleCloseEditClick() {
    this._replaceFormToPoint();
    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  _handleFormSubmit(update) {
    const isMajorUpdate = this._point.dateStart !== update.dateStart || this._point.price !== update.price;
    this._changeData(UserAction.UPDATE_POINT,
      isMajorUpdate ? UpdateType.MAJOR : UpdateType.PATCH,
      update,
    );
    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  _handleDeleteClick(point) {
    this._changeData(
      UserAction.DELETE_POINT,
      UpdateType.MAJOR,
      point,
    );
  }

  _handleFavoriteClick() {
    this._changeData(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      Object.assign(
        {},
        this._point,
        {
          isFavorite: !this._point.isFavorite,
        },
      ),
    );
  }
}
