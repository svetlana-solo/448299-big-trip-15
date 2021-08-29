import AbstractView from './abstract.js';

const createContentList = () => (
  `<ul class="trip-events__list">
  </ul>`
);

export default class ContentList extends AbstractView {
  getTemplate() {
    return createContentList();
  }
}
