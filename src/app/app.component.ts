import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import { DtApi } from './thing/dt_api';
import { DTWatchThing } from './thing/dt_watchthing';
import { DTThingStateChange } from './thing/dt_thingstatechange';
import { LogService } from './log.service';

// The ID of the DT sensors to listen for events for
const THINGSID_TOUCH_1 = '206744835';
const THINGSID_TOUCH_2 = '206747778';
const THINGSID_TOUCH_3 = '206889733';
const THINGSID_TOUCH_1_VS = 'b8ip2ddnqumg00av60q0';
const THINGSID_TOUCH_2_VS = 'b8ip3kmrtm9000cum3ng';
const THINGSID_TOUCH_3_VS = 'b8ip458tbjmg009m3bi0';
const THINGSID_PROX_1 = '206878213'; // ALARM - Multirom 2 Proximity
const THINGSID_PROX_1_VS = 'b8ip8omrtm9000cum3o0';
const THINGSID_PROX_2 = '206855046'; // DØR - Multirom 1 Proximity
const THINGSID_PROX_2_VS = 'b8ipdg6rtm9000cum3og';
const THINGSID_TEMP_1 = '206847879'; // TEMP - Multirom 2 Temp
const THINGSID_TEMP_1_VS = 'vs_temperature_1';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: []
})
export class AppComponent implements OnInit {
  public title = 'IoT Demo webapp';
  private dtapi: DtApi;

  constructor(http: Http) {
    this.dtapi = new DtApi(http);
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

  private getThingsIdStr(): string {
    let str = '';
    str += '&thing_ids=' + THINGSID_TOUCH_1;
    str += '&thing_ids=' + THINGSID_TOUCH_2;
    str += '&thing_ids=' + THINGSID_TOUCH_3;
    str += '&thing_ids=' + THINGSID_TOUCH_1_VS;
    str += '&thing_ids=' + THINGSID_TOUCH_2_VS;
    str += '&thing_ids=' + THINGSID_TOUCH_3_VS;
    str += '&thing_ids=' + THINGSID_PROX_1;
    str += '&thing_ids=' + THINGSID_PROX_1_VS;
    str += '&thing_ids=' + THINGSID_PROX_2;
    str += '&thing_ids=' + THINGSID_PROX_2_VS;
    str += '&thing_ids=' + THINGSID_TEMP_1;
    str += '&thing_ids=' + THINGSID_TEMP_1_VS;
    return str;
  }

  private startListen(): void {
    this.hideElement('startlisten');
    this.showElement('stoplisten');
    const callback = (wt: DTWatchThing): void => {
      const thingId = wt.thing_id;
      const dt_tsc: DTThingStateChange = wt.state_changed;
      if (dt_tsc.event_type === 'timer') {
        console.log('Ignoring event_type "timer" (wt.event_type = ' + wt.event_type + ')');
        // ignore timer events
        return;
      } else {
        // TODO: play sounds, update values and show whats happening

        console.log(JSON.stringify(wt));

        if ( thingId === THINGSID_TOUCH_1 || thingId === THINGSID_TOUCH_1_VS ) {
          console.log('play lys_tone.pm3');
          this.playSound('lys_tone.mp3');

        } else if (thingId === THINGSID_TOUCH_2 || thingId === THINGSID_TOUCH_2_VS ) {
          console.log('play middels_tone.pm3');
          this.playSound('middels_tone.mp3');

        } else if ( thingId === THINGSID_TOUCH_3 || thingId === THINGSID_TOUCH_3_VS ) {
          console.log('play dyp_tone.pm3');
          this.playSound('dyp_tone.mp3');

        } else if ( thingId === THINGSID_PROX_1 || thingId === THINGSID_PROX_1_VS ) {
          if ( dt_tsc.object_present ) {
            console.log('No alarm as long as object is present, object_present = ' + dt_tsc.object_present);
          } else {
            console.log('play alarm.mp3 since object_present = ' + dt_tsc.object_present);
            this.playSound('alarm.mp3');
          }

        } else if ( thingId === THINGSID_PROX_2 || thingId === THINGSID_PROX_2_VS ) {
          if ( ! dt_tsc.object_present ) {
            console.log('Door is closing');
            console.log('TODO: show that door is closing on webpage');
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
    console.log('Trying to play a rooster-sound');
    // if player exists - reuse it
    let player: any = document.getElementById('soundplayer');
    if ( ! player ) {
      player = document.createElement('audio');
      player.setAttribute('id', 'soundplayer');
    }
    player.setAttribute('src', 'assets/' + mp3file);
    console.log('Player set to play <audio src="' + player.getAttribute('src') + '"></audio>');
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

}
