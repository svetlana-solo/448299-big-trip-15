import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);
import AbstractView from './abstract.js';

const createDurationTrip = (start, end) => {
  const eventDuration = dayjs(end) - dayjs(start);

  const days = dayjs.duration(eventDuration).days().toString().padStart(2, '0');
  const hours = dayjs.duration(eventDuration).hours().toString().padStart(2, '0');
  const minutes = dayjs.duration(eventDuration).minutes().toString().padStart(2, '0');

  if (days > 0) {
    return `${days}D ${hours}H ${minutes}M`;
  } else if (hours > 0) {
    return `${hours}H ${minutes}M`;
  }
  return `${minutes}M`;
};

const createOfferList = (array) => (`
  <ul class="event__selected-offers">
    ${array.map((item) => {
    const {title, price} = item;
    return `<li class="event__offer">
              <span class="event__offer-title">${title}</span>
              &plus;&euro;&nbsp;
              <span class="event__offer-price">${price}</span>
            </li>`;
  }).join('\n')}
  </ul>
`);

const createTripPoint = (obj) => {
  const {dateStart, dateEnd, destination, pointType, price, isFavorite, options} = obj;
  const durationEvent = createDurationTrip(dateStart, dateEnd);
  const offers = createOfferList(options);
  return `<div class="event">
      <time class="event__date" datetime="${dayjs(dateStart).format('YYYY-MM-DD')}">${dayjs(dateStart).format('MMM DD')}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${pointType}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${pointType} ${destination.city}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${dayjs(dateStart).format('YYYY-MM-DDTHH:mm')}">${dayjs(dateStart).format('HH:mm')}</time>
          &mdash;
          <time class="event__end-time" datetime="${dayjs(dateEnd).format('YYYY-MM-DDTHH:mm')}">${dayjs(dateEnd).format('HH:mm')}</time>
        </p>
        <p class="event__duration">${durationEvent}</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${price}</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
        ${offers}
      <button class="event__favorite-btn ${isFavorite ? 'event__favorite-btn--active' : ''}" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`;
};

export default class TripPoint extends AbstractView {
  constructor(obj) {
    super();
    this._obj = obj;

    this._editClickHandler = this._editClickHandler.bind(this);
  }

  getTemplate() {
    return createTripPoint(this._obj);
  }

  _editClickHandler(evt) {
    evt.preventDefault();
    this._callback.editClick();
  }

  setEditClickHandler(callback) {
    this._callback.editClick = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._editClickHandler);
  }
}
