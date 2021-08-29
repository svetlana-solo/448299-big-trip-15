import { createElement } from '../utils.js';

const createContentList = () => (
  `<ul class="trip-events__list">
  </ul>`
);

export default class ContentList {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createContentList();
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
