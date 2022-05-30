import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BusDetails } from '../model/bus.component';
import { User } from '../model/user';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class UserService {
  data: any;

  public amount: number = 0;

  public token: string ='';

  numberOfAvaliableSeats:number;

  private dataSource: BehaviorSubject<number> = new BehaviorSubject<number>(this.amount );
  data1: Observable<number> = this.dataSource.asObservable();

  constructor(private http: HttpClient) {

this.numberOfAvaliableSeats=0;

  }

  //  //OBSERVABLE
  // sendData(data1: number) {
  //   this.dataSource.next(data1);
  // }




  private baseUrl = 'http://localhost:9494/api/v1/user';

  httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  options = { headers: this.httpHeaders };

  /* ---method to add user---- */

  addUser(user) {
  
   
    return this.http

      .post(`${this.baseUrl}/addUser`, JSON.stringify(user), this.options)

      .pipe(catchError(this.errorHandler));
  }

  /* -----method to add booking---- */

  addBooking(busNumber, userId, passengers) {
    return this.http
      .post(
        `${this.baseUrl}/addBooking/${userId}/${busNumber}`,
        JSON.stringify(passengers),
        this.options
      )
      .pipe(catchError(this.errorHandler));
  }

  /* ---method to get bookings */

  getBookingByUser(id) {
    return this.http
      .get(this.baseUrl + '/getBookingByUser/' + id)
      .pipe(catchError(this.errorHandler));
  }

  getPassengerByBookingId(bookingId) {
   
    return this.http
      .get(this.baseUrl + '/getPassengerByBookingId/' + bookingId)
      .pipe(catchError(this.errorHandler));
  }

  deleteBooking(bookingId) {
    return this.http
      .delete(this.baseUrl + '/deleteBooking/' + bookingId)
      .pipe(catchError(this.errorHandler));
  }

  /* ----method to update user----- */

  updateUser(userId) {
    return this.http
      .post(this.baseUrl + '/addUser', JSON.stringify(userId), this.options)
      .pipe(catchError(this.errorHandler));
  }

  /* -------method to get user------- */

  getUser(id): Observable<User> {
 

    return this.http
      .get<User>(this.baseUrl + '/getUser/' + id)
      .pipe(catchError(this.errorHandler));
  }

  /* -----method to get bus----------- */

  getBusByNumber(busNumber): Observable<BusDetails> {
    console.log("Service"+busNumber);
    
    return this.http
      .get<BusDetails>(`${this.baseUrl}/getBusByNumber/${busNumber}`)
      .pipe(catchError(this.errorHandler));
  }

  updatePassenger(passengerId) {
    return this.http
      .post(
        `${this.baseUrl}/updatePassenger`,
        JSON.stringify(passengerId),
        this.options
      )
      .pipe(catchError(this.errorHandler));
  }

  userLogin(user): Observable<any> {
    return this.http
      .post<any>(
        this.baseUrl + '/userLogin',
        JSON.stringify(user),
        this.options
      )
      .pipe(catchError(this.errorHandler));
  }

  // searchBus(from, to, date): Observable<any> {
  //   return this.http
  //     .get<any>(`${this.baseUrl}/findBus/${to}/${from}/${date}`)
  //     .pipe(catchError(this.errorHandler));
  // }

  searchBus(from, to): Observable<any> {
    return this.http
      .get<any>(`${this.baseUrl}/findBus/${to}/${from}`)
      .pipe(catchError(this.errorHandler));
  }



  errorHandler(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }

  getSourceDepotDetails(): Observable<BusDetails[]> {
    return this.http
      .get<BusDetails[]>(`${this.baseUrl}/getingData`)
      .pipe(catchError(this.errorHandler));
  }

  // getPdf(id,busNumber) {
  //   return this.http
  //     .get(`${this.baseUrl}/report/product/${id}/${busNumber}`)
  //     .pipe(catchError(this.errorHandler));
  // }

  downloadFile(id, busNumber, bookingId): any {
    return this.http.get(
      `${this.baseUrl}/report/product/${id}/${busNumber}/${bookingId}`,
      { responseType: 'blob' }
    );
  }

  getPayment(): number {
  
    return this.amount;
   
    
  }

  setAmount(ticketPrice: number) {
    
    this.amount = ticketPrice;
  }

  getToken():string{
    return this.token;

  }

  setToken(allowToken: string){
    this.token = allowToken;
  }

  setNumberOfAvailableSeets(seatsCount:number): void{
    this.numberOfAvaliableSeats=seatsCount;
  }

getNumberOfAvailableSeets(): number{
  return this.numberOfAvaliableSeats;
}

}







