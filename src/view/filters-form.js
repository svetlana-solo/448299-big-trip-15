import AbstractView from './abstract.js';

const createFiltersForm = () => (
  `<form class="trip-filters" action="#" method="get">
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`
);

export default class FiltersForm extends AbstractView {
  getTemplate() {
    return createFiltersForm();
  }
}
