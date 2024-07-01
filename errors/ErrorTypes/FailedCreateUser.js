import { FALIED_CREATE_USER } from "../../utils/textConstants.js";

export class FailedCreateUserError extends Error {
  constructor (message, entity, error = null) {
    super(message);
    this.name = FALIED_CREATE_USER;
    this.entity = entity;
    this.innerError = error;
  }
}