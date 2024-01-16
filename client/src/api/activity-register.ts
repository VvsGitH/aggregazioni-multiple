import { axiosBase } from "./axios";
import { IApiResponse, IFilterQuery, IRegisteredActivity } from "../types";

export async function getActivities(filter?: IFilterQuery) {
  const res = await axiosBase.get<IApiResponse<IRegisteredActivity[]>>(`/activity-register`, {
    params: filter
  });
  return res.data;
}
