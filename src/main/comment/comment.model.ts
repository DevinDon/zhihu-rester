import { AccountForeignKey } from '../account/account.model';
import { AnswerForeignKey, AnswerID } from '../answer/answer.model';
import { BaseForeignKey } from '../common/interfaces';

export interface Comment {

  account: AccountForeignKey;

  answer: AnswerForeignKey;

  content: string;

  createdAt: Date;

  updatedAt: Date;

}

export type CommentID = string;

export type CommentInsertParams = Pick<Comment, 'content'> & { answerID: AnswerID };

export type CommentUpdateParams = Partial<CommentInsertParams>;

export type CommentForeignKey = BaseForeignKey;
