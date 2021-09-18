import {DATA, getTripPoint, offers, destinations} from './mock/mocks.js';
import PointsModel from './model/points.js';
import TripPresenter from './presenter/trip.js';

const tripPointsArray = new Array(DATA.COUNT_TRIP_POINTS).fill(null).map(getTripPoint);

const headerContainer = document.querySelector('.trip-main');
const eventsContainer = document.querySelector('.trip-events');

const pointsModel = new PointsModel(offers, destinations);
pointsModel.setPoints(tripPointsArray);

const tripPresenter = new TripPresenter(headerContainer, eventsContainer, pointsModel);
tripPresenter.init();
