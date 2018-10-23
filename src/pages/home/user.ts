import { Device } from '../models/device';

export class User{
    
    private name:string;
    private token:string;
    private password:string;
    private mobile:number;
    private email:string;
    private role:string;
    private devices:Device[];

    public getName():string{
        return this.name;
    }
    public setName(name:string):void{
        this.name= name;
    }
    public getToken():string{
         return this.token;
    }
    public setToken(token:string):void{
      this.token = token;
    }
    public getMobileNumber():number{
        return this.mobile;
    }
    public setMobile(mob:number):void{
    this.mobile= mob;
    }
    public setPassword(pass:string):void{
     this.password= pass;
    }
    public setRole(role:string):void{
      this.role=role;
    }
    public getRole():string{
        return this.role;
    }
    public  setEmail(email:string):void{
     this.email= email;
    }
    public  getEmail():string{
        return this.email;
    }
    public setDevices(devices:Device[]):void{
      this.devices= devices;
    }
    public getDevice():Device[]{
        return this.devices;
    }
    
}