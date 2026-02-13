import { CreateQuestionUseCase } from "@/domain/forum/application/usecases/questions/create-question";
import { FetchRecentQuestionsUseCase } from "@/domain/forum/application/usecases/questions/fetch-recent-questions";
import { AuthenticateStudentUseCase } from "@/domain/forum/application/usecases/students/authenticate-students";
import { RegisterStudentUseCase } from "@/domain/forum/application/usecases/students/register-student";
import { DatabaseModule } from "@/infra/database/database.module";
import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "../auth/jwt.auth.guard";
import { CryptoModule } from "../crypto/crypto.module";
import { CreateQuestionController } from "./controllers/questions/create-question.controller";
import { FetchRecentQuestionsController } from "./controllers/questions/fetch-recent-questions.controller";
import { AuthenticateController } from "./controllers/users/authenticate.controller";
import { CreateAccountController } from "./controllers/users/create-account.controller";
import { GetQuestionBySlugController } from "./controllers/questions/get-question-by-slug.controller";
import { GetQuestionBySlugUseCase } from "@/domain/forum/application/usecases/questions/get-question-by-slug";
import { EditQuestionUseCase } from "@/domain/forum/application/usecases/questions/edit-question";
import { EditQuestionController } from "./controllers/questions/edit-question.controller";
import { DeleteQuestionUseCase } from "@/domain/forum/application/usecases/questions/delete-question";
import { DeleteQuestionController } from "./controllers/questions/delete-question.controller";
import { AnswerQuestionUseCase } from "@/domain/forum/application/usecases/answers/answer-question";
import { AnswerQuestionController } from "./controllers/answers/answer-question.controller";
import { EditAnswerController } from "./controllers/answers/edit-answer.controller";
import { EditAnswerUseCase } from "@/domain/forum/application/usecases/answers/edit-answer";
import { DeleteAnswerUseCase } from "@/domain/forum/application/usecases/answers/delete-answer";
import { DeleteAnswerController } from "./controllers/answers/delete-answer.controller";

@Module({
  imports: [
    DatabaseModule,
    CryptoModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
    CreateQuestionUseCase,
    FetchRecentQuestionsUseCase,
    RegisterStudentUseCase,
    AuthenticateStudentUseCase,
    GetQuestionBySlugUseCase,
    EditQuestionUseCase,
    DeleteQuestionUseCase,
    AnswerQuestionUseCase,
    EditAnswerUseCase,
    DeleteAnswerUseCase
  ],
  controllers: [
    CreateQuestionController,
    CreateAccountController,
    AuthenticateController,
    FetchRecentQuestionsController,
    GetQuestionBySlugController,
    EditQuestionController,
    DeleteQuestionController,
    AnswerQuestionController,
    EditAnswerController,
    DeleteAnswerController
  ],

})
export class HttpModule { }