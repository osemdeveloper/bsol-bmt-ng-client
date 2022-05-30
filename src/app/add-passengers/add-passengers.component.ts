import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { NotificationService } from '../booking/notification.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-add-passengers',
  templateUrl: './add-passengers.component.html',
  styleUrls: ['./add-passengers.component.css'],
})
export class AddPassengersComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private notifyService: NotificationService
  ) {}

  userId = null;
  busNumber = null;

  /* ---passenger form group array---- */

  passengerArrayForm = this.formBuilder.group({
    passengers: this.formBuilder.array([this.addPassengerGroup()]),
  });

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId');
    if (this.userId == null) {
      this.router.navigate(['/error', 'login to continue...']);
    } else {
      this.userId = parseInt(this.userId);
      this.route.paramMap.subscribe((params: ParamMap) => {
        this.busNumber = params.get('busNumber');
      });
    }
  }

  /* ---method to create dynamic form group----- */

  addPassengerGroup() {
    return this.formBuilder.group({
      name: [null, [Validators.required]],
      age: [
        null,
        [Validators.required, Validators.min(1), Validators.max(100)],
      ],
      luggage: [
        null,
        [Validators.required, Validators.min(0), Validators.max(15)],
      ],
    });
  }

  /* --getter for passengers------ */

  get passengerArray() {
    return <FormArray>this.passengerArrayForm.get('passengers');
  }

  /* -----method to add more passengers------ */

  addMorePassengers() {




    if(this.userService.getNumberOfAvailableSeets() > 0 &&  this.userService.getNumberOfAvailableSeets() !== 1){
    this.userService.setNumberOfAvailableSeets(this.userService.getNumberOfAvailableSeets()-1);
      this.passengerArray.push(this.addPassengerGroup());
    } else{
      this.notifyService.showWarning('No seats are avaliable', '');
    }

    // console.log("PassengerIssue",this.passengerArray.length);
    
    
  }

  /* ----method to remove passengers---- */

  removePassenger(index) {
    this.passengerArray.removeAt(index);
  }

  submit() {
    if (this.passengerArray.length < 1) {
      alert('no data provided');
    } else if (this.busNumber == null) {
      this.router.navigate(['/error', 'bus not provided']);
    } else {
      this.busNumber = parseInt(this.busNumber);

      this.userService
        .addBooking(this.busNumber, this.userId, this.passengerArrayForm.value)
        .subscribe(
          (data) => {
            this.router.navigate(['/getBookingByUser/:userId']);
          },
          (error) => {
            this.router.navigate(['/error', 'unable to add booking']);
          }
        );
    }
  }
}
