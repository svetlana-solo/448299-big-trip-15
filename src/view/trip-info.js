import dayjs from 'dayjs';
import AbstractView from './abstract.js';

const createRoute = (array) => {

  const citiesArray = array.map((point) => point.destination.city);

  if (array.length > 3) {
    return `${citiesArray[0]} — . . . — ${citiesArray[citiesArray.length - 1]}`;
  } else {
    return citiesArray.join(' — ');
  }
};

const createTripInfo = (tripPoints) => {
  const citiesRout = createRoute(tripPoints);
  const totalPrice = tripPoints.reduce((acc, tripPoint) => acc + tripPoint.price, 0);
  const dateStart = dayjs(tripPoints[0].dateStart);
  const dateEnd = dayjs(tripPoints[tripPoints.length - 1].dateEnd);
  return `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
    <h1 class="trip-info__title">${citiesRout}</h1>

    <p class="trip-info__dates">${dateStart.format('MMM DD')}&nbsp;&mdash;&nbsp;${dateStart.month() === dateEnd.month() ? dateEnd.format('DD') : dateEnd.format('MMM DD')}</p>
    </div>

    <p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
    </p>
  </section>`;
};

export default class TripInfo extends AbstractView {
  constructor(tripPoints) {
    super();
    this._tripPoints = tripPoints;
  }

  getTemplate() {
    return createTripInfo(this._tripPoints);
  }
}
