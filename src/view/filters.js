import AbstractView from './abstract.js';
import { FilterType } from '../constants.js';

const createFilters = (currentFilter) => (
  `<div class="trip-controls__filters">
  <h2 class="visually-hidden">Filter events</h2>
  <!-- Фильтры -->
  <form class="trip-filters" action="#" method="get">
  <div class="trip-filters__filter">
    <input id="filter-${FilterType.EVERYTHING}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${FilterType.EVERYTHING}" ${currentFilter === FilterType.EVERYTHING ? 'checked' : ''}>
    <label class="trip-filters__filter-label" for="filter-${FilterType.EVERYTHING}" data-filter-type="${FilterType.EVERYTHING}">EVERYTHING</label>
  </div>
  <div class="trip-filters__filter">
    <input id="filter-${FilterType.FUTURE}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${FilterType.FUTURE}" ${currentFilter === FilterType.FUTURE ? 'checked' : ''}>
    <label class="trip-filters__filter-label" for="filter-${FilterType.FUTURE}" data-filter-type="${FilterType.FUTURE}">FUTURE</label>
  </div>
  <div class="trip-filters__filter">
    <input id="filter-${FilterType.PAST}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${FilterType.PAST}" ${currentFilter === FilterType.PAST ? 'checked' : ''}>
    <label class="trip-filters__filter-label" for="filter-${FilterType.PAST}" data-filter-type="${FilterType.PAST}">PAST</label>
  </div>
  <button class="visually-hidden" type="submit">Accept filter</button>
  </form>
  </div>
  `
);

export default class Filters extends AbstractView {
  constructor(currentFilter) {
    super();
    this._currentFilter = currentFilter;
    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createFilters(this._currentFilter);
  }

  _filterTypeChangeHandler(evt) {
    if (evt.target.tagName !== 'LABEL') {
      return;
    }
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.dataset.filterType);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener('click', this._filterTypeChangeHandler);
  }
}
