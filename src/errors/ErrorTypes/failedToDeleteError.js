import { FAILED_DELETE_ERROR } from '../../utils/textConstants.js';

export class FailedToDeleteError extends Error {
  constructor (message, entity) {
    super(message);
    this.name = FAILED_DELETE_ERROR;
    this.entity = entity;
  }
}
