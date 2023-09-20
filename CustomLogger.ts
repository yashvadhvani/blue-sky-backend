import {
  Logger,
  QueryRunner,
  AdvancedConsoleLogger,
  LoggerOptions,
} from 'typeorm';

export class CustomLogger extends AdvancedConsoleLogger implements Logger {
  constructor(options?: LoggerOptions) {
    super(options);
  }

  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
    let logText = query;
    if (logText.length > 100)
      // Truncate the log text if it's too long:
      logText = logText.substring(0, 10) + '...';
    super.logQuery(logText, parameters, queryRunner);
  }
}
