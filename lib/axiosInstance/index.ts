import axios, { AxiosRequestConfig } from 'axios';

import { baseUrl } from '@lib/axiosInstance/constants';

const config: AxiosRequestConfig = { baseURL: baseUrl };

export const axiosInstance = axios.create(config);
