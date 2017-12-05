import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { DtApi } from './thing/dt_api';
import { DTWatchThing } from './thing/dt_watchthing';
import { DTThingStateChange } from './thing/dt_thingstatechange';

@Injectable()
export class DtApiService {

  // The ID of the DT sensors to listen for events for
  static THINGSID_TOUCH_1 = '206744835';
  static THINGSID_TOUCH_2 = '206747778';
  static THINGSID_TOUCH_3 = '206889733';
  static THINGSID_TOUCH_1_VS = 'b8ip2ddnqumg00av60q0';
  static THINGSID_TOUCH_2_VS = 'b8ip3kmrtm9000cum3ng';
  static THINGSID_TOUCH_3_VS = 'b8ip458tbjmg009m3bi0';
  static THINGSID_PROX_1 = '206878213'; // ALARM - Multirom 2 Proximity
  static THINGSID_PROX_1_VS = 'b8ip8omrtm9000cum3o0';
  static THINGSID_PROX_2 = '206855046'; // DØR - Multirom 1 Proximity
  static THINGSID_PROX_2_VS = 'b8ipdg6rtm9000cum3og';
  static THINGSID_TEMP_1 = '206847879'; // TEMP - Multirom 2 Temp
  static THINGSID_TEMP_1_VS = 'vs_temperature_1';

  private dtapi: DtApi;

  constructor(private http: Http) {
    this.dtapi = new DtApi(http);
  }

  private playSound(mp3file: string): void {
    console.log('Trying to play a rooster-sound');
    // if player exists - reuse it
    let player: any = document.getElementById('soundplayer');
    if ( ! player ) {
      player = document.createElement('audio');
      player.setAttribute('id', 'soundplayer');
    }
    player.setAttribute('src', '/app/sound/' + mp3file);
    console.log('Player set to play <audio src="' + player.getAttribute('src') + '"></audio>');
    player.play();
  }

  public startListen(thingsIdStr: string): void {
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

        if ( thingId === DtApiService.THINGSID_TOUCH_1 || thingId === DtApiService.THINGSID_TOUCH_1_VS ) {
          console.log('play lys_tone.pm3');
          this.playSound('lys_tone.mp3');
        } else if (thingId === DtApiService.THINGSID_TOUCH_2 || thingId === DtApiService.THINGSID_TOUCH_2_VS ) {
          console.log('play middels_tone.pm3');
          this.playSound('middels_tone.mp3');
        } else if ( thingId === DtApiService.THINGSID_TOUCH_3 || thingId === DtApiService.THINGSID_TOUCH_3_VS ) {
          console.log('play dyp_tone.pm3');
          this.playSound('dyp_tone.mp3');
        } else if ( thingId === DtApiService.THINGSID_PROX_1 || thingId === DtApiService.THINGSID_PROX_1_VS ) {
          if ( dt_tsc.object_present ) {
            console.log('No alarm as long as object is present, object_present = ' + dt_tsc.object_present);
          } else {
            console.log('play alarm.mp3 since object_present = ' + dt_tsc.object_present);
            this.playSound('alarm.mp3');
          }
        } else if ( thingId === DtApiService.THINGSID_PROX_2 || thingId === DtApiService.THINGSID_PROX_2_VS ) {
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
    this.dtapi.listenForEvents(callback, thingsIdStr);
  }

  public stopListen(): void {
    this.dtapi.stopListening();
  }


}
