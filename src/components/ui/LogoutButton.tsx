"use client";

import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-3 px-3 py-2 rounded-md text-[var(--color-text-secondary)] hover:text-red-400 hover:bg-red-400/10 transition-colors w-full text-left">
      <LogOut className="w-5 h-5" />
      <span className="font-medium text-sm">Cerrar sesión</span>
    </button>
  );
}
