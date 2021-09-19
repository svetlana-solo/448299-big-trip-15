import { FilterType } from '../constants.js';
import AbstractView from './abstract.js';

const createInfo = (state) => (`<p class="trip-events__msg">${state === FilterType.EVERYTHING ? 'Click New Event to create your first point' : `There are no ${state === FilterType.PAST ? 'past' : 'future'} events now`}</p>`);


export default class Info extends AbstractView {
  constructor(state) {
    super();
    this._state = state;
  }

  getTemplate() {
    return createInfo(this._state);
  }
}
