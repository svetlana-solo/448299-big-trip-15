import {DATA, getTripPoint, offers, destinations} from './mock/mocks.js';

import TripPresenter from './presenter/trip.js';

const tripPointsArray = new Array(DATA.COUNT_TRIP_POINTS).fill(null).map(getTripPoint);

const headerContainer = document.querySelector('.trip-main');
const eventsContainer = document.querySelector('.trip-events');


const tripPresenter = new TripPresenter(headerContainer, eventsContainer);
tripPresenter.init({points: tripPointsArray, offers, destinations});

