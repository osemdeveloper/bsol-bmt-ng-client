import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
// import { PopupService } from '@ng-bootstrap/ng-bootstrap/util/popup';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-admin-register',
  templateUrl: './admin-register.component.html',
  styleUrls: ['./admin-register.component.css'],
})
export class AdminRegisterComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private adminService: AdminService
  ) {}

  private adminData = null;
  failure = { value: false };

  /* -------register form for admin------ */

  adminRegisterForm = this.formBuilder.group(
    {
      adminId: [],
      userRole: 'admin',
      adminName: [null, Validators.required],
      adminEmail: [null, Validators.required],

      password: [null, [Validators.required, Validators.minLength(8)]],
      confirmPassword: [null, [Validators.required]],
    },
    { validators: this.passwordValidator }
  );

  /**
   * ------- function to check password and confirm password field are same---------
   */

  passwordValidator(control: AbstractControl): { [key: string]: any } | null {
    const pass = control.get('password');
    const cnfm = control.get('confirmPassword');
    if (pass && cnfm && pass.value !== cnfm.value) {
      return { mismatch: true };
    } else {
      return null;
    }
  }

  /* ---------function to register-------- */

  onAsk() {
    this.adminRegisterForm.removeControl('confirmPassword');
    this.adminService.addAdmin(this.adminRegisterForm.value).subscribe(
      (data) => {
        this.adminData = data;
        //CHANGE localStorage.setItem("adminId",this.adminData.adminId);
        localStorage.setItem('email', this.adminData.email);
        // this.router.navigate(["/adminLogin"]);
        // alert("Secondary Admin has added. Click 'OK' to Login");

        this.router.navigate(['/adminHome']);
      },
      (error) => {
        this.failure.value = true;
        // this.router.navigate(["/error","invalid data provided or unable to connect"]);
      }
    );
  }

  ngOnInit(): void {}
}
