import { forEachObjIndexed } from "ramda";

export class ServerError extends Error {
  constructor(message, data) {
    super(message);

    this.type = "SERVER_ERROR";
    this.data = data;

    Error.captureStackTrace(this, ServerError);
  }
}
