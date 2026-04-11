import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../api";
import "../styles/home.css";

const ActividadBanner = ({ actividad }) => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState({ dias: "00", horas: "00", mins: "00", segs: "00" });

  useEffect(() => {
    if (!actividad.fecha_sorteo) return;

    const targetDate = new Date(actividad.fecha_sorteo).getTime();

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
  }, [actividad.fecha_sorteo]);

  // Si la actividad está sorteada o cancelada, se pueden mostrar botones grises o distintos
  const isActiva = actividad.estado === "activa";
  let statusLabel = "Actividad en vivo";
  if (actividad.estado === "sorteada") statusLabel = "Actividad Finalizada";
  if (actividad.estado === "cancelada") statusLabel = "Actividad Cancelada";

  return (
    <div className={`actividad-wrapper ${!isActiva ? 'actividad-inactiva' : ''}`}>
      <section className="hero">
        <div className="hero-left">
          <span className="hero-badge" style={{ backgroundColor: isActiva ? "" : "#6c757d" }}>
            {statusLabel}
          </span>
          <h1 className="hero-title">
            {actividad.titulo}
          </h1>
          <p className="hero-text">
            {actividad.descripcion}
          </p>

          <div className="hero-actions">
            {isActiva ? (
              <button
                className="btn-primary"
                onClick={() => navigate("/comprar", { state: { rifa: actividad } })}
              >
                Comprar Calcas
              </button>
            ) : (
              <button className="btn-primary" disabled style={{ backgroundColor: "#6c757d", cursor: "not-allowed" }}>
                {actividad.estado === "sorteada" ? "Ganador: #" + actividad.numero_ganador : "Cancelada"}
              </button>
            )}
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-image-card">
            <img src={actividad.imagen_url || "https://via.placeholder.com/600x400"} alt={actividad.titulo} />
          </div>
        </div>
      </section>

      {/* BLOQUE ESTADO DEL SORTEO COMPACTO */}
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
            <span className="sorteo-status-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              Estado de la Actividad
              {actividad.porcentaje >= 80 && (
                <span style={{ color: "#ff4757", fontSize: "0.85em", fontWeight: "bold", backgroundColor: "rgba(255, 71, 87, 0.1)", padding: "2px 8px", borderRadius: "12px" }}>
                  🔥 ¡Ya casi está agotado!
                </span>
              )}
            </span>
            <span className="sorteo-status-percent">
              {actividad.porcentaje || 0}%
            </span>
          </div>

          <div className="sorteo-status-bar-wrapper">
            <div className="sorteo-status-bar">
              <div
                className="sorteo-status-bar-fill"
                style={{ width: `${actividad.porcentaje || 0}%` }}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default function Home() {
  const [actividades, setActividades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchActividades = async () => {
      try {
        const res = await fetch(`${API_URL}/rifas/`);
        if (!res.ok) throw new Error("Error al obtener las actividades");
        const data = await res.json();

        if (!data.success) throw new Error("No se pudieron cargar las actividades.");

        const actConEstado = data.rifas.map((act) => ({
          ...act,
          disponibles: Number(act.disponibles) || 0,
          vendidos: Number(act.vendidos) || 0,
          porcentaje: Number(act.porcentaje) || 0,
          precio_unitario: act.precio_unitario || 1000,
          cantidad_minima: act.cantidad_minima || 5,
          estado: act.estado || "activa",
        }));

        console.log("📊 Actividades cargadas:", actConEstado);
        setActividades(actConEstado);
      } catch (err) {
        console.error("❌ Error al cargar actividades:", err);
        setError("Error de conexión con el servidor.");
      } finally {
        setLoading(false);
      }
    };

    fetchActividades();
  }, []);

  return (
    <div className="home-page">
      {loading && <p className="loading-text">Cargando actividades...</p>}
      {error && <p className="error-text">{error}</p>}
      {!loading && !error && actividades.length === 0 && (
        <p className="no-rifas" style={{ textAlign: 'center', marginTop: '2rem' }}>No hay actividades disponibles por el momento.</p>
      )}

      {actividades.map((actividad) => (
        <ActividadBanner key={actividad.id} actividad={actividad} />
      ))}
    </div>
  );
}
