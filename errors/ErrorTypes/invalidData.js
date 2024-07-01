import { INVALID_DATA_ERROR } from "../../utils/textConstants.js";

export class InvalidDataError extends Error {
  constructor (message, entity) {
    super(message); // Call the base class constructor
    this.name = INVALID_DATA_ERROR; // Assign error name
    this.entity = entity; // Assign entity if relevant
  }
}
