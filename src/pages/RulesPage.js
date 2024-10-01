import React from "react";
import RulesSteps from "../components/RulesSteps";

const RulesPage = () => {
  return (
    <div className="min-h-screen bg-base-100 flex flex-col items-center">
            
        <RulesSteps/>

      {/* Llamado a la Acción */}
      <section className="text-center mt-12">
        <a href="/anotador" className="btn btn-primary btn-lg">
          Comienza a Jugar Ahora
        </a>
      </section>
    </div>
  );
};

export default RulesPage;
