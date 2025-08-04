import { z } from "zod";

// Nombre del jugador: solo letras (mayúsculas, minúsculas), espacios, acentos y diéresis, sin números
export const playerNameSchema = z
  .string()
  .min(2, "El nombre debe tener al menos 2 caracteres")
  .max(14, "El nombre es demasiado largo")
  .regex(
    /^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ\s]+$/,
    "El nombre solo puede contener letras, espacios y caracteres acentuados"
  );

// Puntaje: números enteros entre 1 y 100 (inclusive)
export const scoreSchema = z
  .number()
  .int("El puntaje debe ser un número entero")
  .refine(
    (n) => (n >= 0 && n <= 100) || n === -10,
    "El puntaje debe estar entre 0 y 100 o -10"
  );
// .min(1, "El puntaje debe ser al menos 1")
// .max(100, "El puntaje no puede superar 100");

// Puntaje especial -10 (por ejemplo para el botón -10)
// export const scoreOrMinusTenSchema = z.union([scoreSchema, z.literal(-10)]);

// Nickname: minimo de 1 y macimo de 16 caracteres
export const nicknameSchema = z
  .string()
  .min(1, "El nickname no puede estar vacío")
  .max(16, "El nickname no puede tener más de 16 caracteres");

// Avatar: archivo de imagen opcional (JPEG, PNG o WEBP) con un tamaño máximo de 1 MB
export const avatarSchema = z
  .custom<File>((file) => file instanceof File, {
    message: "Debe ser un archivo",
  })
  .refine((file) => file.size <= 3 * 1024 * 1024, {
    message: "El avatar no debe pesar más de 3MB",
  })
  .refine(
    (file) =>
      ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(
        file.type
      ),
    {
      message: "Formato inválido (solo JPG, PNG, WEBP, GIF)",
    }
  );
