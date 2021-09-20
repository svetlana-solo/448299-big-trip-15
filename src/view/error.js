import AbstractView from './abstract.js';

const createError = () => (
  `<p class="trip-events__msg">
  Something went wrong...
  </p>`
);

export default class Error extends AbstractView {
  getTemplate() {
    return createError();
  }
}
