import { BaseView, cleanify, DELETE, ExistResponse, GET, Handler, HandlerZone, HTTP403Exception, PathVariable, POST, PUT, RequestBody, requiredAtLeastOneParam, requiredParams, ResterResponse, View } from '@rester/core';
import { getEntity } from '@rester/orm';
import { AuthAccountInZone } from '../account/account.model';
import { UserAuthHandler } from '../common/handlers';
import { QuestionCollection, QuestionEntity } from './question.entity';
import { QuestionID, QuestionInsertParams, QuestionUpdateParams } from './question.model';

// create, remove, modify, take, search
// one, more

@View('question')
export class QuestionView extends BaseView {

  private entity: QuestionEntity;
  private collection: QuestionCollection;

  async init() {
    this.entity = getEntity(QuestionEntity);
    this.collection = this.entity.collection;
  }

  @POST()
  @Handler(UserAuthHandler)
  async create(
    @RequestBody() { title, content, tags = [] }: QuestionInsertParams,
    @HandlerZone() { account: { _id, username } }: AuthAccountInZone,
  ) {
    requiredParams(title);
    return new ResterResponse({
      statusCode: 201,
      data: await this.entity.insertOne({
        account: { _id, username },
        title,
        content,
        tags,
        count: {
          answer: 0,
          like: 0,
          visit: 0,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    });
  }

  @DELETE(':id')
  @Handler(UserAuthHandler)
  async remove(
    @PathVariable('id') questionID: QuestionID,
    @HandlerZone() { account: { _id: accountID } }: AuthAccountInZone,
  ) {
    requiredParams(questionID, accountID);
    const accountIDInQuestion = await this.entity.findOne(questionID)
      .then(question => question?.account._id);
    if (accountIDInQuestion !== accountID) {
      throw new HTTP403Exception('No permission to delete this question.');
    }
    return this.entity.deleteOne(questionID);
  }

  @PUT(':id')
  @Handler(UserAuthHandler)
  async modify(
    @PathVariable('id') questionID: QuestionID,
    @RequestBody() { title, content, tags }: QuestionUpdateParams,
    @HandlerZone() { account: { _id: accountID } }: AuthAccountInZone,
  ) {
    requiredParams(questionID, accountID);
    requiredAtLeastOneParam(title, content, tags);
    const accountIDInQuestion = await this.entity.findOne(questionID)
      .then(question => question?.account._id);
    if (accountIDInQuestion !== accountID) {
      throw new HTTP403Exception('No permission to modify this question.');
    }
    return new ExistResponse({
      data: await this.entity.updateOne(questionID, cleanify({ title, content, tags, updateAt: new Date() })),
      message: 'Question not found.',
    });
  }

  @GET(':id')
  async take(
    @PathVariable('id') id: QuestionID,
  ) {
    return new ExistResponse({
      data: await this.entity.findOne(id),
      message: 'Question not found.',
    });
  }

}
