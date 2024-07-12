import { LitElement, css, html } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'

@customElement('custom-date-picker')
export class CustomDatePicker extends LitElement {

  @property({ type: String }) value = '';
  @property({ type: String }) min = '';
  @property({ type: String }) max = '';
  @property({ type: String }) step = '';
  @property({ type: String }) name = '';
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) required = false;
  @property({ type: Boolean }) readonly = false;

  @query('input') dateInput;

  private _onClick(e: Event) {
    e.preventDefault();
    console.log(e);
    //TODO: open/close calendar logic
  }

  private _handleInput(event) {
    this.value = event.target.value;
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
  }

  connectedCallback() {
    super.connectedCallback();
    console.log('montat');
    this.closest('form').addEventListener('reset', ()=>{
      this.value=''}, { capture: true });
    this.closest('form').addEventListener('formdata', (event: FormDataEvent)=>{
      event.formData.append(this.name, this.value);}, { capture: true });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    console.log('demontat');
    this.closest('form').removeEventListener('reset', null,{ capture: true });
    this.closest('form').removeEventListener('formdata', null,{ capture: true });
  }


  render() {
    return html`
        <input type="date" 
               .value="${this.value}"
               .min="${this.min}"
               .max="${this.max}"
               .step="${this.step}"
               .name="${this.name}"
               ?disabled="${this.disabled}"
               ?required="${this.required}"
               ?readonly="${this.readonly}"
               @input="${this._handleInput}"
               @click="${this._onClick}"
        />
    `
  }

  static styles = css`
    input {
      border-radius: 8px;
      border: 1px solid transparent;
      padding: 0.6em 1.2em;
      font-size: 1em;
      font-weight: 500;
      font-family: inherit;
      background-color: #aaa;
      cursor: pointer;
      transition: border-color 0.25s;
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'custom-date-picker': CustomDatePicker
  }
}
