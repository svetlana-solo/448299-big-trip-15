import dayjs from 'dayjs';
import {TRANSPORT_TYPES} from '../constants.js';
import SmartView from './smart.js';
import flatpickr from 'flatpickr';

import '../../node_modules/flatpickr/dist/flatpickr.min.css';

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
    data-point-type=${type}>${type}</label>
  </div>
`)).join('\n');

const createOffer = (availableOptions) => (
  availableOptions.map(({title, price, isChecked}, index) => `<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden"
    id="event-offer-${index}-1"
    type="checkbox"
    name="event-offer-${title}"
    ${isChecked ? 'checked' : ''}
    >
    <label class="event__offer-label" for="event-offer-${index}-1" data-offer=${index}>
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

const createDestinationsList = (cities) => (
  cities.map((city) => (`<option value="${city}" data-city=${city}>${city}</option>`)).join('')
);

const createTripPointForm = (data, isEdit) => {
  const {dateStart, dateEnd, destination, pointType, price, availableOptions, destinationInfo, hasOptions} = data;
  const citiesList = createDestinationsList(destination.cities);
  const typesEvent = createItem(pointType);
  const offersList = createOffer(availableOptions);
  const photoList = createPhoto(destinationInfo);

  return `<li>
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            ${pointType ? `<img class="event__type-icon" width="17" height="17" src="img/icons/${pointType}.png" alt="Event type icon">` : ''}
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
          ${pointType || ''}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.city || ''}" list="destination-list-1">
          <datalist id="destination-list-1">
          ${citiesList}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <span class="event__date-start">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dateStart ? dayjs(dateStart).format('YY/MM/DD HH:mm') : ''}">
          </span>
          &mdash;
          <span class="event__date-end">
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateEnd ? dayjs(dateEnd).format('YY/MM/DD HH:mm') : ''}">
          </span>
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


        ${hasOptions ? `<section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">
            <!--offer-selection-->
            ${offersList || ''}
          </div>
        </section>` : ''}

        ${destinationInfo.infoText ? `<section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${destinationInfo.infoText}</p>
          ${photoList || ''}
        </section>` : ''}
      </section>
    </form>
    </li>
  `;
};

export default class TripPointForm extends SmartView {
  constructor(tripPoint, isEdit) {
    super();
    this._data = TripPointForm.parsePointToData(tripPoint);
    this._datepicker = null;
    this._isEdit = isEdit;

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._closeHandler = this._closeHandler.bind(this);
    this._dateStartChangeHandler = this._dateStartChangeHandler.bind(this);
    this._dateEndChangeHandler = this._dateEndChangeHandler.bind(this);
    this._pointTypeChooseHandler = this._pointTypeChooseHandler.bind(this);
    this._cityChooseHandler = this._cityChooseHandler.bind(this);
    this._priceChangeHandler = this._priceChangeHandler.bind(this);
    this._offerChangeHandler = this._offerChangeHandler.bind(this);

    this._setInnerHandlers();
    this._setDateStartPicker();
    this._setDateEndPicker();
  }

  getTemplate() {
    return createTripPointForm(this._data, this._isEdit);
  }

  _closeHandler(evt) {
    evt.preventDefault();
    this._callback.closeForm();
  }

  setCloseHandler(callback) {
    this._callback.closeForm = callback;
    if (this._isEdit) {
      this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._closeHandler);
    } else {
      this.getElement().querySelector('.event__reset-btn').addEventListener('click', this._closeHandler);
    }
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(TripPointForm.parseDataToPoint(this._data));
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector('form').addEventListener('submit', this._formSubmitHandler);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setDateStartPicker();
    this._setDateEndPicker();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setCloseHandler(this._callback.closeForm);
  }

  _dateStartChangeHandler([userDate]) {
    this.updateData({
      dateStart: userDate,
    });
  }

  _dateEndChangeHandler([userDate]) {
    this.updateData({
      dateEnd: userDate,
    });
  }

  _setDateStartPicker() {
    if (this._dateStartPicker) {
      // В случае обновления компонента удаляем вспомогательные DOM-элементы,
      // которые создает flatpickr при инициализации
      this._dateStartPicker.destroy();
      this._dateStartPicker = null;
    }

    this._dateStartPicker = flatpickr(
      this.getElement().querySelector('.event__date-start'),
      {
        dateFormat: 'y/m/d H:i',
        defaultDate: this._data.dateStart,
        onChange: this._dateStartChangeHandler, // На событие flatpickr передаём наш колбэк
      },
    );
  }

  _setDateEndPicker() {
    if (this._dateEndPicker) {
      // В случае обновления компонента удаляем вспомогательные DOM-элементы,
      // которые создает flatpickr при инициализации
      this._dateEndPicker.destroy();
      this._dateEndPicker = null;
    }
    this._dateEndPicker = flatpickr(
      this.getElement().querySelector('.event__date-end'),
      {
        dateFormat: 'y/m/d H:i',
        defaultDate: this._data.dateEnd,
        onChange: this._dateEndChangeHandler, // На событие flatpickr передаём наш колбэк
      },
    );
  }

  _pointTypeChooseHandler(evt) {
    evt.preventDefault();
    if (evt.target.tagName !== 'LABEL') {
      return;
    }
    const pointType = evt.target.dataset.pointType;
    this.updateData({pointType});

  }

  _cityChooseHandler(evt) {
    evt.preventDefault();
    if (evt.target.tagName !== 'OPTION') {
      return;
    }
    const city = evt.target.dataset.city;
    this.updateData({destination: {city, cities: this._data.destination.cities}});
  }

  _priceChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      price: evt.target.value,
    }, true);
  }

  _offerChangeHandler(evt) {
    evt.preventDefault();
    if (evt.target.tagName !== 'LABEL') {
      return;
    }
    const offerIndex = evt.target.dataset.offer;
    const offers = this._data.availableOptions;
    offers[offerIndex].isChecked = !offers[offerIndex].isChecked;
    this.updateData({availableOptions: offers});
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector('.event__type-group')
      .addEventListener('click', this._pointTypeChooseHandler);
    this.getElement()
      .querySelector('.event__field-group')
      .addEventListener('click', this._cityChooseHandler);
    this.getElement()
      .querySelector('.event__input--price')
      .addEventListener('input', this._priceChangeHandler);
    this.getElement()
      .querySelector('.event__available-offers')
      .addEventListener('click', this._offerChangeHandler);
  }


  static parsePointToData(point) {
    return Object.assign(
      {},
      point,
      {
        hasOptions: point.availableOptions.length > 0,
        availableOptions: point.availableOptions.map((option) => {
          const isChecked = point.options.some((offer)=> (offer.title === option.title && offer.price === option.price));
          return {
            title: option.title,
            price: option.price,
            isChecked,
          };
        }),
      },
    );
  }

  static parseDataToPoint(data) {
    const newData = Object.assign({}, data);

    delete newData.hasOptions;
    const newDataOptions = newData.availableOptions.filter((option)=>option.isChecked).map(({title, price}) => ({title, price}));
    newData.availableOptions = newData.availableOptions.map(({title, price}) => ({title, price}));
    newData.options = newDataOptions;
    return newData;
  }
}
