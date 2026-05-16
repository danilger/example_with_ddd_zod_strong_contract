import { initClient } from '@ts-rest/core';
import { apiContract } from '@repo/contract';

const baseUrl = import.meta.env.VITE_API_URL ?? '';

/** Единая typed-точка доступа к API — типы только из контракта. */
export const api = initClient(apiContract, {
  baseUrl,
  baseHeaders: {},
});
