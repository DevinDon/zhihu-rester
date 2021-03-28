import { BaseView, cleanify, DELETE, ExistResponse, GET, Handler, HandlerZone, PathVariable, POST, PUT, RequestBody, requiredAtLeastOneParam, requiredParams, ResterResponse, View } from '@rester/core';
import { getEntity } from '@rester/orm';
import { AuthAccountInZone } from '../account/account.model';
import { AnswerEntity } from '../answer/answer.entity';
import { UserAuthHandler } from '../common/handlers';
import { CommentCollection, CommentEntity } from './comment.entity';
import { CommentID, CommentInsertParams, CommentUpdateParams } from './comment.model';

// create, remove, modify, take, search
// one, more

@View('comment')
export class CommentView extends BaseView {

  private entity: CommentEntity;
  private answerEntity: AnswerEntity;
  private collection: CommentCollection;

  async init() {
    this.entity = getEntity(CommentEntity);
    this.answerEntity = getEntity(AnswerEntity);
    this.collection = this.entity.collection;
  }

  @POST()
  @Handler(UserAuthHandler)
  async create(
    @RequestBody() { answerID, content }: CommentInsertParams,
    @HandlerZone() { account: { _id: accountID, username } }: AuthAccountInZone,
  ) {
    requiredParams(answerID, content);
    const commentID = await this.entity
      .insertOneAndGetID({
        account: {
          _id: accountID,
          username,
        },
        answer: {
          _id: answerID,
        },
        content,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    const updated = await this.answerEntity.addComment(answerID, commentID);
    return new ExistResponse({
      statusCode: 201,
      data: await this.entity.findOne(commentID),
      message: 'Create comment failed.',
    });
  }

  @DELETE(':id')
  @Handler(UserAuthHandler)
  async remove(@PathVariable('id') id: CommentID) {
    return this.entity.deleteOne(id);
  }

  // @PUT(':id')
  // async modify(
  //   @PathVariable('id') id: CommentID,
  //   @RequestBody() { content }: CommentUpdateParams,
  // ) {
  //   requiredAtLeastOneParam(content);
  //   return new ExistResponse({
  //     data: await this.entity.updateOne(id, cleanify({ content, updateAt: new Date() })),
  //     message: 'Comment not found.',
  //   });
  // }

  @GET(':id')
  async take(
    @PathVariable('id') id: CommentID,
  ) {
    return new ExistResponse({
      data: await this.entity.findOne(id),
      message: 'Comment not found.',
    });
  }

}
