import { LogEntry } from "@/modules/logger/types/LogEntry";
import { consoleLogger } from "@/modules/logger/services/loggers/ConsoleLogger";
import { cloudwatchLogger } from "./loggers/CloudwatchLogger";





class Logger {
  private async sendLog(entry: LogEntry): Promise<void> {
    consoleLogger.log(entry);
    await cloudwatchLogger.log(entry);
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.sendLog({ level: "INFO", message, timestamp: new Date(), context });
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.sendLog({ level: "WARN", message, timestamp: new Date(), context });
  }

  error(message: string, context?: Record<string, unknown>): void {
    this.sendLog({ level: "ERROR", message, timestamp: new Date(), context });
  }

  critical(message: string, context?: Record<string, unknown>): void {
    this.sendLog({ level: "CRITICAL", message, timestamp: new Date(), context });
  }
}

export const logger = new Logger();

