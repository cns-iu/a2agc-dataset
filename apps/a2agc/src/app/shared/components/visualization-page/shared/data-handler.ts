import { View } from 'vega';


/**
 * Data handler interface with finalize function
 */
export interface DataHandler {
  /** Finalizes */
  finalize?(): void;
}

export type DataHandlerType = new (view: View) => DataHandler;
