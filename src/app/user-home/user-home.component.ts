import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  ModalDismissReasons,
  NgbModal,
  NgbModalOptions,
} from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from '../booking/notification.service';
import { BusDetails } from '../model/bus.component';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css'],
})
export class UserHomeComponent implements OnInit {

  
  formatsDateTest: string[] = [

    'dd/MMM/yyyy hh:mm:ss',

];

  
  closeResult: string;
  modalOptions: NgbModalOptions;
  sourceDepotList: BusDetails[];
  boardingPointList: string[];
  dropingPointList: string[];


  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private notifyService: NotificationService,
    public datepipe: DatePipe,
    private modalService: NgbModal
  ) {
    this.sourceDepotList = [];
    this.boardingPointList = [];
    this.dropingPointList = [];

    this.modalOptions = {
      backdrop: 'static',
      backdropClass: 'customBackdrop',
    };
  }

  buses = null;
  notFound = null;
  found = false;
  userId = null;
  user = null;
  date: Date;
  public todayDate;

  /* bus search form */

  searchForm = this.formBuilder.group({
    destinationDepot: [null, Validators.required],
    sourceDepot: [null, Validators.required],
    date: [null, [Validators.required, this.dateValidator]],
  });

  ngOnInit(): void {
    this.todayDate = this.datepipe.transform(this.date, 'yyyy-MM-dd');

    this.userId = localStorage.getItem('userId');

    if (this.userId == null) {
      this.router.navigate(['/error', 'not logged in, login to continue']);
    } else {
      this.userId = parseInt(this.userId);

      this.userService.getUser(this.userId).subscribe(
        (data) => {
          this.user = data;
        },
        (error) => {
          this.router.navigate(['/error', 'not logged in, login to continue']);
        }
      );
    }

    this.getSourceDepotDetails();
  }

  getSourceDepotDetails() {
    this.userService.getSourceDepotDetails().subscribe((data: BusDetails[]) => {
      this.sourceDepotList = data;

      this.boardingPointList = Array.from(
        new Set(this.sourceDepotList.map((item) => item.sourceDepot))
      );
    });
  }

  /* ------method to search bus--------- */

  search() {
    

       let data = {...this.searchForm.value};
       //console.log(JSON.stringify(data, null, 3));
      
  
      data.departureDate_andTime = this.datepipe.transform(data.departureDate_andTime, 'yyyy-MM-dd hh:mm:ss');
    
    let date: string = this.datepipe.transform(this.searchForm.get('date').value, 'yyyy-MM-dd hh:mm:ss');
    console.log(date);
    this.userService
      .searchBus(
        this.searchForm.get('sourceDepot').value,
        this.searchForm.get('destinationDepot').value,
      
        
      )
      .subscribe(
        (data) => {
          this.buses = data;

          if (this.buses) {
            this.notFound = null;
            this.found = true;
          } else {
            this.notifyService.showError('No Bus Avaliable ', '');
            this.found = false;
            // this.router.navigate(['/userLogin']);
          }
        },
        (error) => {
          this.notifyService.showError('No Bus Avaliable ', '');
          this.found = false;
        }
      );
  }

  /* method to validate date */

  dateValidator(control: AbstractControl) {
    const inputDate = new Date(control.value);
    const currentDate = new Date();

    if (inputDate < currentDate) {
      return { dateError: true };
    }
    return null;
  }

  showToasterWarning() {
    this.notifyService.showWarning('This is warning', '');
  }

  logout() {
    localStorage.removeItem('userId');
    this.router.navigate(['/userLogin']);
  }

  getBookings() {
    this.router.navigate(['/getBookingByUser', this.userId]);
  }

  addPassengers() {

   
    this.userService.setNumberOfAvailableSeets(this.buses.avaliableSeats)
    
  
    this.router.navigate(['/addPassengers', this.buses.busNumber]);
  }

  changeSourceDepot(event) {
    console.log(this.searchForm.get('sourceDepot').value);

    this.dropingPointList = this.sourceDepotList
      .filter(
        (item) => item.sourceDepot === this.searchForm.get('sourceDepot').value
      )
      .map((item) => item.destinationDepot);
    console.table(this.dropingPointList);
  }

  changeDestinationDepot(event) {

    console.log()
    const departureDate_andTime = this.sourceDepotList.find(
      (item) =>
        item.sourceDepot === this.searchForm.get('sourceDepot').value &&
        item.destinationDepot === this.searchForm.get('destinationDepot').value
    ).departureDate_andTime;

    let date: string = this.datepipe.transform(!!departureDate_andTime ? departureDate_andTime : new Date(), 'dd/MMM/yyyy');
console.log("TsFor DAte :"+date);

    this.searchForm.controls['date'].setValue(date);
  }

  
}
