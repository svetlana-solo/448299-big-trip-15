import AbstractView from './abstract.js';
import { MenuType } from '../constants.js';

const createMenu = (currentMenu) => (
  `<div class="trip-controls__navigation">
  <h2 class="visually-hidden">Switch trip view</h2>
  <!-- Меню -->
  <nav class="trip-controls__trip-tabs  trip-tabs">
  <a class="trip-tabs__btn  ${currentMenu === 'table' ? 'trip-tabs__btn--active' : ''}" data-menu-type=${MenuType.TABLE} href="#">Table</a>
  <a class="trip-tabs__btn ${currentMenu === 'stats' ? 'trip-tabs__btn--active' : ''}" data-menu-type=${MenuType.STATS} href="#">Stats</a>
  </nav>
</div>
  `
);

export default class Menu extends AbstractView {
  constructor(currentMenu) {
    super();
    this._currentMenu = currentMenu;
    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createMenu(this._currentMenu);
  }

  setClickMenuItemHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().querySelector('.trip-tabs').addEventListener('click', this._menuClickHandler);
  }

  _menuClickHandler(evt) {
    if (evt.target.tagName !== 'A') {
      return;
    }
    evt.preventDefault();
    this._callback.menuClick(evt.target.dataset.menuType);
  }
}
