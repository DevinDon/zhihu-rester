import { BaseHandler, HTTP403Exception, parseTokenFromRequest } from '@rester/core';
import { getEntity } from '@rester/orm';
import { AccountEntity } from '../../../account/account.entity';
import { Role } from '../../../account/account.model';

export class AdminAuthHandler extends BaseHandler {

  async handle(next: () => Promise<any>): Promise<any> {

    if (this.request.method?.toUpperCase() === 'OPTIONS') {
      return next();
    }

    const entity: AccountEntity = getEntity(AccountEntity);
    const token = parseTokenFromRequest(this.request);
    const account = await entity.collection.findOne({ token, role: Role.ADMIN });
    if (!account) {
      throw new HTTP403Exception(`Forbidden token ${token}`);
    }
    this.zone.account = account;

    return next();

  }

}
