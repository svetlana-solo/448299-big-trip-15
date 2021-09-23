import AbstractView from './abstract.js';

const createAdditionButton = () => (
  `<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>
  `
);

export default class AdditionButton extends AbstractView {
  constructor() {
    super();
    this._additionButtonClickHandler = this._additionButtonClickHandler.bind(this);
  }

  getTemplate() {
    return createAdditionButton();
  }

  setDisabled(isDisabled) {
    this.getElement().disabled = isDisabled;
  }

  setAdditionButtonClickHandler(callback) {
    this._callback.additionButtonClick = callback;
    this.getElement().addEventListener('click', this._additionButtonClickHandler);
  }

  _additionButtonClickHandler(evt) {
    evt.preventDefault();

    if (evt.target.disabled) {
      return;
    }
    this._callback.additionButtonClick();
  }
}
