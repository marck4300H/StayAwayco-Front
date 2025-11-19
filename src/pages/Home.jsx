import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../api";
import "../styles/home.css";
import ProgressBar from "../components/ProgressBar";

export default function Home() {
  const [rifas, setRifas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRifas = async () => {
      try {
        const res = await fetch(`${API_URL}/rifas/`);
        if (!res.ok) throw new Error("Error al obtener las rifas");
        const data = await res.json();
        
        if (!data.success) throw new Error("No se pudieron cargar las rifas.");

        const rifasConEstado = data.rifas.map(rifa => ({
          ...rifa,
          disponibles: Number(rifa.disponibles) || 0,
          vendidos: Number(rifa.vendidos) || 0,
          porcentaje: Number(rifa.porcentaje) || 0,
          precio_unitario: rifa.precio_unitario || 1000,
          cantidad_minima: rifa.cantidad_minima || 5
        }));

        console.log("📊 Rifas cargadas:", rifasConEstado);
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
    <div className="home-page">
      <header className="header">
        <h1 className="header-title">🎟️ Adquiere tus tickets</h1>
        <p className="header-subtitle">
          Participa en nuestros eventos invirtiendo en los tickets y podrías ser el próximo dueño de una moto de alto CC.
        </p>
      </header>

      {loading && <p className="loading-text">Cargando rifas...</p>}
      {error && <p className="error-text">{error}</p>}
      {!loading && !error && rifas.length === 0 && (
        <p className="no-rifas">No hay rifas disponibles por el momento.</p>
      )}

      <div className="rifas-grid">
        {rifas.map((rifa) => (
          <div key={rifa.id} className="rifa-card">
            <img src={rifa.imagen_url} alt={rifa.titulo} className="rifa-img" />
            <div className="rifa-content">
              <h3 className="rifa-title">{rifa.titulo}</h3>
              <p className="rifa-desc">{rifa.descripcion}</p>

              {typeof rifa.porcentaje === "number" && (
                <ProgressBar porcentaje={rifa.porcentaje} />
              )}

              <div className="rifa-stats">
                <span>{rifa.vendidos} vendidos</span>
                <span>{rifa.disponibles} disponibles</span>
                <span>${(rifa.precio_unitario || 1000).toLocaleString()} c/u</span>
                <span>Mín: {rifa.cantidad_minima || 5} tickets</span>
              </div>

              <button 
                className="rifa-btn" 
                onClick={() => navigate("/comprar", { state: { rifa } })}
              >
                Comprar Números
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}