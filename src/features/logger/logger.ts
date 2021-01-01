import { ConsoleChannel } from './channels/ConsoleChannel';
import { OutputChannel } from './OutputChannel';

type logType = 'info' | 'warning' | 'error' | 'debug';

export class Logger {
  constructor(private readonly channels: OutputChannel[]) {}

  private log(message: string, type: logType): void {
    const logMessage = this.format(message, type);
    this.channels.forEach((channel) => channel.log(logMessage));
  }

  public format(message: string, type: logType): string {
    return `[${type}] ${message}`;
  }

  public info(...messages: string[]): void {
    this.log(messages.join(' '), 'info');
  }

  public warning(...messages: string[]): void {
    this.log(messages.join(' '), 'warning');
  }

  public error(...messages: string[]): void {
    this.log(messages.join(' '), 'error');
  }

  public debug(...messages: string[]): void {
    this.log(messages.join(' '), 'debug');
  }

  public getChannels(): OutputChannel[] {
    return this.channels;
  }
}

export const logger = new Logger([new ConsoleChannel()]);
