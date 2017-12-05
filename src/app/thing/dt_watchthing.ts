import {DTThingStateChange} from './dt_thingstatechange';

export class DTWatchThing {
  thing_id: string;
  event_type: string;
  version: string;
  timestamp: string;
  state_changed: DTThingStateChange;
}
