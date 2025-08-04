import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import {
  expandFade,
  fadeItem,
  fadeUp,
  staggerContainer,
} from "../../lib/Animations.ts";
import { supabase } from "../../lib/supabaseClient.ts";
import { usePlayerStore } from "../../stores/usePlayerStore.ts";
import { useUserStore } from "../../stores/useUserStore.ts";
import getCroppedImg from "../../utils/cropImage.ts";
import { avatarSchema, nicknameSchema } from "../../validation/validation.ts";

export default function ProfileSettings() {
  const player = usePlayerStore((state) => state.player);
  const updatePlayer = usePlayerStore((state) => state.updatePlayer);

  const user = useUserStore((state) => state.user);
  const [nickname, setNickname] = useState("");
  const [originalNickname, setOriginalNickname] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [nicknameError, setNicknameError] = useState<string | null>(null);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  useEffect(() => {
    if (player) {
      setNickname(player.name || "");
      setOriginalNickname(player.name || "");
      setAvatarUrl(player.avatar_url || "");
      setPreview(null);
      setAvatarFile(null);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);
    }
  }, [player]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      const isValid = avatarSchema.safeParse(file);
      if (!isValid.success) {
        alert(`❌ ${isValid.error.errors[0].message}`);
        return;
      }
      setAvatarFile(file);
      setPreview(URL.createObjectURL(file));
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);
    }
  };

  const handleUpdate = async () => {
    if (!user) return alert("No estás autenticado");
    if (!player) return alert("No hay jugador cargado");

    const result = nicknameSchema.safeParse(nickname);
    if (!result.success) {
      setNicknameError(result.error.errors[0].message);
      return;
    }

    setNicknameError(null);
    setLoading(true);
    let newAvatarUrl = avatarUrl;
    let fileToUpload = avatarFile; // <-- aquí

    if (avatarFile && preview && croppedAreaPixels) {
      try {
        const croppedBlob = await getCroppedImg(preview, croppedAreaPixels);
        const croppedFile = new File([croppedBlob], avatarFile.name, {
          type: avatarFile.type,
        });
        fileToUpload = croppedFile; // <-- aquí actualizamos la variable local
      } catch (e) {
        console.error(e);
        alert("❌ Error al recortar imagen");
        setLoading(false);
        return;
      }
    }
    const avatarValidation = avatarSchema.safeParse(fileToUpload);
    if (!avatarValidation.success) {
      alert(`❌ ${avatarValidation.error.errors[0].message}`);
      setLoading(false);
      return;
    }

    if (fileToUpload) {
      const fileExt = fileToUpload.name.split(".").pop();
      const fileName = `${player.id}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, fileToUpload, { upsert: true });

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
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);
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
            <label className="label font-semibold">Nickname</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value);
                setNicknameError(null);
              }}
              className={`input input-bordered w-full ${
                nicknameError ? "input-error" : ""
              }`}
              disabled={loading}
            />
            {nicknameError && (
              <p className="text-error text-sm mt-1">{nicknameError}</p>
            )}
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
            {preview && (
              <div className="relative w-full h-64">
                <Cropper
                  image={preview}
                  crop={crop}
                  zoom={zoom}
                  aspect={1} // 1:1 para avatar cuadrado
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={(_, croppedAreaPixels) => {
                    setCroppedAreaPixels(croppedAreaPixels);
                  }}
                />
              </div>
            )}
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
