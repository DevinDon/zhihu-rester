import { BaseView, GET, PathQuery, View } from '@rester/core';
import { getEntity, Pagination } from '@rester/orm';
import { AnswerCollection, AnswerEntity } from './answer.entity';

// create, remove, modify, take, search
// one, more

@View('answers')
export class AnswersView extends BaseView {

  private entity: AnswerEntity;
  private collection: AnswerCollection;

  async init() {
    this.entity = getEntity(AnswerEntity);
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
