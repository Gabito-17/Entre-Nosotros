import { useState } from "react";

const SuggestionForm = ({ onSubmit }) => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, message });
    setName("");
    setMessage("");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-8 rounded-lg shadow-lg">
      <div className="mb-4">
        <label htmlFor="name" className="block text-left mb-2">Nombre</label>
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
        <label htmlFor="message" className="block text-left mb-2">Mensaje</label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="textarea textarea-bordered w-full"
          rows="4"
          required
        ></textarea>
      </div>

      <button type="submit" className="btn btn-secondary w-full mt-4">
        Enviar Sugerencia
      </button>
    </form>
  );
};

export default SuggestionForm;