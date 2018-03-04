import { Headers, Http } from '@angular/http';
import { EventSourcePolyfill } from 'ng-event-source';
import { BASIC_AUTH, PROJECT_ID } from '../apikey';
import { Event, EventData } from './dt_streamresult';

const API_PROTO = 'https://';
const API_URL = 'api.disruptive-technologies.com/v2beta1/projects/';
const API_URL_VS = 'api.disruptive-technologies.com/emulator/v2beta1/projects/';
const API_DEVICES = '/devices?';
const API_DEVICE = '/devices/';
const API_STREAM = '/devices:stream?';

const API_PUBLISH = ':publish';
const FILTER_LABEL_VS = 'label_filters=virtual-sensor'; // checks for the presence of the label "virtual-sensor"

const DEVICE_URL = API_PROTO + API_URL + PROJECT_ID + API_DEVICE;
const STREAM_URL = API_PROTO + API_URL + PROJECT_ID  + API_STREAM;


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
    return this.http.get(url, {headers: this.getHeadersAuth()})
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
    this.es = new EventSourcePolyfill(url, this.getEventSourceInitDict() );
    DtApi.IS_LISTENING = true;
    DtApi.SHOW_LISTENING = true;
    console.log('Starting listening on sensors');

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
      const strA = JSON.stringify(a, null, ' ');
      console.log('onOpen\n:' + strA);
    };

    this.es.onerror = (e) => {
      const strErr = JSON.stringify(e, null, ' ');
      // console.log('Got error from eventsource:\n' + strErr);
    };

  }

  public stopListening(): void {
    DtApi.SHOW_LISTENING = false;
    console.log('Skipping listening on sensors (SHOW_LISTENING set to FALSE)');
  }

  private getEventSourceInitDict() {
    const timeOut = 30 * 60 * 1000;
    return {
      withCredentials: false,
      headers: { 'Authorization': BASIC_AUTH },
      errorOnTimeout: false,
      heartbeatTimeout: timeOut,
      checkActivity: false,
      connectionTimeout: timeOut
    };
  }

  private getHeadersAuth() {
    const headers = new Headers();
    headers.append('Authorization', BASIC_AUTH);
    return headers;
  }

  public getDeviceId(targetName: string) {
    const replaceMe = 'projects/' + PROJECT_ID + '/devices/';
    return targetName.replace(replaceMe, '');
  }

}
