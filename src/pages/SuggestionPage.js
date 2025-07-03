import emailjs from "emailjs-com";
import { useState } from "react";
import SuccessModal from "../components/Modals/SuccessModal";
import SuggestionForm from "../components/Suggestions/SuggestionForm.tsx";

const SuggestionsPage = () => {
  const [success, setSuccess] = useState(false);

  const sendEmail = ({ name, message }) => {
    const templateParams = { from_name: name, message };

    emailjs
      .send(
        "service_td0vyah",
        "template_4mo125z",
        templateParams,
        "e7D0znUBtgZTSt2YX"
      )
      .then(() => setSuccess(true))
      .catch((error) => console.error("Error al enviar el correo", error));
  };

  return (
    <div className="py-6 px-4 pt-24">
      <div className="mx-auto text-center">
        <h3 className="footer-title text-primary">Déjanos tu sugerencia</h3>
        <p className="text-sm mb-4">
          Ayúdanos a mejorar tu experiencia. Déjanos un comentario o sugerencia.
        </p>
        {success && (
          <SuccessModal
            onClose={() => setSuccess(false)}
            message={"¡Haremos lo posible por satisfacer sus necesidades XD!"}
          />
        )}
        <SuggestionForm onSubmit={sendEmail} />
      </div>
    </div>
  );
};

export default SuggestionsPage;
