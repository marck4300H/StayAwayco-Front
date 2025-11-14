import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/comprar.css";

export default function Comprar() {
  const navigate = useNavigate();
  const location = useLocation();
  const rifa = location.state?.rifa; // rifa seleccionada desde Home

  const [cantidad, setCantidad] = useState(5); // mínimo 5 números
  const paquetes = [15, 25, 40];

  const handleCantidadChange = (e) => {
    const value = parseInt(e.target.value);
    if (value >= 5) setCantidad(value);
  };

  const handlePaqueteClick = (valor) => {
    setCantidad(valor);
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
      <p>Monto mínimo a comprar: 5 números</p>

      <div className="comprar-layout">
        {/* IZQUIERDA: Datos de la rifa */}
        <div className="rifa-info">
          <img src={rifa.imagen_url} alt={rifa.titulo} className="rifa-img" />
          <h2 className="rifa-title">{rifa.titulo}</h2>
          <p className="rifa-desc">{rifa.descripcion}</p>
        </div>

        {/* DERECHA: Sección de compra */}
        <div className="compra-section">
          <div className="cantidad-section">
            <label>Cantidad de números:</label>
            <input
              type="number"
              min={5}
              value={cantidad}
              onChange={handleCantidadChange}
            />
          </div>

          <div className="paquetes-section">
            <p>Paquetes recomendados:</p>
            {paquetes.map((p) => (
              <button
                key={p}
                className="paquete-btn"
                onClick={() => handlePaqueteClick(p)}
              >
                {p} números
              </button>
            ))}
          </div>

          <div className="acciones">
            <button className="btn-comprar" disabled>
              Comprar
            </button>
            <button className="btn-cancel" onClick={() => navigate(-1)}>
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
