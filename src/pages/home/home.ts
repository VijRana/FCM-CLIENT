import { Component , NgZone} from '@angular/core';
import { NavController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import {Storage} from "@ionic/storage";
import { timeout } from 'rxjs/operators';
import {Firebase} from "@ionic-native/firebase";
import {HttpClient} from "@angular/common/http";
import { User } from './user';
import { TaskPage } from '../task/task';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { Device} from '../models/device';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  private readonly TOPIC_NAME = "idp";
  private readonly  PLATFORM_ANDROID = "android";
  private readonly  PLATFORM_IOS = "ios";
  allowPush: boolean;
  allowPersonal: boolean;
  items: { id: number, text: string }[] = [];
  token: string;
  user:User;
  isSucess:boolean = false;
  roles:string[]= ['PMO', 'DEV'];
  role:string;
  device:Device;
  
  
  constructor(private readonly http: HttpClient,
    private platform: Platform,
    private readonly ngZone: NgZone,
    private readonly firebase: Firebase,
    private readonly storage: Storage,
    private navCtrl:NavController,
    private deviceUniqueID:UniqueDeviceID
  ) {
       this.device = new Device();
      this.platform.ready().then(() => {

        if(this.platform.is(this.PLATFORM_IOS)){
            console.log('I am in IOS  Device');
        }
        if(this.platform.is(this.PLATFORM_ANDROID)){
          console.log('I am in ANDROID  Device');
          this.device.setDeviceName('ANDROID');
          this.firebase.getToken()
          .then(token => this.token = token)
          .catch(error => console.error('Error getting token', error));
  
        this.firebase.onTokenRefresh()
          .subscribe((token: string) => {
            this.token = token;
            this.device.setdeviceToken(this.token);
          });
          
  
        this.firebase.onNotificationOpen().subscribe(notification => this.handleNotification(notification));
        this.deviceUniqueID.get()
        .then((uuid:any) => {
          console.log(uuid);
          this.device.setDeviceID(uuid);
        })
        .catch((error:any) => console.log(error))

      }
        
        // this.firebase.getToken()
        //   .then(token => this.token = token)
        //   .catch(error => console.error('Error getting token', error));
  
        // this.firebase.onTokenRefresh()
        //   .subscribe((token: string) => this.token = token);
  
        // this.firebase.onNotificationOpen().subscribe(notification => this.handleNotification(notification));
        // this.deviceID.get()
        // .then((uuid:any) => console.log(uuid))
        // .catch((error:any) => console.log(error))
        
      });
  
      storage.get("allowPush").then(flag => this.allowPush = !!flag);
      storage.get("allowPersonal").then(flag => this.allowPersonal = !!flag);
  }

  register() {
    const formData = new FormData();
    formData.append('token', this.token);
    this.http.post(`http://localhost:8080/register`, formData)
      .pipe(timeout(10000))
      .subscribe(() => this.storage.set("allowPersonal", this.allowPersonal),
        error => this.allowPersonal = !this.allowPersonal);
  }

  unregister() {
    const formData = new FormData();
    formData.append('token', this.token);
    this.http.post(`http://localhost:8080/unregister`, formData)
      .pipe(timeout(10000))
      .subscribe(() => this.storage.set("allowPersonal", this.allowPersonal),
        error => this.allowPersonal = !this.allowPersonal);
  }

  onChange() {
    this.storage.set("allowPush", this.allowPush);

    if (this.allowPush) {
      this.firebase.subscribe(this.TOPIC_NAME);
    }
    else {
      this.firebase.unsubscribe(this.TOPIC_NAME);
    }
  }

  onPmChange() {
    if (this.allowPersonal) {
      this.register();
    }
    else {
      this.unregister();
    }
  }

  handleNotification(data) {
    if (!data.text) {
      return;
    }

    this.ngZone.run(() => {
      this.items.splice(0, 0, {id: data.id, text: data.text});

      //only keep the last 5 entries
      if (this.items.length > 5) {
        this.items.pop();
      }

    });
  }

  signUp(form:any):void{
    console.log(form);
    console.log(this.token);
     let devices:Device[]=[];
     devices.push(this.device);
     this.user = new User();
     this.user.setName(form.value.uname);
     this.user.setToken(this.token);
     this.user.setMobile(form.value.mob);
     this.user.setPassword(form.value.psw);
     this.user.setEmail(form.value.email);
     this.user.setRole(form.value.role);
     this.user.setDevices(devices);
     this.http.put('https://idb-push.herokuapp.com/users/add',this.user)
     .subscribe((res) => {
       console.log(res)
        if(res){
        this.isSucess =true;
        this.navCtrl.push(TaskPage);
        }
      },
      error => console.log(error)
    )

  }

  gotoTaskPage():void{
    this.navCtrl.push(TaskPage);
  }
}
