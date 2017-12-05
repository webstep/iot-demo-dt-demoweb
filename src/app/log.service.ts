import { Injectable } from '@angular/core';

const LOGLEVEL_FATAL = 1;
const LOGLEVEL_ERROR = 2;
const LOGLEVEL_INFO  = 3;
const LOGLEVEL_DEBUG = 4;
const LOGLEVEL_TRACE = 5;


@Injectable()
export class LogService {
  private static logLevel: number  = LOGLEVEL_DEBUG;

  public static info(): boolean {
    return LogService.logLevel >= LOGLEVEL_INFO;
  }
  public static trace(): boolean {
    return LogService.logLevel >= LOGLEVEL_TRACE;
  }
  public static debug(): boolean {
    return LogService.logLevel >= LOGLEVEL_DEBUG;
  }
  public static error(): boolean {
    return LogService.logLevel >= LOGLEVEL_ERROR;
  }
  public fatal(): boolean {
    return LogService.logLevel >= LOGLEVEL_FATAL;
  }
  public setLogLevel(newLogLevel: number): void {
    if (newLogLevel === LOGLEVEL_INFO) {
      LogService.logLevel = LOGLEVEL_INFO;
    } else if (newLogLevel === LOGLEVEL_DEBUG) {
      LogService.logLevel = LOGLEVEL_DEBUG;
    } else if (newLogLevel === LOGLEVEL_ERROR) {
      LogService.logLevel = LOGLEVEL_ERROR;
    } else if (newLogLevel === LOGLEVEL_FATAL) {
      LogService.logLevel = LOGLEVEL_FATAL;
    } else if (newLogLevel === LOGLEVEL_TRACE) {
      LogService.logLevel = LOGLEVEL_TRACE;
    } else {
      console.log('Unknown logLevel "' + newLogLevel + '"');
    }
  }

}
