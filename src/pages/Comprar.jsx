import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { API_URL } from "../api";
import "../styles/comprar.css";

export default function Comprar() {
  const navigate = useNavigate();
  const location = useLocation();
  const rifa = location.state?.rifa;

  const [cantidad, setCantidad] = useState(rifa?.cantidad_minima || 5);
  const [error, setError] = useState("");

  // Variables DINÁMICAS que YA TENÍAS
  const precioUnitario = rifa?.precio_unitario || 1000;
  const cantidadMinima = rifa?.cantidad_minima || 5;
  const disponibles = rifa?.disponibles || 0;

  // Paquetes DINÁMICOS basados en cantidadMinima
  const paquetes = [
    { 
      cantidad: Math.max(cantidadMinima, 5), 
      precio: Math.max(cantidadMinima, 5) * precioUnitario, 
      destacado: false 
    },
    { 
      cantidad: Math.max(cantidadMinima, 20), 
      precio: Math.max(cantidadMinima, 20) * precioUnitario, 
      destacado: true 
    },
    { 
      cantidad: Math.max(cantidadMinima, 45), 
      precio: Math.max(cantidadMinima, 45) * precioUnitario, 
      destacado: false 
    },
  ];

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
        <img src={rifa.imagen_url} alt={rifa.titulo} className="rifa-img-header" />
        <div className="rifa-info-header">
          <h1 className="rifa-titulo">{rifa.titulo}</h1>
          <p className="rifa-desc-header">{rifa.descripcion}</p>
          <div className="rifa-stats-header">
            Precio: ${precioUnitario.toLocaleString()} c/u | Mín: {cantidadMinima} números
          </div>
        </div>
      </div>

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
              {paquete.destacado && <div className="paquete-popular">POPULAR</div>}
              <div className="paquete-precio">
                ${paquete.precio.toLocaleString()}
              </div>
              <div className="paquete-sub">
                {paquete.cantidad} números
              </div>
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
        <label>
          O cantidad personalizada (mín {cantidadMinima})
        </label>
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
        <button className="btn-cancelar" onClick={() => navigate(-1)}>
          ← Volver
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
