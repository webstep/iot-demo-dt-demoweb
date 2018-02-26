import { Headers, Http } from '@angular/http';
import { EventSourcePolyfill } from 'ng-event-source';
import { BASIC_AUTH, PROJECT_ID } from '../apikey';
import { Event, EventData } from './dt_streamresult';

const API_URL = 'https://api.disruptive-technologies.com/v2beta1/projects/';
const API_URL_VS = 'https://api.disruptive-technologies.com/emulator/v2beta1/projects/';
const API_DEVICES = '/devices?';
const API_DEVICE = '/devices/';
const API_STREAM = 'devices:stream?';

const API_PUBLISH = ':publish';
const FILTER_LABEL_VS = 'label_filters=virtual-sensor'; // checks for the presence of the label "virtual-sensor"

const DEVICE_URL = API_URL + PROJECT_ID + API_DEVICE;
const STREAM_URL = API_URL + PROJECT_ID  + '/' + API_STREAM;


export class DtApi {
  private static IS_LISTENING = false;
  private static SHOW_LISTENING = true;
  private http: Http;
  private es: EventSourcePolyfill;

  constructor (http: Http) {
    this.http = http;
  }

  public getDevice(device_id: string): any {
    const url = DEVICE_URL + device_id;
    return this.http.get(url, {headers: this.getHeaders()})
      .map(res => res.json());
  }

  public listenForEvents(callback: (response: Event) => void, device_ids: string): void {

    const event_types = '' +
      'event_types=objectPresent' +
      '&event_types=touch' +
      '&event_types=temperature';

    const device_types = '' +
      'device_types=proximity' +
      '&device_types=touch' +
      '&device_types=temperature';

    const url = STREAM_URL + event_types + '&' + device_types + '&' + device_ids;
    this.es = new EventSourcePolyfill(url, {headers: { Authorization: BASIC_AUTH }});
    DtApi.IS_LISTENING = true;
    DtApi.SHOW_LISTENING = true;
    console.log('Starting listening on sensors ' + device_ids);

    this.es.onmessage = (response) => {
      if (DtApi.SHOW_LISTENING) {
        const jsonData = JSON.parse(response['data']);
        const event: Event = jsonData.result.event;
        callback(event);
      } else {
        console.log('Skipping listening on EventSource');
      }
    };

    this.es.onopen = (a) => {
      console.log('Something happened', a);
    };

    this.es.onerror = (e) => {
      console.error('Got error from eventsource:', e);
    };

  }

  public stopListening(): void {
    DtApi.SHOW_LISTENING = false;
    console.log('Skipping listening on sensors (SHOW_LISTENING set to FALSE)');
  }

  private getHeaders() {
    const headers = new Headers();
    headers.append('Authorization', BASIC_AUTH);
    return headers;
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

  public getDeviceId(targetName: string) {
    const replaceMe = 'projects/' + PROJECT_ID + '/devices/';
    return targetName.replace(replaceMe, '');
  }

}
