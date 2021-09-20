import AbstractObserver from '../utils/abstract-observer.js';

export default class Points extends AbstractObserver {
  constructor() {
    super();
    this._initType = null;
    this._points = [];
    this._offers = [];
    this._destinations = [];
  }

  _init() {
    const isLoading = !this._offers.length || !this._destinations.length;
    if (!this._initType || isLoading) {
      return;
    }
    this._notify(this._initType);
  }

  setPoints(initType, points) {
    this._initType = initType;
    this._points = points.slice();
    this._init();
  }

  getPoints() {
    return this._points;
  }

  setError(updateType) {
    this._notify(updateType);
  }

  set offers(offers) {
    this._offers = offers;
    this._init();
  }

  get offers() {
    return this._offers;
  }

  set destinations(destinations) {
    this._destinations = destinations;
    this._init();
  }

  get destinations() {
    return this._destinations;
  }

  updatePoint(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);
    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this._points = [
      ...this._points.slice(0, index),
      update,
      ...this._points.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    this._points = [
      update,
      ...this._points,
    ];

    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    this._points = [
      ...this._points.slice(0, index),
      ...this._points.slice(index + 1),
    ];

    this._notify(updateType);
  }

  static adaptPointToClient(point) {
    const adaptedPoint = Object.assign(
      {},
      point,
      {
        price: point['base_price'],
        dateStart: point['date_from'],
        dateEnd: point['date_to'],
        destination: point.destination && Points.adaptDestinationToClient(point.destination),
        options: point.offers,
        pointType: point.type,
        isFavorite: point['is_favorite'],
      },
    );
    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint.offers;
    delete adaptedPoint.type;
    delete adaptedPoint['is_favorite'];

    return adaptedPoint;
  }

  static adaptPointToServer(point) {
    const adaptedPoint = Object.assign(
      {},
      point,
      {
        'base_price': point.price,
        'date_from': point.dateStart,
        'date_to': point.dateEnd,
        destination: point.destination && Points.adaptDestinationToServer(point.destination),
        offers: point.options,
        type: point.pointType,
        'is_favorite': point.isFavorite,
      },
    );
    delete adaptedPoint.price;
    delete adaptedPoint.dateStart;
    delete adaptedPoint.dateEnd;
    delete adaptedPoint.options;
    delete adaptedPoint.pointType;
    delete adaptedPoint.isFavorite;

    return adaptedPoint;
  }

  static adaptDestinationToClient(destination) {
    const adaptedDestination = Object.assign(
      {},
      destination,
      {
        city: destination.name,
        infoText: destination.description,
        photos: destination.pictures,
      },
    );
    delete adaptedDestination.name;
    delete adaptedDestination.description;
    delete adaptedDestination.pictures;

    return adaptedDestination;
  }

  static adaptDestinationToServer(destination) {
    const adaptedDestination = Object.assign(
      {},
      destination,
      {
        name: destination.city,
        description: destination.infoText,
        pictures: destination.photos,
      },
    );
    delete adaptedDestination.city;
    delete adaptedDestination.infoText;
    delete adaptedDestination.photos;

    return adaptedDestination;
  }
}
