export const createFiltersForm = () => (
  `<form class="trip-filters" action="#" method="get">
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`
);

export const createFilter = (filterType) => (
  `<div class="trip-filters__filter">
    <input id="filter-${filterType.toLowerCase()}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filterType.toLowerCase()}">
    <label class="trip-filters__filter-label" for="filter-${filterType.toLowerCase()}">${filterType}</label>
  </div>`
);
