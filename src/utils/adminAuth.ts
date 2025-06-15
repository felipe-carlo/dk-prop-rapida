
import { supabase } from "@/integrations/supabase/client";
import bcrypt from "bcryptjs";

export interface AdminUser {
  id: string;
  username: string;
  created_at: string;
  updated_at: string;
}

export async function loginAdmin(username: string, password: string): Promise<{ user: AdminUser | null; error: string | null }> {
  try {
    // Fetch admin user by username
    const { data: adminUser, error } = await supabase
      .from('admin_users')
      .select('id, username, password_hash, created_at, updated_at')
      .eq('username', username)
      .single();

    if (error || !adminUser) {
      return { user: null, error: "Usuário não encontrado" };
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, adminUser.password_hash);
    
    if (!isValidPassword) {
      return { user: null, error: "Senha incorreta" };
    }

    // Return user without password hash
    const { password_hash, ...userWithoutPassword } = adminUser;
    return { user: userWithoutPassword, error: null };
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
