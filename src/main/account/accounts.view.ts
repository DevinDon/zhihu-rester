import { BaseView, GET, PathQuery, View } from '@rester/core';
import { getEntity, Pagination } from '@rester/orm';
import { AccountCollection, AccountEntity } from './account.entity';

// create, remove, modify, take, search
// one, more

@View('accounts')
export class AccountsView extends BaseView {

  private entity: AccountEntity;
  private collection: AccountCollection;

  async init() {
    this.entity = getEntity(AccountEntity);
    this.collection = this.entity.collection;
  }

  @GET()
  async take(
    @PathQuery('from') from: string = '000000000000000000000000',
    @PathQuery('take') take: number = 10,
  ): Promise<Pagination<string>> {
    return this.entity.getPagination({ from, take });
  }

}
