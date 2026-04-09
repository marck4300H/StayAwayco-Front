import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/comprar.css";

export default function Comprar() {
  const navigate = useNavigate();
  const location = useLocation();
  const rifa = location.state?.rifa;

  const precioUnitario = rifa?.precio_unitario || 1000;
  const cantidadMinima = rifa?.cantidad_minima || 5;
  const disponibles = rifa?.disponibles || 0;

  const [cantidad, setCantidad] = useState(cantidadMinima);
  const [error, setError] = useState("");

  const [timeLeft, setTimeLeft] = useState({
    dias: "00", horas: "00", mins: "00", segs: "00",
  });

  const tienePaquetes = !!rifa?.paquetes_promocion;

  const buildPaquetes = () => {
    if (tienePaquetes) {
      const paquetesRaw = rifa.paquetes_promocion;
      const lista = [];
      ["paquete1", "paquete2", "paquete3"].forEach((key) => {
        const p = paquetesRaw[key];
        if (p && p.cantidad_compra > 0 && p.numeros_gratis > 0) {
          lista.push({
            cantidad: p.cantidad_compra,
            precio: p.cantidad_compra * precioUnitario,
            gratis: p.numeros_gratis,
          });
        }
      });
      lista.sort((a, b) => a.cantidad - b.cantidad);
      return lista;
    }

    return [
      { precio: 10000 },
      { precio: 25000 },
      { precio: 40000 },
    ].map((p) => ({
      cantidad: Math.floor(p.precio / precioUnitario),
      precio: p.precio,
      gratis: 0,
    }));
  };

  const paquetes = buildPaquetes();
  const indexPopular = 1;

  const getPaqueteAplicado = (cant) => {
    if (!tienePaquetes) return null;
    return paquetes.find((p) => p.cantidad === cant) || null;
  };

  const paqueteAplicado = getPaqueteAplicado(cantidad);

  useEffect(() => {
    if (!rifa?.fecha_sorteo) return;
    const targetDate = new Date(rifa.fecha_sorteo).getTime();
    const update = () => {
      const diff = targetDate - Date.now();
      if (diff <= 0) {
        setTimeLeft({ dias: "00", horas: "00", mins: "00", segs: "00" });
        return;
      }
      setTimeLeft({
        dias: String(Math.floor(diff / 86400000)).padStart(2, "0"),
        horas: String(Math.floor((diff / 3600000) % 24)).padStart(2, "0"),
        mins: String(Math.floor((diff / 60000) % 60)).padStart(2, "0"),
        segs: String(Math.floor((diff / 1000) % 60)).padStart(2, "0"),
      });
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [rifa]);

  const handleCantidadChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= cantidadMinima) {
      setCantidad(value);
      setError("");
    } else {
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
      {/* Header rifa */}
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

      {/* Bloque estado del sorteo */}
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
            <span className="sorteo-status-percent">{rifa.porcentaje || 0}%</span>
          </div>
          <div className="sorteo-status-bar-wrapper">
            <div className="sorteo-status-bar">
              <div
                className="sorteo-status-bar-fill"
                style={{ width: `${rifa.porcentaje || 0}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {error && <div className="error-message">{error}</div>}

      {/* ─── PAQUETES ─── */}
      <section className="paquetes-section">
        <h2 className="paquetes-title">Elige tu paquete</h2>

        {tienePaquetes && (
          <div className="paquetes-promo-banner">
            🎁 <strong>¡Esta rifa tiene números gratis!</strong> Compra exactamente un paquete y recibe números adicionales sin costo.
          </div>
        )}

        <div className="paquetes-grid">
          {paquetes.map((paquete, index) => {
            const esPopular = index === indexPopular;
            const estaActivo = cantidad === paquete.cantidad;

            return (
              <div
                key={index}
                className={`paquete-card ${esPopular ? "popular" : ""} ${estaActivo ? "active" : ""}`}
                onClick={() => handlePaqueteClick(paquete.cantidad)}
              >
                {esPopular && <div className="paquete-popular">POPULAR</div>}

                {/* ✅ Solo precio y cantidad — sin texto extra */}
                <div className="paquete-precio">
                  ${paquete.precio.toLocaleString()}
                </div>

                <div className="paquete-sub">
                  {paquete.cantidad} números
                </div>

                {/* Solo mostrar gratis si aplica */}
                {tienePaquetes && paquete.gratis > 0 && (
                  <div className="feature-gratis">
                    🎁 +{paquete.gratis} gratis
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Cantidad personalizada */}
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
          <span className="total-preview">Total: ${total.toLocaleString()}</span>
        </div>

        {tienePaquetes && paqueteAplicado && (
          <div className="paquete-aplicado-preview">
            🎁 Comprando exactamente {cantidad} números recibirás{" "}
            <strong>+{paqueteAplicado.gratis} gratis</strong>
          </div>
        )}
      </div>

      {/* Botón continuar */}
      <div className="acciones-comprar">
        <button
          className="btn-comprar-principal"
          onClick={handleContinuar}
          disabled={cantidad < cantidadMinima || cantidad > disponibles}
        >
          Continuar al Pago — ${total.toLocaleString()}
        </button>
      </div>

      {/* Trust section */}
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
