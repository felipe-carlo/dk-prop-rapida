
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Thanks = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="p-12 text-center">
          {/* Logo */}
          <div className="flex items-center justify-center mx-auto mb-8">
            <img 
              src="/lovable-uploads/697965a5-aa40-4554-902c-20321af7ad63.png" 
              alt="DAKI Logo" 
              className="h-16 w-auto"
            />
          </div>
          
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Main Message */}
          <h1 className="text-4xl md:text-5xl font-owners font-bold text-gray-900 mb-6">
            Recebemos suas informações!
          </h1>
          
          <p className="text-xl text-gray-600 font-inter mb-8 leading-relaxed">
            Nossa equipe enviará uma proposta em até 48 h.
          </p>

          {/* Additional Info */}
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <p className="text-gray-700 font-inter">
              Você receberá um email de confirmação em breve com os detalhes da sua solicitação.
            </p>
          </div>

          {/* Action Button */}
          <Link to="/">
            <Button 
              className="bg-primary hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold transition-colors font-inter"
            >
              Nova Solicitação
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
};

export default Thanks;
