import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./NavBar.jsx";
import "../styles/layout.css"; // ✅ Importar CSS del layout

const Layout = () => {
  return (
    <div className="layout-container">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      <footer className="footer">
        <p>© {new Date().getFullYear()} StayAwayCo — Todos los derechos reservados</p>
        <div className="footer-links">
          
        </div>
      </footer>
    </div>
  );
};

export default Layout;