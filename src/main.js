import {DATA, getTripPoint} from './mock/mocks.js';

import './mock/mocks.js';
import TripPresentor from './presenter/trip.js';

const tripPointsArray = new Array(DATA.COUNT_TRIP_POINTS).fill(null).map(getTripPoint);

const tripPresentor = new TripPresentor();
tripPresentor.init(tripPointsArray);

