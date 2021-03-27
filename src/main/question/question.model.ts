import { AccountForeignKey } from '../account/account.model';

export interface Question {

  /** 提问用户 */
  account: AccountForeignKey;

  /** 问题标题 */
  title: string;

  /** 问题内容 */
  content?: string;

  /** 回答数量等 */
  count: {
    answer: number;
    like: number;
    visit: number;
  };

  /** 问题标签 */
  tags: string[];

  createdAt: Date;
  updatedAt: Date;

}

export type QuestionID = string;

export type QuestionInsertParams = Pick<Question, 'title'> & Partial<Pick<Question, 'content' | 'tags'>>;

export type QuestionUpdateParams = Partial<Pick<Question, 'title' | 'content' | 'tags' | 'updatedAt'>>;

export type QuestionForeignKey = Pick<Question, 'title'> & { _id: QuestionID };
