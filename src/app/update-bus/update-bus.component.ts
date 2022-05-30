import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BusDetails } from '../model/bus.component';
import { AdminService } from '../services/admin.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-update-bus',
  templateUrl: './update-bus.component.html',
  styleUrls: ['./update-bus.component.css'],


  encapsulation: ViewEncapsulation.None,
  styles: [`
    .dark-modal .modal-content {
      background-color: #292b2c;
      color: white;
    }
    .dark-modal .close {
      color: white;
    }
    .light-blue-backdrop {
      background-color: #5cb3fd;
    }
  `]

})


export class UpdateBusComponent implements OnInit {

  formatsDateTest: string[] = [

    'dd/MMM/yyyy hh:mm:ss',

];


  busInstance: BusDetails = new BusDetails({});
  public myDatePicker:Date = new Date();
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private adminService: AdminService,
    private userService: UserService,
    private modalService: NgbModal,
    public datepipe: DatePipe
  ) {}

  adminId = null;
  busNumber = null;
  bookings = null;

  busForm = this.formBuilder.group(
    {
      busNumber: [null],
      registrationNumber: [null, Validators.required],
      sourceDepot: [null, Validators.required],
      destinationDepot: [null, Validators.required],
      departureDate_andTime: [null, [Validators.required, this.departureDateValidator]],
      arrivalDate_andTime: [null, [Validators.required]],
      avaliableSeats: [null, []],
      // arrivalTime: [null, Validators.required],
      // departureTime: [null, Validators.required],
      busVendor: [null, Validators.required],
      price: [
        null,
        [Validators.required, Validators.min(1), Validators.max(10000)],
      ],
    },
    { validators: this.arrivalDateValidator }
  );


  openBackDropCustomClass(content) {
    this.modalService.open(content);
  }

  navigate(){
    this.router.navigate(['/allBusDetails']);
  }

  ngOnInit(): void {
    this.adminId = localStorage.getItem('adminId');
    if (this.adminId !== null) {
      this.router.navigate(['/error', 'login to continue']);
    } else {
      this.adminId = parseInt(this.adminId);
      this.route.paramMap.subscribe((params: ParamMap) => {
        this.busNumber = parseInt(params.get('busNumber'));
        let data = {...this.busForm.value};

        data.departureDate_andTime = this.datepipe.transform(data.departureDate_andTime, 'yyyy-MM-dd hh:mm:ss');
        data.arrivalDate_andTime = this.datepipe.transform(data.arrivalDate_andTime, 'yyyy-MM-dd hh:mm:ss');

        this.userService.getBusByNumber(this.busNumber).subscribe((res) => {
          console.log('Bus Number' + this.busNumber);

          this.busInstance = res;
          console.log(this.busInstance);

          if (!!this.busInstance) {
           
        
            this.busForm.controls['busNumber'].setValue(this.busInstance.busNumber),
              this.busForm.controls['registrationNumber'].setValue(
                this.busInstance.registrationNumber
              ),
              this.busForm.controls['sourceDepot'].setValue(
                this.busInstance.sourceDepot
              ),
              this.busForm.controls['destinationDepot'].setValue(
                this.busInstance.destinationDepot
              ),
              this.busForm.controls['departureDate_andTime'].setValue(
                this.busInstance.departureDate_andTime
               
                
              ),
        
              this.busForm.controls['arrivalDate_andTime'].setValue(
                this.busInstance.arrivalDate_andTime
              ),
              this.busForm.controls['avaliableSeats'].setValue(
                this.busInstance.avaliableSeats
              ),
              // this.busForm.controls['arrivalTime'].setValue(
              //   this.busInstance.arrivalTime
              // ),
              // this.busForm.controls['departureTime'].setValue(
              //   this.busInstance.departureTime
              // ),
              this.busForm.controls['busVendor'].setValue(
                this.busInstance.busVendor
              ),
              this.busForm.controls['price'].setValue(this.busInstance.price);
          }

          // this.busForm.controls['avaliableSeats'].disable();
        });
      });
    }
  }

  departureDateValidator(control: AbstractControl) {
    const inputDate = new Date(control.value);
    const currentDate = new Date();
    if (inputDate < currentDate) {
      return { dateError: true };
    }
    return null;
  }

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
    let data = this.busForm.value;

    // this.busForm.value.setValue.avaliableSeats =56;

    console.log(this.busForm.value);

    if (this.busNumber != NaN && this.busForm.value.avaliableSeats >= 56) {

      data.busNumber = this.busNumber;
    }
    data.departureDate_andTime = this.datepipe.transform(data.departureDate_andTime, 'yyyy-MM-dd hh:mm:ss');
    data.arrivalDate_andTime = this.datepipe.transform(data.arrivalDate_andTime, 'yyyy-MM-dd hh:mm:ss');
    this.adminService.modifyBus(data).subscribe(
      (data) => {
        this.router.navigate(['/adminHome']);
      },
      (error) => {
        this.router.navigate(['/error', 'unable to update']);
      }
    );
  }
}
