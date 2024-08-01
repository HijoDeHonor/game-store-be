import { FAILED_COMPLETING_ERROR } from '../../utils/textConstants.js';

export class FailedCompletingError extends Error {
  constructor (message, entity, error = null) {
    super(`${message}: ${entity}`);
    this.name = FAILED_COMPLETING_ERROR;
    this.entity = entity;
    this.innerError = error;
  }
}
