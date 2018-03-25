import { forEachObjIndexed } from "ramda";

export class ServerError extends Error {
  constructor(message, data) {
    super(message);

    this.type = "SERVER_ERROR";
    this.data = data;

    Error.captureStackTrace(this, ServerError);
  }
}

export class ComputerVisionApiError extends Error {
  constructor(message, data) {
    super(message);

    this.type = "COMPUTER_VISION_API_ERROR";
    this.data = data;

    Error.captureStackTrace(this, ServerError);
  }
}
