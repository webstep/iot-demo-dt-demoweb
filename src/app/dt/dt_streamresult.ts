import {NetworkStatus} from './dt_networkstatus';
import {BatteryStatus} from './dt_batterystatus';
import {Temperature} from './dt_temperature';
import {ObjectPresent} from './dt_objectpresent';
import {Touch} from './dt_touch';
import {ConnectionStatus} from './dt_connectionstatus';

export class EventData {
  type: string;
  temperature: Temperature;
  batteryStatus: BatteryStatus;
  networkStatus: NetworkStatus;
  objectPresent: ObjectPresent;
  touch: Touch;
  connectionStatus: ConnectionStatus;
}

export class Event {
  eventid: string;
  targetName: string;
  eventType: string;
  data: EventData;
  timestamp: string;
}
