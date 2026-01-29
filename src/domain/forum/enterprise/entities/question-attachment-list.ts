import { WatchedList } from "@/core/entities/watched-list";
import type { QuestionAttachment } from "./question-attachment";

export class QuestionAttachmentList extends WatchedList<QuestionAttachment> {
  compareItems(a: QuestionAttachment, b: QuestionAttachment): boolean {
    return a.questionId.equals(b.questionId) && a.attachmentId.equals(b.attachmentId);
  }
}