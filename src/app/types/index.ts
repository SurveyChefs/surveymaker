export type QuestionType = "multipleChoice" | "textEntry" | "matrixTable" | "slider";

export interface Question {
  type: QuestionType;
  name: string;
  description : string;
  answers?: string[]; 
}

