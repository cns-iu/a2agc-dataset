import { Runtime, View, ViewOptions } from 'vega';
import { DataHandler, DataHandlerType } from './data-handler';


export class DataHandlerView extends View {
  static readonly HANDLER_TYPES: DataHandlerType[] = [];

  static withDataHandlers(handlerTypes: DataHandlerType[]): typeof DataHandlerView {
    const superHandlerTypes = this.HANDLER_TYPES;

    return class extends this {
      static readonly HANDLER_TYPES = superHandlerTypes.concat(handlerTypes);
    };
  }

  readonly handlers: DataHandler[];

  constructor(runtime: Runtime, options: ViewOptions) {
    super(runtime, options);

    const constructor = this.constructor as typeof DataHandlerView;
    const handlerTypes = constructor.HANDLER_TYPES;
    this.handlers = handlerTypes.map(type => new type(this));
  }

  finalize(): this {
    this.handlers.forEach(handler => handler.finalize?.());
    return super.finalize();
  }
}
