import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "../../lib/supabaseClient.ts";

export default function ProfileSettings({ playerId }) {
  const [nickname, setNickname] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    let avatarUrl = null;

    if (avatarFile) {
      const fileExt = avatarFile.name.split(".").pop();
      const fileName = `${playerId}.${fileExt}`;
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
      avatarUrl = data.publicUrl;
    }

    const { error } = await supabase
      .from("players")
      .update({
        nickname,
        ...(avatarUrl && { avatar_url: avatarUrl }),
      })
      .eq("id", playerId);

    if (error) {
      console.error(error);
      alert("❌ Error al actualizar perfil");
    } else {
      alert("✅ Perfil actualizado 🎉");
    }

    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto mt-10"
    >
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body space-y-4">
          <h2 className="card-title text-center justify-center">Editar perfil</h2>

          <input
            type="text"
            placeholder="Nuevo nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="input input-bordered w-full"
            disabled={loading}
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="file-input file-input-bordered w-full"
            disabled={loading}
          />

          {preview && (
            <div className="flex justify-center">
              <img
                src={preview}
                alt="Avatar Preview"
                className="w-24 h-24 rounded-full object-cover border border-base-300"
              />
            </div>
          )}

          <button
            onClick={handleUpdate}
            disabled={loading}
            className={`btn btn-primary w-full ${loading ? "loading" : ""}`}
          >
            {loading ? "Guardando..." : "Actualizar perfil"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
