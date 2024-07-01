import { ALREADY_EXIST_ERROR } from "../../utils/textConstants.js";

export class AlreadyExistError extends Error {
  constructor (message, entity) {
    super(message); // Call the base class constructor
    this.name = ALREADY_EXIST_ERROR; // Assign error name
    this.entity = entity; // Assign entity if relevant
  }
}
