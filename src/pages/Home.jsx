import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../api";
import { FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import "../styles/home.css";

export default function Home() {
  const [rifas, setRifas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRifas = async () => {
      try {
        const res = await fetch(`${API_URL}/rifas/listar`);
        if (!res.ok) throw new Error("Error al obtener las rifas");
        const data = await res.json();
        if (data.success) setRifas(data.rifas);
        else setError("No se pudieron cargar las rifas.");
      } catch (err) {
        console.error("❌ Error al cargar rifas:", err);
        setError("Error de conexión con el servidor.");
      } finally {
        setLoading(false);
      }
    };
    fetchRifas();
  }, []);

  return (
    <div className="home-container">
      {/* NAVBAR */}
      <nav className="navbar">
        {/* Logo */}
        <div className="logo-container">
          <img src="/logo.png" alt="Logo" className="logo-img" />
          <h2 className="logo-title">StayAwayCo</h2>
        </div>

        {/* Links */}
        <div className="nav-links">
          <button className="link-btn" onClick={() => navigate("/login")}>
            Login
          </button>

          <Link to="/registro" className="btn-register">
            Registro
          </Link>

          <FaShoppingCart className="cart-icon" size={22} />
        </div>

        {/* Ícono móvil */}
        <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </div>

        {/* Menú móvil */}
        {menuOpen && (
          <div className="mobile-menu">
            <Link to="/login" className="mobile-link">Login</Link>

            <Link to="/registro" className="mobile-btn-register">
              Registro
            </Link>

            <FaShoppingCart size={20} className="mobile-cart" />
          </div>
        )}
      </nav>

      {/* HEADER */}
      <header className="header">
        <h1 className="header-title">🎟️ Trata De Esclavas</h1>
        <p className="header-subtitle">
          Participa en rifas exclusivas y ganate una exclava de nuestro catalogo.
        </p>
      </header>

      {/* ESTADOS */}
      {loading && <p className="loading-text">Cargando rifas...</p>}
      {error && <p className="error-text">{error}</p>}
      {!loading && !error && rifas.length === 0 && (
        <p className="no-rifas">No hay rifas disponibles por el momento.</p>
      )}

      {/* CARDS */}
      <div className="rifas-grid">
        {rifas.map((rifa) => (
          <div key={rifa.id} className="rifa-card">
            <img src={rifa.imagen_url} alt={rifa.titulo} className="rifa-img" />

            <div className="rifa-content">
              <h3 className="rifa-title">{rifa.titulo}</h3>
              <p className="rifa-desc">{rifa.descripcion}</p>
              <button className="rifa-btn">Ver más</button>
            </div>
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} StayAwayCo — Todos los derechos reservados</p>
        <Link to="/admin/login" className="admin-link">
          Panel de administrador →
        </Link>
      </footer>
    </div>
  );
}
