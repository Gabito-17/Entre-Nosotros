import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-10">
      <div className="container mx-auto px-4 lg:px-20">
        {/* Contact Section */}
        <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start lg:space-y-0 space-y-6 lg:space-y-0">
          {/* Contact Info */}
          <div className="text-center lg:text-left">
            <h3 className="text-lg font-bold mb-4">Contacto</h3>
            <p className="text-sm mb-2">📧 <a href="mailto:juangabrielpavon@gmail.com" className="hover:underline">juangabrielpavon@gmail.com</a></p>
            <p className="text-sm">📞 +54 3751 31**79</p>
          </div>

          {/* Social Links */}
          <div className="text-center lg:text-left">
            <h3 className="text-lg font-bold mb-4">Síguenos</h3>
            <div className="flex justify-center lg:justify-start space-x-4">
              <a href="#" className="text-white hover:text-gray-200" aria-label="Facebook">
                <i className="fab fa-facebook text-2xl"></i>
              </a>
              <a href="#" className="text-white hover:text-gray-200" aria-label="Twitter">
                <i className="fab fa-twitter text-2xl"></i>
              </a>
              <a href="#" className="text-white hover:text-gray-200" aria-label="Instagram">
                <i className="fab fa-instagram text-2xl"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white border-opacity-50 my-8"></div>

        {/* Footer Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-center lg:text-left">
          <p className="mb-4 md:mb-0">© 2024 Britney. Todos los derechos reservados.</p>
          <p>Diseñado con ❤️ por el equipo Britney.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;