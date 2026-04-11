import React from "react";
import { Outlet, Link } from "react-router-dom";
import Navbar from "./NavBar.jsx";
import "../styles/layout.css";

const Layout = () => {
  return (
    <div className="layout-container">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      
      {/* ===== NUEVO FOOTER MEJORADO ===== */}
      <footer className="footer-v2">
        <div className="footer-top">
          <div className="footer-col brand-col">
            <h2 className="footer-logo">StayAway</h2>
            <p className="footer-desc">
              La plataforma más segura y transparente para participar en actividades y ganar increíbles premios desde Colombia.
            </p>
          </div>
          
          <div className="footer-col links-col">
            <h3>Explorar</h3>
            <ul>
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/como-funciona">¿Cómo funciona?</Link></li>
              <li><Link to="/contacto">Contacto</Link></li>
              <li><Link to="/perfil">Mi Perfil</Link></li>
            </ul>
          </div>
          
          <div className="footer-col links-col">
            <h3>Legal</h3>
            <ul>
              <li><Link to="/terminos">Términos y Condiciones</Link></li>
              {/* Puedes añadir más links como políticas de privacidad si los creas luego */}
            </ul>
          </div>

          <div className="footer-col contact-col">
            <h3>Atención al Cliente</h3>
            <p>📍 Vijes, Valle del Cauca</p>
            <p>📞 <a href="tel:+573136787040">+57 313 678 70 40</a></p>
            <p>✉️ <a href="mailto:stayaway.col@gmail.com">stayaway.col@gmail.com</a></p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} StayAway. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;