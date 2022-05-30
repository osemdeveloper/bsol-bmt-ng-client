import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../booking/notification.service';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css']
})
export class EmailComponent implements OnInit {

  dataset: Details = {
    name:'',
    age:null,
    country:'',
    email:''
  };
  constructor(private https: HttpClient,  private notifyService: NotificationService,){ }
  ngOnInit(): void {
    // throw new Error('Method not implemented.');
  }
  onSubmit(){
    this.https.post<Details>('http://localhost:9494/testapp/getdetails', this.dataset).subscribe(
        res => {
          this.dataset = res;
    
          this.notifyService.showSuccess('Mail has been sent ', '');

          this.dataset.age = null;
          this.dataset.name = '';
          this.dataset.country = '';
          this.dataset.email = '';
        });
  }
}
interface Details{
  name:string;
  age:number;
  country:string;
  email:string;
}