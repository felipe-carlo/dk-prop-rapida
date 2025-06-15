
import { supabase } from "@/integrations/supabase/client";

export async function debugAdminUsers() {
  console.log("=== DEBUG: Verificando tabela admin_users ===");
  
  try {
    // Tentar buscar todos os usuários admin
    const { data: allUsers, error: allUsersError } = await supabase
      .from('admin_users')
      .select('*');
    
    console.log("Todos os usuários admin:", { allUsers, allUsersError });
    
    // Tentar buscar especificamente o usuário 'admin'
    const { data: adminUser, error: adminUserError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('username', 'admin');
    
    console.log("Usuário 'admin' específico:", { adminUser, adminUserError });
    
    // Testar a função RPC diretamente
    const { data: rpcResult, error: rpcError } = await supabase
      .rpc('verify_admin_login', {
        admin_username: 'admin',
        admin_password: 'daki1234'
      });
    
    console.log("Teste direto da função RPC:", { rpcResult, rpcError });
    
  } catch (error) {
    console.error("Erro no debug:", error);
  }
}
