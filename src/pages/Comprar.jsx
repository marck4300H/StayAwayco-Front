import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { API_URL } from "../api";
import "../styles/comprar.css";

export default function Comprar() {
  const navigate = useNavigate();
  const location = useLocation();
  const rifa = location.state?.rifa;

  const [cantidad, setCantidad] = useState(5);
  const [numerosComprados, setNumerosComprados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const paquetes = [15, 25, 40];

  const handleCantidadChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) setCantidad(value);
  };

  const handlePaqueteClick = (valor) => setCantidad(valor);

  const handleComprar = async () => {
    setError("");
    setSuccess("");
    setNumerosComprados([]);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Debes iniciar sesión para comprar números.");
      return;
    }

    if (cantidad < 1) {
      setError("Debes comprar al menos 1 número.");
      return;
    }

    try {
      setLoading(true);

      // ✅ RUTA CORREGIDA: /api/comprar/crear/:rifaId
      const res = await fetch(`${API_URL}/comprar/crear/${rifa.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ cantidad }),
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        setError(data.message || "Ocurrió un error en la compra.");
      } else {
        setNumerosComprados(data.numeros || []);
        setSuccess(data.message || "¡Compra exitosa!");
        setError("");
      }
    } catch (err) {
      console.error("Error en compra:", err);
      setError("Error de conexión con el servidor.");
    } finally {
      setLoading(false);
    }
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
      <p>La cantidad mínima recomendada a comprar es 5 números.</p>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      {loading && <div className="loading-message">Procesando compra...</div>}

      <div className="comprar-layout">
        <div className="rifa-info">
          <img src={rifa.imagen_url} alt={rifa.titulo} className="rifa-img" />
          <h2 className="rifa-title">{rifa.titulo}</h2>
          <p className="rifa-desc">{rifa.descripcion}</p>
          <div className="rifa-stats">
            <p><strong>Números disponibles:</strong> {rifa.disponibles || 0}</p>
            <p><strong>Números vendidos:</strong> {rifa.vendidos || 0}</p>
            <p><strong>Total números:</strong> {rifa.cantidad_numeros || 0}</p>
          </div>
        </div>

        <div className="compra-section">
          <div className="cantidad-section">
            <label>Cantidad de números:</label>
            <input
              type="number"
              value={cantidad}
              onChange={handleCantidadChange}
              min="1"
              max={rifa.disponibles || 100}
              disabled={loading}
            />
          </div>

          <div className="paquetes-section">
            <p>Paquetes recomendados:</p>
            <div className="paquetes-buttons">
              {paquetes.map((p) => (
                <button
                  key={p}
                  className={`paquete-btn ${cantidad === p ? 'active' : ''}`}
                  onClick={() => handlePaqueteClick(p)}
                  disabled={loading}
                >
                  {p} números
                </button>
              ))}
            </div>
          </div>

          <div className="acciones">
            <button 
              className="btn-comprar" 
              onClick={handleComprar} 
              disabled={loading || cantidad > (rifa.disponibles || 0)}
            >
              {loading ? "Procesando..." : `Comprar ${cantidad} números`}
            </button>
            <button className="btn-cancel" onClick={() => navigate(-1)} disabled={loading}>
              Cancelar
            </button>
          </div>

          {numerosComprados.length > 0 && (
            <div className="numeros-resultado">
              <h3>🎉 ¡Números comprados exitosamente!</h3>
              <p><strong>Tus números:</strong></p>
              <div className="numeros-grid">
                {numerosComprados.map((numero, index) => (
                  <span key={index} className="numero-comprado">
                    #{numero.toString().padStart(5, '0')}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}