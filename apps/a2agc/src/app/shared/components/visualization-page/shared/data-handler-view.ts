import { Runtime, View, ViewOptions } from 'vega';
import { DataHandler, DataHandlerType } from './data-handler';


/**
 * Data handler view
 */
export class DataHandlerView extends View {
  /** Data handler types */
  static readonly HANDLER_TYPES: DataHandlerType[] = [];

  /**
   * Adds data handlers
   * @param handlerTypes handler types
   * @returns data handler view with data handlers
   */
  static withDataHandlers(handlerTypes: DataHandlerType[]): typeof DataHandlerView {
    const superHandlerTypes = this.HANDLER_TYPES;

    return class extends this {
      static readonly HANDLER_TYPES = superHandlerTypes.concat(handlerTypes);
    };
  }

  /** Data handlers */
  readonly handlers: DataHandler[];

  /**
   * Creates an instance of data handler view.
   * @param runtime runtime
   * @param options view options
   */
  constructor(runtime: Runtime, options: ViewOptions) {
    super(runtime, options);

    const constructor = this.constructor as typeof DataHandlerView;
    const handlerTypes = constructor.HANDLER_TYPES;
    this.handlers = handlerTypes.map(type => new type(this));
  }

  /**
   * Finalizes data handlers
   */
  finalize(): this {
    this.handlers.forEach(handler => handler.finalize?.());
    return super.finalize();
  }
}
