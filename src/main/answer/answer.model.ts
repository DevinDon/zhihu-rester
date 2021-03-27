import { AccountForeignKey } from '../account/account.model';
import { QuestionForeignKey } from '../question/question.model';

export interface Answer {

  /** 回答用户 */
  account: AccountForeignKey;

  /** 所属问题 */
  question: QuestionForeignKey;

  /** 回答内容 */
  content: string;

  /** 计数 */
  count: {
    approve: number;
    oppose: number;
    comment: number;
  };

  /** 评论 */
  comments: string[];

  createdAt: Date;
  updatedAt: Date;

}

export type AnswerID = string;

export type AnswerInsertParams = Pick<Answer, 'account' | 'question' | 'content'>;

export type AnswerUpdateParams = Partial<Pick<Answer, 'content'>>;
