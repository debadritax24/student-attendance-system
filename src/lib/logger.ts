import pino, { DestinationStream } from "pino";

const level = process.env.LOG_LEVEL || (process.env.NODE_ENV === "production" ? "info" : "debug");

let stream: DestinationStream | undefined;

if (process.env.NODE_ENV !== "production") {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pretty = require("pino-pretty");
    stream = pretty({
      colorize: true,
      translateTime: "SYS:standard",
      ignore: "pid,hostname",
    });
  } catch {
    // Fall back to default standard stream
  }
}

const logger = stream
  ? pino(
      {
        level,
        serializers: {
          err: pino.stdSerializers.err,
          req: pino.stdSerializers.req,
          res: pino.stdSerializers.res,
        },
      },
      stream
    )
  : pino({
      level,
      serializers: {
        err: pino.stdSerializers.err,
        req: pino.stdSerializers.req,
        res: pino.stdSerializers.res,
      },
    });

export default logger;

