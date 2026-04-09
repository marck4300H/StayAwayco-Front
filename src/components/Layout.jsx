import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./NavBar.jsx";
import "../styles/layout.css";

const Layout = () => {
  return (
    <div className="layout-container">
      <Navbar />

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>StayAwayCo</h3>
            <p>
              Plataforma de rifas en línea con pagos seguros, procesos simples
              y una experiencia pensada para que comprar tus números sea rápido y confiable.
            </p>
          </div>

          <div className="footer-section">
            <h4>Autorización</h4>
            <div className="footer-coljuegos">
              <span className="footer-coljuegos-text">Autoriza</span>
              <div className="footer-coljuegos-box">
                <img
                  src="/coljuegos.jpg"
                  alt="Logo de Coljuegos"
                  className="footer-coljuegos-logo"
                />
              </div>
              <p className="footer-coljuegos-copy">
                Operación sujeta a autorización y regulación aplicable en Colombia.
              </p>
            </div>
          </div>

          <div className="footer-section">
            <h4>Contacto</h4>
            <div className="footer-contact">
              <p>📞 +57 300 000 0000</p>
              <p>✉️ contacto@stayaway.com</p>
              <p>📍 Colombia</p>
            </div>
          </div>

          <div className="footer-section">
            <h4>Síguenos</h4>
            <div className="footer-social">
              <a
                href="https://facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook de StayAwayCo"
              >
                Facebook
              </a>

              <a
                href="https://instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram de StayAwayCo"
              >
                Instagram
              </a>

              <a
                href="https://wa.me/573000000000"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp de StayAwayCo"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} StayAwayCo — Todos los derechos reservados</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
