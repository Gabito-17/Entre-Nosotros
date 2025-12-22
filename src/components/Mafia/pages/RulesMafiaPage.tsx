import RulesSteps from "../MafiaRulesSteps.tsx";

const RulesPage = () => {
  return (
    <div>
      <RulesSteps />
      {/* Llamado a la Acción */}
      <section className="text-center m-12">
        <a href="/mafia/game" className="btn btn-primary btn-lg">
          Comienza a Jugar Ahora
        </a>
      </section>

    </div>
  );
};

export default RulesPage;
