import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

const createDurationTrip = (start, end) => {
  const eventDuration = dayjs(end) - dayjs(start);

  let days = dayjs.duration(eventDuration).days();
  days = days < 10 ? `0${days}` : days;
  let hours = dayjs.duration(eventDuration).hours();
  hours = hours < 10 ? `0${hours}` : hours;
  let minutes = dayjs.duration(eventDuration).minutes();
  minutes = minutes < 10 ? `0${minutes}` : minutes;

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

export const createTripPoint = (obj) => {
  const {dateStart, dateEnd, destination, pointType, price, isFavorite, options} = obj;
  const durationEvent = createDurationTrip(dateStart, dateEnd);
  const offers = createOfferList(options);
  const favoriteButtonClass = isFavorite
    ? 'event__favorite-btn  event__favorite-btn--active'
    : 'event__favorite-btn';
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
      <button class="${favoriteButtonClass}" type="button">
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
