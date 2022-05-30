import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BusDetails } from '../model/bus.component';
import { AdminService } from '../services/admin.service';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-view-all-bus-details',
  templateUrl: './view-all-bus-details.component.html',
  styleUrls: ['./view-all-bus-details.component.css'],
})
export class ViewAllBusDetailsComponent implements OnInit {
  formatsDateTest: string[] = [

    'dd/MMM/yyyy hh:mm:ss',

];

  searchedKeyword: string;

  buses = [];
  busdetails= null;
  adminId = null;
  date: Date;
  public todayDate;
  constructor(
    private adminService: AdminService,
    private router: Router,
    public datepipe: DatePipe,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.date = new Date();
    this.todayDate = this.datepipe.transform(this.date, 'dd-mm-yyyy hh:mm:ss');
    

    // this.todayDate = this.datepipe.transform(this.date, 'yyyy-mm-dd hh:mm:ss');
    console.log(this.todayDate);
    console.log(this.date);

    //  if(this.buses.avaliableSeats>=56){
    this.adminId = localStorage.getItem('adminId');
    if (this.adminId !== null) {
      this.router.navigate(['/allBusDetails']);
    } else {
      this.adminService.viewAllBus().subscribe(
        (data) => {
          // this.buses = data;
          data.forEach(item =>{
            this.buses.push({
            "userId": item.userId,
            "userName": item.userName,
            "password": item.password,
            "phone": item.phone,
            "email": item.email,
            "userRole": item.userRole,
            "bookingDetails": item.bookingDetails,
            "busNumber": item.busNumber,
            "registrationNumber": item.registrationNumber,
            "sourceDepot": item.sourceDepot,
            "destinationDepot": item.destinationDepot,
            "avaliableSeats": item.avaliableSeats,
            "departureDate_andTime": item.departureDate_andTime,
            "arrivalDate_andTime": item.arrivalDate_andTime,
            "busVendor": item.busVendor,
            "price": item.price,
            "isDeleted": item.isDeleted,
            "isArrivalDateExpird": new Date(item.arrivalDate_andTime) < new Date() 
            });
            });

            // && new Date(item.arrivalDate_andTime) = new Date()

            console.table(this.buses);

          console.log(JSON.stringify(this.buses, null, 3));
          
        
          
        },
        (error) => {
          this.router.navigate(['/error', 'some error occured']);
        }
      );
    }

    //  }
  }

  myFunction(busdetails: BusDetails) {
   
    
  }

  openBackDropCustomClass(content) {
    this.modalService.open(content, { backdropClass: 'light-blue-backdrop' });
  }

  removeBus(busdetails: BusDetails) {
    let currentDateTime = this.datepipe.transform(
      new Date(),
      'MM/dd/yyyy h:mm:ss'
    );

    this.adminService.removeBus(busdetails).subscribe(
      (data) => {
        if (this.buses['isDeleted']  == null) {
        }
        this.adminService.viewAllBus().subscribe(
          (data) => {
            this.buses = data;
           
              
          },
          (error) => {
            this.router.navigate(['/error', 'some error occured']);
          }
        );
      },
      (error) => {
        this.router.navigate(['/error', 'unable to delete']);
      }
    );
  }

  navigate() {
    // this.router.navigate(['/adminHome']);
  }
  updateBus(busNumber) {    
    this.router.navigate(['/updateBus', busNumber]);
  }

  expireBus(busdetails: BusDetails) {
    let currentDateTime = this.datepipe.transform(
      new Date(),
      'dd/mm/yyyy hh:mm:ss'
    );

    if (busdetails.departureDate_andTime > currentDateTime) {
    
      
      this.adminService.expireBus(busdetails).subscribe(
        (data) => {
          if (this.buses['isDeleted'] == null) {
          }
          this.adminService.viewAllBus().subscribe(
            (data) => {
              this.buses = data;
            },
            (error) => {
              this.router.navigate(['/error', 'some error occured']);
            }
          );
        },
        (error) => {
          this.router.navigate(['/error', 'unable to delete']);
        }
      );
    }
  }
}
