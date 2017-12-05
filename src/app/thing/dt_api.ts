import { Headers, Http } from '@angular/http';
import { API_KEY } from '../apikey';
import { DTWatchThing } from './dt_watchthing';
const baseUrl = 'https://api.disruptive-technologies.com/v1/';
const thingsUrl = baseUrl + 'things/';
const subscribeUrl = baseUrl + 'subscribe';

export class DtApi {
  private static IS_LISTENING = false;
  private static SHOW_LISTENING = true;
  private apiKey: string = API_KEY;
  private http: Http;
  private es: EventSource;

  constructor (http: Http) {
    this.http = http;
  }

  public getThingById(thingId: string): any {
    const url = thingsUrl + thingId;
    return this.http.get(url, {headers: this.getHeaders(this.apiKey)})
      .map(res => res.json());
  }

  public getAggregatedThingsById(thingId: string, postParams: string): any {
    const url = thingsUrl + thingId + '/aggregate';
    return this.http.post(url, postParams, {headers: this.getHeaders(this.apiKey)})
      .map(res => res.json());
  }

  public listenForEvents(callback: (response: DTWatchThing) => void, strThingIds: string): void {

    if (DtApi.IS_LISTENING) {
      DtApi.SHOW_LISTENING = true;
      console.log('ReStarting listening on sensors (SHOW_LISTENING set to TRUE)');
    } else {
      this.es = new EventSource(subscribeUrl + '?apikey=' + this.apiKey + '&event_types=ThingStateChanged' + strThingIds);
      DtApi.IS_LISTENING = true;
      DtApi.SHOW_LISTENING = true;
      console.log('Starting listening on sensors ' + strThingIds);
    }

    this.es.onmessage = function (response) {
      if (DtApi.SHOW_LISTENING) {
        let watchThing: DTWatchThing;
        const data = response.data;
        const json = JSON.parse(data);
        watchThing = json['result'];
        callback(watchThing);
      } else {
        console.log('Skipping listening on EventSource');
      }
    };
    this.es.onerror = function () {
      console.error('Got error from eventsource:');
    };
  };

  public stopListening(): void {
    DtApi.SHOW_LISTENING = false;
    console.log('Skipping listening on sensors (SHOW_LISTENING set to FALSE)');
  }

  private getHeaders(key: string) {
    const headers = new Headers();
    headers.append('accept', 'application/json');
    headers.append('authorization', 'ApiKey ' + key);
    headers.append('cache-control', 'no-cache');
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

}
