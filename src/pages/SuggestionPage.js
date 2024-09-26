import React, { useState } from "react";
import Modal from "../components/Modal";

const SuggestionsPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí podrías agregar lógica para enviar el mensaje a un backend o un servicio de email
    setSuccess(true); // Simulando éxito en el envío
    // Reiniciar el formulario
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="min-h-screen py-6  px-4">
      <div className="mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">
          Déjanos tu Sugerencia
        </h2>
        <p className="text-md sm:text-lg mb-6">
          Queremos mejorar la experiencia en Britney, deja tu sugerencia o
          comentario.
        </p>

        {success && (
          <p className="text-green-500 mb-6">¡Gracias por tu sugerencia!</p>
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
            <label htmlFor="email" className="block text-left mb-2">
              Correo Electrónico
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

          <Modal />
        </form>
      </div>
    </div>
  );
};

export default SuggestionsPage;
