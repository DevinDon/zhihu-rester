import { BaseHandler, HTTP401Exception, parseTokenFromRequest } from '@rester/core';
import { getEntity } from '@rester/orm';
import { AccountEntity } from '../../../account/account.entity';

export class UserAuthHandler extends BaseHandler {

  async handle(next: () => Promise<any>): Promise<any> {

    if (this.request.method?.toUpperCase() === 'OPTIONS') {
      return next();
    }

    const entity: AccountEntity = getEntity(AccountEntity);
    const token = parseTokenFromRequest(this.request);
    const account = await entity.collection.findOne({ token });
    if (!account) {
      throw new HTTP401Exception(`Invalid token ${token}`);
    }
    this.zone.account = account;

    return next();

  }

}
