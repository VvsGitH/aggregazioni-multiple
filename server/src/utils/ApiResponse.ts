import { STATUS_CODES } from "http";
import { ApiError } from "./ApiError.js";
import type { TPaginationInfo } from "../types/pagination.js";

/**
 * Base response of all apis
 */
export class ApiResponse<T> {
  success: boolean = false;
  data: T | null = null;
  meta?: Record<string, unknown>;
  error: ApiError | null = null;

  constructor(data: T | null, error?: ApiError | Error | unknown) {
    this.data = data;
    if (error != null) {
      this.setError(error);
    }
    this.success = error == null;
  }

  setError(error: ApiError | Error | unknown) {
    if (error instanceof ApiError) {
      this.error = error;
    } else if (error instanceof Error) {
      this.error = new ApiError(error.message, 500);
    } else {
      this.error = new ApiError(STATUS_CODES[500] || "Unknown server error", 500);
    }
  }
}

/**
 * Response of all apis with paginated data
 */
export class ApiResponsePaginated<T> extends ApiResponse<T> {
  meta: {
    pagination: TPaginationInfo;
  };

  constructor(data: T | null, pagination: TPaginationInfo, error?: ApiError | Error | unknown) {
    super(data, error);
    this.meta = { pagination };
  }
}
