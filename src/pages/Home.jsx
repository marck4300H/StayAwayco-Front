import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../api";
import { FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import "../styles/home.css";
import ProgressBar from "../components/ProgressBar";

export default function Home() {
  const [rifas, setRifas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRifas = async () => {
      try {
        // CORREGIDO: endpoint correcto
        const res = await fetch(`${API_URL}/rifas/`);
        if (!res.ok) throw new Error("Error al obtener las rifas");
        const data = await res.json();
        if (!data.success) throw new Error("No se pudieron cargar las rifas.");

        // Para cada rifa, obtener su estado directamente del backend
        const rifasConEstado = await Promise.all(
          data.rifas.map(async (rifa) => {
            try {
              const resEstado = await fetch(`${API_URL}/rifas/${rifa.id}`);
              if (!resEstado.ok) throw new Error("Error al obtener estado de rifa");
              const estado = await resEstado.json();

              // El backend ya devuelve disponibles, vendidos y porcentaje
              return {
                ...rifa,
                disponibles: estado.disponibles ?? 0,
                vendidos: estado.vendidos ?? 0,
                porcentaje: estado.porcentaje ?? 0,
              };
            } catch (err) {
              console.error("❌ Error obteniendo estado de rifa:", err);
              return { ...rifa, vendidos: 0, porcentaje: 0, disponibles: rifa.cantidad_numeros };
            }
          })
        );

        setRifas(rifasConEstado);
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
      <nav className="navbar">
        <div className="logo-container"><h2 className="logo-title">StayAwayCo</h2></div>
        <div className="nav-links">
          <button className="link-btn" onClick={() => navigate("/login")}>Login</button>
          <button className="btn-register" onClick={() => navigate("/registro")}>Registro</button>
          <FaShoppingCart className="cart-icon" size={22} />
        </div>
        <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </div>
        {menuOpen && (
          <div className="mobile-menu">
            <Link to="/login" className="mobile-link">Login</Link>
            <Link to="/registro" className="mobile-btn-register">Registro</Link>
            <FaShoppingCart size={20} className="mobile-cart" />
          </div>
        )}
      </nav>

      <header className="header">
        <link rel="icon" href="../../public/SA.png" type="image/png"></link>
        <h1 className="header-title">🎟️ Adquiere tus tickets Pablo</h1>
        <p className="header-subtitle">
          Participa en nuestros eventos invirtiendo en los tickets y podrías ser el próximo dueño de una moto de alto CC.
        </p>
      </header>

      {loading && <p className="loading-text">Cargando rifas...</p>}
      {error && <p className="error-text">{error}</p>}
      {!loading && !error && rifas.length === 0 && <p className="no-rifas">No hay rifas disponibles por el momento.</p>}

      <div className="rifas-grid">
        {rifas.map((rifa) => (
          <div key={rifa.id} className="rifa-card">
            <img src={rifa.imagen_url} alt={rifa.titulo} className="rifa-img" />
            <div className="rifa-content">
              <h3 className="rifa-title">{rifa.titulo}</h3>
              <p className="rifa-desc">{rifa.descripcion}</p>

              {typeof rifa.porcentaje === "number" && <ProgressBar porcentaje={rifa.porcentaje} />}

              <button className="rifa-btn" onClick={() => navigate("/comprar", { state: { rifa } })}>
                Comprar
              </button>
            </div>
          </div>
        ))}
      </div>

      <footer className="footer">
        <p>© {new Date().getFullYear()} StayAwayCo — Todos los derechos reservados</p>
        <Link to="/admin/login" className="admin-link">Panel de administrador →</Link>
        <Link to="/perfil" className="admin-link">Perfil →</Link>
      </footer>
    </div>
  );
}
