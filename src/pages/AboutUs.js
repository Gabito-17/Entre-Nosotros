import Acknowledgements from "../components/AboutUs/Acknowledgements";
import Introduction from "../components/AboutUs/Introduction";
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

      {/* Agradecimientos */}
      <section className="py-16 ">
        <Acknowledgements />
      </section>
      {/* Footer */}
      <Footer />

    </div>
  );
};

export default AboutUs;
