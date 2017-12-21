import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import { DtApi } from './thing/dt_api';
import { DTWatchThing } from './thing/dt_watchthing';
import { DTThingStateChange } from './thing/dt_thingstatechange';
import { LogService } from './log.service';
import { DTThing } from './thing/dt_thing';

// The ID of the DT sensors to listen for events for
const THINGSID_TOUCH_1 = '206744835';
const THINGSID_TOUCH_2 = '206889733';
const THINGSID_TOUCH_3 = '206747778';
const THINGSID_TOUCH_1_VS = 'b8ip2ddnqumg00av60q0';
const THINGSID_TOUCH_2_VS = 'b8ip3kmrtm9000cum3ng';
const THINGSID_TOUCH_3_VS = 'b8ip458tbjmg009m3bi0';
const THINGSID_ALARM = '206878213'; // ALARM - Moterom Proximity
const THINGSID_ALARM_VS = 'b8ip8omrtm9000cum3o0';
const THINGSID_DOOR = '206855046'; // DØR - Multirom Proximity
const THINGSID_DOOR_VS = 'b8ipdg6rtm9000cum3og';
const THINGSID_TEMP = '206847879'; // TEMP - Lab Temp
const THINGSID_TEMP_VS = 'vs_temperature_1';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: []
})
export class AppComponent implements OnInit {
  private dtapi: DtApi;
  public title = 'IoT Demo webapp';
  public tempThing: DTThing;
  public alarmThing: DTThing;
  public doorThing: DTThing;
  public touch1: DTThing;
  public touch2: DTThing;
  public touch3: DTThing;

  public show_temp = false;
  public show_door = false;
  public show_alarm = false;
  public show_lysorgel = false;

  constructor(http: Http) {
    this.dtapi = new DtApi(http);
    // Get initial temp-sensor
    this.dtapi.getThingById(THINGSID_TEMP).subscribe(
      (newThing: DTThing) => { this.tempThing = newThing; },
      (error: any) => { console.error(' Error: Unable to get dtThing with id ' + THINGSID_TEMP + ' reason:' + error); },
      () => {
        // console.log('http request ended successfully');
      }
    );
    this.dtapi.getThingById(THINGSID_ALARM).subscribe( (newThing: DTThing) => { this.alarmThing = newThing; });
    this.dtapi.getThingById(THINGSID_DOOR).subscribe( (newThing: DTThing) => { this.doorThing = newThing; });
    this.dtapi.getThingById(THINGSID_TOUCH_1).subscribe( (newThing: DTThing) => { this.touch1 = newThing; });
    this.dtapi.getThingById(THINGSID_TOUCH_2).subscribe( (newThing: DTThing) => { this.touch2 = newThing; });
    this.dtapi.getThingById(THINGSID_TOUCH_3).subscribe( (newThing: DTThing) => { this.touch3 = newThing; });
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

  statusDoor(object_present: boolean): string {
    let ret = 'Open';
    if (object_present) {
      ret = 'Closed';
    }
    return ret;
  }
  statusAlarm(object_present: boolean): string {
    let ret = 'On';
    if (object_present) {
      ret = 'Off';
    }
    return ret;
  }

  private getThingsIdStr(): string {
    let str = '';
    str += '&thing_ids=' + THINGSID_TOUCH_1;
    str += '&thing_ids=' + THINGSID_TOUCH_2;
    str += '&thing_ids=' + THINGSID_TOUCH_3;
    str += '&thing_ids=' + THINGSID_TOUCH_1_VS;
    str += '&thing_ids=' + THINGSID_TOUCH_2_VS;
    str += '&thing_ids=' + THINGSID_TOUCH_3_VS;
    str += '&thing_ids=' + THINGSID_ALARM;
    str += '&thing_ids=' + THINGSID_ALARM_VS;
    str += '&thing_ids=' + THINGSID_DOOR;
    str += '&thing_ids=' + THINGSID_DOOR_VS;
    str += '&thing_ids=' + THINGSID_TEMP;
    str += '&thing_ids=' + THINGSID_TEMP_VS;
    return str;
  }

  startListen(): void {
    this.hideElement('startlisten');
    this.showElement('stoplisten');
    const callback = (wt: DTWatchThing): void => {
      const thingId = wt.thing_id;
      const dt_tsc: DTThingStateChange = wt.state_changed;
      if (dt_tsc.event_type === 'timer') {
        if (LogService.trace()) {
          console.log('Ignoring event_type "timer" (wt.event_type = ' + wt.event_type + ')');
        }
        // update temp-sensor
        if ( thingId === THINGSID_TEMP || thingId === THINGSID_TEMP_VS ) {
          this.tempThing.state.properties.temperature = dt_tsc.temperature + '';
        }
        // update door-sensor
        if ( thingId === THINGSID_DOOR || thingId === THINGSID_DOOR_VS ) {
          this.doorThing.state.properties.object_present = dt_tsc.object_present;
        }
        // update alarm-sensor
        if ( thingId === THINGSID_ALARM || thingId === THINGSID_ALARM_VS ) {
          this.alarmThing.state.properties.object_present = dt_tsc.object_present;
        }
        // update touch_1
        if ( thingId === THINGSID_TOUCH_1 || thingId === THINGSID_TOUCH_1_VS) {
          this.touch1.state.properties.touch = dt_tsc.touch;
        }
        // update touch_2
        if ( thingId === THINGSID_TOUCH_2 || thingId === THINGSID_TOUCH_2_VS ) {
          this.touch2.state.properties.touch = dt_tsc.touch;
        }
        // update touch_3
        if ( thingId === THINGSID_TOUCH_3 || thingId === THINGSID_TOUCH_3_VS ) {
          this.touch3.state.properties.touch = dt_tsc.touch;
        }
        return;
      } else {
        if (LogService.trace()) {
          console.log(JSON.stringify(wt));
        }

        if ( thingId === THINGSID_TOUCH_1 || thingId === THINGSID_TOUCH_1_VS ) {
          console.log('play lys_tone.pm3');
          this.touch1_blinkImage();
          this.playSound('lys_tone.mp3');

        } else if (thingId === THINGSID_TOUCH_2 || thingId === THINGSID_TOUCH_2_VS ) {
          console.log('play middels_tone.pm3');
          this.touch2_blinkImage();
          this.playSound('middels_tone.mp3');

        } else if ( thingId === THINGSID_TOUCH_3 || thingId === THINGSID_TOUCH_3_VS ) {
          console.log('play dyp_tone.pm3');
          this.touch3_blinkImage();
          this.playSound('dyp_tone.mp3');

        } else if ( thingId === THINGSID_ALARM || thingId === THINGSID_ALARM_VS ) {
          this.alarmThing.state.properties.object_present = dt_tsc.object_present;
          this.updateAlarmImg(dt_tsc.object_present);
          if ( dt_tsc.object_present ) {
            console.log('No alarm as long as object is present, object_present = ' + dt_tsc.object_present);
          } else {
            console.log('play alarm.mp3 since object_present = ' + dt_tsc.object_present);
            this.playSound('alarm.mp3');
          }

        } else if ( thingId === THINGSID_TEMP || thingId === THINGSID_TEMP_VS ) {
          this.tempThing.state.properties.temperature = dt_tsc.temperature + '';
          this.updateTemp(dt_tsc.temperature + '');

        } else if ( thingId === THINGSID_DOOR || thingId === THINGSID_DOOR_VS ) {
          this.doorThing.state.properties.object_present = dt_tsc.object_present;
          this.updateDoorImg(dt_tsc.object_present);
          if ( dt_tsc.object_present ) {
            console.log('Door is closing');
            console.log('TODO: show that door is closing on webpage');
            this.doorThing.state.properties.object_present = true;
          } else {
            console.log('Door is opening');
            this.playSound('dingdong.mp3');
            console.log('TODO: show that door is closed on webpage');
          }
        } else {
          console.log('Unknown sensor "' + thingId + '"');
          console.log('  temperature....: ' + wt.state_changed.temperature);
          console.log('  object_present.: ' + wt.state_changed.object_present);
          console.log('  touch..........: ' + wt.state_changed.touch);
          console.log('  last_pressed...: ' + wt.state_changed.last_pressed);
          console.log('  event_type.....: ' + wt.state_changed.event_type);
        }
      }
      // console.log('Callback called');
    };
    this.dtapi.listenForEvents(callback, this.getThingsIdStr());
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

  private updateTemp(newTemp: string): void {
    const el = document.getElementById('tempvalue');
    if (el) {
      el.innerText = newTemp + ' ˚C';
    }
  }
  private updateDoorImg(object_present: boolean): void {
    let el = document.getElementById( 'door_img');
    if (el) {
      el.getAttributeNode('src').value = 'assets/' + object_present + '.png';
    }
    el = document.getElementById('statusDoor');
    if (el) {
      el.textContent = this.statusDoor(object_present);
    }
  }
  private updateAlarmImg(object_present: boolean): void {
    let el = document.getElementById( 'alarm_img');
    if (el) {
      el.getAttributeNode('src').value = 'assets/' + object_present + '.png';
    }
    el = document.getElementById('statusAlarm');
    if (el) {
      el.textContent = this.statusAlarm(object_present);
    }
  }

  public touch1_blinkImage(): void {
    const el = document.getElementById('touch1_img');
    if (el) {
      el.style.opacity = '1.00';
      setTimeout(() => { el.style.opacity = '0.00'; }, 3000);
    }
  }
  public touch2_blinkImage(): void {
    const el = document.getElementById('touch2_img');
    if (el) {
      el.style.opacity = '1.00';
      setTimeout(() => { el.style.opacity = '0.00'; }, 3000);
    }
  }
  public touch3_blinkImage(): void {
    const el = document.getElementById('touch3_img');
    if (el) {
      el.style.opacity = '1.00';
      setTimeout(() => { el.style.opacity = '0.00'; }, 3000);
    }
  }
}
