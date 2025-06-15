
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin, setAdminSession } from "@/utils/adminAuth";
import { toast } from "@/hooks/use-toast";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(false);

    try {
      const { user, error: loginError } = await loginAdmin(username, password);
      
      if (loginError || !user) {
        setError(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-lg p-8 space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-[#0066FF] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-xl font-bold text-white">DAKI</span>
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
          <input
            type="password"
            placeholder="Senha"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066FF] focus:border-transparent outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
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
