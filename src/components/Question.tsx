
import { ReactNode } from "react";

interface QuestionProps {
  children: ReactNode;
}

export const Question = ({ children }: QuestionProps) => {
  return (
    <h2 className="text-2xl font-bold text-gray-900 mb-10 font-owners text-center">
      {children}
    </h2>
  );
};
