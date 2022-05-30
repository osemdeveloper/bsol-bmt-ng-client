import * as moment from 'moment';
export class BusDetails {
  registrationNumber: string;
  busNumber: number;
  sourceDepot: string;
  destinationDepot: string;
  avaliableSeats: number;
  departureDate_andTime: string;
  arrivalDate_andTime: string;
  // arrivalTime: string;
  // departureTime: string;
  busVendor: string;
  price: number;
  isDelete: number;

  constructor(bus?: any) {
    this.registrationNumber = bus.registrationNumber || null;
    this.busNumber = bus.busNumber || null;
    this.sourceDepot = bus.sourceDepot || null;
    this.destinationDepot = bus.destinationDepot || null;
    // this.avaliableSeats = bus.avaliableSeats || null;
    this.departureDate_andTime = bus.departureDate_andTime || moment(new Date()).format('MM/DD/YYYY ');
    this.arrivalDate_andTime = bus.arrivalDate_andTime || null;
    // this.arrivalTime = bus.arrivalTime || null;
    // this.departureTime = bus.departureTime || null;
    this.busVendor = bus.busVendor || null;
    this.price = bus.price || null;
    this.isDelete = bus.isDelete || null;
  }
}


