import AbstractView from './abstract.js';

const createAddButton = (isDisabled) => (
  `<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button" ${isDisabled ? 'disabled' : ''}>New event</button>
  `
);

export default class AddButton extends AbstractView {
  constructor(isDisabled) {
    super();
    this._isDisabled = isDisabled;
    this._addButtonClickHandler = this._addButtonClickHandler.bind(this);
  }

  getTemplate() {
    return createAddButton(this._isDisabled);
  }

  _addButtonClickHandler(evt) {
    evt.preventDefault();

    if (this._isDisabled) {
      return;
    }
    this._callback.addButtonClick();
  }

  setAddButtonClickHandler(callback) {
    this._callback.addButtonClick = callback;
    this.getElement().addEventListener('click', this._addButtonClickHandler);
  }
}
