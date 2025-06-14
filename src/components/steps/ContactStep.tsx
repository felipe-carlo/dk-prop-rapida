
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ContactStepProps {
  name: string;
  email: string;
  onNameChange: (name: string) => void;
  onEmailChange: (email: string) => void;
}

export const ContactStep = ({ name, email, onNameChange, onEmailChange }: ContactStepProps) => {
  return (
    <div className="flex flex-col items-center space-y-6 w-full max-w-md mx-auto">
      <div className="bg-gray-50 p-10 rounded-xl shadow-inner space-y-6 w-full">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-base font-inter font-medium text-gray-800">
            Nome completo
          </Label>
          <Input
            id="name"
            placeholder="Seu nome"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            className="h-12 font-inter"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-base font-inter font-medium text-gray-800">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            className="h-12 font-inter"
            required
          />
        </div>
      </div>
    </div>
  );
};
