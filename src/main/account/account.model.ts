export enum Role {
  ADMIN = 'admin',
  NORMAL = 'normal',
}

export interface Account {

  email: string;
  username: string;
  password: string;
  birthdate?: Date;
  createdAt: Date;
  updatedAt: Date;

  token?: string;
  role: Role

}

export type AccountID = string;

export type AccountInsertParams = Pick<Account, 'email' | 'password'>
  & Partial<Pick<Account, 'username' | 'birthdate'>>;

export type AccountUpdateParams = AccountInsertParams;

export type AccountSelectParams = Pick<Account, 'username' | 'password'>;

export type AccountForeignKey = Pick<Account, 'username'> & { _id: AccountID };

export type AuthAccountInZone = { account: Account & { _id: AccountID } };
