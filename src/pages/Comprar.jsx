import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { API_URL } from "../api";
import "../styles/comprar.css";

export default function Comprar() {
  const navigate = useNavigate();
  const location = useLocation();
  const rifa = location.state?.rifa;

  const [cantidad, setCantidad] = useState(5); // mínimo 5 números
  const [numerosComprados, setNumerosComprados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const paquetes = [15, 25, 40];

  const handleCantidadChange = (e) => {
    const value = parseInt(e.target.value);
    if (value >= 5) setCantidad(value);
  };

  const handlePaqueteClick = (valor) => {
    setCantidad(valor);
  };

  const handleComprar = async () => {
    setError("");
    setNumerosComprados([]);
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Debes iniciar sesión para comprar números.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/comprar/rifas/${rifa.id}/comprar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ cantidad }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Ocurrió un error en la compra.");
      } else {
        setNumerosComprados(data.numeros);
      }
    } catch (err) {
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
      <p>Monto mínimo a comprar: 5 números</p>

      {error && <p style={{ color: "#d9534f", textAlign: "center" }}>{error}</p>}
      {loading && <p style={{ color: "#c8a951", textAlign: "center" }}>Procesando compra...</p>}

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
              disabled={loading}
            />
          </div>

          <div className="paquetes-section">
            <p>Paquetes recomendados:</p>
            {paquetes.map((p) => (
              <button
                key={p}
                className="paquete-btn"
                onClick={() => handlePaqueteClick(p)}
                disabled={loading}
              >
                {p} números
              </button>
            ))}
          </div>

          <div className="acciones">
            <button
              className="btn-comprar"
              onClick={handleComprar}
              disabled={loading || cantidad < 5}
            >
              Comprar
            </button>
            <button className="btn-cancel" onClick={() => navigate(-1)} disabled={loading}>
              Cancelar
            </button>
          </div>

          {numerosComprados.length > 0 && (
            <div className="numeros-resultado" style={{ marginTop: "20px" }}>
              <h3>Números comprados:</h3>
              <p>{numerosComprados.join(", ")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
