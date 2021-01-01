import { OutputChannel } from '../OutputChannel';

export class ConsoleChannel implements OutputChannel {
  log(output: string): void {
    console.log(output);
  }
}
