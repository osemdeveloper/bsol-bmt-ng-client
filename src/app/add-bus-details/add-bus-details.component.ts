
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { Router } from '@angular/router';
import * as moment from 'moment';
import { Moment } from 'moment';
import { BusDetails } from '../model/bus.component';
import { AdminService } from '../services/admin.service';


@Component({
  selector: 'app-add-bus-details',
  templateUrl: './add-bus-details.component.html',
  styleUrls: ['./add-bus-details.component.css'],
})
export class AddBusDetailsComponent implements OnInit {

  
  cappucinoBunkersStart:any=null;
  registrationNumber: string;
  public myDatePicker:Date = new Date();
  public tommorowDate = new Date();
  public date:string = new Date().toString();
  constructor(
    private adminService: AdminService,
    private router: Router,
    private formBuilder: FormBuilder,
    public datepipe: DatePipe
  ) {
    this.registrationNumber = '';
  }

  adminId = null;

  // adminRegisterForm = this.formBuilder.group(
  //   { adminId:[],
  //     userRole:"admin",

  //   },

  // );

  busForm = this.formBuilder.group(
    {
      registrationNumber: [null, Validators.required],
      sourceDepot: [null, Validators.required],
      destinationDepot: [null, Validators.required],
      departureDate_andTime: [null, [Validators.required, this.departureDateValidator]],
      arrivalDate_andTime: [null, [Validators.required]],
      // avaliableSeats: [
      //   null,
      //   [Validators.required],
      // ],
      avaliableSeats: [56],
      arrivalTime: [null, Validators.required],
      departureTime: [null, Validators.required],
      busVendor: [null, Validators.required],
      price: [
        null,
        [Validators.required, Validators.min(1), Validators.max(10000)],
      ],
    },
    { validators: this.arrivalDateValidator }
  );

  minDate: Moment;

  ngOnInit(): void {
    this.adminId = localStorage.getItem('adminId');
    if (this.adminId == null) {
      this.router.navigate(['/addBusDetails']);
    } else {
      this.adminId = parseInt(this.adminId);
    }

    // let date: string = this.datepipe.transform(new Date(), 'dd-MMM-yyyy');

    this.tommorowDate.setDate(this.tommorowDate.getDate() + 1);
  
    if (!!this.busForm) {
      this.date = moment(this.date ).format("DD-MMM-YYYY HH:mm:ss" );
      this.busForm.controls['departureDate_andTime'].setValue(this.datepipe.transform(this.date, 'dd/MMM/yyyy HH:mm:ss'));
      console.log("VAL"+this.tommorowDate);
      
      this.busForm.controls['arrivalDate_andTime'].setValue(this.datepipe.transform(this.tommorowDate, 'dd/MMM/yyyy HH:mm:ss'));
    }
    const currentYear = moment().year();
    this.minDate = moment([currentYear - 1, 0, 1]);

    
  }



  /* --------validator method for departure date----
   */

  //   this.form = formBuilder.group({
  //     departureDate_andTime: [new Date()]
  //  });

  departureDateValidator(control: AbstractControl) {
    const inputDate = new Date(control.value);
    const currentDate = new Date();
    if (inputDate >= currentDate) {
      return { dateError: true };
    }
    return null;
  }

  /* ----validator method for arrival date---------- */

  arrivalDateValidator(control: AbstractControl) {
    const depDate = control.get('departureDate_andTime');
    const arrDate = control.get('arrivalDate_andTime');
    if (
      depDate &&
      arrDate &&
      new Date(depDate.value) > new Date(arrDate.value)
    ) {
      return { arrivalDateError: true };
    } else {
      return null;
    }
  }

  onSubmit() {
    console.log(this.busForm.value);
     let data = {...this.busForm.value};
     //console.log(JSON.stringify(data, null, 3));
    

    data.departureDate_andTime = this.datepipe.transform(data.departureDate_andTime, 'yyyy-MM-dd hh:mm:ss');
    data.arrivalDate_andTime = this.datepipe.transform(data.arrivalDate_andTime, 'yyyy-MM-dd hh:mm:ss');
   // console.log(JSON.stringify(data, null, 3));
    
    this.adminService.addBus(data).subscribe(
      (data) => {
        this.router.navigate(['/allBusDetails']);
      },
      (error) => {
        this.router.navigate(['/error', 'error occured unable to add']);
      }
    );
  }

  gotoList() {
    this.router.navigate(['/allBusDetails']);
  }

  // vehicleNoBlur(event) {
  //   console.log(this.registrationNumber, event);
  //   let value: string = this.busForm.get('registrationNumber').value;
  //   if (!!value) {
  //     this.busForm.controls['registrationNumber'].setValue(
  //       this.formatBusRTONumber(value.toUpperCase())
  //     );
  //   }
  // }

  vehicleNoBlur(event) {
    this.busForm.controls['registrationNumber'].setValue(
      this.registrationNumber
    );

    let date: string = this.datepipe.transform(new Date(), 'dd/MMM/yyyy');

    this.busForm.controls['departureDate_andTime'].setValue(date);
  }

  vehicleNochange(event) {
    console.log(event);
    let value: string = typeof event == 'string' ? event.toUpperCase() : '';

    if (/^[A-Z]{2}[0-9]{1}$/.test(value)) {
      this.registrationNumber = `${value.substring(0, 2)} ${value.substring(
        2
      )}`;
    } else if (/^[A-Z]{2}[ -][0-9]{2}$/.test(value)) {
      this.registrationNumber = `${value.substring(0, 2)} ${value.substring(
        3,
        5
      )} `;
    } else if (/^[A-Z]{2}[ -][0-9]{2}[ -][A-Z]{2}$/.test(value)) {
      this.registrationNumber = `${value.substring(0, 2)} ${value.substring(
        3,
        5
      )} ${value.substring(6, 8)} `;
    } else if (/^[A-Z]{2}[ -][0-9]{2}[ -][A-Z]{2}[ -][0-9]{4}$/.test(value)) {
      this.registrationNumber = `${value.substring(0, 2)} ${value.substring(
        3,
        5
      )} ${value.substring(6, 8)} ${value.substring(9, 13)}`;
    }
  }

  // formatBusRTONumber(busNumber: string) {

  //   let returnVal = "";
  //   const spaceAfterTwoDigit = /^[A-Z]{2}[0-9]{1}$/;
  //   const regWthRndmNameOneCharFourDigtWithutSpc = /^[A-Z]{2}[0-9]{2}$/;

  //   const regWithRandomNameOneChar =
  //     /^[A-Z]{2}[ -][0-9]{1,2}(?: [A-Z])?(?: [A-Z]*)? [0-9]{4}$/;
  //   const regWthRndmNameOneCharWithutSpc = /^[A-Z]{2}[0-9]{2}[A-Z]{1}[0-9]{4}$/;
  //   const regWithRandomNameTwoChar = /^[A-Z]{2}\s[0-9]{2}\s[A-Z]{2}\s[0-9]{4}$/;
  //   const regWthRndmNameTwoCharWithutSpc = /^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$/;

  //   if(spaceAfterTwoDigit.test(busNumber)) {
  //     this.registrationNumber= `${busNumber.substring(0, 2)} ${busNumber.substring(2)}`;
  //   } else

  //   if(regWthRndmNameOneCharFourDigtWithutSpc.test(busNumber)){
  //     this.registrationNumber= `${busNumber.substring(0, 2)} ${busNumber.substring(2,4)} `;
  //   } else

  //   if (regWithRandomNameOneChar.test(busNumber)) {
  //     returnVal= busNumber;
  //   } else if (regWthRndmNameOneCharWithutSpc.test(busNumber)) {
  //     returnVal= `${busNumber.substring(0, 2)} ${busNumber.substring(
  //       2,
  //       4
  //     )} ${busNumber.substring(4, 5)} ${busNumber.substring(5)}`;
  //   }

  //   if (regWithRandomNameTwoChar.test(busNumber)) {
  //     returnVal= busNumber;
  //   } else if (regWthRndmNameTwoCharWithutSpc.test(busNumber)) {
  //     returnVal= `${busNumber.substring(0, 2)} ${busNumber.substring(
  //       2,
  //       4
  //     )} ${busNumber.substring(4, 6)} ${busNumber.substring(6)}`;
  //   }

  //   //return returnVal;
  // }
}
