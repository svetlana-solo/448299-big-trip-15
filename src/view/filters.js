import AbstractView from './abstract.js';

const createFilter = (filterType) => (
  `<div class="trip-filters__filter">
    <input id="filter-${filterType.toLowerCase()}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filterType.toLowerCase()}">
    <label class="trip-filters__filter-label" for="filter-${filterType.toLowerCase()}">${filterType}</label>
  </div>`
);

export default class Filter extends AbstractView {
  constructor(filter) {
    super();
    this._filter = filter;
  }

  getTemplate() {
    return createFilter(this._filter);
  }
}
