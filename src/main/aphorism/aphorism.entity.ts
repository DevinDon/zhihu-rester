import { Column, Entity, MongoEntity, ObjectID, PaginationParam } from '@rester/orm';
import { Aphorism, AphorismID, AphorismInsertParams, AphorismUpdateParams } from './aphorism.model';

@Entity({ name: 'aphorism' })
export class AphorismEntity extends MongoEntity<Aphorism> implements Aphorism {

  @Column()
  _id: ObjectID;

  @Column({ index: true })
  author?: string;

  @Column()
  content: string;

  @Column()
  like: number;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  async getRandomList({ take }: Pick<PaginationParam, 'take'>) {
    return { list: await this.collection.aggregate([{ $sample: { size: take } }]).toArray() };
  }

  async insertOne(aphorism: AphorismInsertParams) {
    const id = await this.collection
      .insertOne({
        ...aphorism,
        like: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .then(result => result.insertedId);
    return this.collection.findOne({ _id: new ObjectID(id) });
  }

  async deleteOne(id: AphorismID) {
    await this.collection.deleteOne({ _id: new ObjectID(id) });
    return [id];
  }

  async updateOne(id: AphorismID, aphorism: AphorismUpdateParams) {
    await this.collection.updateOne(
      { _id: new ObjectID(id) },
      { $set: { ...aphorism, updatedAt: new Date() } },
    );
    return this.collection.findOne({ _id: new ObjectID(id) });
  }

  async findOne(id: AphorismID) {
    return this.collection.findOne({ _id: new ObjectID(id) });
  }

}

export type AphorismCollection = AphorismEntity['collection'];
