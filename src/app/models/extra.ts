import { extraTab } from './enums';

export class Extra {
  id?: string;
  name: string;
  price: number;
  type?: extraTab;
  description?: string;

  constructor() { }
}
