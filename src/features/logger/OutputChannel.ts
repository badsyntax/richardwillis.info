import { LogType } from './types';

export interface OutputChannel {
  log: (output: string, type: LogType) => void;
}
