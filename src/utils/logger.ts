import logger from "pino";
import pretty from "pino-pretty";
import dayjs from "dayjs";

const stream = pretty({
  colorize: true,
});

const log = logger(stream);

export default log;
