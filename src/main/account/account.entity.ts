import { generateID } from '@rester/core';
import { Column, Entity, MongoEntity, ObjectID, PaginationParam } from '@rester/orm';
import { Account, AccountID, AccountSelectParams, Role } from './account.model';

@Entity({ name: 'account' })
export class AccountEntity extends MongoEntity<Account> implements Account {

  @Column()
  _id: ObjectID;

  @Column({ index: true, unique: true })
  email!: string

  @Column({ index: true, unique: true })
  username!: string

  @Column()
  password!: string

  @Column()
  birthdate?: Date

  @Column()
  createdAt!: Date

  @Column()
  updatedAt!: Date;

  @Column({ index: true, unique: true })
  token?: string;

  @Column()
  role!: Role;

  async alreadyHasUsernameOrEmail({ username, email }: Pick<Account, 'username' | 'email'>) {
    const hasUsername = await this.collection.findOne({ username });
    const hasEmail = await this.collection.findOne({ email });
    return !!hasUsername || !!hasEmail;
  }

  async selectOneByUsernameAndPassword({ username, password }: AccountSelectParams) {
    const result = await this.collection
      .findOneAndUpdate({ username, password }, { $set: { token: generateID() } });
    return result.value;
  }

  async clearToken({ username }: Pick<Account, 'username'>) {
    const result = await this.collection
      .findOneAndUpdate({ username }, { $set: { token: undefined } });
    return result.value;
  }

  async getRandomList({ take }: Pick<PaginationParam, 'take'>) {
    return { list: await this.collection.aggregate([{ $sample: { size: take } }]).toArray() };
  }

  async insertOne(account: Account) {
    const id = await this.collection
      .insertOne(account)
      .then(result => result.insertedId);
    return this.collection.findOne({ _id: new ObjectID(id) });
  }

  async deleteOne(id: AccountID) {
    await this.collection.deleteOne({ _id: new ObjectID(id) });
    return [id];
  }

  async updateOne(id: AccountID, account: Partial<Account>) {
    await this.collection.updateOne(
      { _id: new ObjectID(id) },
      { $set: account },
    );
    return this.collection.findOne({ _id: new ObjectID(id) });
  }

  async findOne(id: AccountID) {
    return this.collection.findOne({ _id: new ObjectID(id) });
  }

}

export type AccountCollection = AccountEntity['collection'];
