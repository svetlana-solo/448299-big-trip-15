import {createDestinationsList} from '../utils/common.js';
import dayjs from 'dayjs';
import {TRANSPORT_TYPES} from '../constants.js';
import AbstractView from './abstract.js';

const createItem = (currentType) => TRANSPORT_TYPES.map((type) => (`
  <div class="event__type-item">
    <input
      id="event-type-${type}-1"
      class="event__type-input  visually-hidden"
      type="radio"
      name="event-type"
      value="${type}"
      ${currentType === type ? 'checked' : ''}
    >
    <label
      class="event__type-label event__type-label--${type}"
      for="event-type-${type}-1"
    >${type}</label>
  </div>
`)).join('\n');

const createOffer = (options) => (
  options.map(({type, title, price}, index) => `<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden"
    id="event-offer-${type}${index}-1"
    type="checkbox"
    name="event-offer-${type}">
    <label class="event__offer-label" for="event-offer-${type}${index}-1">
      <span class="event__offer-title">${title}</span> &plus;&euro;&nbsp;
      <span class="event__offer-price">${price}</span>
    </label>
  </div>`).join('\n')
);

const createPhoto = (destination) => {
  const {photos = []} = destination;
  return (`
    <div class="event__photos-container">
      <div class="event__photos-tape">
      ${ photos.map((photo) => (`
        <img class="event__photo" src="${photo}" alt="Event photo">
      `)).join('\n')}
      </div>
    </div>
  `);
};

const createTripPointForm = (tripPoint, isEdit) => {
  const {dateStart, dateEnd, destination, pointType, price, options, destinationInfo} = tripPoint;
  const citiesList = createDestinationsList(destination.cities);
  const typesEvent = createItem(pointType);
  const offersList = createOffer(options);
  const photoList = createPhoto(destinationInfo);
  return `<form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${pointType}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
                ${typesEvent}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
          ${pointType}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="Chamonix" list="destination-list-1">
          <datalist id="destination-list-1">
          ${citiesList}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dayjs(dateStart).format('YY/MM/DD HH:mm')}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dayjs(dateEnd).format('YY/MM/DD HH:mm')}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">${isEdit ? 'Delete' : 'Cancel'}</button>
        ${isEdit ? `<button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>` : ''}
      </header>
      <section class="event__details">


        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">
            <!--offer-selection-->
            ${offersList || ''}
          </div>
        </section>

        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${destinationInfo.infoText}</p>
          ${photoList || ''}
        </section>
      </section>
    </form>
  </li>`;
};

export default class TripPointForm extends AbstractView {
  constructor(tripPoint, isEdit) {
    super();
    this._tripPoint = tripPoint;
    this._isEdit = isEdit;
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._editClickHandler = this._editClickHandler.bind(this);
  }

  getTemplate() {
    return createTripPointForm(this._tripPoint, this._isEdit);
  }

  _editClickHandler(evt) {
    evt.preventDefault();
    this._callback.editClick();
  }

  setEditClickHandler(callback) {
    this._callback.editClick = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._editClickHandler);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit();
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().addEventListener('submit', this._formSubmitHandler);
  }
}
