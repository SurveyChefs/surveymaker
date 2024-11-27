export type QuestionType = "multipleChoice" | "textEntry" | "matrixTable" | "slider";

export interface Question {
  type: QuestionType;
  name: string;
  answers?: string[]; 
}

interface answers{
    
}