import { SQLERROR } from "../../utils/textConstants.js";

export class SQLError extends Error {
  constructor (error, query, parameters) {
    super(message); // Call the base class constructor
    this.name = SQLERROR;
    this.stack = error.stack;
    this.query = query;
    this.parameters = parameters;
  }
}
