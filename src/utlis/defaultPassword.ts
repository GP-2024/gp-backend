import { v4 as uuidv4 } from 'uuid';

export const createDefaultPassword = () => {
  return uuidv4().slice(0, 6);
};
