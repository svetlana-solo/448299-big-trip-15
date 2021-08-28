import dayjs from 'dayjs';

const createRoute = (array) => {

  const citiesArray = array.map((point) => point.destination.city);

  if (array.length > 3) {
    return `${citiesArray[0]} — . . . — ${citiesArray[citiesArray.length - 1]}`;
  } else {
    return citiesArray.join(' — ');
  }
};

export const createTripInfo = (tripPoints) => {
  const citiesRout = createRoute(tripPoints);
  const totalPrice = tripPoints.reduce((acc, tripPoint) => acc + tripPoint.price, 0);
  const dateStart = tripPoints[0].dateStart;
  const dateEnd = tripPoints[tripPoints.length - 1].dateEnd;

  return `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
    <h1 class="trip-info__title">${citiesRout}</h1>

    <p class="trip-info__dates">${dayjs(dateStart).format('MMM DD')}&nbsp;&mdash;&nbsp;${dayjs(dateEnd).format('DD')}</p>
    </div>

    <p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
    </p>
  </section>`;
};
