
import { useState, useEffect } from "react";
import { getAdminSession, clearAdminSession, AdminUser } from "@/utils/adminAuth";

export function useAdminAuth() {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = getAdminSession();
    setAdminUser(user);
    setIsLoading(false);
  }, []);

  const logout = () => {
    clearAdminSession();
    setAdminUser(null);
  };

  return { adminUser, isLoading, logout };
}
