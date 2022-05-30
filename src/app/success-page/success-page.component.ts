import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-success-page',
  templateUrl: './success-page.component.html',
  styleUrls: ['./success-page.component.css']
})
export class SuccessPageComponent implements OnInit {

  constructor(
    private router:Router
  ) { 

    

    setTimeout(() => {
    
      this.router.navigate(['getBookingByUser/:userId']);
  }, 3000);  
  }

  ngOnInit(): void {
  }

}
