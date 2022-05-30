import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddBusDetailsComponent } from './add-bus-details/add-bus-details.component';
import { AddPassengersComponent } from './add-passengers/add-passengers.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminRegisterComponent } from './admin-register/admin-register.component';
import { ErrorComponent } from './error/error.component';
import { PaymentComponent } from './payment/payment.component';
import { ShowUserBookingsComponent } from './booking/show-user-bookings/show-user-bookings.component';
import { UpdateBusComponent } from './update-bus/update-bus.component';
import { UpdatePassengerComponent } from './update-passenger/update-passenger.component';
import { UpdateUserDetailsComponent } from './update-user-details/update-user-details.component';
import { UserHomeComponent } from './user-home/user-home.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { UserRegisterComponent } from './user-register/user-register.component';
import { ViewAllBusDetailsComponent } from './view-all-bus-details/view-all-bus-details.component';
import { ViewUserDetailsComponent } from './view-user-details/view-user-details.component';
import { EmailComponent } from './email/email.component';
import { TestComponent } from './test/test.component';
import { SuccessPageComponent } from './success-page/success-page.component';
import { DateTimePickerComponent } from './date-time-picker/date-time-picker.component';




const routes: Routes = [
  { path: '', redirectTo: '/userLogin', pathMatch: 'full' },
  { path: 'userLogin', component: UserLoginComponent },

  { path: 'addUser', component: UserRegisterComponent },
  { path: 'testd', component: DateTimePickerComponent },

  { path: 'error/:message', component: ErrorComponent },
  { path: 'addBusDetails', component: AddBusDetailsComponent },
  { path: 'allBusDetails', component: ViewAllBusDetailsComponent },
  { path: 'adminHome', component: AdminHomeComponent },
  { path: 'addAdmin', component: AdminRegisterComponent },
  { path: 'payment', component: PaymentComponent },
  { path: 'email', component: EmailComponent },
  { path: 'adminLogin', component: AdminLoginComponent },
  { path: 'userHome', component: UserHomeComponent },
  { path: 'getBookingByUser/:userId', component: ShowUserBookingsComponent },
  { path: 'viewUser', component: ViewUserDetailsComponent },
  { path: 'updateUser', component: UpdateUserDetailsComponent },
  { path: 'updateBus/:busNumber', component: UpdateBusComponent },
  { path: 'addPassengers/:busNumber', component: AddPassengersComponent },
  { path: 'updatePassenger/:passengerId', component: UpdatePassengerComponent },
  // { path: '**', component: UserLoginComponent },
  { path: 'testing', component: TestComponent },
  {path:'successPage', component:SuccessPageComponent}

  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

 



