import {DATA, getTripPoint} from './mock/mocks.js';

import './mock/mocks.js';
import TripPresentor from './presenter/trip.js';

const tripPointsArray = new Array(DATA.COUNT_TRIP_POINTS).fill(null).map(getTripPoint);

const headerContainer = document.querySelector('.trip-main');
const eventsContainer = document.querySelector('.trip-events');


const tripPresentor = new TripPresentor(headerContainer, eventsContainer);
tripPresentor.init(tripPointsArray);

