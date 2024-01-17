/**
 * Format a Date object as dd Mon yyyy
 */
const dateFormatter = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" });

/**
 * Parse a date string and return a formatted date
 * @param date
 * @returns
 */
export function formatDate(date: string): string {
  if (!date) return "";
  const timestamp = Date.parse(date);
  if (isNaN(timestamp)) return date; // Invalid date format: returning the provided string
  return dateFormatter.format(new Date(timestamp));
}
