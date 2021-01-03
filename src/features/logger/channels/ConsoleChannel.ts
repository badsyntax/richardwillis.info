import { OutputChannel } from '../OutputChannel';
import { LogType } from '../types';

function getConsoleLogger(type: LogType) {
  switch (type) {
    case LogType.debug:
      return console.debug;
    case LogType.error:
      return console.error;
    case LogType.warn:
      return console.warn;
    case LogType.info:
    default:
      return console.log;
  }
}

export class ConsoleChannel implements OutputChannel {
  log(output: string, type: LogType): void {
    getConsoleLogger(type)(output);
  }
}
