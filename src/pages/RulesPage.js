import React from "react";
import Footer from "../components/Layout/Footer";
import RulesSteps from "../components/RulesSteps";

const RulesPage = () => {
  return (
    <div>
      <RulesSteps/>
      {/* Llamado a la Acción */}
      <section className="text-center m-12">
        <a href="/anotador" className="btn btn-secondary btn-lg">
          Comienza a Jugar Ahora
        </a>
      </section>

      <Footer />
    </div>
  );
};

export default RulesPage;
