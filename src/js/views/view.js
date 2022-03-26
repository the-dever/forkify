import { values } from 'regenerator-runtime';
import icons from 'url:../../img/icons.svg'; // Parcel2

export default class View {
  _data;

  /**
   * Render the received object to the DOM
   * @param {Object | Object[]} data The data to be rendered (e.g. recipe)
   * @param {boolean} [render=true] if false, create markup string instead of rendering to the DOM
   * @returns {undefined | string} A markup string is returned if render=false
   * @this {Object} View instance
   * @author Saboor Abdul
   * @todo Finish implementation
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup; // in bookmarkView rendere is false so it will just return a string that will  then be inserted below

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    this._data = data;

    // The goal of this update method is to create a virtual DOM and then compare it to the DOM thats on the page
    const newMarkup = this._generateMarkup();

    // 1) Virtual DOM
    const newDom = document.createRange().createContextualFragment(newMarkup);
    // console.log(newDom);

    const newElements = Array.from(newDom.querySelectorAll('*'));
    // console.log(newElements);

    // 2) Actual DOM
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));
    // console.log(curElements);

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      // console.log(curEl, newEl.isEqualNode(curEl));

      // Updates changed TEXT
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        // we selected firstChild because it will return the textNode and nodeValue is null when the node is anything else beside the text. so if its text then nodeValue wont be null
        // console.log('💥', newEl.firstChild.nodeValue.trim());
        curEl.textContent = newEl.textContent;
      }

      // Updates changed ATTRIBUTES
      if (!newEl.isEqualNode(curEl)) {
        // console.log(newEl.attributes);
        Array.from(newEl.attributes).forEach(attr =>
          // console.log(attr);
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner() {
    const markup = `
    <div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
    </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
    <div class="error">
      <div>
        <svg>
          <use href="${icons}#icon-alert-triangle"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
    <div class="message">
      <div>
        <svg>
          <use href="${icons}#icon-smile"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
