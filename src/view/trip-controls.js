import AbstractView from './abstract.js';

const createTripControls = () => (
  `<div class="trip-main__trip-controls  trip-controls">
  </div>`
);

export default class TripControls extends AbstractView {
  getTemplate() {
    return createTripControls();
  }
}
