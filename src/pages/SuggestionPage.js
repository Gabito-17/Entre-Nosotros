import { CheckIcon } from "@heroicons/react/24/outline";
import emailjs from "emailjs-com";
import React, { useState } from "react";

const SuggestionsPage = () => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const templateParams = {
      from_name: name,
      message,
    };

    emailjs
      .send(
        "service_td0vyah", // Service ID de EmailJS
        "template_4mo125z", // Template ID de EmailJS
        templateParams,
        "e7D0znUBtgZTSt2YX" // User ID de EmailJS
      )
      .then(
        (response) => {
          console.log(
            "Correo enviado con éxito",
            response.status,
            response.text
          );
          setSuccess(true);
          setName("");
          setMessage("");
        },
        (error) => {
          console.log("Error al enviar el correo", error);
        }
      );
  };

  const handleCloseModal = () => {
    setSuccess(false);
  };

  return (
    <div className="min-h-screen py-6 px-4">
      <div className="mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">
          Déjanos tu Sugerencia
        </h2>
        <p className="text-md sm:text-lg mb-6">
          Queremos mejorar la experiencia en Britney, deja tu sugerencia o
          comentario.
        </p>

        {success && (
          <div className="fixed inset-0 flex items-center justify-center bg-opacity-20">
            <div className="modal-box p-6 rounded-lg shadow-lg text-center">
              <p className="text-lg font-semibold mb-4">
                ¡Gracias por tu sugerencia!
              </p>
              <button className="btn btn-circle btn-sm btn-primary p-1" onClick={handleCloseModal}>
                <CheckIcon />
              </button>
            </div>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="max-w-lg mx-auto p-8 rounded-lg shadow-lg"
        >
          <div className="mb-4">
            <label htmlFor="name" className="block text-left mb-2">
              Nombre
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input input-bordered w-full"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="message" className="block text-left mb-2">
              Mensaje
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="textarea textarea-bordered w-full"
              rows="4"
              required
            ></textarea>
          </div>

          <button type="submit" className="btn btn-primary w-full mt-4">
            Enviar Sugerencia
          </button>
        </form>
      </div>
    </div>
  );
};

export default SuggestionsPage;
