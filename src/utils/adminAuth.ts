
import { supabase } from "@/integrations/supabase/client";

export interface AdminUser {
  id: string;
  username: string;
  created_at: string;
  updated_at: string;
}

export async function loginAdmin(username: string, password: string): Promise<{ user: AdminUser | null; error: string | null }> {
  try {
    console.log("Chamando função RPC verify_admin_login...");
    console.log("Parâmetros:", { username, password: "***" });
    
    // First, let's check if the admin user exists at all
    const { data: adminCheck, error: adminCheckError } = await supabase
      .from('admin_users')
      .select('id, username')
      .eq('username', username);
    
    console.log("Verificação de usuário admin:", { adminCheck, adminCheckError });
    
    // Call a database function to verify credentials
    const { data, error } = await supabase
      .rpc('verify_admin_login', {
        admin_username: username,
        admin_password: password
      });

    console.log("Resposta da função RPC:", { data, error });

    if (error) {
      console.error("Erro na função RPC:", error);
      return { user: null, error: "Erro interno do servidor" };
    }

    if (!data || data.length === 0) {
      console.log("Nenhum usuário retornado - credenciais inválidas");
      return { user: null, error: "Credenciais inválidas" };
    }

    // Return the first user from the result
    const adminUser = data[0];
    console.log("Usuário admin encontrado:", adminUser);
    return { user: adminUser, error: null };
  } catch (error) {
    console.error("Erro no login do admin:", error);
    return { user: null, error: "Erro interno do servidor" };
  }
}

export function setAdminSession(user: AdminUser) {
  localStorage.setItem('admin_user', JSON.stringify(user));
}

export function getAdminSession(): AdminUser | null {
  const stored = localStorage.getItem('admin_user');
  return stored ? JSON.parse(stored) : null;
}

export function clearAdminSession() {
  localStorage.removeItem('admin_user');
}
