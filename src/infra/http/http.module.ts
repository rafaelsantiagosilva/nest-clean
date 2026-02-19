import { AnswerQuestionUseCase } from "@/domain/forum/application/usecases/answers/answer-question";
import { CommentOnAnswerUseCase } from "@/domain/forum/application/usecases/answers/comment-on-answer";
import { DeleteAnswerUseCase } from "@/domain/forum/application/usecases/answers/delete-answer";
import { DeleteAnswerCommentUseCase } from "@/domain/forum/application/usecases/answers/delete-answer-comment";
import { EditAnswerUseCase } from "@/domain/forum/application/usecases/answers/edit-answer";
import { FetchQuestionAnswersUseCase } from "@/domain/forum/application/usecases/answers/fetch-question-answers";
import { ChooseQuestionBestAnswerUseCase } from "@/domain/forum/application/usecases/questions/choose-question-best-answer";
import { CommentOnQuestionUseCase } from "@/domain/forum/application/usecases/questions/comment-on-question";
import { CreateQuestionUseCase } from "@/domain/forum/application/usecases/questions/create-question";
import { DeleteQuestionUseCase } from "@/domain/forum/application/usecases/questions/delete-question";
import { DeleteQuestionCommentUseCase } from "@/domain/forum/application/usecases/questions/delete-question-comment";
import { EditQuestionUseCase } from "@/domain/forum/application/usecases/questions/edit-question";
import { FetchQuestionCommentsUseCase } from "@/domain/forum/application/usecases/questions/fetch-question-comments";
import { FetchRecentQuestionsUseCase } from "@/domain/forum/application/usecases/questions/fetch-recent-questions";
import { GetQuestionBySlugUseCase } from "@/domain/forum/application/usecases/questions/get-question-by-slug";
import { AuthenticateStudentUseCase } from "@/domain/forum/application/usecases/students/authenticate-students";
import { RegisterStudentUseCase } from "@/domain/forum/application/usecases/students/register-student";
import { DatabaseModule } from "@/infra/database/database.module";
import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "../auth/jwt.auth.guard";
import { CryptoModule } from "../crypto/crypto.module";
import { AnswerQuestionController } from "./controllers/answers/answer-question.controller";
import { CommentOnAnswerController } from "./controllers/answers/comment-on-answer.controller";
import { DeleteAnswerCommentController } from "./controllers/answers/delete-answer-comment.controller";
import { DeleteAnswerController } from "./controllers/answers/delete-answer.controller";
import { EditAnswerController } from "./controllers/answers/edit-answer.controller";
import { FetchQuestionAnswersController } from "./controllers/answers/fetch-question-answers.controller";
import { ChooseQuestionBestAnswerController } from "./controllers/questions/choose-question-best-answer.controller";
import { CommentOnQuestionController } from "./controllers/questions/comment-on-question.controller";
import { CreateQuestionController } from "./controllers/questions/create-question.controller";
import { DeleteQuestionCommentController } from "./controllers/questions/delete-question-comment.controller";
import { DeleteQuestionController } from "./controllers/questions/delete-question.controller";
import { EditQuestionController } from "./controllers/questions/edit-question.controller";
import { FetchQuestionCommentsControllers } from "./controllers/questions/fetch-question-comments.controller";
import { FetchRecentQuestionsController } from "./controllers/questions/fetch-recent-questions.controller";
import { GetQuestionBySlugController } from "./controllers/questions/get-question-by-slug.controller";
import { AuthenticateController } from "./controllers/users/authenticate.controller";
import { CreateAccountController } from "./controllers/users/create-account.controller";
import { FetchAnswerCommentsUseCase } from "@/domain/forum/application/usecases/answers/fetch-answer-comments";
import { FetchAnswerCommentsController } from "./controllers/answers/fetch-answer-comments.controller";

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
    DeleteAnswerUseCase,
    FetchQuestionAnswersUseCase,
    ChooseQuestionBestAnswerUseCase,
    CommentOnQuestionUseCase,
    DeleteQuestionCommentUseCase,
    CommentOnAnswerUseCase,
    DeleteAnswerCommentUseCase,
    FetchQuestionCommentsUseCase,
    FetchAnswerCommentsUseCase
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
    DeleteAnswerController,
    FetchQuestionAnswersController,
    ChooseQuestionBestAnswerController,
    CommentOnQuestionController,
    DeleteQuestionCommentController,
    CommentOnAnswerController,
    DeleteAnswerCommentController,
    FetchQuestionCommentsControllers,
    FetchAnswerCommentsController
  ],

})
export class HttpModule { }