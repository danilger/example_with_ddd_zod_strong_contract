import { initContract } from '@ts-rest/core';
import { noteContract } from './note.contract';

const c = initContract();

/** В репо: сюда же spread userContract, postContract, … */
export const apiContract = c.router({
  ...noteContract,
});

export * from './note.contract';
