import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import { useNavigate } from "react-router-dom";
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
  const user = useUserStore((state) => state.user);
  const updatePlayer = usePlayerStore((state) => state.updatePlayer);

  const navigate = useNavigate();

  const [newNickname, setNewNickname] = useState("");
  const [newAvatarUrl, setNewAvatarUrl] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [nicknameError, setNicknameError] = useState<string | null>(null);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  // Redirigir si no está logueado
  useEffect(() => {
    if (!user) {
      navigate("/handle-login");
    }
  }, [user, navigate]);

  // Liberar URL del preview
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

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

    const result = nicknameSchema.safeParse(newNickname);
    if (!result.success) {
      setNicknameError(result.error.errors[0].message);
      return;
    }

    setNicknameError(null);
    setLoading(true);
    let fileToUpload = avatarFile;
    let uploadedAvatarUrl = "";

    // Recortar imagen si hay cambios
    if (avatarFile && preview && croppedAreaPixels) {
      try {
        const croppedBlob = await getCroppedImg(preview, croppedAreaPixels);
        fileToUpload = new File([croppedBlob], avatarFile.name, {
          type: avatarFile.type,
        });
      } catch (e) {
        console.error(e);
        alert("❌ Error al recortar imagen");
        setLoading(false);
        return;
      }
    }

    // Subir imagen a Supabase
    if (fileToUpload) {
      const avatarValidation = avatarSchema.safeParse(fileToUpload);
      if (!avatarValidation.success) {
        alert(`❌ ${avatarValidation.error.errors[0].message}`);
        setLoading(false);
        return;
      }

      const fileExt = fileToUpload.name.split(".").pop();
      const fileName = `${player.id}.${fileExt}`;

      // Eliminar anterior
      await supabase.storage.from("avatars").remove([fileName]);

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, fileToUpload, {
          upsert: true,
        });

      if (uploadError) {
        console.error(uploadError);
        alert("❌ Error al subir la imagen");
        setLoading(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      if (!publicUrlData?.publicUrl) {
        alert("❌ No se pudo obtener la URL del avatar");
        setLoading(false);
        return;
      }

      uploadedAvatarUrl = `${publicUrlData.publicUrl}?t=${Date.now()}`;
      setNewAvatarUrl(uploadedAvatarUrl);
    }

    const hasNicknameChanged = newNickname && newNickname !== player.name;
    const hasAvatarChanged =
      uploadedAvatarUrl && uploadedAvatarUrl !== player.avatar_url;

    if (!hasNicknameChanged && !hasAvatarChanged) {
      alert("No hiciste ningún cambio.");
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from("players")
      .update({
        ...(hasNicknameChanged && { name: newNickname }),
        ...(hasAvatarChanged && { avatar_url: uploadedAvatarUrl }),
      })
      .eq("id", player.id);

    if (error) {
      console.error(error);
      alert("❌ Error al actualizar perfil");
    } else {
      alert("✅ Perfil actualizado 🎉");
      updatePlayer({
        name: hasNicknameChanged ? newNickname : player.name,
        avatar_url: hasAvatarChanged ? uploadedAvatarUrl : player.avatar_url,
      });

      // Resetear estado local
      setAvatarFile(null);
      setPreview(null);
      setNewAvatarUrl("");
      setNewNickname("");
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

          {/* Avatar actual */}
          <motion.div
            className="flex flex-col items-center"
            variants={fadeItem}
            custom={0.1}
          >
            <motion.div
              className="avatar"
              variants={expandFade}
              initial="initial"
              animate="animate"
            >
              <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden">
                <img
                  src={preview || player.avatar_url || "/default-avatar.png"}
                  alt="Avatar"
                />
              </div>
            </motion.div>
            {player.name && (
              <p className="mt-2 text-lg font-semibold text-center">
                {player.name}
              </p>
            )}
          </motion.div>

          {/* Input nickname */}
          <motion.div className="form-control" variants={fadeItem} custom={0.2}>
            <label className="label font-semibold">Cambiar usuario</label>
            <input
              type="text"
              value={newNickname}
              onChange={(e) => {
                setNewNickname(e.target.value);
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

          {/* Input avatar */}
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
              <div className="relative w-full h-64 mt-4">
                <Cropper
                  image={preview}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={(_, croppedAreaPixels) =>
                    setCroppedAreaPixels(croppedAreaPixels)
                  }
                />
              </div>
            )}
          </motion.div>

          {/* Botón de guardar */}
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
