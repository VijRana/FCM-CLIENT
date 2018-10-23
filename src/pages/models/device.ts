export class Device{
    
    private deviceID:string;
    private deviceName:string;
    private deviceToken:string;
    
    public  setDeviceID(deviceID):void{
      this.deviceID= deviceID;
    }
    public getDeviceID():string{
        return this.deviceID;
    }
    public setDeviceName(deviceName):void{
      this.deviceName = deviceName;
    }
    public getDeviceName():string{
        return this.deviceName;
    }
    public setdeviceToken(deviceToken):void{
      this.deviceToken = deviceToken;
    }
    
    public getDeviceToken():string{
        return this.deviceToken;
    }

}