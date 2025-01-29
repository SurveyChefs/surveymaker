export type QuestionType = "multipleChoice" | "textEntry" | "matrixTable" | "slider";

export interface Question {
  type: QuestionType;
  name: string;
  description : string;
  answers?: string[]; 
}

export interface Survey {
  _id: string;
  title: string;
  description: string;
  questions: Question[];
  createdAt: Date;
  updatedAt: Date;
}