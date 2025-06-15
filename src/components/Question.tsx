
import { ReactNode } from "react";

interface QuestionProps {
  children: ReactNode;
}

export const Question = ({ children }: QuestionProps) => {
  // This component is now handled directly in the Wizard for better layout control
  return null;
};
