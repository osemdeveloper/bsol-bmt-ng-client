import { BrowserModule } from '@angular/platform-browser';

import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { UserRegisterComponent } from './user-register/user-register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UserLoginComponent } from './user-login/user-login.component';
import { ErrorComponent } from './error/error.component';
import { AddBusDetailsComponent } from './add-bus-details/add-bus-details.component';
import { ViewAllBusDetailsComponent } from './view-all-bus-details/view-all-bus-details.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { UserHomeComponent } from './user-home/user-home.component';
import { ShowUserBookingsComponent } from './booking/show-user-bookings/show-user-bookings.component';
import { ViewUserDetailsComponent } from './view-user-details/view-user-details.component';
import { UpdateUserDetailsComponent } from './update-user-details/update-user-details.component';
import { UpdateBusComponent } from './update-bus/update-bus.component';
import { AddPassengersComponent } from './add-passengers/add-passengers.component';
import { UpdatePassengerComponent } from './update-passenger/update-passenger.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AdminRegisterComponent } from './admin-register/admin-register.component';
import { PaymentComponent } from './payment/payment.component';
import { DatePipe } from '@angular/common';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastrModule } from 'ngx-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EmailComponent } from './email/email.component';
import { AlertsModule } from 'angular-alert-module';
import { TestComponent } from './test/test.component';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';

////////////
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatBadgeModule } from '@angular/material/badge';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FlexLayoutModule } from "@angular/flex-layout";
import { SuccessPageComponent } from './success-page/success-page.component';
import { NgbdDatepickerCustomday } from './ngb-date-picker/date.component';
import { MomentDateModule } from '@angular/material-moment-adapter';

import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule,
 
} from '@angular-material-components/datetime-picker';


import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateTimePickerComponent } from './date-time-picker/date-time-picker.component';

















@NgModule({
  declarations: [
    AppComponent,
    UserRegisterComponent,
    UserLoginComponent,
    ErrorComponent,
    AdminHomeComponent,
    AdminLoginComponent,
    UserHomeComponent,
    ShowUserBookingsComponent,
    ViewUserDetailsComponent,
    UpdateUserDetailsComponent,
    AddBusDetailsComponent,
    ViewAllBusDetailsComponent,
    UpdateBusComponent,
    AddPassengersComponent,
    UpdatePassengerComponent,
    PageNotFoundComponent,
    AdminRegisterComponent,
    PaymentComponent,
    EmailComponent,
    TestComponent,
    SuccessPageComponent,
    NgbdDatepickerCustomday,
    DateTimePickerComponent
  ],
  imports: [
    Ng2SearchPipeModule,

    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgbModule,
    AlertsModule,
    NgxQRCodeModule,
    MatCheckboxModule,
    MatCheckboxModule,
    MatButtonModule,
    MatInputModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatRadioModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatSidenavModule,
    MatBadgeModule,
    MatToolbarModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatStepperModule,
    MatTabsModule,
    MatExpansionModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatDialogModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    FlexLayoutModule,
    MatProgressSpinnerModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
    MomentDateModule
 
  ],
  providers: [DatePipe,{ provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
  { provide: MAT_DATE_FORMATS, useValue: MAT_DATE_FORMATS }],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  
})
export class AppModule {}
//