import { OutputChannel } from '../OutputChannel';
import { LogType } from '../types';

export class ConsoleChannel implements OutputChannel {
  log(output: string, type: LogType): void {
    console.log(output);
  }
}
