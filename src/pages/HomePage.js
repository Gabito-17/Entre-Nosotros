import Acknowledgements from "../components/AboutUs/Acknowledgements.jsx";
import Introduction from "../components/AboutUs/Introduction.jsx";
import GameList from "../components/GameList.tsx";
import Footer from "../components/Layout/Footer.jsx";

const AboutUs = () => {
  return (
    <div className="bg-base-100 text-base-content">
      {/* Introducción */}
      <section className="bg-base-200">
        <Introduction />
      </section>
     
        {/* Características y funcionalidades */}
      <section className="bg-base-200">
        <GameList />
      </section>

       {/* Agradecimientos */}
      <section >
        <Acknowledgements />
      </section>


      {/* Footer */}
      <Footer />

    </div>
  );
};

export default AboutUs;
