import {createElement} from '../utils.js';

const createInfo = (state) => (`<p class="trip-events__msg">${state === 'Everything' ? 'Click New Event to create your first point' : `There are no ${state === 'Past' ? 'past' : 'future'} events now`}</p>`);


export default class Info {
  constructor(state) {
    this._element = null;
    this._state = state;
  }

  getTemplate() {
    return createInfo(this._state);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
