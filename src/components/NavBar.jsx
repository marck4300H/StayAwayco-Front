import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import "../styles/navbar.css";


const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="logo-container">
        <h2 className="logo-title">StayAwayCo</h2>
      </div>
      
      <div className="nav-links">
        {token ? (
          // Usuario logueado
          <>
            <button className="link-btn" onClick={() => navigate("/perfil")}>
              Mi Perfil
            </button>
            <button className="link-btn" onClick={handleLogout}>
              Cerrar Sesión
            </button>
            <FaShoppingCart className="cart-icon" size={22} />
          </>
        ) : (
          // Usuario no logueado
          <>
            <button className="link-btn" onClick={() => navigate("/login")}>
              Login
            </button>
            <button className="btn-register" onClick={() => navigate("/registro")}>
              Registro
            </button>
            <FaShoppingCart className="cart-icon" size={22} />
          </>
        )}
      </div>

      {/* Menú móvil */}
      <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </div>
      
      {menuOpen && (
        <div className="mobile-menu">
          {token ? (
            // Usuario logueado (móvil)
            <>
              <button className="mobile-link" onClick={() => { navigate("/perfil"); setMenuOpen(false); }}>
                Mi Perfil
              </button>
              <button className="mobile-link" onClick={() => { handleLogout(); setMenuOpen(false); }}>
                Cerrar Sesión
              </button>
            </>
          ) : (
            // Usuario no logueado (móvil)
            <>
              <button className="mobile-link" onClick={() => { navigate("/login"); setMenuOpen(false); }}>
                Login
              </button>
              <button className="mobile-btn-register" onClick={() => { navigate("/registro"); setMenuOpen(false); }}>
                Registro
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