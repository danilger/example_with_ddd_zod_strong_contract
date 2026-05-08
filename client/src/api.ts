import { initClient } from '@ts-rest/core';
import { apiContract } from '@repo/contract';

const baseUrl = import.meta.env.VITE_API_URL ?? '';

export const api = initClient(apiContract, {
  baseUrl,
  baseHeaders: {},
});
