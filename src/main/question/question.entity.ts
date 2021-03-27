import { Column, Entity, MongoEntity, ObjectID, PaginationParam } from '@rester/orm';
import { Account } from '../account/account.model';
import { Question, QuestionID } from './question.model';

@Entity({ name: 'question' })
export class QuestionEntity extends MongoEntity<Question> implements Question {

  @Column()
  _id: ObjectID;

  @Column()
  account: Pick<Account, 'username'> & { _id: string; };

  @Column({ index: true })
  title: string;

  @Column()
  content?: string;

  @Column()
  count: { answer: number; like: number; visit: number; };

  @Column()
  tags: string[];

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
  async getRandomList({ take }: Pick<PaginationParam, 'take'>) {
    return { list: await this.collection.aggregate([{ $sample: { size: take } }]).toArray() };
  }

  async insertOne(question: Question) {
    const id = await this.collection
      .insertOne(question)
      .then(result => result.insertedId);
    return this.collection.findOne({ _id: new ObjectID(id) });
  }

  async deleteOne(id: QuestionID) {
    await this.collection.deleteOne({ _id: new ObjectID(id) });
    return [id];
  }

  async updateOne(id: QuestionID, question: Partial<Question>) {
    await this.collection.updateOne(
      { _id: new ObjectID(id) },
      { $set: question },
    );
    return this.collection.findOne({ _id: new ObjectID(id) });
  }

  async findOne(id: QuestionID) {
    return this.collection.findOne({ _id: new ObjectID(id) });
  }

}

export type QuestionCollection = QuestionEntity['collection'];
