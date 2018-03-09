/**
 * Models used by Disruptive Technologies REST-API
 * JSON
 */

export class Touch {
  updateTime: string;
}

export class Temperature {
  value: number;
  updateTime: string;
}

export class ObjectPresent {
  state: string;
  updateTime: string;
}

export class CloudConnector {
  id: string;
  signalStrength: number;
}

export class ErrorMessage {
  code: string;
  message: string;
}

export class ConnectionLatency {
  avgLatencyMillis: number;
  minLatencyMillis: number;
  maxLatencyMillis: number;
  updateTime: string;
}

export class BatteryStatus {
  percentage: number;
  updateTime: string;
}

export class EthernetStatus {
  macAddress: string;
  ipAddress: string;
  errors: ErrorMessage[];
  updateTime: string;
}

export class CellularStatus {
  signalStrength: number;
  mode: string;
  errors: ErrorMessage[];
  updateTime: string;
}

export class ConnectionStatus {
  connection: string;
  available: [string];
  updateTime: string;
}

export class NetworkStatus {
  signalStrength: number;
  updateTime: string;
  cloudConnectors: CloudConnector[];
  transmissionMode: string;
}

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

export class Device {
  name: string;
  sensorId: string;
  type: string;
  labels: [string[]];
  reported: Reported;
  unit: string;
}

export class DeviceList {
  devices: Device[];
}
