import { BaseView, cleanify, DELETE, ExistResponse, GET, PathVariable, POST, PUT, RequestBody, requiredAtLeastOneParam, requiredParams, ResterResponse, View } from '@rester/core';
import { getEntity } from '@rester/orm';
import { AphorismCollection, AphorismEntity } from './aphorism.entity';
import { AphorismID, AphorismInsertParams, AphorismUpdateParams } from './aphorism.model';

// create, remove, modify, take, search
// one, more

@View('aphorism')
export class AphorismView extends BaseView {

  private entity: AphorismEntity;
  private collection: AphorismCollection;

  async init() {
    this.entity = getEntity(AphorismEntity);
    this.collection = this.entity.collection;
  }

  @POST()
  async create(
    @RequestBody() { author, content }: AphorismInsertParams,
  ) {
    requiredParams(content);
    return new ResterResponse({
      statusCode: 201,
      data: await this.entity.insertOne({ author, content }),
    });
  }

  @DELETE(':id')
  async remove(@PathVariable('id') id: AphorismID) {
    return this.entity.deleteOne(id);
  }

  @PUT(':id')
  async modify(
    @PathVariable('id') id: AphorismID,
    @RequestBody() { author, content }: AphorismUpdateParams,
  ) {
    requiredAtLeastOneParam(author, content);
    return new ExistResponse({
      data: await this.entity.updateOne(id, cleanify({ author, content })),
      message: 'Aphorism not found.',
    });
  }

  @GET(':id')
  async take(
    @PathVariable('id') id: AphorismID,
  ) {
    return new ExistResponse({
      data: await this.entity.findOne(id),
      message: 'Aphorism not found.',
    });
  }

}
