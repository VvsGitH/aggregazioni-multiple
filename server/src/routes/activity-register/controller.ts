import express from "express";
import { getRegisteredActivities } from "./service.js";
import { ApiResponse, ApiResponsePaginated } from "../../utils/ApiResponse.js";
import type { IFilterQuery } from "../../types/query.js";

const controller = express.Router();

controller.route("/").get((req, res) => {
  getRegisteredActivities(req.query as IFilterQuery)
    .then((result) => {
      if (result.pagination) {
        res.status(200).json(new ApiResponsePaginated(result.data, result.pagination));
      } else {
        res.status(200).json(new ApiResponse(result.data));
      }
    })
    .catch((err) => {
      res.status(err?.code || 500).json(new ApiResponse(null, err));
    });
});

export default controller;
