import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart, FaBars, FaTimes, FaUserShield } from "react-icons/fa";
import "../styles/navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userType = localStorage.getItem("userType"); // 'admin' o 'user'

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
      <div className="logo-container">
        <h2 onClick={() => navigate("/")} className="logo-title">StayAwayCo</h2>
        {userType === "admin" && (
          <span className="admin-badge" title="Administrador">
            <FaUserShield size={16} />
          </span>
        )}
      </div>
      
      <div className="nav-links">
        {token ? (
          // Usuario logueado (admin o user)
          <>
            {userType === "admin" && (
              <button className="link-btn admin-btn" onClick={handleAdminPanel}>
                <FaUserShield /> Panel Admin
              </button>
            )}
            <button className="link-btn" onClick={() => navigate("/perfil")}>
              Mi Perfil {userType === "admin" && "(Admin)"}
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
      <button className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>
      
      {menuOpen && (
        <div className="mobile-menu">
          {token ? (
            // Usuario logueado (móvil)
            <>
              {userType === "admin" && (
                <button className="mobile-link admin-link" onClick={() => { handleAdminPanel(); setMenuOpen(false); }}>
                  <FaUserShield /> Panel Admin
                </button>
              )}
              <button className="mobile-link" onClick={() => { navigate("/perfil"); setMenuOpen(false); }}>
                Mi Perfil {userType === "admin" && "(Admin)"}
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