import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/comprar.css";

export default function Comprar() {
  const navigate = useNavigate();
  const location = useLocation();
  const rifa = location.state?.rifa;

  const [cantidad, setCantidad] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ PAQUETES DINÁMICOS CON PRECIOS CALCULADOS
  const paquetes = [
    { cantidad: 15, precio: 15000, destacado: true },
    { cantidad: 25, precio: 25000, destacado: true },
    { cantidad: 40, precio: 40000, destacado: true }
  ];

  const handleCantidadChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 5) {
      setCantidad(value);
    } else if (value < 5) {
      setError("La cantidad mínima es 5 números.");
    }
  };

  const handlePaqueteClick = (cantidadPaquete) => {
    setCantidad(cantidadPaquete);
    setError("");
  };

  const handleContinuarPago = () => {
    setError("");
    
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Debes iniciar sesión para comprar números.");
      navigate("/login");
      return;
    }

    // ✅ Validaciones
    if (cantidad < 5) {
      setError("La cantidad mínima es 5 números.");
      return;
    }

    if (cantidad > (rifa.disponibles || 0)) {
      setError(`Solo hay ${rifa.disponibles} números disponibles.`);
      return;
    }

    // ✅ Calcular valor total
    const valorTotal = cantidad * 1000; // $1,000 por número

    // ✅ Navegar al formulario de pago
    navigate("/formulario-pago", {
      state: {
        rifa,
        cantidad,
        valorTotal
      }
    });
  };

  if (!rifa) {
    return (
      <div className="comprar-container">
        <p>No se ha seleccionado ninguna rifa.</p>
        <button onClick={() => navigate(-1)}>Volver</button>
      </div>
    );
  }

  return (
    <div className="comprar-container">
      <h1>Comprar Números de Rifa</h1>

      {error && <div className="error-message">{error}</div>}

      <div className="comprar-layout">
        <div className="rifa-info">
          <img src={rifa.imagen_url} alt={rifa.titulo} className="rifa-img" />
          <h2 className="rifa-title">{rifa.titulo}</h2>
          <p className="rifa-desc">{rifa.descripcion}</p>
          <div className="rifa-stats">
            <span><strong>Disponibles:</strong> {rifa.disponibles}</span>
            <span><strong>Vendidos:</strong> {rifa.vendidos}</span>
            <span><strong>Progreso:</strong> {rifa.porcentaje}%</span>
          </div>
        </div>

        <div className="compra-section">
          <div className="cantidad-section">
            <label>Cantidad de números <small>(mínimo 5)</small>:</label>
            <input
              type="number"
              value={cantidad}
              onChange={handleCantidadChange}
              min="5"
              max={rifa.disponibles || 100}
              disabled={loading}
            />
            <small>Precio por número: $1,000</small>
          </div>

          {/* ✅ OFERTAS DINÁMICAS */}
          <div className="ofertas-container">
            {paquetes.map((paquete, index) => (
              <div 
                key={index} 
                className={`oferta-box ${cantidad === paquete.cantidad ? 'active' : ''} ${
                  paquete.destacado ? 'destacado' : ''
                }`}
              >
                {paquete.destacado && <div className="badge-destacado">🔥 POPULAR</div>}
                <h3>{paquete.cantidad} Tickets</h3>
                <p>{paquete.destacado ? 'Mejor valor' : 'Buena opción'}</p>
                <span className="precio">Precio: ${paquete.precio.toLocaleString()}</span>
                <button 
                  className={`btn-oferta ${cantidad === paquete.cantidad ? 'selected' : ''}`}
                  onClick={() => handlePaqueteClick(paquete.cantidad)}
                  disabled={paquete.cantidad > (rifa.disponibles || 0)}
                >
                  {cantidad === paquete.cantidad ? '✓ Seleccionado' : 'Seleccionar'}
                </button>
              </div>
            ))}
          </div>

          <div className="resumen-pago">
            <h3>Resumen de compra</h3>
            <div className="resumen-item">
              <span>Cantidad:</span>
              <span>{cantidad} números</span>
            </div>
            <div className="resumen-item">
              <span>Precio unitario:</span>
              <span>$1,000</span>
            </div>
            <div className="resumen-total">
              <span>Total a pagar:</span>
              <span>${(cantidad * 1000).toLocaleString()}</span>
            </div>
          </div>

          <div className="acciones">
            <button 
              className="btn-comprar" 
              onClick={handleContinuarPago}
              disabled={loading || cantidad < 5 || cantidad > (rifa.disponibles || 0)}
            >
              {loading ? "Procesando..." : `Continuar al Pago - $${(cantidad * 1000).toLocaleString()}`}
            </button>
            <button className="btn-cancel" onClick={() => navigate(-1)} disabled={loading}>
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}