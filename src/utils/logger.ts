import * as vscode from 'vscode';

/**
 * Log levels for the logger
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

/**
 * Logger utility for VSCode extensions
 */
export class Logger {
  private outputChannel: vscode.OutputChannel;
  private logLevel: LogLevel;

  constructor(channelName: string, logLevel: LogLevel = LogLevel.INFO) {
    this.outputChannel = vscode.window.createOutputChannel(channelName);
    this.logLevel = logLevel;
  }

  /**
   * Set the minimum log level
   */
  setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  /**
   * Show the output channel
   */
  show(): void {
    this.outputChannel.show();
  }

  /**
   * Log a debug message
   */
  debug(message: string, ...args: any[]): void {
    if (this.logLevel <= LogLevel.DEBUG) {
      this.log('DEBUG', message, ...args);
    }
  }

  /**
   * Log an info message
   */
  info(message: string, ...args: any[]): void {
    if (this.logLevel <= LogLevel.INFO) {
      this.log('INFO', message, ...args);
    }
  }

  /**
   * Log a warning message
   */
  warn(message: string, ...args: any[]): void {
    if (this.logLevel <= LogLevel.WARN) {
      this.log('WARN', message, ...args);
    }
  }

  /**
   * Log an error message
   */
  error(message: string, error?: Error, ...args: any[]): void {
    if (this.logLevel <= LogLevel.ERROR) {
      const errorMsg = error ? `${message}: ${error.message}\n${error.stack}` : message;
      this.log('ERROR', errorMsg, ...args);
    }
  }

  /**
   * Internal log method
   */
  private log(level: string, message: string, ...args: any[]): void {
    const timestamp = new Date().toISOString();
    const formattedArgs = args.length > 0 ? ` ${JSON.stringify(args)}` : '';
    this.outputChannel.appendLine(`[${timestamp}] [${level}] ${message}${formattedArgs}`);
  }

  /**
   * Dispose of the output channel
   */
  dispose(): void {
    this.outputChannel.dispose();
  }
}
