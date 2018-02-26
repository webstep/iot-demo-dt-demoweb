import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import { DtApi } from './dt/dt_api';
import { Event } from './dt/dt_streamresult';
import { LogService } from './log.service';
import { Device } from './dt/dt_device';

// The ID of the DT sensors to listen for events for
const DEVICE_ID_TOUCH_1 = 'b6oiv957rihk096jph4g';
const DEVICE_ID_TOUCH_2 = 'b6oiv957rihk096jphh0';
const DEVICE_ID_TOUCH_3 = 'b6oiv957rihk096jpgsg';
const DEVICE_ID_ALARM = 'b6sfpst7rihg0dm4uvm0'; // ALARM
const DEVICE_ID_DOOR = 'b6sfpt57rihg0dm4v0kg'; // DØR
const DEVICE_ID_TEMP = 'b6sfpst7rihg0dm4uvr0'; // TEMP - Lab Temp

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
  public doorSensor: Device;
  public touchSensor1: Device;
  public touchSensor2: Device;
  public touchSensor3: Device;

  public show_temp = false;
  public show_door = false;
  public show_alarm = false;
  public show_lysorgel = false;

  constructor(http: Http) {
    this.dtapi = new DtApi(http);
    this.dtapi.getDevice(DEVICE_ID_TEMP).subscribe( (newDevice: Device) => { this.tempSensor = newDevice; });
    this.dtapi.getDevice(DEVICE_ID_ALARM).subscribe( (newDevice: Device) => { this.alarmSensor = newDevice; });
    this.dtapi.getDevice(DEVICE_ID_DOOR).subscribe( (newDevice: Device) => { this.doorSensor = newDevice; });
    this.dtapi.getDevice(DEVICE_ID_TOUCH_1).subscribe( (newDevice: Device) => { this.touchSensor1 = newDevice; });
    this.dtapi.getDevice(DEVICE_ID_TOUCH_2).subscribe( (newDevice: Device) => { this.touchSensor2 = newDevice; });
    this.dtapi.getDevice(DEVICE_ID_TOUCH_3).subscribe( (newDevice: Device) => { this.touchSensor3 = newDevice; });
  }

  ngOnInit(): void {
    if (LogService.info()) {
      console.log('AppComponent initialized');
    }
  }

  public stopListen(): void {
    this.dtapi.stopListening();
    this.showElement('startlisten');
    this.hideElement('stoplisten');
  }

  showTemp(): void {
    this.show_alarm = false;
    this.show_door = false;
    this.show_lysorgel = false;
    this.show_temp = true;
  }
  showDoor(): void {
    this.show_alarm = false;
    this.show_door = true;
    this.show_lysorgel = false;
    this.show_temp = false;
  }
  showAlarm(): void {
    this.show_alarm = true;
    this.show_door = false;
    this.show_lysorgel = false;
    this.show_temp = false;
  }
  showLysorgel(): void {
    this.show_alarm = false;
    this.show_door = false;
    this.show_lysorgel = true;
    this.show_temp = false;
  }

  statusDoor(object_present: string): string {
    let ret = 'Open';
    if ('PRESENT' === object_present) {
      ret = 'Closed';
    }
    return ret;
  }
  statusAlarm(object_present: string): string {
    let ret = 'On';
    if ('PRESENT' === object_present) {
      ret = 'Off';
    }
    return ret;
  }

  private getDeviceIdFilter(): string {
    let str = '';
    str += 'device_ids=' + DEVICE_ID_TOUCH_1;
    str += '&device_ids=' + DEVICE_ID_TOUCH_2;
    str += '&device_ids=' + DEVICE_ID_TOUCH_3;
    str += '&device_ids=' + DEVICE_ID_ALARM;
    str += '&device_ids=' + DEVICE_ID_DOOR;
    str += '&device_ids=' + DEVICE_ID_TEMP;
    return str;
  }

  startListen(): void {
    this.hideElement('startlisten');
    this.showElement('stoplisten');

    const callbackListenForEvents = (event: Event): void => {
      const device_id = this.dtapi.getDeviceId(event.targetName);
      if (LogService.trace()) {
        console.log(JSON.stringify(event, null, ' '));
      }

      if ( device_id === DEVICE_ID_TOUCH_1 ) {
        console.log('play lys_tone.pm3');
        this.touch_blinkImage('touch1_img');
        this.playSound('lys_tone.mp3');

      } else if (device_id === DEVICE_ID_TOUCH_2 ) {
        console.log('play middels_tone.pm3');
        this.touch_blinkImage('touch2_img');
        this.playSound('middels_tone.mp3');

      } else if ( device_id === DEVICE_ID_TOUCH_3 ) {
        console.log('play dyp_tone.pm3');
        this.touch_blinkImage('touch3_img');
        this.playSound('dyp_tone.mp3');

      } else if ( device_id === DEVICE_ID_ALARM && event.data.objectPresent ) {
        this.alarmSensor.reported.objectPresent.state = event.data.objectPresent.state;
        this.updateAlarmImg(event.data.objectPresent.state);
        if ( 'PRESENT' === event.data.objectPresent.state ) {
          console.log('No alarm as long as object is present, object_present = ' + event.data.objectPresent.state);
        } else {
          console.log('play alarm.mp3 since object_present = ' + event.data.objectPresent.state);
          this.playSound('alarm.mp3');
        }

      } else if ( device_id === DEVICE_ID_TEMP ) {
        if ( event.data.temperature ) {
          this.tempSensor.reported.temperature.value = event.data.temperature.value;
        }

      } else if ( device_id === DEVICE_ID_DOOR  && event.data.objectPresent ) {
        this.doorSensor.reported.objectPresent.state =  event.data.objectPresent.state;
        this.updateDoorImg(event.data.objectPresent.state);
        if ( 'PRESENT' === event.data.objectPresent.state) {
          console.log('Door is closing');
          console.log('TODO: show that door is closing on webpage');
        } else {
          console.log('Door is opening');
          this.playSound('dingdong.mp3');
          console.log('TODO: show that door is closed on webpage');
        }

      } else {
        console.log('Unknown sensor "' + device_id + '"');
        console.log(JSON.stringify(event, null, ' '));
      }
    };

    this.dtapi.listenForEvents(callbackListenForEvents, this.getDeviceIdFilter());
  }
  private playSound(mp3file: string): void {
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

  private hideElement(id: string): void {
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

  private showElement(id: string): void {
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

  private updateDoorImg(object_present: string): void {
    let el = document.getElementById( 'door_img');
    if (el) {
      el.getAttributeNode('src').value = 'assets/' + object_present + '.png';
    }
    el = document.getElementById('statusDoor');
    if (el) {
      el.textContent = this.statusDoor(object_present);
    }
  }

  private updateAlarmImg(object_present: string): void {
    let el = document.getElementById( 'alarm_img');
    if (el) {
      el.getAttributeNode('src').value = 'assets/' + object_present + '.png';
    }
    el = document.getElementById('statusAlarm');
    if (el) {
      el.textContent = this.statusAlarm(object_present);
    }
  }

  public touch_blinkImage(imgName: string): void {
    const el = document.getElementById(imgName);
    if (el) {
      el.style.opacity = '1.00';
      setTimeout(() => { el.style.opacity = '0.10'; }, 3000);
    }
  }

}
