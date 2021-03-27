import { BaseView, ExistResponse, generateID, Handler, HandlerZone, HTTP400Exception, POST, RequestBody, requiredParams, View } from '@rester/core';
import { getEntity } from '@rester/orm';
import { UserAuthHandler } from '../common/handlers';
import { AccountCollection, AccountEntity } from './account.entity';
import { AccountInsertParams, AccountSelectParams, AuthAccountInZone, Role } from './account.model';

// create, remove, modify, take, search
// one, more

@View('account')
export class AccountView extends BaseView {

  private entity: AccountEntity;
  private collection: AccountCollection;

  async init() {
    this.entity = getEntity(AccountEntity);
    this.collection = this.entity.collection;
  }

  @POST('signin')
  async signin(
    @RequestBody() { username, password }: AccountSelectParams,
  ) {
    requiredParams(username, password);
    return new ExistResponse({
      data: await this.entity.selectOneByUsernameAndPassword({ username, password }),
      fields: ['username', 'token'],
    });
  }

  @POST('signup')
  async signup(
    @RequestBody() { email, password, username = generateID(), birthdate }: AccountInsertParams,
  ) {
    requiredParams(email, password);
    if (await this.entity.alreadyHasUsernameOrEmail({ username, email })) {
      throw new HTTP400Exception(`Username '${username}' or email '${email}' has been registered.`);
    }
    return new ExistResponse({
      data: await this.entity.insertOne({
        email,
        password,
        username,
        birthdate,
        role: Role.NORMAL,
        token: generateID(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      fields: ['username', 'token'],
    });
  }

  @Handler(UserAuthHandler)
  @POST('signout')
  async signout(
    @HandlerZone() { account: { username } }: AuthAccountInZone,
  ) {
    return new ExistResponse({
      data: await this.entity.clearToken({ username }),
      fields: ['username'],
    });
  }

}
