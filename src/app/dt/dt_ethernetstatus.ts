import {ErrorMessage} from './dt_errormessage';

export class CellularStatus {
  signalStrength: number;
  mode: string;
  errors: ErrorMessage[];
  updateTime: string;
}
