import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import {HttpClient} from "@angular/common/http";
import {Firebase} from "@ionic-native/firebase";
import { User } from '../home/user';

@IonicPage()
@Component({
  selector: 'page-task',
  templateUrl: 'task.html',
})
export class TaskPage {
   email:string;
   message:any;
   public approvals =[];
   public users:User[]=[];
   public aUsers:string[]= []
  constructor(public navCtrl: NavController, public navParams: NavParams,private readonly http: HttpClient,private readonly firebase: Firebase) {
     
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TaskPage');
    this.http.get('https://idb-push.herokuapp.com/users/all')
    .subscribe((res:User[]) =>{
        // this.users = res;
        // console.log(this.users);
        // this.users.forEach((data) =>{
        //   console.log(data);
        //   this.aUsers.push((<any> data).name);
        // })
        
    }, error=> console.log(error))
  }

  submitTask(form:any):void{
    this.email= form.value.pmo;
    console.log(this.email);
    const formData = new FormData();
    formData.append('email', this.email);
    this.http.post('https://idb-push.herokuapp.com/push/send',formData)
    .subscribe(((res) => {
      console.log(res);
      this.handleNotification();
    }), 
     error =>console.log(error))
  }

  handleNotification(){
    this.firebase.onNotificationOpen().subscribe((notification)=>{
      this.message= notification.body;
      console.log(this.message);
    })
  }
}
