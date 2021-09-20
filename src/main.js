import PointsModel from './model/points.js';
import TripPresenter from './presenter/trip.js';
import Api from './api.js';
import { UpdateType } from './constants.js';

const AUTHORIZATION = 'Basic hS2fa7kfSw6l1sa2j';
const END_POINT = 'https://15.ecmascript.pages.academy/big-trip';

const headerContainer = document.querySelector('.trip-main');
const eventsContainer = document.querySelector('.trip-events');

const api = new Api(END_POINT, AUTHORIZATION);

const pointsModel = new PointsModel();

const tripPresenter = new TripPresenter(headerContainer, eventsContainer, pointsModel, api);
tripPresenter.init();

api.getPoints()
  .then((points) => {
    pointsModel.setPoints(UpdateType.INIT, points);
  })
  .catch(() => {
    pointsModel.setPoints(UpdateType.INIT, []);
  });

api.getOffers()
  .then((offers) => {
    pointsModel.offers = offers;
  })
  .catch(() => {
    pointsModel.setError(UpdateType.ERROR);
  });

api.getDestinations()
  .then((destinations) => {
    pointsModel.destinations = destinations;
  })
  .catch(() => {
    pointsModel.setError(UpdateType.ERROR);
  });
