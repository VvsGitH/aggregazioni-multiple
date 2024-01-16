/**
 * Default error response of all apis
 */
export class ApiError extends Error {
  code: number;
  message: string;

  constructor(message: string, code: number) {
    super(message);
    this.code = code;
    this.message = message;
  }
}
