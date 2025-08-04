import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient.ts";
import { usePlayerStore } from "../../stores/usePlayerStore.ts";
import {
  fadeUp,
  fadeItem,
  staggerContainer,
  expandFade} from "../../lib/Animations.ts"; // Asumo que estas variantes están exportadas desde un archivo común

export default function ProfileSettings() {
  const player = usePlayerStore((state) => state.player);
  const updatePlayer = usePlayerStore((state) => state.updatePlayer);

  const [nickname, setNickname] = useState("");
  const [originalNickname, setOriginalNickname] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="max-w-md mx-auto mt-10"
    >
      <motion.div
        className="card bg-base-100 shadow-xl"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="card-body space-y-5">
          <motion.h2
            className="card-title text-center justify-center text-2xl"
            variants={fadeItem}
            custom={0}
          >
            Ajustes de perfil
          </motion.h2>

          <motion.div
            className="flex justify-center"
            variants={fadeItem}
            custom={0.1}
          >
            <motion.div
              className="avatar"
              variants={expandFade}
              animate="animate"
              initial="initial"
            >
              <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img
                  src={preview || avatarUrl || "/default-avatar.png"}
                  alt="Avatar"
                />
              </div>
            </motion.div>
          </motion.div>

          <motion.div className="form-control" variants={fadeItem} custom={0.2}>
            <label className="label font-semibold">Nombre de usuario</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="input input-bordered w-full"
              disabled={loading}
            />
          </motion.div>

          <motion.div className="form-control" variants={fadeItem} custom={0.3}>
            <label className="label font-semibold">Cambiar avatar</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="file-input file-input-bordered w-full"
              disabled={loading}
            />
          </motion.div>

          <motion.button
            variants={expandFade}
            initial="hidden"
            animate="visible"
            onClick={handleUpdate}
            disabled={loading}
            className={`btn btn-primary w-full ${loading ? "loading" : ""}`}
          >
            {loading ? "Guardando..." : "Guardar cambios"}
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
