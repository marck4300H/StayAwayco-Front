import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart, FaBars, FaTimes, FaUserShield } from "react-icons/fa";
import "../styles/navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userType = localStorage.getItem("userType");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    navigate("/");
  };

  const handleAdminPanel = () => {
    if (userType === "admin") {
      navigate("/admin/dashboard");
    }
  };

  return (
    <nav className="navbar">
      {/* UNA SOLA LÍNEA */}
      <div className="navbar-line">
        {/* LOGO IZQUIERDA */}
        <div className="logo-container">
          <h2 onClick={() => navigate("/")} className="logo-title">
            StayAway
          </h2>
          {userType === "admin" && (
            <span className="admin-badge" title="Administrador">
              <FaUserShield size={14} />
            </span>
          )}
        </div>

        {/* OPCIONES DERECHA - SIEMPRE IGUAL */}
        <div className="navbar-right">
          <a href="#rifas" className="nav-link">Rifas</a>
          <a href="#como-funciona" className="nav-link">Cómo funciona</a>
          <a href="#contacto" className="nav-link">Contacto</a>
          
          {/* Botones dinámicos pero en línea */}
          {token ? (
            <>
              <button className="link-btn" onClick={() => navigate("/perfil")}>
                Mi Perfil
              </button>
              <button className="link-btn" onClick={handleLogout}>
                Cerrar Sesión
              </button>
              {userType === "admin" && (
                <button className="link-btn admin-btn" onClick={handleAdminPanel}>
                  Admin
                </button>
              )}
            </>
          ) : (
            <>
              <button className="link-btn" onClick={() => navigate("/login")}>
                Iniciar Sesión
              </button>
              <button className="btn-register" onClick={() => navigate("/registro")}>
                Registrarse
              </button>
            </>
          )}
          
          <FaShoppingCart className="cart-icon" size={18} />
        </div>

        {/* Hamburguesa móvil */}
        <button className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>

      {/* Menú móvil */}
      {menuOpen && (
        <div className="mobile-menu">
          <a href="#rifas" className="mobile-nav-link">Rifas</a>
          <a href="#como-funciona" className="mobile-nav-link">Cómo funciona</a>
          <a href="#contacto" className="mobile-nav-link">Contacto</a>
          
          {token ? (
            <>
              <button className="mobile-link" onClick={() => { navigate("/perfil"); setMenuOpen(false); }}>
                Mi Perfil
              </button>
              {userType === "admin" && (
                <button className="mobile-link admin-link" onClick={() => { handleAdminPanel(); setMenuOpen(false); }}>
                  Panel Admin
                </button>
              )}
              <button className="mobile-link" onClick={() => { handleLogout(); setMenuOpen(false); }}>
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <button className="mobile-link" onClick={() => { navigate("/login"); setMenuOpen(false); }}>
                Iniciar Sesión
              </button>
              <button className="mobile-btn-register" onClick={() => { navigate("/registro"); setMenuOpen(false); }}>
                Registrarse
              </button>
            </>
          )}
          <FaShoppingCart size={20} className="mobile-cart" />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
