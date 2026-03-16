import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { API_URL } from "../api";
import "../styles/comprar.css";

export default function Comprar() {
  const navigate = useNavigate();
  const location = useLocation();
  const rifa = location.state?.rifa;

  const [cantidad, setCantidad] = useState(rifa?.cantidad_minima || 5);
  const [error, setError] = useState("");

  // Countdown estado
  const [timeLeft, setTimeLeft] = useState({
    dias: "00",
    horas: "00",
    mins: "00",
    segs: "00",
  });

  // Variables DINÁMICAS
  const precioUnitario = rifa?.precio_unitario || 1000;
  const cantidadMinima = rifa?.cantidad_minima || 5;
  const disponibles = rifa?.disponibles || 0;

  // Paquetes DINÁMICOS basados en cantidadMinima
  const paquetes = [
    {
      cantidad: Math.max(cantidadMinima, 5),
      precio: Math.max(cantidadMinima, 5) * precioUnitario,
      destacado: false,
    },
    {
      cantidad: Math.max(cantidadMinima, 20),
      precio: Math.max(cantidadMinima, 20) * precioUnitario,
      destacado: true,
    },
    {
      cantidad: Math.max(cantidadMinima, 45),
      precio: Math.max(cantidadMinima, 45) * precioUnitario,
      destacado: false,
    },
  ];

  // Countdown basado en rifa.fecha_sorteo
  useEffect(() => {
    if (!rifa || !rifa.fecha_sorteo) return;

    const targetDate = new Date(rifa.fecha_sorteo).getTime();

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
  }, [rifa]);

  const handleCantidadChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= cantidadMinima) {
      setCantidad(value);
      setError("");
    } else if (value < cantidadMinima) {
      setError(`La cantidad mínima es ${cantidadMinima} números.`);
    }
  };

  const handlePaqueteClick = (cantidadPaquete) => {
    if (cantidadPaquete <= disponibles) {
      setCantidad(cantidadPaquete);
      setError("");
    }
  };

  const handleContinuar = () => {
    setError("");

    if (cantidad < cantidadMinima) {
      setError(`La cantidad mínima es ${cantidadMinima} números.`);
      return;
    }

    if (cantidad > disponibles) {
      setError(`Solo hay ${disponibles} números disponibles.`);
      return;
    }

    navigate("/checkout", { state: { rifa, cantidad } });
  };

  if (!rifa) {
    return (
      <div className="comprar-container">
        <p>No se ha seleccionado ninguna rifa.</p>
        <button onClick={() => navigate(-1)}>Volver</button>
      </div>
    );
  }

  const total = cantidad * precioUnitario;

  return (
    <div className="comprar-container">
      {/* Header rifa con variables dinámicas */}
      <div className="rifa-header">
        <img
          src={rifa.imagen_url}
          alt={rifa.titulo}
          className="rifa-img-header"
        />
        <div className="rifa-info-header">
          <h1 className="rifa-titulo">{rifa.titulo}</h1>
          <p className="rifa-desc-header">{rifa.descripcion}</p>
          <div className="rifa-stats-header">
            Precio: ${precioUnitario.toLocaleString()} c/u | Mín:{" "}
            {cantidadMinima} números
          </div>
        </div>
      </div>

      {/* BLOQUE ESTADO DEL SORTEO (mismo estilo que Home) */}
      {rifa && (
        <section className="sorteo-status comprar-status">
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
                {rifa.porcentaje || 0}%
              </span>
            </div>

            <div className="sorteo-status-bar-wrapper">
              <div className="sorteo-status-bar">
                <div
                  className="sorteo-status-bar-fill"
                  style={{ width: `${rifa.porcentaje || 0}%` }}
                />
              </div>
            </div>

            <p className="sorteo-status-note">
              ¡Casi agotado! Solo queda el{" "}
              {Math.max(0, 100 - (rifa.porcentaje || 0))}% de los boletos
              disponibles.
            </p>
          </div>
        </section>
      )}

      {error && <div className="error-message">{error}</div>}

      {/* Paquetes DINÁMICOS */}
      <section className="paquetes-section">
        <h2 className="paquetes-title">Elige tu paquete</h2>

        <div className="paquetes-grid">
          {paquetes.map((paquete, index) => (
            <div
              key={index}
              className={`paquete-card ${paquete.destacado ? "popular" : ""} ${
                cantidad === paquete.cantidad ? "active" : ""
              }`}
              onClick={() => handlePaqueteClick(paquete.cantidad)}
            >
              {paquete.destacado && (
                <div className="paquete-popular">POPULAR</div>
              )}
              <div className="paquete-precio">
                ${paquete.precio.toLocaleString()}
              </div>
              <div className="paquete-sub">{paquete.cantidad} números</div>
              <div className="paquete-features">
                <div className="feature">
                  ✅ {paquete.cantidad} números aleatorios
                </div>
                <div className="feature">✅ Correo confirmación</div>
                <div className="feature">✅ Participación inmediata</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Input personalizado con variables dinámicas */}
      <div className="cantidad-personalizada">
        <label>O cantidad personalizada (mín {cantidadMinima})</label>
        <div className="input-group">
          <input
            type="number"
            value={cantidad}
            onChange={handleCantidadChange}
            min={cantidadMinima}
            max={disponibles}
            className="cantidad-input"
          />
          <span className="total-preview">
            Total: ${total.toLocaleString()}
          </span>
          <small>Disponibles: {disponibles}</small>
        </div>
      </div>

      {/* Botones acción */}
      <div className="acciones-comprar">
        <button
          className="btn-comprar-principal"
          onClick={handleContinuar}
          disabled={cantidad < cantidadMinima || cantidad > disponibles}
        >
          Continuar al Pago - ${total.toLocaleString()}
        </button>
      </div>

      {/* NUEVO BLOQUE INFERIOR - 3 CARDS HORIZONTALES */}
      <section className="trust-section">
        <div className="trust-card">
          <div className="trust-icon">🔒</div>
          <h3>Pagos Seguros</h3>
          <p>Todos los pagos procesados con Mercado Pago</p>
        </div>

        <div className="trust-card">
          <div className="trust-icon">🎯</div>
          <h3>Ganadores Reales</h3>
          <p>Sorteos públicos con resultados verificables</p>
        </div>

        <div className="trust-card">
          <div className="trust-icon">🛠️</div>
          <h3>Soporte 24/7</h3>
          <p>Estamos aquí para ayudarte en cualquier momento</p>
        </div>
      </section>
    </div>
  );
}
