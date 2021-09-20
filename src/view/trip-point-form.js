import dayjs from 'dayjs';
import SmartView from './smart.js';
import flatpickr from 'flatpickr';

import '../../node_modules/flatpickr/dist/flatpickr.min.css';

const hasOption = (option, options = []) => options.some((currentOption)=> (currentOption.title === option.title && currentOption.price === option.price));

const createItemMarkup = (currentType, offers, isDisabled) => offers.map(({type}) => (`
  <div class="event__type-item">
    <input
      id="event-type-${type}-1"
      class="event__type-input  visually-hidden"
      type="radio"
      name="event-type"
      value="${type}"
      ${currentType === type ? 'checked' : ''}
      ${isDisabled ? 'disabled' : ''}
    >
    <label
      class="event__type-label event__type-label--${type}"
      for="event-type-${type}-1"
    data-point-type=${type}>${type}</label>
  </div>
`)).join('\n');

const createOfferMarkup = (selectedOptions, availableOptions, isDisabled) => (
  availableOptions.map((option, index) => `<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden"
    id="event-offer-${index}-1"
    type="checkbox"
    name="event-offer-${option.title}"
    data-offer=${index}
    ${hasOption(option, selectedOptions) ? 'checked' : ''}
    ${isDisabled ? 'disabled' : ''}>
    <label class="event__offer-label" for="event-offer-${index}-1">
      <span class="event__offer-title">${option.title}</span> &plus;&euro;&nbsp;
      <span class="event__offer-price">${option.price}</span>
    </label>
  </div>`).join('\n')
);

const createPhotoMarkup = (photos) => (photos && photos.length ? `
    <div class="event__photos-container">
      <div class="event__photos-tape">
      ${ photos.map((photo) => (`
        <img class="event__photo" src="${photo.src}" alt="${photo.description}">
      `)).join('\n')}
      </div>
    </div>
  ` : '');


const createDestinationsList = (cities) => (
  cities.map(({city}) => (`<option value="${city}" data-city=${city}>${city}</option>`)).join('')
);

const createTripPointForm = (point, offers, destinations, isEdit) => {
  const {dateStart, dateEnd, destination = {}, pointType, price = '0', options = [], isDisabled, isSaving, isDeleting} = point;
  const offer = offers.find((currentOffer) => currentOffer.type === pointType);
  const citiesList = createDestinationsList(destinations);
  const typesEvent = createItemMarkup(pointType, offers, isDisabled);
  const offersList = createOfferMarkup(options, offer.offers, isDisabled);
  const photoList = createPhotoMarkup(destination.photos);
  const deleteButtonText = isDeleting ? 'Deleting...' : 'Delete';

  return `<li>
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            ${pointType ? `<img class="event__type-icon" width="17" height="17" src="img/icons/${pointType}.png" alt="Event type icon">` : ''}
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? 'disabled' : ''}>

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
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.city || ''}" list="destination-list-1" placeholder="Destination" ${isDisabled ? 'disabled' : ''}>
          <datalist id="destination-list-1">
          ${citiesList}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <span class="event__date-start">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dateStart ? dayjs(dateStart).format('YY/MM/DD HH:mm') : ''}" readonly="readonly" placeholder="Start Date" ${isDisabled ? 'disabled' : ''}>
          </span>
          &mdash;
          <span class="event__date-end">
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateEnd ? dayjs(dateEnd).format('YY/MM/DD HH:mm') : ''}" readonly="readonly" placeholder="End Date" ${isDisabled ? 'disabled' : ''}>
          </span>
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="number" min="0" name="event-price" value="${price}" ${isDisabled ? 'disabled' : ''}>
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>
        <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${isEdit ? deleteButtonText : 'Cancel'}</button>
        ${isEdit ? `<button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>` : ''}
      </header>
      <section class="event__details">

      ${offer.offers.length ?
    `<section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>

        <div class="event__available-offers">
          <!--offer-selection-->
          ${offersList || ''}
        </div>
      </section>
        ` : ''}


        ${destination.infoText ? `<section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${destination.infoText}</p>
          ${photoList}
        </section>` : ''}
      </section>
    </form>
    </li>
  `;
};

export default class TripPointForm extends SmartView {
  constructor(point, offers, destinations) {
    super();
    this._isEdit = !!point;
    this._data = TripPointForm.parsePointToData(point, offers[0].type);
    this._offers = offers;
    this._destinations = destinations;
    this._datepicker = null;

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);
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
    this._setIsDisabled();
  }

  getTemplate() {
    return createTripPointForm(this._data, this._offers, this._destinations, this._isEdit);
  }

  _isDataFull(update) {
    if (!update.price || update.price === '0' || !update.dateStart || !update.dateEnd || !update.destination) {
      return false;
    }
    return true;
  }

  _setFormDisable(isDisabled) {
    this.getElement().querySelector('.event__save-btn').disabled = isDisabled;
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

  _formDeleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(this._data);
  }

  _setIsDisabled() {
    const isFullData = this._isDataFull(this._data);
    this._setFormDisable(!isFullData);
  }

  _updateData(update, justDataUpdating) {
    this.updateData(update, justDataUpdating);
    this._setIsDisabled();
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector('.event__reset-btn').addEventListener('click', this._formDeleteClickHandler);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setDateStartPicker();
    this._setDateEndPicker();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setDeleteClickHandler(this._callback.deleteClick);
    this.setCloseHandler(this._callback.closeForm);
  }

  _dateStartChangeHandler([userDate]) {
    this._updateData({
      dateStart: userDate,
    });
  }

  _dateEndChangeHandler([userDate]) {
    this._updateData({
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
        enableTime: true,
        dateFormat: 'y/m/d H:i',
        defaultDate: this._data.dateStart,
        onChange: this._dateStartChangeHandler, // На событие flatpickr передаём наш колбэк
        disable: [() => this._data.isDisabled],
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
        enableTime: true,
        dateFormat: 'y/m/d H:i',
        defaultDate: this._data.dateEnd,
        onChange: this._dateEndChangeHandler, // На событие flatpickr передаём наш колбэк
        disable: [() => this._data.isDisabled],
      },
    );
  }

  _pointTypeChooseHandler(evt) {
    evt.preventDefault();
    if (evt.target.tagName !== 'LABEL') {
      return;
    }
    const pointType = evt.target.dataset.pointType;
    this._updateData({pointType, options : []});

  }

  _cityChooseHandler(evt) {
    const city = evt.target.value;
    this._updateData({destination: this._destinations.find((destination) => city === destination.city)});
  }

  _priceChangeHandler(evt) {
    evt.preventDefault();
    this._updateData({
      price: evt.target.value,
    }, true);
  }

  _offerChangeHandler(evt) {
    const offerIndex = evt.target.dataset.offer;
    const {offers} = this._offers.find((currentOffer) => currentOffer.type === (this._data.pointType || this._offers[0].type));
    const currentOption = offers[offerIndex];
    const isRemoving = hasOption(currentOption, this._data.options);
    const newOptions = isRemoving ? this._data.options.filter((option) => option.title !== currentOption.title && option.price !== currentOption.price) : [...this._data.options, currentOption];
    this._updateData({options: newOptions}, true);
  }

  _setInnerHandlers() {
    const offersElement = this.getElement().querySelector('.event__available-offers');
    this.getElement()
      .querySelector('.event__type-group')
      .addEventListener('click', this._pointTypeChooseHandler);
    this.getElement()
      .querySelector('.event__input--destination')
      .addEventListener('input', this._cityChooseHandler);
    this.getElement()
      .querySelector('.event__input--price')
      .addEventListener('input', this._priceChangeHandler);
    if (offersElement) {
      offersElement.addEventListener('input', this._offerChangeHandler);
    }
  }

  static parsePointToData(point, defaultPointType) {
    return Object.assign(
      {},
      point,
      {
        options: point && point.options || [],
        pointType: point && point.pointType || defaultPointType,
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      },
    );
  }

  static parseDataToPoint(data) {
    const newData = Object.assign({}, data, {
      price: Number(data.price),
      isFavorite: !!data.isFavorite,
    });

    delete newData.isDisabled;
    delete newData.isSaving;
    delete newData.isDeleting;

    return newData;
  }
}
