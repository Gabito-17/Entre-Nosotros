import Features from "../components/Features";
import Introduction from "../components/Introduction";
import Footer from "../components/Layout/Footer";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <Introduction />
      <section className="py-16 bg-base-200">
        <Features />
      </section>
      <section className="py-16 text-center">
        <h2 className="text-3xl font-bold mb-4 text-primary">
          ¡Empieza a jugar Britney hoy!
        </h2>
        <p className="text-lg text-gray-700 mb-6">
          Simplifica la forma en que juegas y mantén todo organizado.
        </p>
        <a href="/anotador" className="btn btn-primary">
          Utilizar anotador
        </a>
      </section>
      <Footer />
    </div>
  );
};

export default LandingPage;
