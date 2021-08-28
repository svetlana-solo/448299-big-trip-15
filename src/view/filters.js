import { createElement } from '../utils.js';

const createFilter = (filterType) => (
  `<div class="trip-filters__filter">
    <input id="filter-${filterType.toLowerCase()}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filterType.toLowerCase()}">
    <label class="trip-filters__filter-label" for="filter-${filterType.toLowerCase()}">${filterType}</label>
  </div>`
);

export default class Filter {
  constructor(filter) {
    this._element = null;
    this._filter = filter;
  }

  getTemplate() {
    return createFilter(this._filter);
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
