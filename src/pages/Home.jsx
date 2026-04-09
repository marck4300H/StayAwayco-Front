import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../api";
import "../styles/home.css";
import ProgressBar from "../components/ProgressBar";

export default function Home() {
  const [rifas, setRifas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState({
    dias: "00",
    horas: "00",
    mins: "00",
    segs: "00",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRifas = async () => {
      try {
        const res = await fetch(`${API_URL}/rifas/`);
        if (!res.ok) throw new Error("Error al obtener las rifas");
        const data = await res.json();

        if (!data.success) throw new Error("No se pudieron cargar las rifas.");

        const rifasConEstado = data.rifas.map((rifa) => ({
          ...rifa,
          disponibles: Number(rifa.disponibles) || 0,
          vendidos: Number(rifa.vendidos) || 0,
          porcentaje: Number(rifa.porcentaje) || 0,
          precio_unitario: rifa.precio_unitario || 1000,
          cantidad_minima: rifa.cantidad_minima || 5,
          estado: rifa.estado || "activa",
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

  // Countdown real usando rifas[0].fecha_sorteo
  useEffect(() => {
    if (!rifas[0] || !rifas[0].fecha_sorteo) return;

    const targetDate = new Date(rifas[0].fecha_sorteo).getTime();

    const update = () => {
      const now = Date.now();
      const diff = targetDate - now;

      if (diff <= 0) {
        setTimeLeft({ dias: "00", horas: "00", mins: "00", segs: "00" });
        return;
      }

      const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
      const horas = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / (1000 * 60)) % 60);
      const segs = Math.floor((diff / 1000) % 60);

      setTimeLeft({
        dias: String(dias).padStart(2, "0"),
        horas: String(horas).padStart(2, "0"),
        mins: String(mins).padStart(2, "0"),
        segs: String(segs).padStart(2, "0"),
      });
    };

    update();
    const intervalId = setInterval(update, 1000);
    return () => clearInterval(intervalId);
  }, [rifas]);

  const renderRifaCard = (rifa) => {
    // Rifa sorteada
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
                  Sorteada el{" "}
                  {new Date(rifa.fecha_sorteo).toLocaleDateString("es-CO", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              )}

              {rifa.loteria_referencia && (
                <p className="loteria-ref">📋 {rifa.loteria_referencia}</p>
              )}
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
          <img
            src={rifa.imagen_url}
            alt={rifa.titulo}
            className="rifa-img rifa-img-disabled"
          />
          <div className="rifa-content">
            <h3 className="rifa-title">{rifa.titulo}</h3>
            <p className="rifa-desc">{rifa.descripcion}</p>
            <p className="mensaje-cancelada">Esta rifa ha sido cancelada</p>
          </div>
        </div>
      );
    }

    // Rifa activa
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
            <span>${rifa.precio_unitario.toLocaleString()} c/u</span>
            <span>Mín: {rifa.cantidad_minima} Números</span>
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
      {/* HERO NUEVO */}
      <section className="hero">
        <div className="hero-left">
          <span className="hero-badge">Sorteo en vivo</span>
          <h1 className="hero-title">
            Gana la <span>Moto</span> de tus Sueños
          </h1>
          <p className="hero-text">
            Participa en nuestras rifas con poco dinero, accesible para todo el
            mundo. Calidad, seguridad y emoción en cada sorteo.
          </p>

          <div className="hero-actions">
            <button
              className="btn-primary"
              onClick={() => {
                const primeraActiva = rifas.find((r) => r.estado === "activa");
                if (primeraActiva) {
                  navigate("/comprar", { state: { rifa: primeraActiva } });
                }
              }}
              disabled={!rifas.some((r) => r.estado === "activa")}
            >
              Participar Ahora
            </button>

          </div>
        </div>

        <div className="hero-right">
          <div className="hero-image-card">
            {rifas[0] ? (
              <img src={rifas[0].imagen_url} alt={rifas[0].titulo} />
            ) : (
              <img
                src="https://via.placeholder.com/600x400?text=Tu+próxima+moto"
                alt="Moto"
              />
            )}
          </div>
        </div>
      </section>

      {/* BLOQUE ESTADO DEL SORTEO COMPACTO */}
      {rifas[0] && (
        <section className="sorteo-status">
          <div className="sorteo-status-left">
            <p className="sorteo-status-label">⏱ Finaliza en:</p>
            <div className="sorteo-countdown">
              <div className="sorteo-count-box">
                <span className="sorteo-count-value">{timeLeft.dias}</span>
                <span className="sorteo-count-text">DÍAS</span>
              </div>
              <div className="sorteo-count-box">
                <span className="sorteo-count-value">{timeLeft.horas}</span>
                <span className="sorteo-count-text">HORAS</span>
              </div>
              <div className="sorteo-count-box">
                <span className="sorteo-count-value">{timeLeft.mins}</span>
                <span className="sorteo-count-text">MINS</span>
              </div>
              <div className="sorteo-count-box">
                <span className="sorteo-count-value">{timeLeft.segs}</span>
                <span className="sorteo-count-text">SEGS</span>
              </div>
            </div>
          </div>

          <div className="sorteo-status-right">
            <div className="sorteo-status-header">
              <span className="sorteo-status-title">Estado del Sorteo</span>
              <span className="sorteo-status-percent">
                {rifas[0].porcentaje || 0}%
              </span>
            </div>

            <div className="sorteo-status-bar-wrapper">
              <div className="sorteo-status-bar">
                <div
                  className="sorteo-status-bar-fill"
                  style={{ width: `${rifas[0].porcentaje || 0}%` }}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* LISTADO ORIGINAL DE RIFAS */}
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
