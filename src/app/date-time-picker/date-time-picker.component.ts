import { Component, OnInit, Input, forwardRef, ViewChild, AfterViewInit, Injector, Output, EventEmitter, ElementRef } from '@angular/core';
import { NgbTimeStruct, NgbPopoverConfig, NgbPopover, NgbDatepicker, NgbDate, NgbCalendar, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, NgControl } from '@angular/forms';

import { noop } from 'rxjs';
// import { ToastNotificationService } from '@common/shared/toastr/toast-notification.service';
import { NotificationService } from '../booking/notification.service';


import * as moment from 'moment';
import { DateTimeModel } from '../model/date.time.model';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-date-time-picker',
  templateUrl: './date-time-picker.component.html',
  styleUrls: ['./date-time-picker.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateTimePickerComponent),
      multi: true
    }
  ]
})
export class DateTimePickerComponent implements ControlValueAccessor, OnInit, AfterViewInit {
  minDate = new Date();

  @Input()
  dateString: string;

  @Input()
  inputDatetimeFormat = 'dd-MMM-yyyy HH:mm:ss';
  @Input()
  hourStep = 1;
  @Input()
  minuteStep = 1;
  @Input()
  secondStep = 1;
  @Input()
  seconds = true;

  @Input()
  disabled = false;

  @Output()
  isValid = new EventEmitter<boolean>();

  ngControl: NgControl;

  public showTimePickerToggle = false;

  public datetime: DateTimeModel = new DateTimeModel();
  public today = new Date();

  @ViewChild(NgbDatepicker)
  private dp: NgbDatepicker;

  @ViewChild('dateTime')
  private dateTimeField: ElementRef;

  @ViewChild(NgbPopover)
  private popover: NgbPopover;

  private onTouched: () => void = noop;
  private onChange: (_: any) => void = noop;

  constructor (private config: NgbPopoverConfig,
    private inj: Injector,
    private calendar: NgbCalendar,
 private notifyService: NotificationService,
 private ngbConfig: NgbDatepickerConfig ) {
  const current = new Date();
  ngbConfig.minDate = { year: current.getFullYear(), month: 
    current.getMonth() + 1, day: current.getDate() };
    config.autoClose = 'outside';
    config.placement = 'auto';
  }

  isWeekend = (date: NgbDate) => this.calendar.getWeekday(date) >= 6;
  isToday = (date: NgbDate) => {
    return date.day === this.today.getDate() &&
      date.month === this.today.getMonth() + 1 &&
      date.year === this.today.getFullYear();
  }

  ngOnInit(): void {
    // this.ngControl = this.inj.get(NgControl);
  }

  ngAfterViewInit(): void {
    this.popover.hidden.subscribe($event => {
      this.showTimePickerToggle = false;
    });
  }

  writeValue(newModel: string) {
    if (newModel) {
      this.datetime = Object.assign(this.datetime, DateTimeModel.fromLocalString(newModel));
      this.dateString = newModel;
      this.setDateStringModel();
    } else {
      this.datetime = new DateTimeModel();
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  toggleDateTimeState($event) {
    this.showTimePickerToggle = !this.showTimePickerToggle;
    $event.stopPropagation();
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInputChange($event: any) {
    let value = $event.target.value;
    console.log('value: ' + value);
    value = value.trim();

    if ((moment(value, ['DD-MMM-YYYY HH:mm:ss',
      'DD-MMM-YYYY H:m:s',
      'DD-MMM-YYYY HH:m:s',
      'DD-MMM-YYYY HH:m:ss',
      'DD-MMM-YYYY HH:mm:s',
      'DD-MMM-YYYY H:mm:s',
      'DD-MMM-YYYY H:mm:ss',
      'DD-MMM-YYYY H:m:ss',
      'D-MMM-YYYY HH:mm:ss',
      'D-MMM-YYYY H:m:s',
      'D-MMM-YYYY HH:m:s',
      'D-MMM-YYYY HH:m:ss',
      'D-MMM-YYYY HH:mm:s',
      'D-MMM-YYYY H:mm:s',
      'D-MMM-YYYY H:mm:ss',
      'D-MMM-YYYY H:m:ss',
      'D-MMM-YYYY', 'DD-MMM-YYYY'], true).isValid()) || value === "") {

      this.isValid.emit(true);
      const dt = DateTimeModel.fromLocalString(value);
      console.log('dt: ' + dt);
      if (dt) {
        console.log('inside dt if');
        this.datetime = dt;
        this.setDateStringModel();
      } else if (value.trim() === '') {
        console.log('inside dt else-if');
        this.datetime = new DateTimeModel();
        this.dateString = '';
        this.onChange(this.dateString);
      } else {
        console.log('inside dt else');
        this.onChange(value);
      }
    } else {
      this.dateTimeField.nativeElement.focus();
      this.notifyService.showError('Invalid Datetime', '');
      this.isValid.emit(false);
    }
  }

  onDateChange($event) {
    if ($event.year) {
      $event = `${$event.year}-${$event.month}-${$event.day}`;
    }

    const date = DateTimeModel.fromLocalString($event);

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

    if(!!this.dp){
      this.dp.navigateTo({ year: this.datetime.year, month: this.datetime.month });
    }
   
    this.setDateStringModel();
  }

  onTimeChange(event: NgbTimeStruct) {
    if(!!event){
      this.datetime.hour = event.hour;
      this.datetime.minute = event.minute;
      this.datetime.second = event.second;
    }else{
      this.datetime.hour = 0;
      this.datetime.minute = 0;
      this.datetime.second = 0;
    }

    this.setDateStringModel();
  }

  setDateStringModel() {
    console.log(' before this.datetime: ' + this.datetime);
    this.dateString = moment(this.datetime, ['YYYY-MM-DD HH:mm:ss']).format('DD-MMM-YYYY HH:mm:ss').toUpperCase();
    console.log("afte " + this.dateString);
    this.onChange(this.dateString);
  }

  inputBlur($event) {
    this.onTouched();
  }

  setDefaultValue() {
    this.dateString = null;
    this.onChange(this.dateString);
  }

}

