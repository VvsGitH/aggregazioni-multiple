import express from "express";
import { STATUS_CODES } from "http";
import activityRegisterController from "./activity-register/controller.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const router = express.Router();

router.use("/activity-register", activityRegisterController);

// 404 route
router.all("*", (_req, res) =>
  res.status(404).json(new ApiResponse(null, new ApiError(STATUS_CODES[404]!, 404)))
);

export default router;
