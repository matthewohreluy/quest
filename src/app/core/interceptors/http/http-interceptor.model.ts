import { HttpStatusCode } from "@angular/common/http";

export interface SuccessResponse{
  data: any;
  message: string | null;
  statusCode: HttpStatusCode;
  title: string | null;
}

export interface ErrorResponse{
  errors: {[key: string]: string};
  message: string | null;
  statusCode: HttpStatusCode;
  title: string | null;
}

export interface TableResponse{
  count: number;
  items: any[];
  page: number;
  pageSize: number;
}
