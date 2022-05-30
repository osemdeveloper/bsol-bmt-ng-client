import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';
import { UserService } from '../../services/user.service';
import jsPDF from 'jspdf';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import htmlToPdfmake from 'html-to-pdfmake';
import { NotificationService } from '../notification.service';
import * as fileSaver from 'file-saver';
import * as saveAs from 'file-saver';
import { Details } from 'src/app/model/ticket';
import { HttpClient } from '@angular/common/http';
import { ModalDismissReasons, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-show-user-bookings',
  templateUrl: './show-user-bookings.component.html',
  styleUrls: ['./show-user-bookings.component.css'],
})
export class ShowUserBookingsComponent implements OnInit {
  closeResult: string;
  modalOptions:NgbModalOptions;
  passengers: any;
  dataset: Details = {
    name: '',
    age: null,
    country: '',
    email: '',
  };

  formatsDateTest: string[] = [

    'dd/MMM/yyyy hh:mm:ss',

];
  // formatsDateTest: string[] = [
  //   'dd/MM/yyyy',
  //   'dd/MM/yyyy hh:mm:ss',
  //   'dd-MM-yyyy',
  //   'dd-MM-yyyy HH:mm:ss',
  //   'MM/dd/yyyy',
  //   'MM/dd/yyyy hh:mm:ss',
  //   'yyyy/MM/dd',
  //   'yyyy/MM/dd HH:mm:ss',
  //   'dd/MM/yy',
  //   'dd/MM/yy hh:mm:ss',
  //   'hh:mm:ss',
  //   'short',
  //   'medium',
  //   'long',
  //   'full',
  //   'shortDate',
  //   'mediumDate',
  //   'longDate',
  //   'fullDate',
  //   'shortTime',
  //   'mediumTime',
  //   'longTime',
  //   'fullTime',
  // ];

  gotAmount: number = null;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private notifyService: NotificationService,
    private https: HttpClient,
    private modalService: NgbModal

  ) {
    this.passengers = [];
  }
  showToasterSuccess() {
    this.notifyService.showSuccess('Data shown successfully !!', '');
  }

  showToasterError() {
    this.notifyService.showError('Something is wrong', '');
  }

  showToasterInfo() {
    this.notifyService.showInfo('This is info', '');
  }

  showToasterWarning() {
    this.notifyService.showWarning('This is warning', '');
  }

  userId = null;
  bookings = null;
  users = null;
  found = false;
  notFound = false;

  bookingId = null;

  buses = null;

  ngOnInit(): void {
    //OBSERVABLE
    //

    // console.log(this.bookings.totalCost);

    // this.sendNewData(21);

    this.userId = localStorage.getItem('userId');

    if (this.userId == null) {
      this.router.navigate(['/error', 'not logged in, login to continue']);
    } else {
      this.userService.getBookingByUser(this.userId).subscribe(
        (data) => {
          this.bookings = data;
          // this.sendNewData(this.bookings.totalCost);

          if (this.bookings.length > 0) {
            this.found = true;
            this.notFound = false;
          } else {
            this.found = false;
            this.notFound = true;
          }
        },
        (error) => {
          this.router.navigate(['/error', 'not logged in, login to continue']);
        }
      );
    }
  }

  payment(amount: number) {
    this.userService.setAmount(amount);

    this.router.navigate(['/payment']);
  }

  // //OBSERVABLE
  // sendNewData(data1: number) {
  //   this.userService.sendData(data1);
  // }

  email() {
    this.router.navigate(['/email']);
  }

  /* ------method to delete booking-------- */

  delete(bookingId) {
    // if (confirm('Are you sure want to cancel booking??')) {
      this.passengers = null;
      this.userService.deleteBooking(bookingId).subscribe(
        (data) => {
          this.userService.getBookingByUser(bookingId).subscribe(
            (data) => {
              this.bookings = data;
              if (this.bookings.length > 0) {
                this.found = true;
                this.notFound = false;
              } else {
                this.found = false;
                this.notFound = true;
              }
            },
            (error) => {
              this.router.navigate([
                '/error',
                'not logged in, login to continue',
              ]);
            }
          );
        },
        (error) => {
          this.router.navigate(['/error', 'cannot delete']);
        }
      );
    
  }

  /* ------method to get bus detais---------- */

  getBusDetails(busNumber: Number) {
    this.passengers = null;
    this.userService.getBusByNumber(busNumber).subscribe(
      (data) => {
        this.buses = data;
      },
      (error) => {
        this.router.navigate(['/error', 'no bus found or bus is deleted']);
      }
    );
  }

  getPassengers(bookingId: any) {
    this.buses = null;
    this.passengers = bookingId.passengers;

    this.userService.getPassengerByBookingId(bookingId).subscribe(
      (data) => {
        this.passengers = data;
      },
      (error) => {
        this.router.navigate(['/error', 'no bus found or bus is deleted']);
      }
    );
  }

  updatePassenger(passengerId) {
    this.router.navigate(['/updatePassenger', passengerId]);
  }

  logout() {
    localStorage.removeItem('userId');
    this.router.navigate(['/userLogin']);
  }

  download(id, busNumber, bookingId) {
    this.userService
      .downloadFile(id, busNumber, bookingId)
      .subscribe((response: any) => {
        this.notifyService.showSuccess('Ticket  Downloaded ', '');

        let blob: any = new Blob([response], {
          type: 'text/json; charset=utf-8',
        });
        const url = window.URL.createObjectURL(blob);
        //window.open(url);
        saveAs(blob, 'ticket.pdf');
      }),
      (error: any) => console.log('Error downloading the file'),
      () => console.info('File downloaded successfully');

    // this.https.post<Details>('http://localhost:9494/testapp/getdetails', this.dataset).subscribe(
    //   res => {
    //     this.dataset = res;
    //     console.log(this.dataset);
    //     // alert('Email Sent successfully');
    //     this.dataset.age = null;
    //     this.dataset.name = '';
    //     this.dataset.country = '';
    //     this.dataset.email = '';
    //   });
    //   interface Details{
    //     name:string;
    //     age:number;
    //     country:string;
    //     email:string;
    //   }
  }

  finalTokenCheck() {
    let allowToken = this.userService.getToken();
  }
  open(content) {
    this.modalService.open(content, this.modalOptions).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  
}

//   @ViewChild('pdfTable') pdfTable: ElementRef;

//   public downloadAsPDF() {
//     const doc = new jsPDF();

//     const pdfTable = this.pdfTable.nativeElement;

//     var html = htmlToPdfmake(pdfTable.innerHTML);

//     const documentDefinition = { content: html };
//     pdfMake.createPdf(documentDefinition).open();
//   }

//   getPdf(id: Number, busNumber: Number) {
//     this.passengers = null;
//     this.userService.getPdf(id, busNumber).subscribe(
//       (data) => {
//         this.buses = data;
//       },
//       (error) => {
//         this.router.navigate(['/error', 'no bus found or bus is deleted']);
//       }
//     );
//   }

//   download(id: number, busNumber: number) {
//     this.userService.getPdf(id, busNumber).subscribe((response: any) => {
//       saveAs(
//         new Blob([response], {
//           type: 'application/pdf',
//         })
//       );
//     });
//   }
// }
