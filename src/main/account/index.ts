import { ResterModule } from '@rester/core';
import { AccountEntity } from './account.entity';
import { AccountView } from './account.view';
import { AccountsView } from './accounts.view';

export const AccountModule: ResterModule = {
  entities: [AccountEntity],
  views: [AccountView, AccountsView],
};
