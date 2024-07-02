import { USER_DOES_NOT_EXIST_ERROR } from "../../utils/textConstants.js";

export class UserDoesNotExistError extends Error {
  constructor (message, entity) {
    super(message);
    this.name = USER_DOES_NOT_EXIST_ERROR;
    this.entity = entity;
  }
}
