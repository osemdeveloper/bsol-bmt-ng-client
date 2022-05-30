import { Component, OnInit, ViewEncapsulation  } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from '../booking/notification.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css'],
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
export class UserRegisterComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private modalService: NgbModal,
    private notifyService : NotificationService
  ) {}

  private userData = null;
  failure = { value: false };

  /* -------register form for user------ */

  userRegisterForm = this.formBuilder.group(
    {
      userId: [],
      userName: [null, Validators.required],
      email: [null, Validators.required],
      phone: [
        null,
        [Validators.required, Validators.pattern('[6789][0-9]{9}')],
      ],

      password: [
        null,
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(
            '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$&*~]).{8,}$'
          ),
        ],
      ],
      confirmPassword: [null, [Validators.required]],
    },
    // { validators: this.passwordValidator }
  );

  /**
   * ------- function to check password and confirm password field are same---------
   */

  // passwordValidator(control: AbstractControl): { [key: string]: any } | null {
  //   const pass = control.get('password');
  //   const cnfm = control.get('confirmPassword');
  //   if (pass && cnfm && pass.value !== cnfm.value) {
  //     return { mismatch: true };
   
  //   } else {
  //     return null;
  //   }
  // }

  passwordValidator(): boolean {

    const pass = this.userRegisterForm.get('password').value;
      const cnfm =  this.userRegisterForm.get('confirmPassword').value;
      console.log(pass);
      console.log(cnfm);
      
     if (pass && cnfm && pass === cnfm) {
  
       
      return true;
       
     }else{
      return false;
      
       
     }
    
  }


  openBackDropCustomClass(content) {
    this.modalService.open(content);
  }

  /* ---------function to register-------- */

  

  submit(content) {

   if( this.passwordValidator()){

    this.userService.addUser(this.userRegisterForm.value).subscribe(
        (data) => {
          this.userData = data;
        
          localStorage.setItem('email', this.userData.email);
          // this.openBackDropCustomClass("success");
          this.notifyService.showSuccess('Registered Succesfully ', '');

         this.openBackDropCustomClass(content);

          // this.router.navigate(['/userLogin']);
        },
        (error) => {
          this.failure.value = true;
          this.router.navigate(["/error","invalid data provided or unable to connect"]);
        }
      );

     
   }else{
    this.notifyService.showError('Password Mismatch ', '');

   }


    // this.userRegisterForm.removeControl('confirmPassword');
    // this.userService.addUser(this.userRegisterForm.value).subscribe(
    //   (data) => {
    //     this.userData = data;
      
    //     localStorage.setItem('email', this.userData.email);
    //     // this.openBackDropCustomClass("success");
    //     // alert("User Registered Succesfully Click 'OK' to Login");
    //     // this.router.navigate(['/userLogin']);
    //   },
    //   (error) => {
    //     this.failure.value = true;
    //     // this.router.navigate(["/error","invalid data provided or unable to connect"]);
    //   }
    // );
  }

  navigate(){
    this.router.navigate(['/userLogin']);
  }
  ngOnInit(): void {
    this.failure.value = false;
  }
}
