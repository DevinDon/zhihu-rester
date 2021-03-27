import { BaseView, GET, PathQuery, View } from '@rester/core';
import { getEntity, Pagination } from '@rester/orm';
import { AphorismCollection, AphorismEntity } from './aphorism.entity';

// create, remove, modify, take, search
// one, more

@View('aphorisms')
export class AphorismsView extends BaseView {

  private entity: AphorismEntity;
  private collection: AphorismCollection;

  async init() {
    this.entity = getEntity(AphorismEntity);
    this.collection = this.entity.collection;
  }

  @GET()
  async take(
    @PathQuery('random') random: boolean = false,
    @PathQuery('from') from: string = '000000000000000000000000',
    @PathQuery('take') take: number = 10,
  ): Promise<Pagination<string>> {
    return random
      ? this.entity.getRandomList({ take })
      : this.entity.getPagination({ from, take });
  }

}
