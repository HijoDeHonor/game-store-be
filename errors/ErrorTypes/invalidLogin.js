import { INVALID_LOGIN_ERROR } from "../../utils/textConstants.js";

export class InvalidLoginError extends Error {
  constructor (message, entity) {
    super(message);
    this.name = INVALID_LOGIN_ERROR;
    this.entity = entity;
  }
}