import AbstractView from './abstract.js';

const createAddButton = () => (
  `<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>
  `
);

export default class AddButton extends AbstractView {
  constructor() {
    super();
    this._addButtonClickHandler = this._addButtonClickHandler.bind(this);
  }

  getTemplate() {
    return createAddButton();
  }

  _addButtonClickHandler(evt) {
    evt.preventDefault();

    if (evt.target.disabled) {
      return;
    }
    this._callback.addButtonClick();
  }

  setDisabled(isDisabled) {
    this.getElement().disabled = isDisabled;
  }

  setAddButtonClickHandler(callback) {
    this._callback.addButtonClick = callback;
    this.getElement().addEventListener('click', this._addButtonClickHandler);
  }
}
