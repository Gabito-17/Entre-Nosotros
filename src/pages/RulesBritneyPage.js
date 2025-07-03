import RulesSteps from "../components/Britney/RulesSteps";
import Footer from "../components/Layout/Footer.jsx";

const RulesPage = () => {
  return (
    <div>
      <RulesSteps />
      {/* Llamado a la Acción */}
      <section className="text-center m-12">
        <a href="/anotador" className="btn btn-primary btn-lg">
          Comienza a Jugar Ahora
        </a>
      </section>

      <Footer />
    </div>
  );
};

export default RulesPage;
