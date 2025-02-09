import React from "react";
import Introduction from "../components/AboutUs/Introduction";
import Features from "../components/AboutUs/Features";
import Philosophy from "../components/AboutUs/Philosophy";
import Acknowledgements from "../components/AboutUs/Acknowledgements";
import Footer from "../components/Layout/Footer";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-base-100 text-base-content">
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
