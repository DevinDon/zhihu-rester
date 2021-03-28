import { Column, Entity, MongoEntity, ObjectID, Pagination, PaginationParam } from '@rester/orm';
import { AccountForeignKey } from '../account/account.model';
import { AnswerForeignKey } from '../answer/answer.model';
import { Comment, CommentID } from './comment.model';

@Entity({ name: 'comment' })
export class CommentEntity extends MongoEntity<Comment> implements Comment {

  @Column()
  _id: ObjectID;

  @Column()
  account: AccountForeignKey;

  @Column()
  answer: AnswerForeignKey;

  @Column()
  content: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  async insertOneAndGetID(comment: Comment) {
    return this.collection.insertOne(comment)
      .then(result => result.insertedId.toHexString());
  }

  async getComments(answerForeignKeys: AnswerForeignKey[], { from, take }: Required<PaginationParam>): Promise<Pagination<string, Comment>> {
    const ids = answerForeignKeys.map(answer => new ObjectID(answer._id));
    const result = await this.collection.find({
      _id: { $in: ids, $gte: new ObjectID(from) },
    }, {
      limit: take + 1,
    }).toArray();
    return result.length === take + 1 ? {
      next: (result[take] as any)._id,
      list: result.slice(0, take),
    } : {
      list: result,
    };
  }

  async getRandomList({ take }: Pick<PaginationParam, 'take'>) {
    return { list: await this.collection.aggregate([{ $sample: { size: take } }]).toArray() };
  }

  async insertOne(comment: Comment) {
    const id = await this.collection
      .insertOne(comment)
      .then(result => result.insertedId);
    return this.collection.findOne({ _id: new ObjectID(id) });
  }

  async deleteOne(id: CommentID) {
    await this.collection.deleteOne({ _id: new ObjectID(id) });
    return [id];
  }

  async updateOne(id: CommentID, comment: Partial<Comment>) {
    await this.collection.updateOne(
      { _id: new ObjectID(id) },
      { $set: comment },
    );
    return this.collection.findOne({ _id: new ObjectID(id) });
  }

  async findOne(id: CommentID) {
    return this.collection.findOne({ _id: new ObjectID(id) });
  }

}

export type CommentCollection = CommentEntity['collection'];
