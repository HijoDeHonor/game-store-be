import { USER_DONT_EXIST_ERROR } from "../../utils/textConstants.js";

export class UserDontExistError extends Error {
  constructor (message, entity) {
    super(message);
    this.name = USER_DONT_EXIST_ERROR;
    this.entity = entity;
  }
}