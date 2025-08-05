// utils/cropImage.ts
export default async function getCroppedImg(
  imageSrc: string,
  crop: { x: number; y: number; width: number; height: number }
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous"; // Para evitar problemas de CORS si la imagen es externa
    image.src = imageSrc;

    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = crop.width;
      canvas.height = crop.height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("No se pudo obtener el contexto del canvas"));
        return;
      }

      // Dibujar la parte recortada en el canvas
      ctx.drawImage(
        image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        crop.width,
        crop.height
      );

      // Convertir el canvas a Blob en PNG
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Error al generar blob del canvas"));
          return;
        }
        resolve(blob);
      }, "image/png");
    };

    image.onerror = (error) => {
      reject(error);
    };
  });
}
