import {css, html, LitElement} from 'lit'
import {customElement, property, state} from 'lit/decorators.js'

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

  @state() private hideDatepicker = true;
  @state() private dates :HTMLElement=document.createElement('div');
  @state() private selectedDate = new Date();
  @state() private year=this.selectedDate.getFullYear();
  @state() private month=this.selectedDate.getMonth();

  private _handleDateClick = (e) => {
    const button = e.target;

    // remove the 'selected' class from other buttons
    const selected = this.dates.querySelector(".selected");
    selected && selected.classList.remove("selected");

    // add the 'selected' class to current button
    button.classList.add("selected");

    // set the selected date
    this.selectedDate = new Date(this.year, this.month, parseInt(button.textContent) +1);
    this.value=this.selectedDate.toISOString().substring(0, 10);
  };

  private _displayDates = () => {
    // update year & month whenever the dates are updated
    //updateYearMonth();

    // clear the dates
    this.dates.innerHTML = "";

    //* display the last week of previous month

    // get the last date of previous month
    const lastOfPrevMonth = new Date(this.year, this.month, 0);

    for (let i = 0; i <= lastOfPrevMonth.getDay(); i++) {
      const text = lastOfPrevMonth.getDate() - lastOfPrevMonth.getDay() + i;
      const button = this._createButton(text, true, -1);
      this.dates.appendChild(button);
    }

    //* display the current month

    // get the last date of the month
    const lastOfMOnth = new Date(this.year, this.month + 1, 0);

    for (let i = 1; i <= lastOfMOnth.getDate(); i++) {
      const button = this._createButton(i, false);
      button.addEventListener("click", this._handleDateClick);
      this.dates.appendChild(button);
    }

    //* display the first week of next month

    const firstOfNextMonth = new Date(this.year, this.month + 1, 1);

    for (let i = firstOfNextMonth.getDay(); i < 7; i++) {
      const text = firstOfNextMonth.getDate() - firstOfNextMonth.getDay() + i;

      const button = this._createButton(text, true, 1);
      this.dates.appendChild(button);
    }
  };

  private _createButton = (text, isDisabled = false, type = 0) => {
    const currentDate = new Date();

    // determine the date to compare based on the button type
    let comparisonDate = new Date(this.year, this.month + type, text);

    // check if the current button is the date today
    const isToday =
      currentDate.getDate() === text &&
      currentDate.getFullYear() === this.year &&
      currentDate.getMonth() === this.month;

    // check if the current button is selected
    const selected = this.selectedDate.getTime() === comparisonDate.getTime();

    const button = document.createElement("button");
    button.textContent = text;
    button.disabled = isDisabled;
    button.classList.toggle("today", isToday);
    button.classList.toggle("selected", selected);
    return button;
  };

  private _onClick(e: Event) {
    e.preventDefault();
    this.hideDatepicker=!this.hideDatepicker;
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

  private _onPreviousMonthClick(e: Event) {
    e.preventDefault();
    if(this.month === 0) this.year--;
    this.month=(this.month - 1 + 12) % 12;
    this._displayDates();
    console.log(this.month, this.year);
  }

  private _onNextMonthClick(e: Event) {
    e.preventDefault();
    if(this.month === 11) this.year++;
    this.month=(this.month + 1) % 12;
    this._displayDates();
    console.log(this.month, this.year);
  }

  private _handleMonthChange(e: Event) {
    e.preventDefault();
    this.month=e.target.selectedIndex;
    this._displayDates();
  }

  private _handleYearChange(e: Event) {
    e.preventDefault();
    this.year=e.target.value;
    this._displayDates();
  }

  private _handleInput(event) {
    this.value = event.target.value;
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('click', this._handleDocumentClick);
    this.closest('form').addEventListener('reset', ()=>{
      this.value='';
      this.dates.querySelector('.selected').classList.toggle('selected');
    }, { capture: true });
    this.closest('form').addEventListener('formdata', (event: FormDataEvent)=>{
      event.formData.append(this.name, this.value);}, { capture: true });
    this.dates.className='dates';
    this._displayDates();
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
                    <button class="prev" @click="${this._onPreviousMonthClick}">Prev</button>

                    <div>
                        <select class="month-input" @change="${this._handleMonthChange}">
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
                        <input type="number" class="year-input" @change="${this._handleYearChange}"/>
                    </div>

                    <button class="next" @click="${this._onNextMonthClick}">Next</button>
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
                    ${this.dates}
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
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'custom-date-picker': CustomDatePicker
  }
}
