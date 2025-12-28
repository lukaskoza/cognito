import { LogEntry } from "@/modules/logger/types/LogEntry";
import env from "@/config/env";
import {
  CloudWatchLogsClient,
  CreateLogStreamCommand,
  PutLogEventsCommand,
  DescribeLogStreamsCommand,
} from "@aws-sdk/client-cloudwatch-logs";

class CloudwatchLogger {
  private client: CloudWatchLogsClient | null = null;
  private logGroupName: string = "";
  private logStreamName: string = "";
  private sequenceToken: string | undefined;
  private initialized: boolean = false;

  constructor() {
      if (env.CLOUDWATCH_ENABLED) {
        this.client = new CloudWatchLogsClient({
          region: env.AWS_REGION,
          credentials: {
            accessKeyId: env.AWS_ACCESS_KEY_ID,
            secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
          },
        });
        if (!env.CLOUDWATCH_LOG_GROUP) {
          throw new Error("CLOUDWATCH_LOG_GROUP is required");
        }
        this.logGroupName = env.CLOUDWATCH_LOG_GROUP;
        this.logStreamName = `app-${new Date().toISOString().split("T")[0]}`;
        console.log("☁️  CloudWatch logging enabled");
      }
  }

  private async ensureLogStream(): Promise<void> {
    if (this.initialized || !this.client) return;

    try {
      const describeResponse = await this.client.send(
        new DescribeLogStreamsCommand({
          logGroupName: this.logGroupName,
          logStreamNamePrefix: this.logStreamName,
        })
      );

      const existingStream = describeResponse.logStreams?.find(
        (stream) => stream.logStreamName === this.logStreamName
      );

      if (existingStream) {
        this.sequenceToken = existingStream.uploadSequenceToken;
      } else {
        await this.client.send(
          new CreateLogStreamCommand({
            logGroupName: this.logGroupName,
            logStreamName: this.logStreamName,
          })
        );
      }

      this.initialized = true;
    } catch (error) {
      console.error("Failed to initialize CloudWatch log stream:", error);
    }
  }

  async log(entry: LogEntry): Promise<void> {
    if (!env.CLOUDWATCH_ENABLED || !this.client) return;

    try {
      await this.ensureLogStream();

      const logMessage = JSON.stringify({
        level: entry.level,
        message: entry.message,
        timestamp: entry.timestamp.toISOString(),
        ...entry.context,
      });

      const response = await this.client.send(
        new PutLogEventsCommand({
          logGroupName: this.logGroupName,
          logStreamName: this.logStreamName,
          logEvents: [
            {
              timestamp: entry.timestamp.getTime(),
              message: logMessage,
            },
          ],
          sequenceToken: this.sequenceToken,
        })
      );

      this.sequenceToken = response.nextSequenceToken;
    } catch (error) {
      console.error("Failed to send log to CloudWatch:", error);
    }
  }
}

export const cloudwatchLogger = new CloudwatchLogger();
