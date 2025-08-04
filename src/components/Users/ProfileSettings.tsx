import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient.ts";
import { usePlayerStore } from "../../stores/usePlayerStore.ts";

export default function ProfileSettings() {
  const player = usePlayerStore((state) => state.player);
  const updatePlayer = usePlayerStore((state) => state.updatePlayer);

  const [nickname, setNickname] = useState("");
  const [originalNickname, setOriginalNickname] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Cuando el player cambia (carga), seteamos localmente
  useEffect(() => {
    if (player) {
      setNickname(player.name || "");
      setOriginalNickname(player.name || "");
      setAvatarUrl(player.avatar_url || "");
      setPreview(null);
      setAvatarFile(null);
    }
  }, [player]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      setAvatarFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async () => {
    if (!player) return alert("No hay jugador cargado");

    setLoading(true);

    let newAvatarUrl = avatarUrl;

    if (avatarFile) {
      const fileExt = avatarFile.name.split(".").pop();
      const fileName = `${player.id}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, avatarFile, { upsert: true });

      if (uploadError) {
        console.error(uploadError);
        alert("❌ Error al subir la imagen");
        setLoading(false);
        return;
      }

      const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);
      newAvatarUrl = data.publicUrl;
    }

    const hasNicknameChanged = nickname !== originalNickname;
    const hasAvatarChanged = newAvatarUrl !== avatarUrl;

    if (!hasNicknameChanged && !hasAvatarChanged) {
      alert("No hiciste ningún cambio.");
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from("players")
      .update({
        ...(hasNicknameChanged && { name: nickname }),
        ...(hasAvatarChanged && { avatar_url: newAvatarUrl }),
      })
      .eq("id", player.id);

    if (error) {
      console.error(error);
      alert("❌ Error al actualizar perfil");
    } else {
      alert("✅ Perfil actualizado 🎉");
      // Actualizamos el store para que esté sincronizado
      updatePlayer({
        name: nickname,
        avatar_url: newAvatarUrl,
      });
      setOriginalNickname(nickname);
      setAvatarUrl(newAvatarUrl);
      setAvatarFile(null);
      setPreview(null);
    }

    setLoading(false);
  };

  if (!player) {
    return (
      <div className="text-center mt-20 text-lg font-semibold">
        Cargando perfil...
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto mt-10"
    >
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body space-y-5">
          <h2 className="card-title text-center justify-center text-2xl">
            Ajustes de perfil
          </h2>

          <div className="flex justify-center">
            <div className="avatar">
              <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img
                  src={preview || avatarUrl || "/default-avatar.png"}
                  alt="Avatar"
                />
              </div>
            </div>
          </div>

          <div className="form-control">
            <label className="label font-semibold">Nombre de usuario</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="input input-bordered w-full"
              disabled={loading}
            />
          </div>

          <div className="form-control">
            <label className="label font-semibold">Cambiar avatar</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="file-input file-input-bordered w-full"
              disabled={loading}
            />
          </div>

          <button
            onClick={handleUpdate}
            disabled={loading}
            className={`btn btn-primary w-full ${loading ? "loading" : ""}`}
          >
            {loading ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
