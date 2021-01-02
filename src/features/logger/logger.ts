import { ConsoleChannel } from './channels/ConsoleChannel';
import { OutputChannel } from './OutputChannel';
import { LogType } from './types';

export class Logger {
  constructor(private readonly channels: OutputChannel[]) {}

  public info(...messages: string[]): void {
    this.log(messages.join(' '), LogType.info);
  }

  public warn(...messages: string[]): void {
    this.log(messages.join(' '), LogType.warn);
  }

  public error(...messages: string[]): void {
    this.log(messages.join(' '), LogType.error);
  }

  public debug(...messages: string[]): void {
    this.log(messages.join(' '), LogType.debug);
  }

  public getChannels(): OutputChannel[] {
    return this.channels;
  }

  private log(message: string, type: LogType): void {
    const logMessage = this.format(message, type);
    this.channels.forEach((channel) => channel.log(logMessage, type));
  }

  private format(message: string, type: LogType): string {
    return `[${type}] ${message}`;
  }
}

export const logger = new Logger([new ConsoleChannel()]);
