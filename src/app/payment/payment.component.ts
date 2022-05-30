import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';
import { BehaviorSubject } from 'rxjs';
import { NotificationService } from '../booking/notification.service';
import { User } from '../model/user';

import { UserService } from '../services/user.service';



@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
})
export class PaymentComponent implements OnInit {
  paymentHandler: any = null;
  userId = null;
  bookings = null;
  found = false;
  notFound = false;
  bookingId = null;
  buses = null;
  window = null;
  user: User = new User({});
  public paymentAmount : number =0;
  public value :string='';
  loading = false;
  cardNumber: string;

  


  elementType = NgxQrcodeElementTypes.URL;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;

  private _loading = new BehaviorSubject<boolean>(false);
  public readonly loading$ = this._loading.asObservable();








  constructor(

    private userService: UserService,
    private notifyService: NotificationService,
    private router : Router,
    private formBuilder: FormBuilder,
    private httpClient: HttpClient
  ) {
    this.paymentAmount=this.userService.getPayment();
    this.value = "upi://pay?pa=" +   // payment method.
    "8296456112@ybl" +         // VPA number.
    "&am="+ this.paymentAmount +       // this param is for fixed amount (non editable).
    "&pn=MAKE-MY-TRIP"+      // to showing your name in app.
    "&cu=INR";
    console.log(this.value);

    this.cardNumber = "";
    
    
  }

  // show() {
  //   this._loading.next(true);
  // }

  // hide() {
  //   this._loading.next(false);
  // }



  //////////////////////////I//M//A///G////E////////////////////////////////////////////////

  selectedFile: File;
  retrievedImage: any;
  base64Data: any;
  retrieveResonse: any;
  message: string;
  imageName: any;

  //Gets called when the user selects an image
  public onFileChanged(event) {
    //Select File
    this.selectedFile = event.target.files[0];
  }

  //Gets called when the user clicks on submit to upload the image
  onUpload() {
    console.log(this.selectedFile);
    this.notifyService.showSuccess('Upload Success!! We will verify your payment , It takes some time ', '');
    
    //FormData API provides methods and properties to allow us easily prepare form data to be sent with POST HTTP requests.
    const uploadImageData = new FormData();
    uploadImageData.append('imageFile', this.selectedFile, this.selectedFile.name);

     //Make a call to the Spring Boot Application to save the image
     this.httpClient.post('http://localhost:9494/image/upload', uploadImageData, { observe: 'response' })
     .subscribe((response) => {
       if (response.status === 200) {
         this.message = 'Image uploaded successfully';
       } else {
         this.message = 'Image not uploaded successfully';
       }
     }
     );

     setTimeout(() => {
    
      this.router.navigate(['getBookingByUser/:userId']);
  }, 5000);  


 }

 card(){
  this.loading = true;
  this.notifyService.showSuccess('Verifying your payment, soon you will redirect to bookings page ', '');
  setTimeout(() => {
    
    this.router.navigate(['successPage']);
}, 6000);  
 }

 //Gets called when the user clicks on retieve image button to get the image from back end
 getImage() {
  //Make a call to Sprinf Boot to get the Image Bytes.
  this.httpClient.get('http://localhost:9494/image/get/' + this.imageName)
    .subscribe(
      res => {
        this.retrieveResonse = res;
        this.base64Data = this.retrieveResonse.picByte;
        this.retrievedImage = 'data:image/jpeg;base64,' + this.base64Data;
      }
    );
}

//////////////////////////I//M//A///G////E////////////////////////////////////////////////
      
  updateForm = this.formBuilder.group(
    {
    email: [null, Validators.required],

  }
  );

  ngOnInit(): void {
    // this.invokeStripe();

    this.userId = localStorage.getItem('userId');
    if (this.userId == null) {
      this.router.navigate(['/error', 'login to continue']);
    } else {
      this.userId = parseInt(this.userId);
      this.userService.getUser(this.userId).subscribe((res) => {
        console.log(res);

        this.user = res;
       

        if (!!this.user) {
          // this.updateForm.controls['userId'].setValue(this.user.userId);
          // this.updateForm.controls['userName'].setValue(this.user.userName);
          this.updateForm.controls['email'].setValue(this.user.email);
          // this.updateForm.controls['phone'].setValue(this.user.phone);
          // this.updateForm.controls['password'].setValue(this.user.password);
        }
      });

      this.updateForm.controls['email'].disable();
    }



  }

  


  

  showToasterSuccess() {
    this.notifyService.showSuccess('Data shown successfully !!', '');
  }

  


  //OBSERVABLE
  // getDataa() {
  //   this.userService.data1.subscribe(response => {
  //     console.log("From Observables :"+response);  // you will receive the data from sender component here.
  //   });
  // }

  // amount: number



  initializePayment() {
    let ticketPrice = this.userService.getPayment();

  

    const paymentHandler = (<any>window).StripeCheckout.configure({
      
      
      key: 'pk_test_51K6qFNSG50Hqm5BgxXZPrDoDbpOeXugOvgysmoGwP0ZaED5ehO2mZdgSXiedHqBQv5AVOcEN917DLuef5S6x5Eyz0076tJWs9Y',
      locale: 'auto',
      token: function (stripeToken: any) {
        
      
        console.log({ stripeToken });
 
      },
    });

    paymentHandler.open({
      name: 'BSOL- Book My trip',
      description: 'Have a Great Journey',
      amount: ticketPrice * 100,
    });
  }
  

 

  invokeStripe() {
    if (!window.document.getElementById('stripe-script')) {
      const script = window.document.createElement('script');
      script.id = 'stripe-script';
      script.type = 'text/javascript';
      script.src = 'https://checkout.stripe.com/checkout.js';
      script.onload = () => {
        this.paymentHandler = (<any>window).StripeCheckout.configure({
          key: 'sk_test_51K6qFNSG50Hqm5BgsIQlMvs7H5gbHMC8gmHgeyCxFkv2kZ33J6d815b8O2qxQbRasdcdO3wuLUj1tA4SbzZxGjNU00Oxupmsif',
          locale: 'auto',
          
          token: function (stripeToken: any) {
           
      

            
          },
        });
      };
      window.document.body.appendChild(script);
    }
  }

  ticketToken(token: string) {
    this.userService.setToken(token);
  }


 

  cardNumberchange(event) {
    console.log(event);

    let value: string = typeof event == 'string' ? event.toUpperCase() : '';

    if (/^[0-9]{4}$/.test(value)) {
      this.cardNumber = `${value.substring(0, 4)} `;

    } else if (/^[0-9]{4}[ -][0-9]{4}$/.test(value)) {
      this.cardNumber = `${value.substring(0, 4)} ${value.substring(
        5,
        9
      )} `;
    } else if (/^[0-9]{4}[ -][0-9]{4}[ -][0-9]{4}$/.test(value)) {
      this.cardNumber = `${value.substring(0, 4)} ${value.substring(
        5,
        9
      )} ${value.substring(10, 14)} `;

    } 
  
  }
}
