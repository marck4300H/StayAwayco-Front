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
          cantidad_minima: rifa.cantidad_minima || 5,
          estado: rifa.estado || "activa"
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

  const renderRifaCard = (rifa) => {
    // Rifa sorteada - mostrar ganador
    if (rifa.estado === "sorteada") {
      return (
        <div key={rifa.id} className="rifa-card rifa-sorteada">
          <div className="banner-sorteada">
            <span className="trophy-icon">🏆</span>
            <span>RIFA SORTEADA</span>
          </div>
          <img src={rifa.imagen_url} alt={rifa.titulo} className="rifa-img" />
          <div className="rifa-content">
            <h3 className="rifa-title">{rifa.titulo}</h3>
            <p className="rifa-desc">{rifa.descripcion}</p>

            <div className="ganador-info">
              <div className="numero-ganador-box">
                <span className="label-ganador">Número Ganador</span>
                <span className="numero-ganador">#{rifa.numero_ganador}</span>
              </div>
              
              {rifa.ganador && (
                <div className="ganador-nombre-box">
                  <span className="label-ganador">Ganador</span>
                  <span className="ganador-nombre">{rifa.ganador.nombre_completo}</span>
                </div>
              )}

              {rifa.fecha_sorteo && (
                <p className="fecha-sorteo">
                  Sorteada el {new Date(rifa.fecha_sorteo).toLocaleDateString("es-CO", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  })}
                </p>
              )}

              {rifa.loteria_referencia && (
                <p className="loteria-ref">
                  📋 {rifa.loteria_referencia}
                </p>
              )}
            </div>

            <div className="rifa-stats">
              <span>{rifa.vendidos} números vendidos</span>
              <span>${rifa.precio_unitario.toLocaleString()} c/u</span>
            </div>
          </div>
        </div>
      );
    }

    // Rifa cancelada
    if (rifa.estado === "cancelada") {
      return (
        <div key={rifa.id} className="rifa-card rifa-cancelada">
          <div className="banner-cancelada">
            <span>❌</span>
            <span>RIFA CANCELADA</span>
          </div>
          <img src={rifa.imagen_url} alt={rifa.titulo} className="rifa-img rifa-img-disabled" />
          <div className="rifa-content">
            <h3 className="rifa-title">{rifa.titulo}</h3>
            <p className="rifa-desc">{rifa.descripcion}</p>
            <p className="mensaje-cancelada">Esta rifa ha sido cancelada</p>
          </div>
        </div>
      );
    }

    // Rifa activa - mostrar botón de compra
    return (
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
            <span>${rifa.precio_unitario.toLocaleString()} c/u</span>
            <span>Mín: {rifa.cantidad_minima} tickets</span>
          </div>

          <button 
            className="rifa-btn" 
            onClick={() => navigate("/comprar", { state: { rifa } })}
          >
            Comprar Números
          </button>
        </div>
      </div>
    );
  };

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
        {rifas.map((rifa) => renderRifaCard(rifa))}
      </div>
    </div>
  );
}
