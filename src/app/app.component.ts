import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import { DtApi } from './dt/dt_api';
import { Event, Device } from './dt/dt_model';
import { LOGLEVEL_ERROR, LogService} from './log.service';

// The ID of the DT sensors to listen for events for
const DEVICE_ID_TOUCH_1 = 'b6oiv957rihk096jph4g';
const DEVICE_ID_TOUCH_2 = 'b6oiv957rihk096jphh0';
const DEVICE_ID_TOUCH_3 = 'b6oiv957rihk096jpgsg';
const DEVICE_ID_PROXIMITY_ALARM = 'b6sfpst7rihg0dm4uvm0';
const DEVICE_ID_PROXIMITY_DINGDONG = 'b6sfpt57rihg0dm4v0kg';
const DEVICE_ID_TEMPERATURE     = 'b6sfpst7rihg0dm4uvr0';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: []
})
export class AppComponent implements OnInit {
  private dtapi: DtApi;
  public title = 'IoT Demo webapp';
  public tempSensor: Device;
  public alarmSensor: Device;
  public dingDongSensor: Device;
  public touchSensor1: Device;
  public touchSensor2: Device;
  public touchSensor3: Device;

  public show_temp = false;
  public show_dingdong = false;
  public show_alarm = false;
  public show_lightorgan = false;

  static getDeviceIdFilter(): string {
    let str = '';
    str += 'device_ids=' + DEVICE_ID_TOUCH_1;
    str += '&device_ids=' + DEVICE_ID_TOUCH_2;
    str += '&device_ids=' + DEVICE_ID_TOUCH_3;
    str += '&device_ids=' + DEVICE_ID_PROXIMITY_ALARM;
    str += '&device_ids=' + DEVICE_ID_PROXIMITY_DINGDONG;
    str += '&device_ids=' + DEVICE_ID_TEMPERATURE;
    return str;
  }

  static playSound(mp3file: string): void {
    if ( LogService.trace()) {
      console.log('Trying to play a sound (' + mp3file + ')');
    }
    // if player exists - reuse it
    let player: any = document.getElementById('soundplayer');
    if ( ! player ) {
      player = document.createElement('audio');
      player.setAttribute('id', 'soundplayer');
    }
    player.setAttribute('src', 'assets/' + mp3file);
    if (LogService.debug()) {
      console.log('Player set to play <audio src="' + player.getAttribute('src') + '"></audio>');
    }
    player.play();
  }

  static hideElement(id: string): void {
    if ( LogService.trace() ) {
      console.log(id + ' => none');
    }
    const el = document.getElementById(id);
    if (id) {
      el.style.display = 'none';
    } else {
      if (LogService.info()) {
        console.log('No HTML element with id \'' + id + '\' found');
      }
    }
  }

  static showElement(id: string): void {
    if ( LogService.trace() ) {
      console.log( id + ' => block');
    }
    const el = document.getElementById(id);
    if (id) {
      el.style.display = 'block';
    } else {
      if (LogService.info()) {
        console.log('No HTML element with id \'' + id + '\' found');
      }
    }
  }

  static updateDingDongImage(object_present: string): void {
    const el = document.getElementById( 'dingdong_img');
    if (el) {
      el.getAttributeNode('src').value = 'assets/' + object_present + '.png';
    }
  }

  static updateAlarmImg(object_present: string): void {
    const el = document.getElementById( 'alarm_img');
    if (el) {
      el.getAttributeNode('src').value = 'assets/' + object_present + '.png';
    }
  }

  constructor(http: Http) {
    this.dtapi = new DtApi(http);
    this.dtapi.getDevice(DEVICE_ID_TEMPERATURE).subscribe( (newDevice: Device) => { this.tempSensor = newDevice; });
    this.dtapi.getDevice(DEVICE_ID_PROXIMITY_ALARM).subscribe( (newDevice: Device) => { this.alarmSensor = newDevice; });
    this.dtapi.getDevice(DEVICE_ID_PROXIMITY_DINGDONG).subscribe( (newDevice: Device) => { this.dingDongSensor = newDevice; });
    this.dtapi.getDevice(DEVICE_ID_TOUCH_1).subscribe( (newDevice: Device) => { this.touchSensor1 = newDevice; });
    this.dtapi.getDevice(DEVICE_ID_TOUCH_2).subscribe( (newDevice: Device) => { this.touchSensor2 = newDevice; });
    this.dtapi.getDevice(DEVICE_ID_TOUCH_3).subscribe( (newDevice: Device) => { this.touchSensor3 = newDevice; });
  }

  ngOnInit(): void {
    LogService.setLogLevel(LOGLEVEL_ERROR);
    if (LogService.info()) {
      console.log('AppComponent initialized');
    }
  }

  public stopListen(): void {
    this.dtapi.stopListening();
    AppComponent.showElement('startlisten');
    AppComponent.hideElement('stoplisten');
  }

  showTemp(): void {
    this.show_alarm = false;
    this.show_dingdong = false;
    this.show_lightorgan = false;
    this.show_temp = true;
  }
  showDoor(): void {
    this.show_alarm = false;
    this.show_dingdong = true;
    this.show_lightorgan = false;
    this.show_temp = false;
  }
  showAlarm(): void {
    this.show_alarm = true;
    this.show_dingdong = false;
    this.show_lightorgan = false;
    this.show_temp = false;
  }
  showLysorgel(): void {
    this.show_alarm = false;
    this.show_dingdong = false;
    this.show_lightorgan = true;
    this.show_temp = false;
  }

  startListen(): void {
    AppComponent.hideElement('startlisten');
    AppComponent.showElement('stoplisten');

    const callbackListenForEvents = (event: Event): void => {
      const device_id = this.dtapi.getDeviceId(event.targetName);
      if (LogService.trace()) {
        console.log(JSON.stringify(event, null, ' '));
      }

      if ( device_id === DEVICE_ID_TOUCH_1 ) {
        this.touch_blinkImage('touch1_img');
        AppComponent.playSound('tone_light.mp3');

      } else if (device_id === DEVICE_ID_TOUCH_2 ) {
        this.touch_blinkImage('touch2_img');
        AppComponent.playSound('tone_medium.mp3');

      } else if ( device_id === DEVICE_ID_TOUCH_3 ) {
        this.touch_blinkImage('touch3_img');
        AppComponent.playSound('tone_dark.mp3');

      } else if ( device_id === DEVICE_ID_PROXIMITY_ALARM && event.data.objectPresent ) {
        this.alarmSensor.reported.objectPresent.state = event.data.objectPresent.state;
        AppComponent.updateAlarmImg(event.data.objectPresent.state);
        if ( 'PRESENT' === event.data.objectPresent.state ) {
          if (LogService.debug()) {
            console.log('No alarm as long as object is present, object_present = ' + event.data.objectPresent.state);
          }
        } else {
          if (LogService.info()) {
            console.log('play alarm.mp3 since object_present = ' + event.data.objectPresent.state);
          }
          AppComponent.playSound('alarm.mp3');
        }

      } else if ( device_id === DEVICE_ID_TEMPERATURE ) {
        if ( event.data.temperature ) {
          if (LogService.info()) {
            console.log('Updating temp from ' + this.tempSensor.reported.temperature.value + '˙C => ' + event.data.temperature.value + '˙C');
          }
          this.tempSensor.reported.temperature.value = event.data.temperature.value;
        }

      } else if ( device_id === DEVICE_ID_PROXIMITY_DINGDONG  && event.data.objectPresent ) {
        this.dingDongSensor.reported.objectPresent.state =  event.data.objectPresent.state;
        AppComponent.updateDingDongImage(event.data.objectPresent.state);
        if ( 'PRESENT' === event.data.objectPresent.state) {
          if (LogService.trace()) {
            console.log('TODO: show that DingDong is going from NOT_PRESENT to PRESENT on webpage');
          }
        } else {
          AppComponent.playSound('dingdong.mp3');
          if (LogService.trace()) {
            console.log('TODO: show that door is closed on webpage');
          }
        }
      } else {
        if (LogService.error()) {
          console.log('Unknown sensor "' + device_id + '"');
          console.log(JSON.stringify(event, null, ' '));
        }
      }
    };

    this.dtapi.listenForEvents(callbackListenForEvents, AppComponent.getDeviceIdFilter());
  }

  public touch_blinkImage(imgName: string): void {
    const el = document.getElementById(imgName);
    if (el) {
      el.style.opacity = '1.00';
      setTimeout(() => { el.style.opacity = '0.10'; }, 3000);
    }
  }

}
