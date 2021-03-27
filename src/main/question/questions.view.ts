import { BaseView, GET, PathQuery, View } from '@rester/core';
import { getEntity, Pagination } from '@rester/orm';
import { QuestionCollection, QuestionEntity } from './question.entity';

// create, remove, modify, take, search
// one, more

@View('questions')
export class QuestionsView extends BaseView {

  private entity: QuestionEntity;
  private collection: QuestionCollection;

  async init() {
    this.entity = getEntity(QuestionEntity);
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
