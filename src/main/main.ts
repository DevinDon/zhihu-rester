import { DEFAULT_HANDLERS, Rester } from '@rester/core';
import { AccessModule } from './access';
import { AccountModule } from './account';
import { AnswerModule } from './answer';
import { AphorismModule } from './aphorism';
import { CommentModule } from './comment';
import { AccessHandler } from './common/handlers';
import { QuestionModule } from './question';

const rester = new Rester({
  handlers: [
    AccessHandler,
    ...DEFAULT_HANDLERS,
  ],
  modules: [
    AccessModule,
    AphorismModule,
    AccountModule,
    QuestionModule,
    AnswerModule,
    CommentModule,
  ],
});

rester.bootstrap();
