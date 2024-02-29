import { getValue, setValue } from "../../utils/objects.js";
import { ApiError } from "../../utils/ApiError.js";
import type { IFilterQuery } from "../../types/query.js";
import type { IRegisteredActivity } from "./types.js";
import type { TPaginationInfo } from "../../types/pagination.js";

import db from "./mock-simple.json" assert { type: "json" };

/**
 * Return the list of registered activities
 * @param filter
 * @returns
 */
export async function getRegisteredActivities(
  filter: IFilterQuery
): Promise<{ data: IRegisteredActivity[]; pagination?: TPaginationInfo }> {
  let dbData: IRegisteredActivity[] = await Promise.resolve(db.data);
  let pagination: TPaginationInfo | undefined = undefined;

  if (filter.groupBy) {
    const groupBy = Array.isArray(filter.groupBy) ? filter.groupBy : [filter.groupBy];
    dbData = groupActivities(dbData, groupBy);
  }
  if (filter.orderBy) {
    dbData = sortActivities(dbData, filter.orderBy, filter.orderDir);
  }
  if (filter.limit) {
    pagination = {
      count: dbData.length,
      offset: Number(filter.offset || 0),
      limit: Number(filter.limit),
    };
    dbData = paginateActivities(dbData, Number(filter.limit), Number(filter.offset || 0));
  }

  return { data: dbData, pagination: pagination };
}

/**
 * Group activities by a number of fields.
 * Use a O(n) algorithm with a dictionary
 * @param activities
 * @param groupBy
 * @returns
 */
function groupActivities(activities: IRegisteredActivity[], groupBy: string[]): IRegisteredActivity[] {
  // Creating a dictionary of groups. The key is the concatenation of the values to group by; the value is sum of the hours.
  const groupsDict: Record<string, number> = {};
  for (const activity of activities) {
    if (!activity) continue;
    const key = groupBy.reduce((str, field) => {
      const value = getValue(activity, field);
      if (value != null) {
        if (typeof value == "object") {
          throw new ApiError(`Invalid groupBy field ${groupBy}. This field contains a nested object.`, 400);
        }
        str += `${value};`;
      } else {
        str = ""; // skip activities with null values in the key
      }
      return str;
    }, "");
    if (key) {
      groupsDict[key] = (groupsDict[key] || 0) + (activity.hours || 0);
    }
  }

  // Transforming the dictionary in an array
  const groupsArray = Object.entries(groupsDict);
  const aggregatedData: IRegisteredActivity[] = [];
  for (let i = 0; i < groupsArray.length; i++) {
    const [key, value] = groupsArray[i]!;
    const fieldValues = key.split(";");
    let groupedActivity: IRegisteredActivity = {
      id: i,
      hours: value,
      project: null,
      employee: null,
      date: null,
    };
    groupBy.forEach((field, i) => {
      setValue(groupedActivity, field, fieldValues[i]);
    });
    aggregatedData[i] = groupedActivity;
  }

  return aggregatedData;
}

/**
 * Group activities by a number of fields.
 * Use a O(kn) algorithm with nested loops
 * @param activities
 * @param groupBy
 * @returns
 */
function groupActivitiesPolinomial(
  activities: IRegisteredActivity[],
  groupBy: string[]
): IRegisteredActivity[] {
  const aggregatedData: IRegisteredActivity[] = [];
  for (let i = 0; i < activities.length; i++) {
    const activity = activities[i];
    if (!activity) continue;
    const group = aggregatedData.find((el) => {
      for (const groupByField of groupBy) {
        if (getValue(el, groupByField) != getValue(activity, groupByField)) {
          return false;
        }
      }
      return true;
    });
    if (group) {
      group.hours += activity.hours || 0;
    } else {
      let newGroup: IRegisteredActivity = {
        id: i,
        hours: activity.hours || 0,
        project: null,
        employee: null,
        date: null,
      };
      groupBy.forEach((field) => {
        setValue(newGroup, field, getValue(activity, field));
      });
      aggregatedData.push(newGroup);
    }
  }
  return aggregatedData;
}

/**
 * Sort activities by the value of a field
 * @param activities
 * @param orderBy
 * @param orderDir
 * @returns
 */
function sortActivities(
  activities: IRegisteredActivity[],
  orderBy: string,
  orderDir?: "asc" | "desc"
): IRegisteredActivity[] {
  const orderDirMult = orderDir === "desc" ? -1 : 1;

  return activities.sort((a, b) => {
    const valueA = getValue(a, orderBy);
    const valueB = getValue(b, orderBy);

    if (valueA == null || valueB == null) return 0;
    if (typeof valueA == "object") {
      throw new ApiError(`Invalid orderBy field ${orderBy}. This field contains a nested object.`, 400);
    }

    if (valueA < valueB) return -orderDirMult;
    else if (valueA > valueB) return orderDirMult;
    return 0;
  });
}

/**
 * Sort activities by the value of multiple fields
 * @param activities
 * @param orderBy
 * @param orderDir
 * @returns
 */
function sortActivities2Mult(
  activities: IRegisteredActivity[],
  orderBy: string[],
  orderDir?: "asc" | "desc"
): IRegisteredActivity[] {
  const orderDirMult = orderDir === "desc" ? -1 : 1;

  const sortByField = (a: IRegisteredActivity, b: IRegisteredActivity, byIndx: number = 0): number => {
    const by = orderBy[byIndx];
    if (!by) return 0;

    const valueA = getValue(a, by);
    const valueB = getValue(b, by);

    if (valueA == null || valueB == null) return sortByField(a, b, byIndx + 1);
    if (typeof valueA == "object") {
      throw new ApiError(`Invalid orderBy field ${orderBy}. This field contains a nested object.`, 400);
    }

    if (valueA < valueB) return -orderDirMult;
    else if (valueA > valueB) return orderDirMult;
    return sortByField(a, b, byIndx + 1);
  };

  return activities.sort((a, b) => sortByField(a, b, 0));
}

/**
 * Slice the array of activities
 * @param activities
 * @param limit
 * @param offset
 * @returns
 */
function paginateActivities(
  activities: IRegisteredActivity[],
  limit: number,
  offset: number
): IRegisteredActivity[] {
  if (isNaN(offset + limit)) return activities;

  const startIndex = Math.min(offset, activities.length - 1);
  const maxIndex = Math.min(offset + limit, activities.length);

  let paginated: IRegisteredActivity[] = [];
  for (let i = startIndex; i < maxIndex; i++) {
    paginated[i - offset] = activities[i]!;
  }
  return paginated;
}
