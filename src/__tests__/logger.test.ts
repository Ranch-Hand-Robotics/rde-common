import { Logger, LogLevel } from '../utils/logger';

describe('Logger', () => {
  let logger: Logger;

  beforeEach(() => {
    logger = new Logger('Test Channel');
  });

  it('should create a logger instance', () => {
    expect(logger).toBeDefined();
  });

  it('should set log level', () => {
    expect(() => logger.setLogLevel(LogLevel.DEBUG)).not.toThrow();
    expect(() => logger.setLogLevel(LogLevel.INFO)).not.toThrow();
    expect(() => logger.setLogLevel(LogLevel.WARN)).not.toThrow();
    expect(() => logger.setLogLevel(LogLevel.ERROR)).not.toThrow();
  });

  it('should log messages without throwing', () => {
    expect(() => logger.debug('Debug message')).not.toThrow();
    expect(() => logger.info('Info message')).not.toThrow();
    expect(() => logger.warn('Warning message')).not.toThrow();
    expect(() => logger.error('Error message')).not.toThrow();
  });

  it('should log error with Error object', () => {
    const error = new Error('Test error');
    expect(() => logger.error('Error occurred', error)).not.toThrow();
  });

  it('should show output channel', () => {
    expect(() => logger.show()).not.toThrow();
  });

  it('should dispose output channel', () => {
    expect(() => logger.dispose()).not.toThrow();
  });
});

