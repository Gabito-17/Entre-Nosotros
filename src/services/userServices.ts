import { supabase } from "../lib/supabaseClient.ts";

export const ensurePlayerCreated = async (): Promise<{ id: number } | null> => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("No se pudo obtener el usuario");
    return null;
  }

  const { id, email, user_metadata } = user;

  // Buscar si ya existe en "players"
  try {
    const { data: existing, error: fetchError } = await supabase
      .from("players")
      .select("id")
      .eq("user_id", id)
      .single();  

    if (existing) {
      return existing;
    }
  } catch (err) {
    console.error("Falla inesperada al buscar player:", err);
  }

  // Crear nuevo jugador
  const { data: inserted, error: insertError } = await supabase
    .from("players")
    .insert([
      {
        user_id: id,
        name: user_metadata?.full_name || email,
        email: email,
        avatar_url: user.user_metadata?.avatar_url || null,
      },
    ])
    .select()
    .single();

  if (insertError || !inserted) {
    console.error("Error al insertar jugador:", insertError?.message);
    return null;
  }

  return { id: inserted.id };
};
