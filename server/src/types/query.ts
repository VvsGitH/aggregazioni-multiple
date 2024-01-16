export interface IPaginationQuery {
  offset: string;
  limit: string;
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
