import emailjs from "emailjs-com";
import { useState } from "react";
import SuccessModal from "../components/Modals/SuccessModal";
import SuggestionForm from "../components/Suggestions/SuggestionForm";

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
    <div className="min-h-screen py-6 px-4">
      <div className="mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-primary">
          Déjanos una Sugerencia
        </h2>
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
