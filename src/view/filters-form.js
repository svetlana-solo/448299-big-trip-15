import {createElement} from '../utils.js';

const createFiltersForm = () => (
  `<form class="trip-filters" action="#" method="get">
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`
);

export default class FiltersForm {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createFiltersForm();
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
