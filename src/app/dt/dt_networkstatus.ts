import {CloudConnector} from './dt_cloudconnector';

export class NetworkStatus {
  signalStrength: number;
  updateTime: string;
  cloudConnectors: CloudConnector[];
  transmissionMode: string;
}
