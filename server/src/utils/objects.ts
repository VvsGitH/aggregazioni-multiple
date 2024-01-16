/**
 * Get the value of a field deep inside an object
 * @param obj
 * @param path the path to the field to get the value from, in the format a.b.c.d
 * @returns the value
 */
export function getValue(obj: unknown, path: string): unknown | undefined {
  if (obj == null || typeof obj != "object" || path == null) return undefined;
  const fields = path.split(".");
  let value: any = obj;
  for (const field of fields) {
    if (value != null && typeof value == "object") {
      value = value[field];
    } else {
      return undefined;
    }
  }
  return value;
}

/**
 * Set the value of a field deep inside an object
 * @param obj
 * @param path the path to the field to set, in the format a.b.c.d
 * @param value the desired value of the field
 */
export function setValue(obj: unknown, path: string, value: unknown): void {
  if (obj == null || typeof obj != "object" || path == null) return undefined;
  const fields = path.split(".");
  let curr: any = obj;
  for (let i = 0; i < fields.length; i++) {
    const field = fields[i];
    if (!field) continue;
    if (i < fields.length - 1) {
      if (curr[field] == null) {
        curr[field] = {};
      } else if (typeof curr[field] != "object") {
        throw new Error(`setValue is trying to access ${field} propery of a primitive value`);
      }
      curr = curr[field];
    } else {
      curr[field] = value;
    }
  }
}
