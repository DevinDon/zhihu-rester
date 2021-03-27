import { ResterModule } from '@rester/core';
import { AnswerEntity } from './answer.entity';
import { AnswerView } from './answer.view';
import { AnswersView } from './answers.view';

export const AnswerModule: ResterModule = {
  entities: [AnswerEntity],
  views: [AnswerView, AnswersView],
};
