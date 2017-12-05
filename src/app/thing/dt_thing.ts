import {DTThingState} from './dt_thingstate';
import {DTThingType} from './dt_thingtype';

export class DTThing {
  id: string;
  name: string;
  description: string;
  starred: boolean;
  registered: string;
  last_updated: string;
  state: DTThingState;
  type: DTThingType;
  firmware: string;
}
