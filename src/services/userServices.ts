import { supabase } from "../lib/supabaseClient.ts";
import type { Player } from "../stores/usePlayerStore.ts";

export const ensurePlayerCreated = async (): Promise<Player | null> => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("No se pudo obtener el usuario");
    return null;
  }

  const { id: userId, email, user_metadata } = user;

  // Buscar player existente
  const { data: existing, error: fetchError } = await supabase
    .from("players")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (fetchError && fetchError.code !== "PGRST116") {
    // Código 116 = Not found (PostgREST)
    console.error("Error buscando player:", fetchError);
    return null;
  }

  if (existing) return existing;

  // Crear player si no existe
  const { data: inserted, error: insertError } = await supabase
    .from("players")
    .insert([
      {
        user_id: userId,
        name: user_metadata?.full_name || email,
        avatar_url: user_metadata?.avatar_url || null,
      },
    ])
    .select()
    .single();

  if (insertError) {
    console.error("Error al crear player:", insertError);
    return null;
  }

  return inserted;
};
