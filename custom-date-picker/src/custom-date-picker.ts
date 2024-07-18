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

  // @property({ type: Boolean }) hideDatepicker = true;

  private _hideDatepicker = true;
  get hideDatepicker() {
    return this._hideDatepicker;
  }

  set hideDatepicker(value) {
    const oldValue = this._hideDatepicker;
    this._hideDatepicker = value;
    this.requestUpdate('_hideDatepicker', oldValue);
  }


  @query('input') dateInput;

  private _onClick(e: Event) {
    e.preventDefault();
    this.hideDatepicker=!this.hideDatepicker;
  }

  private _onButtonClick(e: Event) {
    e.preventDefault();
    e.target.classList.toggle('selected');
  }

  private _onCancelClick(e: Event) {
    e.preventDefault();
    this.hideDatepicker=true;
  }

  private _onApplyClick(e: Event) {
    e.preventDefault();
    //TODO: apply logic

    this.hideDatepicker=true;
  }

  private _handleInput(event) {
    this.value = event.target.value;
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
  }

  connectedCallback() {
    super.connectedCallback();
    console.log('montat');
    document.addEventListener('click', this._handleDocumentClick);
    this.closest('form').addEventListener('reset', ()=>{
      this.value=''}, { capture: true });
    this.closest('form').addEventListener('formdata', (event: FormDataEvent)=>{
      event.formData.append(this.name, this.value);}, { capture: true });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    console.log('demontat');
    document.removeEventListener('click', this._handleDocumentClick);
    this.closest('form').removeEventListener('reset', null,{ capture: true });
    this.closest('form').removeEventListener('formdata', null,{ capture: true });
  }

  private _handleDocumentClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    console.log(target?.id);
    if (!target.closest('#dateInput')) {
      this.hideDatepicker = true;
    }
  };


  render() {
    return html`
        <div class="datepicker-container">
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
            <div class="datepicker" ?hidden="${(this.hideDatepicker)}">
                <div class="datepicker-header">
                    <button class="prev">Prev</button>

                    <div>
                        <select class="month-input">
                            <option>January</option>
                            <option>February</option>
                            <option>March</option>
                            <option>April</option>
                            <option>May</option>
                            <option>June</option>
                            <option>July</option>
                            <option>August</option>
                            <option>September</option>
                            <option>October</option>
                            <option>November</option>
                            <option>December</option>
                        </select>
                        <input type="number" class="year-input" />
                    </div>

                    <button class="next">Next</button>
                </div>
                <div class="days">
                    <span>Sun</span>
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                </div>
                <div class="dates">
                    <button disabled @click="${this._onButtonClick}">1</button>
                    <button disabled @click="${this._onButtonClick}">2</button>
                    <button disabled @click="${this._onButtonClick}">3</button>
                    <button @click="${this._onButtonClick}">4</button>
                    <button @click="${this._onButtonClick}">5</button>
                    <button @click="${this._onButtonClick}">6</button>
                    <button>7</button>
                    <button>8</button>
                    <button class="today">9</button>
                    <button>10</button>
                    <button class="selected">11</button>
                    <button>12</button>
                    <button>13</button>
                    <button>14</button>
                    <button>15</button>
                    <button>16</button>
                    <button>17</button>
                    <button>18</button>
                    <button>19</button>
                    <button>20</button>
                    <button>21</button>
                    <button>22</button>
                    <button>23</button>
                    <button>24</button>
                    <button>25</button>
                    <button>26</button>
                    <button>27</button>
                    <button>28</button>
                    <button>29</button>
                    <button>30</button>
                </div>
                <div class="datepicker-footer">
                    <button class="cancel" @click="${this._onCancelClick}">Cancel</button>
                    <button class="apply" @click="${this._onApplyClick}">Apply</button>
                </div>
            </div>
        </div>
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

    .datepicker-container {
      position: relative;
    }

    .datepicker {
      position: absolute;
      top: 100%;
      z-index: 100;
      margin-top: 2px;
      background: #fff;
      padding: 10px;
      border-radius: 5px;
    }

    .datepicker button {
      cursor: pointer;
      border: none;
      border-radius: 3px;
      background: transparent;
      font-size: 14px;
      font-weight: 500;
      text-transform: uppercase;
      transition: 0.3s;
    }

    .days,
    .dates {
      display: grid;
      grid-template-columns: repeat(7, 32px);
      gap: 10px;
      margin-block: 10px;
    }

    .days span {
      font-size: 14px;
      font-weight: 600;
      text-transform: uppercase;
      text-align: center;
    }

    .dates button {
      color: slategray;
      aspect-ratio: 1;
    }

    .dates button:disabled {
      opacity: 0.5;
      pointer-events: none;
      user-select: none;
    }

    .dates button:hover {
      background: rgba(119, 136, 153, 0.1);
    }

    .dates button.today {
      background: rgba(147, 112, 216, 0.2);
      color: mediumpurple;
    }

    .dates button.selected {
      background: mediumpurple;
      color: #fff;
    }

    .datepicker-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
    }

    .datepicker-header select,
    .datepicker-header input {
      font-size: 14px;
      border: 1px solid #eee;
    }

    .datepicker-header input {
      max-width: 64px;
    }

    .datepicker-header button {
      color: slategray;
    }

    .datepicker-header button:hover {
      color: mediumpurple;
    }

    .datepicker-footer {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      padding-top: 10px;
      border-top: 1px solid #eee;
    }

    .datepicker-footer button {
      background: rgba(119, 136, 153, 0.1);
      padding: 3px 10px;
    }

    .datepicker-footer button.apply {
      background: mediumpurple;
      color: #fff;
    }

    //option {
    //  background-color: red;
    //  color: #333;
    //  padding: 10px;
    //}
    //
    //option:hover {
    //  background-color: green;
    //}

  `
}

declare global {
  interface HTMLElementTagNameMap {
    'custom-date-picker': CustomDatePicker
  }
}
