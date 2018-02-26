import {NetworkStatus} from './dt_networkstatus';
import {BatteryStatus} from './dt_batterystatus';
import {Temperature} from './dt_temperature';
import {ObjectPresent} from './dt_objectpresent';
import {Touch} from './dt_touch';
import {ConnectionLatency} from './dt_connectionlatency';
import {EthernetStatus} from './dt_cellularstatus';
import {CellularStatus} from './dt_ethernetstatus';
import {ConnectionStatus} from './dt_connectionstatus';

export class Reported {
  type: string;
  networkStatus: NetworkStatus; // for sensors
  batteryStatus: BatteryStatus; // for sensors
  touch: Touch; // for all sensors and CloudConnector
  temperature: Temperature; // for sensors of type 'temperature'
  objectPresent: ObjectPresent; // for sensors of type 'proximity'

  // Only reported for CloudConnectors (type='ccon')
  connectionLatency: ConnectionLatency;
  ethernetStatus: EthernetStatus;
  cellularStatus: CellularStatus;
  connectionStatus: ConnectionStatus;
}
