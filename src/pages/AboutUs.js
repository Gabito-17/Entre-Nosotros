import Acknowledgements from "../components/AboutUs/Acknowledgements";
import Introduction from "../components/AboutUs/Introduction";
import Philosophy from "../components/AboutUs/Philosophy";
import Features from "../components/Features";
import Footer from "../components/Layout/Footer.jsx";

const AboutUs = () => {
  return (
    <div className="bg-base-100 text-base-content">
      {/* Introducción */}
      <Introduction />

      {/* Características y funcionalidades */}
      <section className="py-16 bg-base-200">
        <Features />
      </section>

      {/* Filosofía y Compromiso */}
      <section className="py-16">
        <Philosophy />
      </section>

      {/* Agradecimientos */}
      <section className="py-16 bg-base-200">
        <Acknowledgements />
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AboutUs;
