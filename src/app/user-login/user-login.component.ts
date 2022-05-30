import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../services/admin.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css'],
})
export class UserLoginComponent implements OnInit {
  
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private adminService: AdminService
  ) {}

  failure = { value: false };
  userData = null;
  adminData = null;

  /* --login form--- */

  loginForm = this.formBuilder.group({
    // userId: [null, [Validators.required]],
    email: [null, [Validators.required]],
    password: [null, [Validators.required, Validators.minLength(8)]],
  });

  ngOnInit(): void {
    this.failure.value = false;
  }

  func(){
    this.router.navigate(['/testing']);
  }

  

  /* -----method for login------- */

  submit() {
    this.userService.userLogin(this.loginForm.value).subscribe(
      (data) => {
  

        this.userData = data;
        this.failure.value = false;

    
        if (this.userData) {
          localStorage.setItem('userId', this.userData.userId);
        }
        localStorage.setItem('userRole', this.userData.userRole);
        if (!!data) {
          if (data.userRole === 'admin') {
            this.router.navigate(['/adminHome']);
          } else if (data.userRole === 'user') {
            this.router.navigate(['/userHome']);
          }
        }
      },
      (error) => {
        this.failure.value = true;
        this.loginForm.reset();
      }
    );
  }
  

  // ///////////////////////////////////////////////////

  //  this.adminService.adminLogin(this.loginForm.value).subscribe(
  //     (data) => {
  //       this.adminData = data;
  //       this.failure.value = false;
  //       localStorage.setItem("adminId",this.adminData.adminId);
  //       this.router.navigate(["/adminHome"]);
  //     },
  //     (error) => {
  //       this.failure.value = true;
  //       this.loginForm.reset();
  //     }
  //   );
  // }


}
