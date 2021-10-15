import { View } from 'vega';


export interface DataHandler {
  finalize?(): void;
}

export type DataHandlerType = new (view: View) => DataHandler;
