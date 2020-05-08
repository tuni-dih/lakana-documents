class EmbeddedDocument extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      this.src = this.getAttribute('src');
    }

    get src() {
        return this.getAttribute('src');
    }

    set src(newValue) {
        this.setAttribute('src', newValue);
      }
}

customElements.define('embedded-document', EmbeddedDocument);

export default EmbeddedDocument;