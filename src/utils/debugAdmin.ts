
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
    
    // Testar a função RPC diretamente com vários cenários
    console.log("=== Testando função RPC ===");
    
    const { data: rpcResult, error: rpcError } = await supabase
      .rpc('verify_admin_login', {
        admin_username: 'admin',
        admin_password: 'daki1234'
      });
    
    console.log("Teste direto da função RPC:", { rpcResult, rpcError });
    
    // Testar com senha incorreta para comparar
    const { data: wrongPasswordResult, error: wrongPasswordError } = await supabase
      .rpc('verify_admin_login', {
        admin_username: 'admin',
        admin_password: 'senhaerrada'
      });
    
    console.log("Teste com senha errada:", { wrongPasswordResult, wrongPasswordError });
    
    // Testar verificação manual do hash bcrypt
    if (allUsers && allUsers.length > 0) {
      const storedHash = allUsers[0].password_hash;
      console.log("Hash armazenado:", storedHash);
      console.log("Comprimento do hash:", storedHash?.length);
      console.log("Formato do hash:", storedHash?.substring(0, 10) + "...");
    }
    
  } catch (error) {
    console.error("Erro no debug:", error);
  }
}
