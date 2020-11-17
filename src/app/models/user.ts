import * as Enums from './enums';

export class User {
  readonly id?:string;
  readonly email: string;
  readonly name: string;
  readonly storeId: string;
  readonly storeName: string;
  readonly isSuperUser: boolean;
  readonly userType:Enums.userType;
  
  constructor() { }
}
