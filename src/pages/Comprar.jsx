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
  const paquetes = [15, 25, 40];

  const handleCantidadChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) setCantidad(value); // Permite cualquier número válido
  };

  const handlePaqueteClick = (valor) => setCantidad(valor);

  const handleComprar = async () => {
    setError("");
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

      const res = await fetch(`${API_URL}/comprar/rifas/${rifa.id}/comprar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ cantidad }),
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        setError(data.error || data.message || "Ocurrió un error en la compra.");
      } else {
        setNumerosComprados(data.numeros || []);
        setError(""); // limpiar errores previos si la compra fue exitosa
      }
    } catch (err) {
      console.error(err);
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

      {error && <p style={{ color: "#d9534f", textAlign: "center" }}>{error}</p>}
      {loading && <p style={{ color: "#c8a951", textAlign: "center" }}>Procesando compra...</p>}

      <div className="comprar-layout">
        <div className="rifa-info">
          <img src={rifa.imagen_url} alt={rifa.titulo} className="rifa-img" />
          <h2 className="rifa-title">{rifa.titulo}</h2>
          <p className="rifa-desc">{rifa.descripcion}</p>
        </div>

        <div className="compra-section">
          <div className="cantidad-section">
            <label>Cantidad de números:</label>
            <input
              type="number"
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
            <button className="btn-comprar" onClick={handleComprar} disabled={loading}>
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
