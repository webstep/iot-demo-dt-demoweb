import {ErrorMessage} from './dt_errormessage';

export class EthernetStatus {
  macAddress: string;
  ipAddress: string;
  errors: ErrorMessage[];
  updateTime: string;
}
