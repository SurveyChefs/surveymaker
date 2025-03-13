export type QuestionType = "multipleChoice" | "textEntry";

export interface SkipLogic {
  answer: string;
  skipToIndex: number;
}

export interface Question {
  type: QuestionType;
  name: string;
  description: string;
  answers?: string[];
  skipLogic?: SkipLogic[];
  index: number;
}

export interface Survey {
  _id: string;
  title: string;
  description: string;
  questions: Question[];
  createdAt: Date;
  updatedAt: Date;
}