import { User } from '@/types/auth';

export type ApiResponse<T> = {
  message: string;
  data: T;
  token?: string | undefined;
};

export type ApiError = {
  message: string;
};

export type UninterceptedApiError = {
  message: string | Record<string, string[]>;
};

export interface PaginatedApiResponse<T> {
  message: number;
  status: string;
  data: T;
  total?: number;
  currentPages?: number;
  limit?: number;
  maxPages?: number;
  from?: number;
  to?: number;
  sortBy?: string;
  sortType?: string;
}

export interface UserInfoApi {
  message: string;
  data: User;
}

export interface Transaction {
  id: number;
  transactionId: string;
  notaId: string;
  weight: string;
  service: string;
  price: string;
  name: string;
  noTelp: string;
  address: string;
  createdBy: string;
  fkAuthor: number;
  dateIn: string;
  dateDone: string;
  dateOut?: string;
  status: string;
  deletedAt?: string;
  notes: string;
  cashier: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerApi {
  message: string;
  data: Customer[];
}
export interface Customer {
  id: number;
  name: string;
  address: string;
  noTelp: string;
  createdAt?: string;
  updatedAt?: string;
}
