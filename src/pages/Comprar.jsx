import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { API_URL } from "../api";
import "../styles/comprar.css";

export default function Comprar() {
  const navigate = useNavigate();
  const location = useLocation();
  const rifa = location.state?.rifa;

  // ✅ USAR CANTIDAD MÍNIMA DINÁMICA DE LA RIFA
  const [cantidad, setCantidad] = useState(rifa?.cantidad_minima || 5);
  const [error, setError] = useState("");

  // ✅ PRECIO UNITARIO DINÁMICO
  const precioUnitario = rifa?.precio_unitario || 1000;
  const cantidadMinima = rifa?.cantidad_minima || 5;
  
  const paquetes = [
    { cantidad: Math.max(cantidadMinima, 15), precio: Math.max(cantidadMinima, 15) * precioUnitario, destacado: true },
    { cantidad: Math.max(cantidadMinima, 25), precio: Math.max(cantidadMinima, 25) * precioUnitario, destacado: true },
    { cantidad: Math.max(cantidadMinima, 40), precio: Math.max(cantidadMinima, 40) * precioUnitario, destacado: true }
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
    setCantidad(cantidadPaquete);
    setError("");
  };

  const handleContinuar = () => {
    setError("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Debes iniciar sesión para comprar números.");
      navigate("/login");
      return;
    }

    // ✅ Validación con cantidad mínima dinámica
    if (cantidad < cantidadMinima) {
      setError(`La cantidad mínima es ${cantidadMinima} números.`);
      return;
    }

    if (cantidad > (rifa.disponibles || 0)) {
      setError(`Solo hay ${rifa.disponibles} números disponibles.`);
      return;
    }

    // ✅ REDIRIGIR DIRECTAMENTE AL CHECKOUT
    navigate("/checkout", { 
      state: { rifa, cantidad } 
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

  const total = cantidad * precioUnitario;

  return (
    <div className="comprar-container">
      <h1>Comprar Números de Rifa</h1>

      {error && <div className="error-message">{error}</div>}

      <div className="comprar-layout">
        <div className="rifa-info">
          <img src={rifa.imagen_url} alt={rifa.titulo} className="rifa-img" />
          <h2 className="rifa-title">{rifa.titulo}</h2>
          <p className="rifa-desc">{rifa.descripcion}</p>
          
        </div>

        <div className="compra-section">
          <div className="cantidad-section">
            <label>Cantidad de números <small>(mínimo {cantidadMinima})</small>:</label>
            <input
              type="number"
              value={cantidad}
              onChange={handleCantidadChange}
              min={cantidadMinima}
              max={rifa.disponibles || 100}
            />
          </div>

          {/* ✅ OFERTAS DINÁMICAS CON PRECIOS CALCULADOS */}
          <div className="ofertas-container">
            {paquetes.map((paquete, index) => (
              <div 
                key={index} 
                className={`oferta-box ${cantidad === paquete.cantidad ? 'active' : ''} ${
                  paquete.destacado ? 'destacado' : ''
                }`}
              >
                {paquete.destacado && <div className="badge-destacado">🔥 POPULAR</div>}
                <h3>{paquete.cantidad} Números</h3>
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

          <div className="acciones">
            <button 
              className="btn-comprar" 
              onClick={handleContinuar}
              disabled={cantidad < cantidadMinima || cantidad > (rifa.disponibles || 0)}
            >
              Continuar al Pago - $${total.toLocaleString()}
            </button>
            <button className="btn-cancel" onClick={() => navigate(-1)}>
              Cancelar
            </button>
          </div>

          <div className="info-pago">
            <p>🔒 Pago seguro mediante Mercado Pago</p>
            <p>🎯 Los números se asignarán automáticamente después del pago exitoso</p>
          </div>
        </div>
      </div>
    </div>
  );
}