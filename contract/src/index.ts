import { initContract } from '@ts-rest/core';
import { postContract } from './post.contract';
import { userContract } from './user.contract';

const c = initContract();

export const apiContract = c.router({
  ...userContract,
  ...postContract,
});

export * from './user.contract';
export * from './post.contract';
