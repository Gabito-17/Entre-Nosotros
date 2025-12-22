
import RulesTruco from "../TrucoRulesSteps.tsx";

const RulesPage = () => {
  return (
    <div>
      <RulesTruco />

      {/* Llamado a la Acción */}
      <section className="text-center m-12">
        <a href="/truco/anotador" className="btn btn-primary btn-lg">
          Comenzar a Jugar al Truco
        </a>
      </section>

    </div>
  );
};

export default RulesPage;
