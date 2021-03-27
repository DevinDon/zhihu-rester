import { ResterModule } from '@rester/core';
import { QuestionEntity } from './question.entity';
import { QuestionView } from './question.view';
import { QuestionsView } from './questions.view';

export const QuestionModule: ResterModule = {
  entities: [QuestionEntity],
  views: [QuestionView, QuestionsView],
};
