import TripPointFormView from '../view/trip-point-form.js';
import {remove, render, RenderPosition} from '../utils/render.js';
import {UserAction, UpdateType} from '../constants';

export default class NewPoint {
  constructor(pointsListContainer, changeData, closePoint) {
    this._pointsListContainer = pointsListContainer;
    this._changeData = changeData;
    this._closePoint = closePoint;

    this._tripPointFormComponent = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleCloseClick = this._handleCloseClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(offers, destinations) {
    if (this._tripPointFormComponent !== null) {
      return;
    }

    this._tripPointFormComponent = new TripPointFormView(null, offers, destinations);
    this._tripPointFormComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._tripPointFormComponent.setDeleteClickHandler(this._handleCloseClick);

    document.addEventListener('keydown', this._escKeyDownHandler);

    render(this._pointsListContainer, this._tripPointFormComponent, RenderPosition.AFTERBEGIN);
  }

  destroy() {
    if (this._tripPointFormComponent === null) {
      return;
    }

    remove(this._tripPointFormComponent);
    this._tripPointFormComponent = null;
    document.removeEventListener('keydown', this._escKeyDownHandler);
    this._closePoint();
  }

  setSaving() {
    this._tripPointFormComponent.updateData({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this._tripPointFormComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this._tripPointFormComponent.shake(resetFormState);
  }

  _handleFormSubmit(point) {
    this._changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point,
    );
  }

  _handleCloseClick() {
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  }
}
