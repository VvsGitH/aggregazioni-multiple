export interface IRegisteredActivity {
  id: number;
  project: { id: number; name: string } | null;
  employee: { id: number; name: string } | null;
  date: string | null; // ISO
  hours: number;
}

export interface IPaginationQuery {
  offset: number;
  limit: number;
}
export interface IOrderByQuery {
  orderBy: string;
  orderDir: "asc" | "desc";
}
export interface IGroupByQuery {
  groupBy: string | string[];
}
export interface IFilterQuery
  extends Partial<IPaginationQuery>,
    Partial<IOrderByQuery>,
    Partial<IGroupByQuery> {}

export interface IApiResponse<T> {
  success: boolean;
  data: T | null;
  meta?: { pagination?: IPaginationQuery & { count: number } };
  error: { code: number; message: string } | null;
}
