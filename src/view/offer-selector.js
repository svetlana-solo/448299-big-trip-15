export const createOfferSelector = (selectorType, selectorTitle, selectorPrice) => (
  `<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${selectorType}-1" type="checkbox" name="event-offer-${selectorType}">
    <label class="event__offer-label" for="event-offer-${selectorType}-1">
      <span class="event__offer-title">${selectorTitle}</span> &plus;&euro;&nbsp;
      <span class="event__offer-price">${selectorPrice}</span>
    </label>
  </div>`
);
