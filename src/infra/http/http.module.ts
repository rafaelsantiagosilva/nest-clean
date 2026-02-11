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
    GetQuestionBySlugUseCase
  ],
  controllers: [
    CreateQuestionController,
    CreateAccountController,
    AuthenticateController,
    FetchRecentQuestionsController,
    GetQuestionBySlugController
  ],

})
export class HttpModule { }