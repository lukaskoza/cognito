import { LogEntry } from "@/modules/logger/types/LogEntry";
import { COLORS } from "@/modules/logger/enums/Colors";


class ConsoleLogger {
  private formatLocalLog(entry: LogEntry): string {
    const color = COLORS[entry.level];
    const time = entry.timestamp.toISOString().split("T")[1].slice(0, 8);
    const ctx = entry.context ? ` ${JSON.stringify(entry.context)}` : "";
    return `${color}[${time}] ${entry.level}${COLORS.RESET} ${entry.message}${ctx}`;
  }

  public log(entry: LogEntry): void {
    const formatted = this.formatLocalLog(entry);
    switch (entry.level) {
      case "ERROR":
      case "CRITICAL":
        console.error(formatted);
        break;
      case "WARN":
        console.warn(formatted);
        break;
      default:
        console.log(formatted);
    }
  }
}

export const consoleLogger = new ConsoleLogger();
