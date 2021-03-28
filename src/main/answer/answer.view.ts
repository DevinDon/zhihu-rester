import { BaseView, cleanify, DELETE, ExistResponse, GET, Handler, HandlerZone, HTTP400Exception, HTTP403Exception, PathVariable, POST, PUT, RequestBody, requiredAtLeastOneParam, requiredParams, ResterResponse, View } from '@rester/core';
import { getEntity } from '@rester/orm';
import { AuthAccountInZone } from '../account/account.model';
import { UserAuthHandler } from '../common/handlers';
import { QuestionEntity } from '../question/question.entity';
import { AnswerCollection, AnswerEntity } from './answer.entity';
import { AnswerID, AnswerInsertParams, AnswerUpdateParams } from './answer.model';

// create, remove, modify, take, search
// one, more

@View('answer')
export class AnswerView extends BaseView {

  private entity: AnswerEntity;
  private questionEntity: QuestionEntity;
  private collection: AnswerCollection;

  async init() {
    this.entity = getEntity(AnswerEntity);
    this.questionEntity = getEntity(QuestionEntity);
    this.collection = this.entity.collection;
  }

  @POST()
  @Handler(UserAuthHandler)
  async create(
    @RequestBody() { questionID, content }: { questionID: string, content: string },
    @HandlerZone() { account: { _id: accountID, username } }: AuthAccountInZone,
  ) {
    requiredParams(questionID, content, accountID, username);
    const question = await this.questionEntity.findOne(questionID);
    if (!question) {
      throw new HTTP400Exception(`Question '${questionID}' does not exist.`);
    }
    return new ResterResponse({
      statusCode: 201,
      data: await this.entity.insertOne({
        account: { _id: accountID, username },
        question: { _id: questionID, title: question.title },
        content,
        count: {
          approve: 0,
          oppose: 0,
          comment: 0,
        },
        comments: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    });
  }

  @DELETE(':id')
  @Handler(UserAuthHandler)
  async remove(
    @PathVariable('id') answerID: AnswerID,
    @HandlerZone() { account: { _id: accountID } }: AuthAccountInZone,
  ) {
    const accountIDInAnswer = await this.entity.findOne(answerID)
      .then(answer => answer?.account._id);
    if (accountIDInAnswer !== accountID) {
      throw new HTTP403Exception('No permission to delete this answer.');
    }
    return this.entity.deleteOne(answerID);
  }

  @PUT(':id')
  @Handler(UserAuthHandler)
  async modify(
    @PathVariable('id') answerID: AnswerID,
    @RequestBody() { content }: AnswerUpdateParams,
    @HandlerZone() { account: { _id: accountID } }: AuthAccountInZone,
  ) {
    requiredAtLeastOneParam(content);
    const accountIDInAnswer = await this.entity.findOne(answerID)
      .then(answer => answer?.account._id);
    if (accountIDInAnswer !== accountID) {
      throw new HTTP403Exception('No permission to modify this answer.');
    }
    return new ExistResponse({
      data: await this.entity.updateOne(answerID, cleanify({ content, updateAt: new Date() })),
      message: 'Answer not found.',
    });
  }

  @GET(':id')
  async take(
    @PathVariable('id') id: AnswerID,
  ) {
    return new ExistResponse({
      data: await this.entity.findOne(id),
      message: 'Answer not found.',
    });
  }

}
