import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BusDetails } from '../model/bus.component';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private http: HttpClient) {}

  private baseUrl = 'http://localhost:9494/api/v1/admin';

  httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  options = { headers: this.httpHeaders };

  addAdmin(admin) {
 
    return this.http
      .post(`${this.baseUrl}/addAdmin`, JSON.stringify(admin), this.options)
      .pipe(catchError(this.errorHandler));
  }

  adminLogin(admin) {


    return this.http
      .post(`${this.baseUrl}/adminLogin`, JSON.stringify(admin), this.options)
      .pipe(catchError(this.errorHandler));
  }

  getAdminDetails(id) {
 
    return this.http
      .get(`${this.baseUrl}/getAdmin/${id}`)
      .pipe(catchError(this.errorHandler));
  }

  addBus(bus): Observable<Object> {
    return this.http
      .post(`${this.baseUrl}/addBusDetails`, JSON.stringify(bus), this.options)
      .pipe(catchError(this.errorHandler));
  }

  modifyBus(bus): Observable<Object> {
    console.log("====="+bus);
    
    return this.http
      .post(`${this.baseUrl}/addBusDetails`, JSON.stringify(bus), this.options)
      .pipe(catchError(this.errorHandler));
  }

  // removeBus(busNumber): Observable<any> {
  //   return this.http.delete(`${this.baseUrl}/deleteBusDetails/${busNumber}`).pipe(catchError(this.errorHandler));
  // }

  removeBus(busdetails: BusDetails): Observable<any> {
    return this.http
      .post(
        `${this.baseUrl}/deleteBusDetails/`,
        JSON.stringify(busdetails),
        this.options
      )
      .pipe(catchError(this.errorHandler));
  }

  expireBus(busdetails: BusDetails): Observable<any> {
    return this.http
      .post(
        `${this.baseUrl}/expireBusDetails/`,
        JSON.stringify(busdetails),
        this.options
      )
      .pipe(catchError(this.errorHandler));
  }

  viewAllBus(): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/getAllBusDetails`)
      .pipe(catchError(this.errorHandler));
  }

  errorHandler(error) {
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


  
}



