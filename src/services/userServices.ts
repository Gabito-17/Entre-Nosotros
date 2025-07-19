import { supabase } from "../lib/supabaseClient";

export const ensurePlayerCreated = async () => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error('No se pudo obtener el usuario');
    return;
  }

  const { id, email, user_metadata } = user;

  // Buscar si ya existe en "players"
  const { data: existing, error: fetchError } = await supabase
    .from('players')
    .select('id')
    .eq('auth_user_id', id)
    .single();

  if (existing) {
    console.log('Jugador ya existe:', existing.id);
    return;
  }

  // Crear nuevo jugador
  const { data: inserted, error: insertError } = await supabase
    .from('players')
    .insert([
      {
        auth_user_id: id, // clave foránea
        name: user_metadata?.full_name || email,
        email: email,
        avatar_url: user.user_metadata?.avatar_url || null,
      },
    ])
    .select()
    .single();

  if (insertError) {
    console.error('Error al insertar jugador:', insertError.message);
  } else {
    console.log('Jugador creado:', inserted);
  }
};