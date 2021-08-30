export const getRandomNumber = (min, max) => {
  const lower = Math.ceil(Math.min(min, max));
  const upper = Math.floor(Math.max(min, max));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
};

export const toggleFormElements = (elements, status) => {
  elements.forEach((item) => item.disabled = status);
};

export const createDestinationsList = (array) => (
  array.map((_, i) => (`<option value="${array[i]}"></option>`)).join('')
);

export const createPhotosList = (array) => (
  array.map((_, i) => (`<img class="event__photo" src="${array[i]}" alt="Event photo">`)).join('')
);

export const isEscEvent = (evt) => evt.key === 'Escape' || evt.key === 'Esc';
