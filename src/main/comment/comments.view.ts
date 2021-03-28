import { BaseView, GET, HTTP404Exception, PathQuery, View } from '@rester/core';
import { getEntity, Pagination } from '@rester/orm';
import { AnswerEntity } from '../answer/answer.entity';
import { CommentCollection, CommentEntity } from './comment.entity';

// create, remove, modify, take, search
// one, more

@View('comments')
export class CommentsView extends BaseView {

  private entity: CommentEntity;
  private answerEntity: AnswerEntity;
  private collection: CommentCollection;

  async init() {
    this.entity = getEntity(CommentEntity);
    this.answerEntity = getEntity(AnswerEntity);
    this.collection = this.entity.collection;
  }

  @GET()
  async take(
    @PathQuery('answerID') answerID: string,
    @PathQuery('from') from: string = '000000000000000000000000',
    @PathQuery('take') take: number = 10,
  ): Promise<Pagination<string>> {
    const answer = await this.answerEntity.findOne(answerID);
    if (!answer) {
      throw new HTTP404Exception(`Question '${answerID}' not found.`);
    }
    return this.entity.getComments(answer.comments, { from, take });
  }

}
