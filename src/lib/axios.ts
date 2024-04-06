import axios, { AxiosError } from 'axios';
import { GetServerSidePropsContext } from 'next';
import Cookies from 'universal-cookie';

import { getToken } from '@/lib/cookies';

import { ApiResponse, UninterceptedApiErrorData } from '@/types/api';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const isServer = () => {
  return typeof window === 'undefined';
};
let context = <GetServerSidePropsContext>{};

export const api = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

api.defaults.withCredentials = false;

api.interceptors.request.use(function (config) {
  if (config.headers) {
    let token: string | undefined;

    if (isServer()) {
      if (!context)
        throw 'Api Context not found. You must call `setApiContext(context)` before calling api on server-side';

      const cookies = new Cookies(context.req?.headers.cookie);
      /** Get cookies from context if server side */
      token = cookies.get('@example/token');
    } else {
      /** Get cookies from context if server side */
      token = getToken();
    }
    if (token === undefined) {
      token = localStorage.getItem('token') as string;
    }

    config.headers.Authorization = token ? token : '';
  }

  return config;
});

api.interceptors.response.use(
  (config) => {
    return config;
  },
  (error: AxiosError<ApiResponse<UninterceptedApiErrorData>>) => {
    // parse error
    if (error.response?.status != 200) {
      return Promise.reject({
        ...error,
        response: {
          ...error.response,
          data: {
            ...error.response?.data,
            error:
              typeof error.response?.data === 'string'
                ? error.response?.data
                : Object.values(error.response?.data?.data ?? '')[0],
          },
        },
      });
    }
    return Promise.reject(error);
  },
);

/**
 * Must be set when calling api on server side
 */
export const setApiContext = (_context: GetServerSidePropsContext) => {
  context = _context;
  return;
};

export default api;
