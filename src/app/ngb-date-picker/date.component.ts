import { Component, OnInit, Input, forwardRef, ViewChild, AfterViewInit, Injector, Output, EventEmitter, ElementRef } from '@angular/core';
import { NgbTimeStruct, NgbPopoverConfig, NgbPopover, NgbDatepicker, NgbDate, NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, NgControl } from '@angular/forms';
import { DateModel, YEAR } from './date.model';
import { noop } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'ngbd-datepicker-customday',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgbdDatepickerCustomday),
      multi: true
    }
  ]
})
export class NgbdDatepickerCustomday implements ControlValueAccessor, OnInit {
  @Input()
  dateString: string;

  @Input()
  inputDatetimeFormat = 'dd-MMM-yyyy';

  @Input()
  disabled = false;

  @Output()
  isValid = new EventEmitter<boolean>();

  ngControl: NgControl;

   datetime: DateModel = new DateModel();
  private today = new Date();

  @ViewChild(NgbDatepicker)
  private dp: NgbDatepicker;

  @ViewChild('dateTime')
  private dateTimeField: ElementRef;

  @ViewChild(NgbPopover)
  private popover: NgbPopover;

  private onTouched: () => void = noop;
  private onChange: (_: any) => void = noop;
  minDate: NgbDateStruct;
  maxDate: NgbDateStruct;
  nextYear: number;
  selectedDateObject: NgbDateStruct;

  constructor (private config: NgbPopoverConfig,
    private inj: Injector,
    private calendar: NgbCalendar) {
   config.autoClose = 'outside';
    config.placement = 'auto';
    let now = new Date();
    this.nextYear = now.getFullYear() + 1;
    this.minDate = { year: YEAR, month: 1, day: 1 };
    this.maxDate = { year: this.nextYear, month: 1, day: 1 };

  }

  isDisabled = (date: NgbDate, current: { month: number }) => date.month !== current.month;
  isWeekend = (date: NgbDate) => this.calendar.getWeekday(date) >= 6;
  isToday = (date: NgbDate) => {
    return date.day === this.today.getDate() &&
      date.month === this.today.getMonth() + 1 &&
      date.year === this.today.getFullYear();
  }

  ngOnInit(): void {
    this.ngControl = this.inj.get(NgControl);
  }

  writeValue(newModel: string) {
    if (newModel) {
      this.datetime = Object.assign(this.datetime, DateModel.fromLocalString(newModel));
      this.dateString = newModel;
      this.setDateStringModel();
    } else {
      this.datetime = new DateModel();
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }


  isDateValid(value: string): boolean {
    let valid = false;

    if ((moment(value, ['DD-MMM-YYYY',
      'D-MMM-YYYY'], true).isValid()) || value === "") {
      valid = true;
    }
    return valid;
  }

  onInputChange($event: any) {
    let value = $event.target.value;
    value = value.trim();
    let year: number;

    if (this.isDateValid(value)) {

      this.isValid.emit(true);
      const dt = DateModel.fromLocalString(value);
      if (dt) {
        this.datetime = dt;
        this.setDateStringModel();
      } else if (value.trim() === '') {
        this.datetime = new DateModel();
        this.dateString = '';
        this.onChange(this.dateString);
      } else {
        this.onChange(value);
      }
    } else {
      this.dateTimeField.nativeElement.focus();
      this.isValid.emit(false);
    }
  }

  onDateChange($event) {
    if ($event.year) {
      $event = `${$event.year}-${$event.month}-${$event.day}`;
    }

    const date = DateModel.fromLocalString($event);

    if (!date) {
      this.dateString = this.dateString;
      return;
    }

    if (!this.datetime) {
      this.datetime = date;
    }

    this.datetime.year = date.year;
    this.datetime.month = date.month;
    this.datetime.day = date.day;
    if (!!this.dp) {
      this.dp.navigateTo({ year: this.datetime.year, month: this.datetime.month });
    }

    this.setDateStringModel();
  }


  setDateStringModel() {
    this.dateString = moment(this.datetime, ['YYYY-MM-DD']).format('DD-MMM-YYYY').toUpperCase();
    this.onChange(this.dateString);
  }

  inputBlur($event) {
    this.onTouched();
  }

  selectedDate() {
    if (!!this.datetime) {
      this.selectedDateObject = { year: this.datetime.year, month: this.datetime.month, day: this.datetime.day };
    } else {
      this.selectedDateObject = { year: this.today.getFullYear(), month: this.today.getMonth() + 1, day: this.today.getDate() };
    }
  }

}

