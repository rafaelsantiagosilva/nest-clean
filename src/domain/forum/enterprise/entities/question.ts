import { AggregateRoot } from "@/core/entities/aggregate-root";
import type { UniqueEntityId } from "@/core/entities/unique-entity-id";
import type { Optional } from "@/core/types/optional";
import dayjs from "dayjs";
import { QuestionAttachmentList } from "./question-attachment-list";
import type { QuestionAttachment } from "./question-attachment";
import { Slug } from "./value-objects/slug";
import { QuestionBestAnswerChosenEvent } from "../events/question-best-answer-chosen-event";

export type QuestionProps = {
  title: string;
  slug: Slug;
  content: string;
  authorId: UniqueEntityId;
  attachments: QuestionAttachmentList;
  bestAnswerId?: UniqueEntityId;
  createdAt: Date;
  updatedAt?: Date;
}

export class Question extends AggregateRoot<QuestionProps> {
  static create(props: Optional<QuestionProps, 'createdAt' | 'slug' | 'attachments'>, id?: UniqueEntityId) {
    const question = new Question({
      ...props,
      slug: props.slug ?? Slug.createFromText(props.title),
      createdAt: props.createdAt ?? new Date(),
      attachments: props.attachments ?? new QuestionAttachmentList()
    }, id);

    return question;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  get title() {
    return this.props.title;
  }

  set title(title: string) {
    this.props.title = title;
    this.props.slug = Slug.createFromText(title);
    this.touch();
  }

  get content() {
    return this.props.content;
  }

  set content(content: string) {
    this.props.content = content;
    this.touch();
  }

  get slug() {
    return this.props.slug;
  }

  get attachments() {
    return this.props.attachments;
  }

  set attachments(attachments: QuestionAttachmentList) {
    this.props.attachments = attachments;
    this.touch();
  }

  get authorId() {
    return this.props.authorId;
  }

  get bestAnswerId() {
    return this.props.bestAnswerId;
  }

  set bestAnswerId(bestAnswerId: UniqueEntityId | undefined) {
    if (bestAnswerId === undefined)
      return;

    if (this.props.bestAnswerId === undefined || !this.props.bestAnswerId.equals(bestAnswerId))
      this.addDomainEvent(new QuestionBestAnswerChosenEvent(
        this, bestAnswerId
      ));

    this.props.bestAnswerId = bestAnswerId;
    this.touch();
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get isNew() {
    return dayjs().diff(this.createdAt, "days") <= 3;
  }

  get excerpt() {
    return this.content.substring(0, 120).trimEnd().concat('...');
  }
}