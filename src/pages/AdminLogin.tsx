
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin, setAdminSession } from "@/utils/adminAuth";
import { debugAdminUsers } from "@/utils/debugAdmin";
import { toast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(false);

    console.log("Tentando login com:", { username });
    
    // Executar debug antes do login
    await debugAdminUsers();

    try {
      const { user, error: loginError } = await loginAdmin(username, password);
      
      console.log("Resultado do login:", { user, loginError });
      
      if (loginError || !user) {
        console.error("Erro no login:", loginError);
        setError(true);
        toast({
          title: "Erro no login",
          description: "Credenciais inválidas",
          variant: "destructive",
        });
        return;
      }

      setAdminSession(user);
      toast({
        title: "Login realizado com sucesso",
        description: `Bem-vindo, ${user.username}!`,
      });
      navigate("/admin/dashboard");
    } catch (err) {
      console.error("Erro no login:", err);
      setError(true);
      toast({
        title: "Erro no login",
        description: "Erro interno do servidor",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-lg p-8 space-y-6">
        <div className="text-center">
          <div className="flex items-center justify-center mx-auto mb-4">
            <img 
              src="/lovable-uploads/697965a5-aa40-4554-902c-20321af7ad63.png" 
              alt="DAKI Logo" 
              className="h-12 w-auto"
            />
          </div>
          <h1 className="text-xl font-semibold">Login Admin</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            placeholder="Usuário"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066FF] focus:border-transparent outline-none"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066FF] focus:border-transparent outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {error && (
            <p className="text-xs text-red-600">Credenciais inválidas</p>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#0066FF] hover:bg-[#0052CC] text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50"
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
