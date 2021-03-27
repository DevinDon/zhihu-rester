import { Column, Entity, MongoEntity, ObjectID, PaginationParam } from '@rester/orm';
import { AccountForeignKey } from '../account/account.model';
import { QuestionForeignKey } from '../question/question.model';
import { Answer, AnswerID } from './answer.model';

@Entity({ name: 'answer' })
export class AnswerEntity extends MongoEntity<Answer> implements Answer {

  @Column()
  _id: ObjectID;

  @Column()
  account!: AccountForeignKey;

  @Column({ index: true })
  question!: QuestionForeignKey;

  @Column()
  content!: string;

  @Column()
  count!: { approve: number; oppose: number; comment: number; };

  @Column()
  comments!: string[];

  @Column()
  createdAt!: Date;

  @Column()
  updatedAt!: Date;

  async getRandomList({ take }: Pick<PaginationParam, 'take'>) {
    return { list: await this.collection.aggregate([{ $sample: { size: take } }]).toArray() };
  }

  async insertOne(answer: Answer) {
    const id = await this.collection
      .insertOne(answer)
      .then(result => result.insertedId);
    return this.collection.findOne({ _id: new ObjectID(id) });
  }

  async deleteOne(id: AnswerID) {
    await this.collection.deleteOne({ _id: new ObjectID(id) });
    return [id];
  }

  async updateOne(id: AnswerID, answer: Partial<Answer>) {
    await this.collection.updateOne(
      { _id: new ObjectID(id) },
      { $set: answer },
    );
    return this.collection.findOne({ _id: new ObjectID(id) });
  }

  async findOne(id: AnswerID) {
    return this.collection.findOne({ _id: new ObjectID(id) });
  }

}

export type AnswerCollection = AnswerEntity['collection'];
